// 🌀 LightSlider init + nav highlight
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

  // 🔍 Highlight active nav link
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav a').forEach(a => {
    if (a.getAttribute('href').endsWith(path)) a.classList.add('active');
  });
});

// 🌟 Global function to navigate to player detail page
function goToDetail(playerId) {
  window.location.href = `player-detail.html?id=${playerId}`;
}

// ⚙️ App logic after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");

  // 🛡️ Restrict access to footballer pages if not authenticated
  const protectedLinks = document.querySelectorAll('.nav a[href*="footballers"], .btn[href*="footballers"]');
  protectedLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      if (!token) {
        e.preventDefault();
        alert("გთხოვთ, ჯერ გაიარეთ ავტორიზაცია.");
        window.location.href = "/pages/login.html";
      }
    });
  });

// 👁️ Hide footballer links if not logged in
if (!token) protectedLinks.forEach(el => (el.style.display = "none"));
const dropdownBox = document.getElementById("profileDropdown");
const profileMenu = document.getElementById("profileMenu");
const iconImg     = document.getElementById("profileIcon");

if (iconImg && profileMenu && dropdownBox) {
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const { name, gender } = payload;

      // Set icon image based on gender
      let imgSrc = "/assets/images/icons/guest.png";
      if (gender === "male")
        imgSrc = "/assets/images/icons/icons8-profile-50.png";
      if (gender === "female")
        imgSrc = "/assets/images/icons/female.png";

      iconImg.src = imgSrc;
      iconImg.title = name;
      iconImg.style.cursor = "pointer";

      // 🔽 Toggle dropdown on click
      iconImg.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent close immediately
        profileMenu.classList.toggle("show");
      });

      // ⛔ Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!dropdownBox.contains(e.target)) {
          profileMenu.classList.remove("show");
        }
      });

      // 🚪 Logout button
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.removeItem("authToken");
          window.location.href = "/index.html";
        });
      }

    } catch (err) {
      console.warn("⚠️ Token parsing failed", err);
    }
  } else {
    // Not logged in behavior (optional)
    iconImg.onclick = () => window.location.href = "/pages/register.html";
  }
}

  // 🎯 Safe click vs drag (player boxes)
  document.querySelectorAll('.box').forEach(box => {
    let isDragging = false;
    box.addEventListener('mousedown', () => isDragging = false);
    box.addEventListener('mousemove', () => isDragging = true);
    box.addEventListener('mouseup', function () {
      if (!isDragging) this.click();
    });
  });
});
