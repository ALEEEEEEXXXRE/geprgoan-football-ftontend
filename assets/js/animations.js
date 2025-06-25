document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.animate-fadeIn');
  const io = new IntersectionObserver(entries =>
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target); // stop observing after animation triggers
      }
    }),
    { threshold: 0.2 }
  );
  els.forEach(el => io.observe(el));
});
