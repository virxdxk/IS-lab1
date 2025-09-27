import RouteTable from "./components/RouteTable.jsx";
import "./styles/utilities.css";
import { WS_TOPIC } from "./lib/ws.js";


export default function App(){
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 text-neutral-900 dark:text-neutral-100">
            <div className="max-w-6xl mx-auto p-6 space-y-6">
                <header className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">IS-lab1 · Routes (React)</h1>
                    <a className="text-sm opacity-70 hover:opacity-100" href="#" onClick={(e)=>{e.preventDefault(); location.reload();}}>reload</a>
                </header>
                <RouteTable />
                <footer className="text-xs opacity-70 pt-8">Live updates via STOMP: {WS_TOPIC}</footer>
            </div>
        </div>
    );
}