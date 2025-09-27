export default function Field({ label, children, error }){
    return (
        <div className="mb-3">
            <label className="block text-sm mb-1 opacity-80">{label}</label>
            {children}
            {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
        </div>
    );
}