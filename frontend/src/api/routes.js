export const API_BASE   = (import.meta?.env?.VITE_API_BASE || "").replace(/\/+$/, "");
export const ROUTES_URL = `${API_BASE}/api/routes`;
export const OPS_URL    = `${API_BASE}/api/routes/ops`;

const JSON_HEADERS = { "Accept": "application/json" };
const BODY_HEADERS = { "Content-Type": "application/json", ...JSON_HEADERS };

async function req(url, options = {}) {
    const resp = await fetch(url, { headers: JSON_HEADERS, ...options });
    if (!resp.ok) {
        // пробуем достать сообщение об ошибке
        let msg = `${resp.status} ${resp.statusText}`;
        try {
            const ct = resp.headers.get("content-type") || "";
            if (ct.includes("application/json")) {
                const j = await resp.json();
                msg = (j.message || j.error || JSON.stringify(j));
            } else {
                msg = await resp.text();
            }
        } catch { /* ignore parsing errors */ }
        throw new Error(msg || `Request failed: ${resp.status}`);
    }
    // 204 / пустой ответ — вернуть undefined
    if (resp.status === 204) return;
    const ct = resp.headers.get("content-type") || "";
    return ct.includes("application/json") ? resp.json() : resp.text();
}

export async function apiList({ page, size, sort, column, equals }) {
    const params = new URLSearchParams();
    if (page != null)  params.set("page", page);
    if (size != null)  params.set("size", size);
    if (sort)          params.set("sort", sort);
    if (column)        params.set("column", column);
    if (equals != null && equals !== "") params.set("equals", equals);

    return req(`${ROUTES_URL}?${params.toString()}`);
}

export async function apiGet(id) {
    return req(`${ROUTES_URL}/${encodeURIComponent(id)}`);
}

// Ожидаемый формат route:
// {
//   name: string,
//   rating: number,
//   distance?: number|null,
//   coordinates?: { x: number, y: number },
//   from?: { id: number|long } | null,
//   to?:   { id: number|long } | null
// }
export async function apiCreate(route) {
    return req(ROUTES_URL, {
        method: "POST",
        headers: BODY_HEADERS,
        body: JSON.stringify(route)
    });
}

export async function apiUpdate(id, route) {
    return req(`${ROUTES_URL}/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: BODY_HEADERS,
        body: JSON.stringify(route)
    });
}

export async function apiDelete(id) {
    return req(`${ROUTES_URL}/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// ---- спец-операции ----

export async function apiDeleteByRating(rating) {
    const url = `${OPS_URL}/deleteByRating?rating=${encodeURIComponent(rating)}`;
    return req(url, { method: "POST" });
}

export async function apiCountByRating(rating) {
    const url = `${OPS_URL}/countByRating?rating=${encodeURIComponent(rating)}`;
    return req(url);
}

export async function apiLessThanRating(rating) {
    const url = `${OPS_URL}/lessThanRating?rating=${encodeURIComponent(rating)}`;
    return req(url);
}

export async function apiShortestOrLongest(fromName, toName, longest = false) {
    const url = `${OPS_URL}/path?from=${encodeURIComponent(fromName)}&to=${encodeURIComponent(toName)}&longest=${encodeURIComponent(longest)}`;
    return req(url);
}

export async function apiAddRouteBetween({ fromName, toName, distance, rating }) {
    return req(`${OPS_URL}/addBetween`, {
        method: "POST",
        headers: BODY_HEADERS,
        body: JSON.stringify({ fromName, toName, distance, rating })
    });
}
