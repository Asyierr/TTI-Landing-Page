/**
 * shape-field.js
 * The "antigravity" signature interaction: a field of simple wireframe
 * shapes that drift slowly on their own (idle zero-g float) and gently
 * get pushed away when the cursor comes near, then ease back — like
 * objects floating in zero gravity that respond to a passing hand.
 *
 * Usage: <canvas class="shape-field" data-density="normal|light"></canvas>
 */
(function () {
  const canvases = document.querySelectorAll(".shape-field");
  if (!canvases.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  canvases.forEach((canvas) => initField(canvas));

  function initField(canvas) {
    const ctx = canvas.getContext("2d");
    const density = canvas.dataset.density === "light" ? 0.55 : 1;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width, height;
    let particles = [];
    let mouse = { x: -9999, y: -9999, active: false };
    let rafId = null;

    const shapeTypes = ["circle", "ring", "triangle", "hex"];
    const colors = ["#5B5FEF", "#12141C", "#FF6F59"];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const count = Math.round(((width * height) / 42000) * density);
      particles = new Array(Math.max(6, count)).fill(0).map(() => {
        const homeX = Math.random() * width;
        const homeY = Math.random() * height;
        return {
          homeX,
          homeY,
          x: homeX,
          y: homeY,
          r: 10 + Math.random() * 26,
          type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.14 + Math.random() * 0.22,
          floatSpeed: 0.25 + Math.random() * 0.35,
          floatOffset: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.0025,
          vx: 0,
          vy: 0,
        };
      });
    }

    function drawShape(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.strokeStyle = p.color;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.lineWidth = 1.4;

      if (p.type === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === "ring") {
        ctx.beginPath();
        ctx.arc(0, 0, p.r * 0.55, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === "triangle") {
        const s = p.r * 0.6;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.87, s * 0.5);
        ctx.lineTo(-s * 0.87, s * 0.5);
        ctx.closePath();
        ctx.stroke();
      } else if (p.type === "hex") {
        const s = p.r * 0.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          const px = Math.cos(a) * s;
          const py = Math.sin(a) * s;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    }

    function tick(t) {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // idle zero-g drift around home position
        const driftX = Math.sin(t * 0.00035 * p.floatSpeed + p.floatOffset) * 18;
        const driftY = Math.cos(t * 0.0004 * p.floatSpeed + p.floatOffset) * 14;
        const targetX = p.homeX + driftX;
        const targetY = p.homeY + driftY;

        // repel from cursor
        let pushX = 0, pushY = 0;
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const radius = 150;
          if (dist < radius) {
            const force = (1 - dist / radius) * 3.2;
            pushX = (dx / (dist || 1)) * force * 14;
            pushY = (dy / (dist || 1)) * force * 14;
          }
        }

        p.vx += ((targetX + pushX - p.x) * 0.02);
        p.vy += ((targetY + pushY - p.y) * 0.02);
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed * 16;

        drawShape(p);
      });

      rafId = requestAnimationFrame(tick);
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.parentElement.addEventListener("mousemove", onMove);
    canvas.parentElement.addEventListener("mouseleave", onLeave);

    if (reduceMotion) {
      // Draw a single static frame, skip the animation loop entirely
      tick(0);
    } else {
      rafId = requestAnimationFrame(tick);
    }
  }
})();
