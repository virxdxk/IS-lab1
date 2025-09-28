import RouteTable from "./components/RouteTable.jsx";
import "./styles/utilities.css";
import { WS_TOPIC } from "./lib/ws.js";

export default function App(){
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black text-red-100 relative overflow-hidden">
            {/* Фоновые декоративные элементы */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-red-600/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-1/3 right-20 w-48 h-48 bg-red-800/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-red-900/10 rounded-full blur-xl animate-pulse delay-2000"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                {/* Сетчатый паттерн */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `
                        linear-gradient(rgba(220, 38, 38, 0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(220, 38, 38, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-8 space-y-8">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent shadow-text mb-2">
                            ⚡ DEMONIC ROUTES ⚡
                        </h1>
                        <div className="text-red-400/70 text-lg font-medium tracking-wider">
                            IS-LAB1 · INFERNAL MANAGEMENT SYSTEM
                        </div>
                    </div>
                    <button
                        className="text-red-400/70 hover:text-red-300 hover:scale-110 transition-all duration-300 text-lg font-bold tracking-wider"
                        onClick={(e)=>{e.preventDefault(); location.reload();}}
                    >
                        ⟲ RELOAD REALM
                    </button>
                </header>

                <RouteTable />

                <footer className="text-red-500/50 pt-12 text-center">
                    <div className="flex items-center justify-center gap-4 text-sm">
                        <span className="flicker-text">🔥</span>
                        <span>LIVE UPDATES VIA HELLISH STOMP: {WS_TOPIC}</span>
                        <span className="flicker-text">🔥</span>
                    </div>
                    <div className="mt-4 text-xs opacity-60">
                        "In darkness we find our path, in chaos we build our empire"
                    </div>
                </footer>
            </div>
        </div>
    );
}