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
                setResult(`SOULS BANISHED: ${n} 💀`);
                onRefresh?.();
            } else if (op === "count") {
                const n = await apiCountByRating(Number(rating));
                setResult(`DARK COUNT: ${n} ⚡`);
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
    }

    return (
        <div className="demonic-card rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-red-300 shadow-text mb-6 flex items-center gap-3">
                <span>🔮</span>
                DARK SORCERY OPERATIONS
                <span>⚡</span>
            </h3>

            <ErrorBanner msg={error} />

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <div className="text-lg font-semibold text-red-400 flex items-center gap-2">
                        <span>⚡</span>
                        POWER RATING MAGIC
                    </div>
                    <input
                        type="number"
                        step="0.01"
                        className="input"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        placeholder="Enter dark power level..."
                    />
                    <div className="grid grid-cols-1 gap-3">
                        <button
                            disabled={busy}
                            className="btn-secondary flex items-center justify-center gap-2"
                            onClick={() => run("count")}
                        >
                            <span>🔢</span>
                            COUNT EQUALS
                        </button>
                        <button
                            disabled={busy}
                            className="btn-secondary flex items-center justify-center gap-2"
                            onClick={() => run("less")}
                        >
                            <span>📋</span>
                            LIST WEAKER
                        </button>
                        <button
                            disabled={busy}
                            className="btn-danger flex items-center justify-center gap-2"
                            onClick={() => run("del")}
                        >
                            <span>💀</span>
                            PURGE EQUALS
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="text-lg font-semibold text-red-400 flex items-center gap-2">
                        <span>🗺️</span>
                        REALM PATHFINDING
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <input
                            placeholder="FROM REALM NAME"
                            className="input"
                            value={fromName}
                            onChange={(e) => setFromName(e.target.value)}
                        />
                        <input
                            placeholder="TO REALM NAME"
                            className="input"
                            value={toName}
                            onChange={(e) => setToName(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            disabled={busy}
                            className="btn-secondary flex items-center justify-center gap-2"
                            onClick={() => run("short")}
                        >
                            <span>⚡</span>
                            SHORTEST
                        </button>
                        <button
                            disabled={busy}
                            className="btn-secondary flex items-center justify-center gap-2"
                            onClick={() => run("long")}
                        >
                            <span>🌙</span>
                            LONGEST
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="text-lg font-semibold text-red-400 flex items-center gap-2">
                        <span>⚔️</span>
                        FORGE NEW PATH
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <input
                            placeholder="FROM REALM"
                            className="input"
                            value={fromName}
                            onChange={(e) => setFromName(e.target.value)}
                        />
                        <input
                            placeholder="TO REALM"
                            className="input"
                            value={toName}
                            onChange={(e) => setToName(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="DARK DISTANCE"
                            className="input"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                        />
                    </div>
                    <button
                        disabled={busy}
                        className="btn-primary flex items-center justify-center gap-2 w-full"
                        onClick={() => run("add")}
                    >
                        <span>🔥</span>
                        FORGE ROUTE
                    </button>
                </div>
            </div>

            {result && typeof result === 'string' && (
                <div className="mt-8 p-4 bg-red-950/30 border border-red-600/30 rounded-xl">
                    <div className="text-red-300 font-bold text-lg flex items-center gap-2">
                        <span>✨</span>
                        {result}
                    </div>
                </div>
            )}

            {Array.isArray(result) && (
                <div className="mt-8 space-y-3">
                    <div className="text-red-300 font-bold text-lg flex items-center gap-2">
                        <span>📜</span>
                        ROUTES WITH POWER LESS THAN {rating}:
                    </div>
                    <pre className="p-6 bg-black/80 border-2 border-red-900/40 rounded-xl overflow-auto max-h-64 font-mono text-sm text-red-200">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}

            {path?.length > 0 && (
                <div className="mt-8 space-y-3">
                    <div className="text-red-300 font-bold text-lg flex items-center gap-2">
                        <span>🛣️</span>
                        DISCOVERED PATH:
                    </div>
                    <ol className="space-y-2 pl-4">
                        {path.map((r, idx) => (
                            <li key={r.id} className="flex items-center gap-3 p-3 bg-red-950/20 border border-red-800/30 rounded-lg">
                                <span className="text-red-400 font-bold text-lg">#{idx + 1}</span>
                                <span className="text-red-200 font-medium">{r.name}</span>
                                <span className="text-red-400/70 text-sm">
                                    (distance: {r.distance} ⚡)
                                </span>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
}