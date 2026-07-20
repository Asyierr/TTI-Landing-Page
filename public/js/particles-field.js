/**
 * particles-field.js — GIIAS 2026
 *
 * Interaktif floating particle field:
 *  • Partikel melayang idle dengan zero-g drift
 *  • Hover → partikel lari menghindar dari kursor
 *  • KLIK → ledakan burst: partikel terpental, muncul ripple,
 *    spawn partikel mini baru sebentar
 *  • Klik partikel spesifik → highlight + scale pop
 *  • Touch support (mobile)
 *
 * Usage: <canvas id="particles-canvas"></canvas>
 * Ganti atau tambah canvas lewat initParticleField(canvasEl)
 */

(function () {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const ctx = canvas.getContext("2d");

  // ─── Config ───────────────────────────────────────────────────────────────
  const COLORS   = ["#E8304A", "#F0B429", "#3B82F6", "#ffffff", "#E8304A"];
  const SHAPES   = ["circle", "ring", "triangle", "hex", "dot"];
  const REPEL_R  = 130;   // cursor repel radius (px)
  const REPEL_F  = 3.5;   // repel force multiplier
  const CLICK_R  = 200;   // click blast radius
  const CLICK_F  = 22;    // click blast force
  const HIT_R    = 28;    // clickable hit radius per particle

  // ─── State ────────────────────────────────────────────────────────────────
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W, H;
  let particles = [];
  let ripples   = [];
  let bursts    = [];
  let mouse     = { x: -9999, y: -9999, active: false };
  let rafId     = null;

  // ─── Resize ───────────────────────────────────────────────────────────────
  function resize() {
    const parent = canvas.parentElement;
    const rect   = parent.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  // ─── Seed particles ───────────────────────────────────────────────────────
  function seed() {
    const count = Math.max(18, Math.round((W * H) / 26000));
    particles = Array.from({ length: count }, () => makeParticle());
  }

  function makeParticle(x, y, mini = false) {
    const hx = x !== undefined ? x : Math.random() * W;
    const hy = y !== undefined ? y : Math.random() * H;
    return {
      homeX: hx, homeY: hy,
      x: hx, y: hy,
      r: mini ? 4 + Math.random() * 8 : 10 + Math.random() * 28,
      type:  SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha:    mini ? 0.5 + Math.random() * 0.4 : 0.1 + Math.random() * 0.25,
      maxAlpha: mini ? 0.9 : 0.35,
      floatSpd: 0.2 + Math.random() * 0.4,
      floatOff: Math.random() * Math.PI * 2,
      rot:      Math.random() * Math.PI * 2,
      rotSpd:   (Math.random() - 0.5) * 0.003,
      vx: mini ? (Math.random() - 0.5) * 6 : 0,
      vy: mini ? (Math.random() - 0.5) * 6 : 0,
      life:  mini ? 1.0 : null,  // null = immortal
      scale: 1,
      popped: false,
      mini,
    };
  }

  // ─── Draw a single particle ───────────────────────────────────────────────
  function drawParticle(p, t) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(p.scale, p.scale);

    const a = p.life !== null
      ? p.alpha * p.life   // mini: fade with life
      : p.alpha;

    ctx.globalAlpha = Math.max(0, Math.min(1, a));
    ctx.strokeStyle = p.color;
    ctx.fillStyle   = p.color;
    ctx.lineWidth   = p.mini ? 1.2 : 1.5;

    switch (p.type) {
      case "dot":
        ctx.beginPath();
        ctx.arc(0, 0, p.r * 0.28, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(0, 0, p.r * 0.38, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "ring":
        ctx.beginPath();
        ctx.arc(0, 0, p.r * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "triangle":
        const s = p.r * 0.55;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.87, s * 0.5);
        ctx.lineTo(-s * 0.87, s * 0.5);
        ctx.closePath();
        ctx.stroke();
        break;
      case "hex":
        const h = p.r * 0.48;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i - Math.PI / 6;
          i === 0 ? ctx.moveTo(Math.cos(a)*h, Math.sin(a)*h)
                  : ctx.lineTo(Math.cos(a)*h, Math.sin(a)*h);
        }
        ctx.closePath();
        ctx.stroke();
        break;
    }
    ctx.restore();
  }

  // ─── Draw ripple ──────────────────────────────────────────────────────────
  function drawRipple(rp) {
    ctx.save();
    ctx.globalAlpha = rp.life * 0.55;
    ctx.strokeStyle = rp.color;
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
    ctx.stroke();

    // second ripple ring
    ctx.globalAlpha = rp.life * 0.25;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(rp.x, rp.y, rp.r * 0.6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // ─── Tick / animation loop ────────────────────────────────────────────────
  function tick(t) {
    ctx.clearRect(0, 0, W, H);

    // — Immortal particles —
    particles.forEach(p => {
      // Idle drift (zero-g float)
      const dx = Math.sin(t * 0.00032 * p.floatSpd + p.floatOff) * 22;
      const dy = Math.cos(t * 0.00038 * p.floatSpd + p.floatOff) * 16;
      const tx = p.homeX + dx;
      const ty = p.homeY + dy;

      // Cursor repel
      let px = 0, py = 0;
      if (mouse.active) {
        const ddx = p.x - mouse.x;
        const ddy = p.y - mouse.y;
        const dist = Math.hypot(ddx, ddy);
        if (dist < REPEL_R && dist > 0) {
          const f = (1 - dist / REPEL_R) * REPEL_F;
          px = (ddx / dist) * f * 12;
          py = (ddy / dist) * f * 12;
        }
      }

      // Spring back to drifted home + push
      p.vx += (tx + px - p.x) * 0.022;
      p.vy += (ty + py - p.y) * 0.022;
      p.vx *= 0.88;
      p.vy *= 0.88;
      p.x  += p.vx;
      p.y  += p.vy;
      p.rot += p.rotSpd * 16;

      // Pop scale spring back
      if (p.scale !== 1) {
        p.scale += (1 - p.scale) * 0.12;
        if (Math.abs(p.scale - 1) < 0.005) p.scale = 1;
      }

      drawParticle(p, t);
    });

    // — Mini burst particles —
    bursts = bursts.filter(p => p.life > 0.02);
    bursts.forEach(p => {
      p.x    += p.vx;
      p.y    += p.vy;
      p.vx   *= 0.94;
      p.vy   *= 0.94;
      p.rot  += p.rotSpd * 16;
      p.life -= 0.025;
      drawParticle(p, t);
    });

    // — Ripples —
    ripples = ripples.filter(r => r.life > 0.01);
    ripples.forEach(r => {
      r.r    += 6;
      r.life -= 0.032;
      drawRipple(r);
    });

    rafId = requestAnimationFrame(tick);
  }

  // ─── Click handler — blast + ripple + pop ─────────────────────────────────
  function onClick(e) {
    const rect = canvas.getBoundingClientRect();
    const cx   = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const cy   = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;

    // Ripple effect
    ripples.push({
      x: cx, y: cy,
      r: 8,
      life: 1,
      color: COLORS[Math.floor(Math.random() * 3)],
    });

    // Second staggered ripple
    setTimeout(() => {
      ripples.push({ x: cx, y: cy, r: 4, life: 0.8,
        color: COLORS[Math.floor(Math.random() * 3)] });
    }, 80);

    // Blast nearby particles away
    particles.forEach(p => {
      const ddx = p.x - cx;
      const ddy = p.y - cy;
      const dist = Math.hypot(ddx, ddy);
      if (dist < CLICK_R && dist > 0) {
        const f = (1 - dist / CLICK_R) * CLICK_F;
        p.vx += (ddx / dist) * f;
        p.vy += (ddy / dist) * f;
      }

      // Pop any particle that was directly hit
      if (dist < HIT_R) {
        p.scale  = 1.7;
        p.popped = true;
      }
    });

    // Spawn mini burst particles
    const burstCount = 10 + Math.floor(Math.random() * 8);
    for (let i = 0; i < burstCount; i++) {
      bursts.push(makeParticle(cx, cy, true));
    }
  }

  // ─── Mouse / touch tracking ───────────────────────────────────────────────
  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    mouse.x = src.clientX - rect.left;
    mouse.y = src.clientY - rect.top;
    mouse.active = true;

    // Cursor style: pointer when hovering a particle
    const hovering = particles.some(p => Math.hypot(p.x - mouse.x, p.y - mouse.y) < HIT_R);
    canvas.style.cursor = hovering ? "pointer" : "default";
  }

  function onLeave() {
    mouse.active = false;
    canvas.style.cursor = "default";
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const hero = canvas.parentElement;
  hero.addEventListener("mousemove",  onMove,  { passive: true });
  hero.addEventListener("mouseleave", onLeave, { passive: true });
  hero.addEventListener("touchmove",  onMove,  { passive: true });
  hero.addEventListener("touchend",   onLeave, { passive: true });

  // Click — on canvas AND hero (so clicking text area also triggers)
  hero.addEventListener("click",      onClick);
  hero.addEventListener("touchstart", onClick, { passive: true });

  rafId = requestAnimationFrame(tick);

})();
