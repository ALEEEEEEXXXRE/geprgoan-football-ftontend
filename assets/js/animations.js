/* Adds .in to elements with .animate-fadeIn when they enter viewport */
document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.animate-fadeIn');
  const io = new IntersectionObserver(entries =>
    entries.forEach(e => e.isIntersecting && e.target.classList.add('in')),
    { threshold:0.2 }
  );
  els.forEach(el=>io.observe(el));
});
