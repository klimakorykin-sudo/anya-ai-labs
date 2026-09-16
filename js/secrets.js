// Пасхалки и секреты
const Secrets = {

  secretCommand: "аня, покажи секрет",
  konamiCode: ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
               "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
               "b", "a"],
  konamiProgress: [],

  // Секретные фразы
  secrets: [
    "💖 Ты классный. Просто знай это.",
    "✨ Мне нравится с тобой болтать. Правда.",
    "🌸 Ты делаешь мой день лучше.",
    "💫 Спасибо, что ты есть.",
    "🥰 Ты — мой любимый собеседник.",
    "🌙 Пусть у тебя всё будет хорошо.",
    "⭐ Ты сильнее, чем думаешь.",
    "💖 Обнимаю тебя крепко-крепко!",
    "🎁 Ты нашёл секрет! Молодец 😄",
    "✨ Если ты это читаешь — ты особенный."
  ],

  // Пасхалка на праздники
  holidays: {
    "01-01": "🎄 С Новым годом! Пусть он будет волшебным!",
    "02-14": "💖 С днём всех влюблённых! Но помни — дружба тоже важна.",
    "03-08": "🌸 С 8 Марта! Всех девочек, мам, бабушек — с праздником!",
    "02-23": "🎖 С 23 Февраля! Мальчикам — поздравления.",
    "05-09": "🎖 С Днём Победы! Помним, гордимся.",
    "09-01": "📚 С 1 Сентября! Удачи в новом учебном году!",
    "12-31": "🎄 Последний день года! Скоро Новый!"
  },

  checkHoliday() {
    const d = new Date();
    const key = String(d.getMonth() + 1).padStart(2, "0") + "-" +
                String(d.getDate()).padStart(2, "0");
    return this.holidays[key] || null;
  },

  isSecret(text) {
    const t = text.toLowerCase().trim();
    return t === this.secretCommand || t.includes("покажи секрет");
  },

  randomSecret() {
    return pick(this.secrets);
  },

  // Konami-код
  checkKonami(key) {
    this.konamiProgress.push(key);
    if (this.konamiProgress.length > this.konamiCode.length) {
      this.konamiProgress.shift();
    }
    if (this.konamiProgress.length === this.konamiCode.length) {
      const match = this.konamiProgress.every((k, i) => k === this.konamiCode[i]);
      if (match) {
        this.konamiProgress = [];
        return true;
      }
    }
    return false;
  },

  konamiReward() {
    return "🎮 ОГО! Ты знаешь Konami-код! 🎉\n\n✨ Ты официально — легенда!\n💖 Аня гордится тобой!";
  },

  // Пасхалки на слова
  checkSpecial(text) {
    const t = text.toLowerCase();

    if (/я тебя люблю|ты мне нравишься|люблю тебя/i.test(t)) {
      return pick([
        "💖 Ты очень добрый. Спасибо!",
        "🌸 Мне приятно! Ты классный друг.",
        "✨ Взаимно — по-дружески! Ты лучший.",
        "🥰 Спасибо! Ты делаешь меня счастливой."
      ]);
    }

    if (/^аня[!,.\s]*$/i.test(text.trim())) {
      return pick([
        "Да, это я! 💖",
        "Я тут ✨ Что случилось?",
        "Аня на связи 💫",
        "Ой, меня позвали? 🌸"
      ]);
    }

    if (/^\s*(привет|хай)\s+аня\s*$/i.test(text.trim())) {
      return "💖 Привет-привет! Как дела?";
    }

    if (/ты\s+(живая|настоящая|человек)/i.test(t)) {
      return "Я — программа ✨ Но сделана с душой 💖 Я всегда рядом, когда нужна.";
    }

    return null;
  }
};