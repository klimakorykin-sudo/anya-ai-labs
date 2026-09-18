// ============================================================
// MATRIX.JS — Цифровой дождь (оптимизированный)
// Работает только когда выбран фон "matrix"
// ============================================================

const MatrixRain = {

  canvas: null,
  ctx: null,
  columns: [],
  fontSize: 18,
  running: false,
  animationId: null,
  lastFrame: 0,
  frameInterval: 50, // 20 fps вместо 60 — хватит для дождя

  chars: "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",

  init() {
    if (!document.getElementById("matrixCanvas")) {
      const canvas = document.createElement("canvas");
      canvas.id = "matrixCanvas";
      document.body.appendChild(canvas);
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: false });
    } else {
      this.canvas = document.getElementById("matrixCanvas");
      this.ctx = this.canvas.getContext("2d", { alpha: false });
    }

    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Следим за сменой фона
    setInterval(() => {
      const isMatrix = document.body.classList.contains("bg-matrix");
      if (isMatrix && !this.running) this.start();
      else if (!isMatrix && this.running) this.stop();
    }, 500);
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    const columns = Math.floor(this.canvas.width / this.fontSize);
    this.columns = new Array(columns).fill(1);

    // Заливаем фон один раз
    if (this.ctx) {
      this.ctx.fillStyle = "#000";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },

  start() {
    if (this.running) return;
    this.running = true;
    this.lastFrame = performance.now();
    this.animate();
  },

  stop() {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.fillStyle = "#000";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },

  animate(now = 0) {
    if (!this.running) return;

    // Ограничиваем FPS
    if (now - this.lastFrame < this.frameInterval) {
      this.animationId = requestAnimationFrame((t) => this.animate(t));
      return;
    }
    this.lastFrame = now;

    const ctx = this.ctx;
    const canvas = this.canvas;
    if (!ctx || !canvas) return;

    // Затемняем предыдущий кадр
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = this.fontSize + "px monospace";
    ctx.textBaseline = "top";

    // Яркая голова — отдельно, без shadowBlur
    ctx.fillStyle = "#ccffcc";

    for (let i = 0; i < this.columns.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.columns[i] * this.fontSize;

      // Обычные символы — зелёные
      ctx.fillStyle = "#00ff41";
      ctx.fillText(char, x, y);

      // Иногда яркая голова
      if (Math.random() > 0.97) {
        ctx.fillStyle = "#ccffcc";
        ctx.fillText(char, x, y);
      }

      // Сброс колонки
      if (y > canvas.height && Math.random() > 0.975) {
        this.columns[i] = 0;
      }

      this.columns[i]++;
    }

    this.animationId = requestAnimationFrame((t) => this.animate(t));
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => MatrixRain.init());
} else {
  MatrixRain.init();
}
