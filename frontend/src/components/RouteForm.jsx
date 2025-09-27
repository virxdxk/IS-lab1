import Modal from "./ui/Modal.jsx";
import Field from "./ui/Field.jsx";
import { useRouteForm } from "../hooks/useRouteForm.js";


export default function RouteForm({ open, onClose, initial, onSubmit }){
    const { form, set, errors, validate } = useRouteForm(initial);
    return (
        <Modal open={open} onClose={onClose} title={initial?.id ? "Изменить маршрут" : "Создать маршрут"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Название" error={errors.name}><input className="input" value={form.name} onChange={(e)=>set("name", e.target.value)} /></Field>
                <Field label="Rating" error={errors.rating}><input type="number" step="0.01" className="input" value={form.rating ?? ""} onChange={(e)=>set("rating", e.target.value===""?null:Number(e.target.value))} /></Field>
                <Field label="Distance" error={errors.distance}><input type="number" step="0.01" className="input" value={form.distance ?? ""} onChange={(e)=>set("distance", e.target.value===""?null:Number(e.target.value))} /></Field>
                <div className="grid grid-cols-2 gap-2">
                    <Field label="Coord X"><input type="number" step="0.01" className="input" value={form.coordinates?.x ?? 0} onChange={(e)=>set("coordinates.x", Number(e.target.value))} /></Field>
                    <Field label="Coord Y (≤49)" error={errors.coord_y}><input type="number" step="0.01" className="input" value={form.coordinates?.y ?? 0} onChange={(e)=>set("coordinates.y", Number(e.target.value))} /></Field>
                </div>
                <Field label="From (location id)"><input type="number" className="input" value={form.from?.id ?? ""} onChange={(e)=>set("from", e.target.value?{id:Number(e.target.value)}:null)} /></Field>
                <Field label="To (location id)"><input type="number" className="input" value={form.to?.id ?? ""} onChange={(e)=>set("to", e.target.value?{id:Number(e.target.value)}:null)} /></Field>
            </div>
            <div className="flex justify-end gap-2 mt-6">
                <button className="btn-secondary" onClick={onClose}>Отмена</button>
                <button className="btn-primary" onClick={async()=>{ if(!validate()) return; await onSubmit(form); onClose(); }}>Сохранить</button>
            </div>
        </Modal>
    );
}