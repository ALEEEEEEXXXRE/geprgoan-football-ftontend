// assets/js/login.js
import { saveToken } from './auth-utils.js';
import { includeHTML } from './dom-utils.js';

document.addEventListener("DOMContentLoaded", async () => {
  await includeHTML();

  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("გთხოვთ შეიყვანოთ ელ-ფოსტა და პაროლი.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "შესვლა ვერ მოხერხდა.");
        return;
      }

      saveToken(data.token);
      window.location.href = "/index.html";
    } catch (err) {
      console.error("⚠️ Login error:", err);
      alert("სერვერთან კავშირის შეცდომა.");
    }
  });
});
