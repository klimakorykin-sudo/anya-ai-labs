// ============================================================
// MATRIX.JS — Настоящий цифровой дождь
// Работает только когда body.bg-matrix
// ============================================================

const MatrixRain = {

  canvas: null,
  ctx: null,
  columns: [],
  fontSize: 16,
  running: false,
  animationId: null,

  // Символы для дождя: цифры + катакана (как в фильме)
  chars: "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",

  init() {
    // Создаём canvas, если нет
    if (!document.getElementById("matrixCanvas")) {
      const canvas = document.createElement("canvas");
      canvas.id = "matrixCanvas";
      document.body.appendChild(canvas);
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
    } else {
      this.canvas = document.getElementById("matrixCanvas");
      this.ctx = this.canvas.getContext("2d");
    }

    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Следим за сменой фона
    this.watchBackground();
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    const columns = Math.floor(this.canvas.width / this.fontSize);
    this.columns = new Array(columns).fill(1);
  },

  start() {
    if (this.running) return;
    this.running = true;
    this.animate();
  },

  stop() {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    // Очищаем canvas
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },

  animate() {
    if (!this.running) return;

    const ctx = this.ctx;
    const canvas = this.canvas;
    if (!ctx || !canvas) return;

    // Затемняем предыдущий кадр — создаёт эффект затухания
    ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Настройки шрифта
    ctx.font = this.fontSize + "px monospace";
    ctx.textBaseline = "top";

    for (let i = 0; i < this.columns.length; i++) {
      // Случайный символ
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.columns[i] * this.fontSize;

      // Яркая голова (белый или ярко-зелёный)
      if (Math.random() > 0.975) {
        ctx.fillStyle = "#ccffcc";
        ctx.shadowColor = "#00ff41";
        ctx.shadowBlur = 12;
      } else {
        ctx.fillStyle = "#00ff41";
        ctx.shadowColor = "#00ff41";
        ctx.shadowBlur = 4;
      }

      ctx.fillText(char, x, y);

      // Сброс тени после каждого символа (для производительности)
      ctx.shadowBlur = 0;

      // Сброс колонки — если достигла низа
      if (y > canvas.height && Math.random() > 0.975) {
        this.columns[i] = 0;
      }

      this.columns[i]++;
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  },

  watchBackground() {
    // Проверяем каждые 500 мс, включён ли фон «Матрица»
    setInterval(() => {
      const isMatrix = document.body.classList.contains("bg-matrix");
      if (isMatrix && !this.running) {
        this.start();
      } else if (!isMatrix && this.running) {
        this.stop();
      }
    }, 500);
  }
};

// Запуск
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => MatrixRain.init());
} else {
  MatrixRain.init();
}
