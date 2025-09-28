export default function Spinner(){
    return (
        <div className="flex items-center gap-3 text-sm text-red-400 font-medium">
            <div className="animate-spin rounded-full h-5 w-5 border-2 demonic-spinner"></div>
            <span className="flicker-text">LOADING DARK MAGIC...</span>
        </div>
    );
}