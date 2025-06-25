$(function () {
  if ($('#autoWidth').length) {
    $('#autoWidth').lightSlider({
      autoWidth: true,
      loop: true,
      speed: 400,
      slideMargin: 20,
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      enableDrag: true,
      swipeThreshold: 80,
      onSliderLoad: () => $('#autoWidth').removeClass('cs-hidden')
    });
  }

  // Highlight active nav link
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav a').forEach(a => {
    if (a.getAttribute('href').endsWith(path)) a.classList.add('active');
  });
});

// Global function
function goToDetail(playerId) {
  window.location.href = `player-detail.html?id=${playerId}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");

  // ⛔ Restrict access to footballer pages if not authenticated
  const protectedLinks = document.querySelectorAll('.nav a[href*="footballers"], .btn[href*="footballers"]');
  protectedLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      if (!token) {
        e.preventDefault();
        alert("გთხოვთ, ჯერ გაიარეთ ავტორიზაცია.");
        window.location.href = "/georgian-football/pages/login.html";
      }
    });
  });

  // ⛔ Hide links/buttons if not logged in (visual)
  if (!token) {
    protectedLinks.forEach(el => el.style.display = 'none');
  }

  // ✅ Profile icon logic
const iconImg = document.getElementById('profileIcon');
const dropdown = document.getElementById("profileDropdown");
const profileMenu = document.getElementById("profileMenu");

if (iconImg && dropdown && profileMenu) {
  iconImg.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevents it from closing immediately
    profileMenu.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      profileMenu.classList.remove("show");
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("authToken");
    alert("გამოსვლა შესრულდა წარმატებით.");
    window.location.href = "/georgian-football/index.html";
  });
}

  if (iconContainer) {
    try {
      if (!token) throw new Error("No token");

      const payload = JSON.parse(atob(token.split('.')[1]));
      const { name, gender } = payload;

      let imgSrc = '/georgian-football/assets/images/icons/icons8-profile-50.png';
      if (gender === 'male') imgSrc = '/georgian-football/assets/images/icons/icons8-customer-50.png';
      else if (gender === 'female') imgSrc = '/georgian-football/assets/images/icons/icons8-female-user-update-50.png';

      const img = document.getElementById("profileIcon");
      img.src = imgSrc;
      img.title = name;
      img.style.cursor = "pointer";


      if (dropdown) dropdown.style.display = "inline-block";
      img.addEventListener("click", () => {
        profileMenu.classList.toggle("show");
      });

      document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("authToken");
        alert("გამოსვლა შესრულდა წარმატებით.");
        window.location.href = "/georgian-football/index.html";
      });

      document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
          profileMenu.classList.remove("show");
        }
      });

    } catch (err) {
      // 👤 Not logged in
      const img = document.createElement('img');
      img.src = '/georgian-football/assets/images/icons/icons8-profile-50.png';
      img.alt = 'Register';
      img.style.cssText = 'height: 34px; margin-left: 1rem; cursor: pointer;';
      img.onclick = () => window.location.href = '/georgian-football/pages/register.html';
      iconContainer.appendChild(img);
      if (dropdown) dropdown.style.display = "none";
    }
  }

  // 🎯 Safe click vs drag
  document.querySelectorAll('.box').forEach(box => {
    let isDragging = false;
    box.addEventListener('mousedown', () => isDragging = false);
    box.addEventListener('mousemove', () => isDragging = true);
    box.addEventListener('mouseup', function () {
      if (!isDragging) this.click();
    });
  });
});
