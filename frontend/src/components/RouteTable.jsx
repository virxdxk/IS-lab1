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
                    "px-4 py-4 cursor-pointer select-none font-bold tracking-wider text-left transition-all duration-300 hover:bg-red-950/30",
                    active && "text-red-400 shadow-text"
                )}
                onClick={() => setSort(`${key},${nextDir}`)}
            >
                <div className="flex items-center gap-2">
                    {label}
                    <span className="text-red-500">
                        {active ? (curDir === "asc" ? "▲" : "▼") : "⚡"}
                    </span>
                </div>
            </th>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <div className="text-2xl font-bold text-red-300 shadow-text mb-2">🗡️ INFERNAL ROUTES</div>
                    <div className="text-red-400/70 font-medium">
                        Advanced pagination, sorting & demonic filtering system
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-primary flex items-center gap-2" onClick={() => setCreateOpen(true)}>
                        <span>⚔️</span>
                        FORGE NEW ROUTE
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-end gap-4 demonic-card rounded-xl p-6">
                <div className="flex-1 min-w-[200px]">
                    <div className="text-sm font-medium text-red-400 mb-2">🎯 FILTER COLUMN</div>
                    <select
                        className="input"
                        value={column}
                        onChange={(e) => setColumn(e.target.value)}
                    >
                        <option value="">— ALL REALMS —</option>
                        <option value="name">NAME</option>
                        <option value="from">FROM (name)</option>
                        <option value="to">TO (name)</option>
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <div className="text-sm font-medium text-red-400 mb-2">⚡ EXACT MATCH</div>
                    <input
                        className="input"
                        value={equals}
                        onChange={(e) => setEquals(e.target.value)}
                        placeholder="enter dark value..."
                    />
                </div>
                <div className="min-w-[150px]">
                    <div className="text-sm font-medium text-red-400 mb-2">📊 PAGE SIZE</div>
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
                                {n} SOULS
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end gap-3">
                    <button
                        className="btn-secondary flex items-center gap-2"
                        onClick={() => {
                            setPage(0);
                            load();
                        }}
                    >
                        <span>🔮</span>
                        CAST FILTER
                    </button>
                    {loading && <Spinner />}
                </div>
            </div>

            <ErrorBanner msg={error} />

            <div className="demonic-table overflow-hidden">
                <div className="overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="demonic-header">
                        <tr>
                            {headerCell("id", "ID")}
                            {headerCell("name", "NAME")}
                            <th className="px-4 py-4 font-bold tracking-wider text-left">COORDINATES</th>
                            {headerCell("creationDate", "FORGED")}
                            <th className="px-4 py-4 font-bold tracking-wider text-left">FROM REALM</th>
                            <th className="px-4 py-4 font-bold tracking-wider text-left">TO REALM</th>
                            {headerCell("distance", "DISTANCE")}
                            {headerCell("rating", "POWER")}
                            <th className="px-4 py-4 font-bold tracking-wider text-left">ACTIONS</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((r, idx) => (
                            <tr key={r.id} className="demonic-row">
                                <td className="px-4 py-4 font-bold text-red-400">#{r.id}</td>
                                <td className="px-4 py-4 font-medium text-red-200">{r.name}</td>
                                <td className="px-4 py-4 text-red-300/80">
                                    <span className="font-mono">x:{r.coordinates?.x}, y:{r.coordinates?.y}</span>
                                </td>
                                <td className="px-4 py-4 text-red-300/80 font-mono text-xs">
                                    {new Date(r.creationDate).toLocaleString()}
                                </td>
                                <td className="px-4 py-4 text-red-200">{r.from?.name ?? "—"}</td>
                                <td className="px-4 py-4 text-red-200">{r.to?.name ?? "—"}</td>
                                <td className="px-4 py-4 text-red-300 font-bold">{r.distance ?? "∞"}</td>
                                <td className="px-4 py-4 text-red-400 font-bold">{r.rating}⚡</td>
                                <td className="px-4 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            className="btn-secondary text-xs px-3 py-2"
                                            onClick={() => {
                                                setEditing(r);
                                                setEditOpen(true);
                                            }}
                                        >
                                            ✏️ EDIT
                                        </button>
                                        <button
                                            className="btn-danger text-xs px-3 py-2"
                                            onClick={async () => {
                                                if (confirm("🔥 BANISH THIS ROUTE TO THE VOID? 🔥")) {
                                                    await apiDelete(r.id);
                                                    await load();
                                                }
                                            }}
                                        >
                                            💀 DESTROY
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!items.length && !loading && (
                            <tr>
                                <td colSpan={9} className="px-4 py-12 text-center text-red-400/60 text-lg font-medium">
                                    <div className="flex flex-col items-center gap-3">
                                        <span className="text-4xl">👻</span>
                                        <span>THE VOID IS EMPTY...</span>
                                        <span className="text-sm opacity-60">No routes found in this dark realm</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between demonic-card rounded-xl p-6">
                <div className="text-red-300 font-medium">
                    <span className="text-red-400">🔮</span> REALM {page + 1} OF {Math.max(totalPages, 1)}
                </div>
                <div className="flex gap-2">
                    <button
                        className="btn-secondary px-4 py-2"
                        disabled={page === 0}
                        onClick={() => setPage(0)}
                    >
                        ⏮️
                    </button>
                    <button
                        className="btn-secondary px-4 py-2"
                        disabled={page === 0}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        ⬅️
                    </button>
                    <button
                        className="btn-secondary px-4 py-2"
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        ➡️
                    </button>
                    <button
                        className="btn-secondary px-4 py-2"
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage(totalPages - 1)}
                    >
                        ⏭️
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