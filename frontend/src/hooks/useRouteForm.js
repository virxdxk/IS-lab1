import { useState } from "react";
export function useRouteForm(initial){
const [form, setForm] = useState(initial ?? { name:"", coordinates:{x:0,y:0}, from:null, to:null, distance:null, rating:1 });
const [errors, setErrors] = useState({});
function set(path,val){ setForm(f=>{ const c=structuredClone(f); const parts=path.split('.'); let cur=c; for(let i=0;i<parts.length-1;i++){ cur = cur[parts[i]] ?? (cur[parts[i]]={}); } cur[parts.at(-1)]=val; return c; }); }
function validate(){ const e={}; if(!form.name?.trim()) e.name="Название обязательно"; if(form.coordinates?.y!=null && Number(form.coordinates.y)>49) e.coord_y="y ≤ 49"; if(form.rating==null||Number(form.rating)<=0) e.rating="> 0"; if(form.distance!=null && Number(form.distance)<=1) e.distance="> 1 или пусто"; setErrors(e); return Object.keys(e).length===0; }
return { form, set, errors, validate, setErrors };
}