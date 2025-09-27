export const API_BASE = import.meta?.env?.VITE_API_BASE || ""; // e.g. http://localhost:8080
export const ROUTES_URL = `${API_BASE}/api/routes`;
export const OPS_URL = `${API_BASE}/api/routes/ops`;


export async function apiList({ page, size, sort, column, equals }) {
const params = new URLSearchParams();
if (page != null) params.set("page", page);
if (size != null) params.set("size", size);
if (sort) params.set("sort", sort);
if (column) params.set("column", column);
if (equals != null && equals !== "") params.set("equals", equals);
const r = await fetch(`${ROUTES_URL}?${params.toString()}`);
if (!r.ok) throw new Error(`Failed to load: ${r.status}`);
return r.json();
}
export async function apiGet(id){ const r=await fetch(`${ROUTES_URL}/${id}`); if(!r.ok) throw new Error("Not found"); return r.json(); }
export async function apiCreate(route){ const r=await fetch(ROUTES_URL,{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(route)}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
export async function apiUpdate(id,route){ const r=await fetch(`${ROUTES_URL}/${id}`,{method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(route)}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
export async function apiDelete(id){ const r=await fetch(`${ROUTES_URL}/${id}`,{method:"DELETE"}); if(!r.ok) throw new Error(await r.text()); }
export async function apiDeleteByRating(rating){ const r=await fetch(`${OPS_URL}/deleteByRating?rating=${encodeURIComponent(rating)}`,{method:"POST"}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
export async function apiCountByRating(rating){ const r=await fetch(`${OPS_URL}/countByRating?rating=${encodeURIComponent(rating)}`); if(!r.ok) throw new Error(await r.text()); return r.json(); }
export async function apiLessThanRating(rating){ const r=await fetch(`${OPS_URL}/lessThanRating?rating=${encodeURIComponent(rating)}`); if(!r.ok) throw new Error(await r.text()); return r.json(); }
export async function apiShortestOrLongest(fromName,toName,longest=false){ const r=await fetch(`${OPS_URL}/path?from=${encodeURIComponent(fromName)}&to=${encodeURIComponent(toName)}&longest=${longest}`); if(!r.ok) throw new Error(await r.text()); return r.json(); }
export async function apiAddRouteBetween({fromName,toName,distance,rating}){ const r=await fetch(`${OPS_URL}/addBetween`,{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({fromName,toName,distance,rating})}); if(!r.ok) throw new Error(await r.text()); return r.json(); }