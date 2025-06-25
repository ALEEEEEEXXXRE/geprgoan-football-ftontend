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
 * Delete token and redirect to login
 */
export function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "/pages/login.html";
}

/**
 * Check if user is logged in
 */
export function isLoggedIn() {
  return !!getToken();
}

/**
 * Decode JWT without verifying
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
 * Get user info from decoded token
 */
export function getUserInfo() {
  const token = getToken();
  return token ? parseJwt(token) : null;
}

/**
 * Update profile icon and auth UI state
 */
export function updateAuthUI() {
  const token = getToken();
  const iconImg = document.getElementById("profileIcon");
  const menuUl = document.getElementById("profileMenu");
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!iconImg || !menuUl) return;

  if (token) {
    const data = parseJwt(token);
    const gender = data?.gender;

    let icon = "/assets/images/icons/guest.png";
    if (gender === "male") icon = "/assets/images/icons/icons8-profile-50.png";
    if (gender === "female") icon = "/assets/images/icons/female.png";

    iconImg.src = icon;
    iconImg.style.cursor = "pointer";
    iconImg.title = data?.name ?? "User";

    iconImg.onclick = e => {
      e.stopPropagation();
      menuUl.classList.toggle("show");
    };
    document.addEventListener("click", e => {
      if (!menuUl.contains(e.target)) menuUl.classList.remove("show");
    });

    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";
    if (logoutBtn) logoutBtn.onclick = logout;
  } else {
    if (iconImg) iconImg.onclick = () => location.href = "/pages/register.html";
  }
}
