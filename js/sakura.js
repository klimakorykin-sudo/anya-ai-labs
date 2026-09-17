// ============================================================
// SAKURA.JS — Падающие лепестки сакуры
// Работает только когда выбран фон "sakura"
// ============================================================

const SakuraRain = {
  canvas: null,
  ctx: null,
  petals: [],
  running: false,
  animationId: null,

  init() {
    if (!document.getElementById("sakuraCanvas")) {
      const canvas = document.createElement("canvas");
      canvas.id = "sakuraCanvas";
      document.body.appendChild(canvas);
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
    } else {
      this.canvas = document.getElementById("sakuraCanvas");
      this.ctx = this.canvas.getContext("2d");
    }

    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Следим за сменой фона
    setInterval(() => {
      const isSakura = document.body.classList.contains("bg-sakura");
      if (isSakura && !this.running) this.start();
      else if (!isSakura && this.running) this.stop();
    }, 500);
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  createPetal() {
    return {
      x: Math.random() * this.canvas.width,
      y: -20,
      size: 8 + Math.random() * 8,
      speedY: 1 + Math.random() * 2,
      speedX: -1 + Math.random() * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: -0.03 + Math.random() * 0.06,
      opacity: 0.5 + Math.random() * 0.5
    };
  },

  start() {
    if (this.running) return;
    this.running = true;
    this.petals = [];
    for (let i = 0; i < 40; i++) {
      const p = this.createPetal();
      p.y = Math.random() * this.canvas.height;
      this.petals.push(p);
    }
    this.animate();
  },

  stop() {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },

  drawPetal(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;

    // Лепесток сакуры — простая форма
    ctx.fillStyle = "#ffb3d9";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, 0, 0, p.size);
    ctx.bezierCurveTo(p.size, 0, p.size / 2, -p.size / 2, 0, 0);
    ctx.fill();

    ctx.restore();
  },

  animate() {
    if (!this.running) return;

    const ctx = this.ctx;
    const canvas = this.canvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      this.drawPetal(p);

      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.y / 50) * 0.5;
      p.rotation += p.rotationSpeed;

      // Сброс — если упал вниз
      if (p.y > canvas.height + 20) {
        this.petals[i] = this.createPetal();
      }
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => SakuraRain.init());
} else {
  SakuraRain.init();
}
