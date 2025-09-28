export default function ErrorBanner({ msg }){
    if(!msg) return null;
    return (
        <div className="demonic-error rounded-xl p-4 text-sm font-medium flex items-center gap-3">
            <span className="text-red-400 text-lg">⚠</span>
            <span>{msg}</span>
            <span className="text-red-400 text-lg">⚠</span>
        </div>
    );
}