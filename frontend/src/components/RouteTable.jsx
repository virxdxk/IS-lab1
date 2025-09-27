import { useEffect, useState } from "react";
import Spinner from "./ui/Spinner.jsx";
import ErrorBanner from "./ui/ErrorBanner.jsx";
import RouteForm from "./RouteForm.jsx";
import SpecialOps from "./SpecialOps.jsx";
import { apiCreate, apiDelete, apiList, apiUpdate } from "../api/routes.js";
import { useRoutesStomp } from "../lib/ws.js";

function classNames(...xs) {
    return xs.filter(Boolean).join(" ");
}

export default function RouteTable() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sort, setSort] = useState("id,asc");
    const [column, setColumn] = useState("");
    const [equals, setEquals] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    async function load() {
        try {
            setLoading(true);
            setError(null);
            const data = await apiList({
                page,
                size,
                sort,
                column: column || undefined,
                equals,
            });
            setItems(data.content ?? []);
            setTotalPages(data.totalPages ?? 0);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size, sort, column, equals]);

    // авто-обновление по WebSocket (топик /topic/routes)
    useEffect(() => {
        const stop = useRoutesStomp(() => load());
        return () => stop?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function headerCell(key, label) {
        const [curKey, curDir] = sort.split(",");
        const active = curKey === key;
        const nextDir = active && curDir === "asc" ? "desc" : "asc";
        return (
            <th
                className={classNames(
                    "px-3 py-2 cursor-pointer select-none",
                    active && "underline"
                )}
                onClick={() => setSort(`${key},${nextDir}`)}
            >
                {label} {active ? (curDir === "asc" ? "▲" : "▼") : ""}
            </th>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <div className="text-lg font-semibold">Маршруты</div>
                    <div className="text-sm opacity-70">
                        Пагинация, сортировка, фильтр по точному совпадению
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-primary" onClick={() => setCreateOpen(true)}>
                        + Новый
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-end gap-3">
                <div>
                    <div className="text-xs opacity-70 mb-1">Столбец для фильтра</div>
                    <select
                        className="input"
                        value={column}
                        onChange={(e) => setColumn(e.target.value)}
                    >
                        <option value="">— не фильтровать —</option>
                        <option value="name">name</option>
                        <option value="from">from (name)</option>
                        <option value="to">to (name)</option>
                    </select>
                </div>
                <div>
                    <div className="text-xs opacity-70 mb-1">Равно (точное совпадение)</div>
                    <input
                        className="input"
                        value={equals}
                        onChange={(e) => setEquals(e.target.value)}
                        placeholder="значение"
                    />
                </div>
                <div>
                    <div className="text-xs opacity-70 mb-1">Размер страницы</div>
                    <select
                        className="input"
                        value={size}
                        onChange={(e) => {
                            setPage(0);
                            setSize(Number(e.target.value));
                        }}
                    >
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className="btn-secondary"
                    onClick={() => {
                        setPage(0);
                        load();
                    }}
                >
                    Применить
                </button>
                {loading && <Spinner />}
            </div>

            <ErrorBanner msg={error} />

            <div className="overflow-auto rounded-2xl border bg-white/50 dark:bg-neutral-900/50">
                <table className="w-full text-sm">
                    <thead className="bg-neutral-50 dark:bg-neutral-800/60">
                    <tr className="text-left">
                        {headerCell("id", "ID")}
                        {headerCell("name", "Name")}
                        <th className="px-3 py-2">Coordinates</th>
                        {headerCell("creationDate", "Created")}
                        <th className="px-3 py-2">From</th>
                        <th className="px-3 py-2">To</th>
                        {headerCell("distance", "Distance")}
                        {headerCell("rating", "Rating")}
                        <th className="px-3 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((r) => (
                        <tr key={r.id} className="border-t">
                            <td className="px-3 py-2">{r.id}</td>
                            <td className="px-3 py-2">{r.name}</td>
                            <td className="px-3 py-2">
                                x:{r.coordinates?.x}, y:{r.coordinates?.y}
                            </td>
                            <td className="px-3 py-2">
                                {new Date(r.creationDate).toLocaleString()}
                            </td>
                            <td className="px-3 py-2">{r.from?.name ?? "—"}</td>
                            <td className="px-3 py-2">{r.to?.name ?? "—"}</td>
                            <td className="px-3 py-2">{r.distance ?? "—"}</td>
                            <td className="px-3 py-2">{r.rating}</td>
                            <td className="px-3 py-2">
                                <div className="flex gap-2">
                                    <button
                                        className="btn-secondary"
                                        onClick={() => {
                                            setEditing(r);
                                            setEditOpen(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-danger"
                                        onClick={async () => {
                                            if (confirm("Удалить маршрут?")) {
                                                await apiDelete(r.id);
                                                await load();
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {!items.length && !loading && (
                        <tr>
                            <td colSpan={9} className="px-3 py-6 text-center opacity-70">
                                Пусто
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm opacity-70">
                    Страница {page + 1} из {Math.max(totalPages, 1)}
                </div>
                <div className="flex gap-2">
                    <button
                        className="btn-secondary"
                        disabled={page === 0}
                        onClick={() => setPage(0)}
                    >
                        {"<<"}
                    </button>
                    <button
                        className="btn-secondary"
                        disabled={page === 0}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        {"<"}
                    </button>
                    <button
                        className="btn-secondary"
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        {">"}
                    </button>
                    <button
                        className="btn-secondary"
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage(totalPages - 1)}
                    >
                        {">>"}
                    </button>
                </div>
            </div>

            <SpecialOps onRefresh={load} />

            <RouteForm
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSubmit={async (f) => {
                    await apiCreate(f);
                    await load();
                }}
            />
            {editing && (
                <RouteForm
                    open={editOpen}
                    initial={editing}
                    onClose={() => setEditOpen(false)}
                    onSubmit={async (f) => {
                        await apiUpdate(editing.id, f);
                        await load();
                    }}
                />
            )}
        </div>
    );
}
