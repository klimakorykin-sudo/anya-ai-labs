// ============================================================
// BACKGROUND.JS — Переключение фона
// 4 варианта: matrix, anime, white, dark
// ============================================================

const Background = {

  KEY: "anya_background",
  variants: ["dark", "matrix", "anime", "white"],
  labels: {
    dark: "🌙 Тёмный",
    matrix: "🟢 Матрица",
    anime: "🌸 Аниме",
    white: "⚪ Белый"
  },

  current: "dark",

  init() {
    // Загружаем сохранённый вариант
    let saved = "dark";
    try {
      saved = localStorage.getItem(this.KEY) || "dark";
    } catch (e) {}

    if (!this.variants.includes(saved)) saved = "dark";

    this.set(saved);

    // Кнопка в шапке — переключение
    const bgBtn = document.getElementById("bgToggle");
    if (bgBtn) {
      bgBtn.addEventListener("click", () => this.openMenu());
    }

    this.bindMenu();
  },

  set(variant) {
    if (!this.variants.includes(variant)) variant = "dark";

    this.current = variant;

    // Убираем все классы
    this.variants.forEach(v => document.body.classList.remove("bg-" + v));

    // Добавляем новый
    document.body.classList.add("bg-" + variant);

    // Сохраняем
    try {
      localStorage.setItem(this.KEY, variant);
    } catch (e) {}
  },

  openMenu() {
    const overlay = document.getElementById("bgOverlay");
    if (overlay) overlay.classList.add("open");
  },

  closeMenu() {
    const overlay = document.getElementById("bgOverlay");
    if (overlay) overlay.classList.remove("open");
  },

  bindMenu() {
    const closeBtn = document.getElementById("closeBg");
    const overlay = document.getElementById("bgOverlay");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeMenu());
    }
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) this.closeMenu();
      });
    }

    // Кнопки вариантов
    document.querySelectorAll(".bg-option").forEach(btn => {
      btn.addEventListener("click", () => {
        const variant = btn.dataset.bg;
        this.set(variant);

        // Обновляем активную
        document.querySelectorAll(".bg-option").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }
};

// Запуск
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => Background.init());
} else {
  Background.init();
}
