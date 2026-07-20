/* ==========================================================================
   GIIAS 2026 — Main JavaScript
   Features: Countdown, Brand Filter, Lightbox, Scroll Reveal,
             Stats Counter, Particles, Mobile Nav
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ====== 1. NAV SCROLL BEHAVIOR ====== */
  const nav = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }, { passive: true });

  /* ====== 2. MOBILE NAV ====== */
  const burger = document.getElementById("nav-burger");
  const mobileMenu = document.getElementById("mobile-menu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
      const isOpen = mobileMenu.classList.contains("open");
      burger.setAttribute("aria-expanded", isOpen);
    });
    // Close mobile menu on link click
    mobileMenu.querySelectorAll(".mobile-menu__link").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
      });
    });
    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove("open");
      }
    });
  }

  /* ====== 3. COUNTDOWN TIMER ====== */
  const targetDate = new Date("2026-07-24T12:00:00+07:00").getTime();
  const cdDays  = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMins  = document.getElementById("cd-mins");
  const cdSecs  = document.getElementById("cd-secs");

  function updateCountdown() {
    const now = Date.now();
    const diff = targetDate - now;
    if (diff <= 0) {
      if (cdDays) cdDays.textContent = "00";
      if (cdHours) cdHours.textContent = "00";
      if (cdMins) cdMins.textContent = "00";
      if (cdSecs) cdSecs.textContent = "00";
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    if (cdDays)  cdDays.textContent  = String(d).padStart(2, "0");
    if (cdHours) cdHours.textContent = String(h).padStart(2, "0");
    if (cdMins)  cdMins.textContent  = String(m).padStart(2, "0");
    if (cdSecs)  cdSecs.textContent  = String(s).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ====== 4. PARTICLES — handled by /js/particles-field.js ====== */

  /* ====== 5. SCROLL REVEAL ====== */
  const revealEls = document.querySelectorAll(".reveal-on-scroll");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = Array.from(entry.target.parentElement.children)
          .filter(c => c.classList.contains("reveal-on-scroll"));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -48px 0px" });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ====== 6. STATS COUNTER ANIMATION ====== */
  const statNums = document.querySelectorAll(".stat-item__num[data-count]");
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = target / 50;
        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current);
          if (current >= target) clearInterval(interval);
        }, 28);
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statsObserver.observe(el));

  /* ====== 7. BRAND FILTER ====== */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const carCards = document.querySelectorAll(".car-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter cards
      carCards.forEach(card => {
        const brand = card.dataset.brand;
        const match = filter === "all" || brand === filter;

        if (match) {
          card.classList.remove("hidden");
          card.classList.add("fade-in");
          setTimeout(() => card.classList.remove("fade-in"), 400);
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  /* ====== 8. LIGHTBOX ====== */
  const lightbox = document.getElementById("lightbox");
  const lightboxBackdrop = document.getElementById("lightbox-backdrop");
  const lbImg   = document.getElementById("lb-img");
  const lbBrand = document.getElementById("lb-brand");
  const lbModel = document.getElementById("lb-model");
  const lbType  = document.getElementById("lb-type");
  const lbDesc  = document.getElementById("lb-desc");
  const lbClose = document.getElementById("lightbox-close");
  const lbPrev  = document.getElementById("lb-prev");
  const lbNext  = document.getElementById("lb-next");

  let currentIndex = 0;
  let visibleCards = [];

  function openLightbox(card) {
    visibleCards = Array.from(document.querySelectorAll(".car-card:not(.hidden)"));
    currentIndex = visibleCards.indexOf(card);
    populateLightbox(currentIndex);
    lightbox.classList.add("open");
    lightboxBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  window.closeLightbox = function() {
    lightbox.classList.remove("open");
    lightboxBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  };

  function populateLightbox(idx) {
    const card = visibleCards[idx];
    if (!card) return;
    const img = card.querySelector(".car-card__img");
    lbImg.src = img ? img.src : "";
    lbImg.alt = img ? img.alt : "";
    lbBrand.textContent = card.dataset.brand?.toUpperCase() || "";
    lbModel.textContent = card.dataset.model || "";
    lbType.textContent  = card.dataset.type || "";
    lbDesc.textContent  = card.dataset.desc || "";
    // Update nav visibility
    lbPrev.style.display = idx > 0 ? "flex" : "none";
    lbNext.style.display = idx < visibleCards.length - 1 ? "flex" : "none";
  }

  // Bind zoom buttons
  document.querySelectorAll(".car-card__zoom").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(btn.closest(".car-card"));
    });
  });

  // Click card body also opens lightbox
  document.querySelectorAll(".car-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".car-card__zoom")) {
        openLightbox(card);
      }
    });
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);

  if (lbPrev) lbPrev.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      populateLightbox(currentIndex);
    }
  });
  if (lbNext) lbNext.addEventListener("click", () => {
    if (currentIndex < visibleCards.length - 1) {
      currentIndex++;
      populateLightbox(currentIndex);
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft" && currentIndex > 0) {
      currentIndex--;
      populateLightbox(currentIndex);
    }
    if (e.key === "ArrowRight" && currentIndex < visibleCards.length - 1) {
      currentIndex++;
      populateLightbox(currentIndex);
    }
  });

  // Touch/swipe support for lightbox
  let touchStartX = 0;
  if (lightbox) {
    lightbox.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) {
        if (diff > 0 && currentIndex < visibleCards.length - 1) { currentIndex++; populateLightbox(currentIndex); }
        if (diff < 0 && currentIndex > 0) { currentIndex--; populateLightbox(currentIndex); }
      }
    }, { passive: true });
  }

  /* ====== 9. SMOOTH ANCHOR SCROLL ====== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ====== 10. SCROLL HINT AUTO HIDE ====== */
  const scrollHint = document.getElementById("scroll-hint");
  if (scrollHint) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 120) {
        scrollHint.style.opacity = "0";
        scrollHint.style.pointerEvents = "none";
      }
    }, { passive: true, once: false });
  }

});
