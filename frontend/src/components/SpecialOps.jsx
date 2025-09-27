import { useState } from "react";
import ErrorBanner from "./ui/ErrorBanner.jsx";
import {
    apiAddRouteBetween,
    apiCountByRating,
    apiDeleteByRating,
    apiLessThanRating,
    apiShortestOrLongest,
} from "../api/routes.js";

export default function SpecialOps({ onRefresh }) {
    const [rating, setRating] = useState(1);
    const [result, setResult] = useState(null);
    const [fromName, setFromName] = useState("");
    const [toName, setToName] = useState("");
    const [distance, setDistance] = useState(10);
    const [path, setPath] = useState([]);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    async function run(op) {
        try {
            setBusy(true);
            setError(null);

            if (op === "del") {
                const n = await apiDeleteByRating(Number(rating));
                setResult(`Удалено: ${n}`);
                onRefresh?.();
            } else if (op === "count") {
                const n = await apiCountByRating(Number(rating));
                setResult(`Количество: ${n}`);
            } else if (op === "less") {
                const arr = await apiLessThanRating(Number(rating));
                setResult(arr);
            } else if (op === "short" || op === "long") {
                const p = await apiShortestOrLongest(fromName, toName, op === "long");
                setPath(p);
            } else if (op === "add") {
                await apiAddRouteBetween({
                    fromName,
                    toName,
                    distance: Number(distance),
                    rating: Number(rating),
                });
                onRefresh?.();
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setBusy(false);
        }
    } // <- конец функции run

    return (
        <div className="rounded-2xl border p-4 bg-white/50 dark:bg-neutral-900/50">
            <h3 className="font-semibold mb-3">Специальные операции</h3>
            <ErrorBanner msg={error} />
            <div className="grid md:grid-cols-3 gap-3">
                <div>
                    <div className="text-sm mb-1 opacity-70">rating</div>
                    <input
                        type="number"
                        step="0.01"
                        className="input"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2">
                        <button disabled={busy} className="btn-secondary" onClick={() => run("count")}>
                            count =
                        </button>
                        <button disabled={busy} className="btn-secondary" onClick={() => run("less")}>
                            list &lt;
                        </button>
                        <button disabled={busy} className="btn-danger" onClick={() => run("del")}>
                            delete =
                        </button>
                    </div>
                </div>

                <div>
                    <div className="text-sm mb-1 opacity-70">Маршрут между локациями</div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                            placeholder="from name"
                            className="input"
                            value={fromName}
                            onChange={(e) => setFromName(e.target.value)}
                        />
                        <input
                            placeholder="to name"
                            className="input"
                            value={toName}
                            onChange={(e) => setToName(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button disabled={busy} className="btn-secondary" onClick={() => run("short")}>
                            shortest
                        </button>
                        <button disabled={busy} className="btn-secondary" onClick={() => run("long")}>
                            longest
                        </button>
                    </div>
                </div>

                <div>
                    <div className="text-sm mb-1 opacity-70">Добавить маршрут</div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                        <input
                            placeholder="from"
                            className="input"
                            value={fromName}
                            onChange={(e) => setFromName(e.target.value)}
                        />
                        <input
                            placeholder="to"
                            className="input"
                            value={toName}
                            onChange={(e) => setToName(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="distance"
                            className="input"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                        />
                    </div>
                    <button disabled={busy} className="btn-primary" onClick={() => run("add")}>
                        Add route
                    </button>
                </div>
            </div>

            {Array.isArray(result) && (
                <div className="mt-3 text-sm">
                    <div className="opacity-70 mb-1">Routes with rating &lt; {rating}:</div>
                    <pre className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-auto max-h-40">
            {JSON.stringify(result, null, 2)}
          </pre>
                </div>
            )}

            {path?.length > 0 && (
                <div className="mt-3 text-sm">
                    <div className="opacity-70 mb-1">Путь:</div>
                    <ol className="list-decimal ml-6">
                        {path.map((r) => (
                            <li key={r.id}>
                                {r.name} (dist: {r.distance})
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
}
