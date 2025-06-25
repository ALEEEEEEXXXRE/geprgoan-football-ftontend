// assets/js/login.js

document.addEventListener("DOMContentLoaded", () => {
  const form     = document.querySelector("form");
  const emailInp = document.getElementById("email");
  const passInp  = document.getElementById("password");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email    = emailInp.value.trim();
    const password = passInp.value.trim();

    if (!email || !password) {
      alert("შეიყვანეთ ელ-ფოსტა და პაროლი.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "ავტორიზაცია ვერ შესრულდა.");
        return;
      }

      // ✅ Save token only (no user is returned)
      localStorage.setItem("token", data.token);
      alert("ავტორიზაცია წარმატებით დასრულდა!");
      window.location.href = "../index.html";
    } catch (err) {
      console.error("[login.js]", err);
      alert("სერვერთან კავშირის შეცდომა.");
    }
  });
});
