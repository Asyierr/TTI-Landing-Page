// main.js — small shared interactions for the landing page

document.addEventListener("DOMContentLoaded", () => {
  // Scroll-triggered reveal for feature cards / sections
  const revealEls = document.querySelectorAll(".reveal-on-scroll");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }
});
