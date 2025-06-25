/**
 * Save JWT token to localStorage
 */
export function saveToken(token) {
  localStorage.setItem("authToken", token);
}

/**
 * Retrieve token
 */
export function getToken() {
  return localStorage.getItem("authToken");
}

/**
 * Delete token
 */
export function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "pages/login.html";
}

/**
 * Check if user is logged in
 */
export function isLoggedIn() {
  return !!getToken();
}

/**
 * Decode JWT (without verifying)
 */
export function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (e) {
    return null;
  }
}

/**
 * Get user info (decoded from token)
 */
export function getUserInfo() {
  const token = getToken();
  return token ? parseJwt(token) : null;
}