export default function Modal({ open, onClose, title, children }){
    if(!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button className="px-2 py-1 text-sm rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={onClose}>✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}