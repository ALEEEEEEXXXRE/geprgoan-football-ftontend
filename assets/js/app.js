/* =======================================================================
   assets/js/app.js  –  shared UI logic for every page
   ======================================================================= */

/* --------------------------------------------------
   0.  UTIL  – wait until the header/footer are injected
   -------------------------------------------------- */
async function injectPartials() {
  const els = document.querySelectorAll('[data-include-html]');
  for (const el of els) {
    const file = el.getAttribute('data-include-html');
    if (!file) continue;
    try {
      const res = await fetch(file);
      const html = await res.text();
      el.insertAdjacentHTML('afterend', html);  // ✅ Correct insertion
      el.remove();                              // ✅ Remove the placeholder
    } catch (e) {
      console.error(`[include] ${file} →`, e);
    }
  }

  // ✅ Signal everything is ready
  window.dispatchEvent(new Event('partials-ready'));
}


/* kick it off immediately */
injectPartials();

/* --------------------------------------------------
   1.  Floating circular menu
   -------------------------------------------------- */
window.addEventListener('partials-ready', () => {
  const menuBtn      = document.querySelector('.floating-btn');
  const circularMenu = document.getElementById('circularMenu');
  if (menuBtn && circularMenu) {
    menuBtn.onclick = () => circularMenu.classList.toggle('active');
  }
});

/* --------------------------------------------------
   2.  Profile-icon dropdown + protected links
   -------------------------------------------------- */
window.addEventListener('partials-ready', () => {
  const token = localStorage.getItem('authToken');

  /* protect footballer pages */
  const protectedLinks = document.querySelectorAll(
    '.nav a[href*="footballers"], .btn[href*="footballers"]'
  );
  protectedLinks.forEach(a => {
    a.addEventListener('click', e => {
      if (!token) {
        e.preventDefault();
        alert('გთხოვთ, ჯერ გაიარეთ ავტორიზაცია.');
        location.href = '/pages/login.html';
      }
    });
  });
  if (!token) protectedLinks.forEach(a => (a.style.display = 'none'));

  /* profile icon / dropdown */
  const dropdownBox = document.getElementById('profileDropdown');
  const menuUl      = document.getElementById('profileMenu');
  const iconImg     = document.getElementById('profileIcon');

  if (!dropdownBox || !menuUl || !iconImg) return;   // header not found

  if (token) {
    try {
      const { name, gender } = JSON.parse(atob(token.split('.')[1]));

      let src = '/assets/images/icons/guest.png';
      if (gender === 'male')   src = '/assets/images/icons/icons8-profile-50.png';
      if (gender === 'female') src = '/assets/images/icons/female.png';

      iconImg.src   = src;
      iconImg.title = name;
      iconImg.style.cursor = 'pointer';

      iconImg.onclick = e => {
        e.stopPropagation();
        menuUl.classList.toggle('show');
      };

      document.addEventListener('click', e => {
        if (!dropdownBox.contains(e.target)) menuUl.classList.remove('show');
      });

      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) logoutBtn.onclick = () => {
        localStorage.removeItem('authToken');
        location.href = '/index.html';
      };
    } catch (e) {
      console.warn('[auth] corrupt token', e);
    }
  } else {
    iconImg.onclick = () => (location.href = '/pages/register.html');
  }
});

/* --------------------------------------------------
   3.  jQuery lightSlider for footballers.html
   -------------------------------------------------- */
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
});

/* --------------------------------------------------
   4.  Highlight active nav link (runs after header injected)
   -------------------------------------------------- */
window.addEventListener('partials-ready', () => {
  const current = location.pathname.split('/').pop();
  document.querySelectorAll('.nav a').forEach(a => {
    if (a.getAttribute('href')?.endsWith(current)) a.classList.add('active');
  });
});

/* --------------------------------------------------
   5.  Helper for player-detail navigation
   -------------------------------------------------- */
window.goToDetail = id => location.href = `/pages/player-detail.html?id=${id}`;




