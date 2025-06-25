// assets/js/register.js

document.addEventListener("DOMContentLoaded", () => {
  const form        = document.querySelector("form");
  const nameInput   = document.getElementById("name");
  const lastNameInp = document.getElementById("last_name");
  const ageInput    = document.getElementById("age");
  const emailInp    = document.getElementById("email");
  const passInp     = document.getElementById("password");
  const genderInputs = document.querySelectorAll("input[name='gender']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name       = nameInput.value.trim();
    const last_name  = lastNameInp.value.trim();
    const age        = parseInt(ageInput.value.trim(), 10);
    const email      = emailInp.value.trim();
    const password   = passInp.value.trim();
    const genderEl   = Array.from(genderInputs).find(r => r.checked);
    const gender     = genderEl ? genderEl.value : null;

    if (!name || !last_name || !email || !password || isNaN(age) || !gender) {
      alert("გთხოვთ შეავსოთ ყველა ველი სწორად.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, last_name, age, email, password, gender })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "რეგისტრაცია ვერ შესრულდა.");
        return;
      }

      localStorage.setItem("token", data.token);
      alert("რეგისტრაცია წარმატებით დასრულდა!");
      window.location.href = "../index.html";
    } catch (err) {
      console.error("[register.js]", err);
      alert("სერვერთან კავშირის შეცდომა.");
    }
  });
});
