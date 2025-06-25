const BASE_API_URL = 'http://localhost:3000/api';
const PLAYER_API   = `${BASE_API_URL}/players`;
const AUTH_API     = `${BASE_API_URL}/auth`;

// Token helper
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// -----------------------------
// ⚽ PLAYER API
// -----------------------------

/**
 * Fetch all players from backend
 * @returns {Promise<Array>}
 */
export async function getAllPlayers() {
  try {
    const res = await fetch(PLAYER_API);
    if (!res.ok) throw new Error('Failed to fetch players');
    return await res.json();
  } catch (error) {
    console.error('[API] getAllPlayers:', error);
    return [];
  }
}

/**
 * Fetch one player by ID
 * @param {string} playerId
 * @returns {Promise<Object|null>}
 */
export async function getPlayerById(playerId) {
  try {
    const res = await fetch(`${PLAYER_API}/${playerId}`);
    if (!res.ok) throw new Error('Player not found');
    return await res.json();
  } catch (error) {
    console.error('[API] getPlayerById:', error);
    return null;
  }
}

/**
 * Submit resemblance data (if backend supports it)
 * @param {Object} data {height, weight, age}
 * @returns {Promise<Object>} response with similarity %
 */
export async function checkResemblanceBackend(data) {
  try {
    const res = await fetch(`${PLAYER_API}/resemblance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Resemblance check failed');
    return await res.json();
  } catch (error) {
    console.error('[API] checkResemblance:', error);
    return { similarity: 0 };
  }
}

// 👤 AUTH API
// -----------------------------

/**
 * Register user
 * @param {Object} data - { name, last_name, email, password, age, gender }
 * @returns {Promise<Object>} token or error
 */
export async function registerUser(data) {
  try {
    const res = await fetch(`${AUTH_API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('[API] registerUser:', error);
    return { error: 'Registration failed' };
  }
}

/**
 * Login user
 * @param {Object} data - { email, password }
 * @returns {Promise<Object>} token + gender or error
 */
export async function loginUser(data) {
  try {
    const res = await fetch(`${AUTH_API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('[API] loginUser:', error);
    return { error: 'Login failed' };
  }
}

/**
 * Get current user from token
 * @returns {Promise<Object|null>}
 */
export async function getMe() {
  try {
    const res = await fetch(`${AUTH_API}/me`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('[API] getMe:', error);
    return null;
  }
}
