/* ==========================================================
   assets/js/api.js  –  single source of truth for all HTTP
   ========================================================== */

const API_BASE = 'http://localhost:3000/api';

/* ---------- helper: add bearer token if present ---------- */
const authHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ---------- universal fetch wrapper (returns json|error) -- */
async function callApi(url, opts = {}) {
  try {
    const res  = await fetch(url, opts);
    const data = await res.json().catch(() => ({})); // fallback if no JSON

    if (!res.ok) {
      const msg = data.error || data.message || 'სერვერის შეცდომა';
      throw new Error(msg);
    }
    return { data };
  } catch (err) {
    console.error('[API]', err.message);
    return { error: err.message };
  }
}

/* ==========================================================
   🌟  PUBLIC HELPERS
   ========================================================== */

/* ⚽  PLAYERS ------------------------------------------------ */
export const getAllPlayers = () =>
  callApi(`${API_BASE}/players`);

export const getPlayerById = (id) =>
  callApi(`${API_BASE}/players/${id}`);

/* 👤  AUTH -------------------------------------------------- */
export const register = (payload) =>
  callApi(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

export const login = (payload) =>
  callApi(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

/* example of an authenticated call */
export const getMe = () =>
  callApi(`${API_BASE}/auth/me`, { headers: authHeaders() });
