export default function Modal({ open, onClose, title, children }){
    if(!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center demonic-modal">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative demonic-modal-content rounded-2xl w-full max-w-3xl p-8 m-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent shadow-text">
                        {title}
                    </h2>
                    <button
                        className="px-4 py-2 text-lg font-bold text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-all duration-300 hover:scale-110"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}