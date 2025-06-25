// 📄 profile.js — handles showing user profile info from token

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const container = document.getElementById("profileContent");

  if (!container) return;

  if (!token) {
    container.innerHTML = `
      <p style="text-align:center;">⛔ გთხოვთ, გაიარეთ ავტორიზაცია.</p>
      <div style="text-align:center;margin-top:1rem">
        <a class="btn btn-primary" href="/pages/login.html">შესვლა</a>
      </div>
    `;
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const { name, last_name, email, age, gender } = payload;

    container.innerHTML = `
      <h2 style="text-align:center;">მომხმარებლის პროფილი</h2>
      <div class="profile-details">
        <p><strong>სახელი:</strong> ${name}</p>
        <p><strong>გვარი:</strong> ${last_name}</p>
        <p><strong>ასაკი:</strong> ${age}</p>
        <p><strong>ელ-ფოსტა:</strong> ${email}</p>
        <p><strong>სქესი:</strong> ${gender === 'male' ? 'კაცი' : 'ქალი'}</p>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p>⛔ პროფილის მონაცემების წაკითხვის შეცდომა.</p>`;
    console.error("Token parsing error:", err);
  }
});
