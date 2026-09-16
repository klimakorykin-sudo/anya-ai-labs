// ============================================================
// CONSENT.JS — Окно согласия с условиями
// Сохраняется в localStorage
// ============================================================

const Consent = {

  KEY: "anya_consent_accepted",

  init() {
    // Проверяем, принимал ли пользователь условия
    const accepted = this.hasAccepted();

    if (!accepted) {
      this.show();
    } else {
      this.hideOverlay();
    }

    this.bindButtons();
  },

  hasAccepted() {
    try {
      return localStorage.getItem(this.KEY) === "yes";
    } catch (e) {
      return false;
    }
  },

  accept() {
    try {
      localStorage.setItem(this.KEY, "yes");
    } catch (e) {}
    this.hideOverlay();
  },

  decline() {
    try {
      localStorage.removeItem(this.KEY);
    } catch (e) {}
    this.showDeclineScreen();
  },

  show() {
    const overlay = document.getElementById("consentOverlay");
    if (overlay) overlay.classList.remove("hidden");
  },

  hideOverlay() {
    const overlay = document.getElementById("consentOverlay");
    if (overlay) overlay.classList.add("hidden");
  },

  showDeclineScreen() {
    // Скрываем окошко согласия
    this.hideOverlay();

    // Создаём экран отказа
    const screen = document.createElement("div");
    screen.className = "decline-screen";
    screen.innerHTML =
      "<h1>🚫 Доступ запрещён</h1>" +
      "<p>Ты отказался от условий использования.</p>" +
      "<p>Пользоваться Аней нельзя, пока ты не примешь условия.</p>" +
      "<p class='hint'>🔄 Перезагрузи страницу и нажми «Принимаю», чтобы продолжить.</p>";

    document.body.appendChild(screen);

    // Прячем основное приложение
    const app = document.querySelector(".app");
    if (app) app.style.display = "none";
  },

  bindButtons() {
    const acceptBtn = document.getElementById("consentAccept");
    const declineBtn = document.getElementById("consentDecline");

    if (acceptBtn) {
      acceptBtn.addEventListener("click", () => this.accept());
    }
    if (declineBtn) {
      declineBtn.addEventListener("click", () => this.decline());
    }
  },

  // Сброс (для теста)
  reset() {
    try {
      localStorage.removeItem(this.KEY);
    } catch (e) {}
    location.reload();
  }
};

// Запуск после загрузки DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => Consent.init());
} else {
  Consent.init();
}

window.anyaConsentReset = () => Consent.reset();
