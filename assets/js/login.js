// assets/js/login.js

document.addEventListener("DOMContentLoaded", async () => {
  // ✅ Inject header/footer before anything else
  const includeHTML = async () => {
    const els = document.querySelectorAll('[data-include-html]');
    for (const el of els) {
      const file = el.getAttribute('data-include-html');
      if (!file) continue;
      try {
        const res = await fetch(file);
        el.outerHTML = await res.text();
      } catch (e) {
        console.error(`[include] ${file} →`, e);
      }
    }
  };

  await includeHTML();

  const saveToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  const form = document.querySelector("form");
  if (!form) return;

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
