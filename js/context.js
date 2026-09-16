// ============================================================
// CONTEXT.JS — Контекст диалога
// Помнит последние N сообщений, умеет искать по ним
// ============================================================

const Context = {
  history: [],
  MAX: 50,

  // ============================================================
  // ДОБАВИТЬ СООБЩЕНИЕ
  // ============================================================
  push(userText, botText) {
    this.history.push({
      user: userText || "",
      bot: botText || "",
      time: Date.now()
    });

    // Обрезаем историю до MAX
    if (this.history.length > this.MAX) {
      this.history = this.history.slice(-this.MAX);
    }
  },

  // ============================================================
  // ПОЛУЧИТЬ ПОСЛЕДНЮЮ ПАРУ
  // ============================================================
  last() {
    return this.history[this.history.length - 1] || null;
  },

  // ============================================================
  // ПОСЛЕДНЕЕ СООБЩЕНИЕ ПОЛЬЗОВАТЕЛЯ
  // ============================================================
  lastUser() {
    return this.last() ? this.last().user : null;
  },

  // ============================================================
  // ПОСЛЕДНЕЕ СООБЩЕНИЕ АНИ
  // ============================================================
  lastBot() {
    return this.last() ? this.last().bot : null;
  },

  // ============================================================
  // ПОЛУЧИТЬ N ПОСЛЕДНИХ СООБЩЕНИЙ
  // ============================================================
  lastN(n = 5) {
    return this.history.slice(-n);
  },

  // ============================================================
  // ПРОВЕРИТЬ: упоминалось ли слово в последних N сообщениях
  // ============================================================
  mentioned(word, within = 10) {
    if (!word) return false;
    const w = word.toLowerCase();
    const recent = this.history.slice(-within);
    return recent.some(h =>
      (h.user && h.user.toLowerCase().includes(w)) ||
      (h.bot && h.bot.toLowerCase().includes(w))
    );
  },

  // ============================================================
  // СКОЛЬКО РАЗ УПОМИНАЛОСЬ (в сообщениях пользователя)
  // ============================================================
  countMentions(word, within = 20) {
    if (!word) return 0;
    const w = word.toLowerCase();
    const recent = this.history.slice(-within);
    let count = 0;
    recent.forEach(h => {
      if (h.user && h.user.toLowerCase().includes(w)) count++;
    });
    return count;
  },

  // ============================================================
  // СКОЛЬКО РАЗ АНЯ ГОВОРИЛА СЛОВО
  // ============================================================
  countBotMentions(word, within = 20) {
    if (!word) return 0;
    const w = word.toLowerCase();
    const recent = this.history.slice(-within);
    let count = 0;
    recent.forEach(h => {
      if (h.bot && h.bot.toLowerCase().includes(w)) count++;
    });
    return count;
  },

  // ============================================================
  // ПОСЛЕДНИЕ N СООБЩЕНИЙ ТЕКСТОМ (для передачи в мозг)
  // ============================================================
  recentText(limit = 6) {
    return this.history.slice(-limit).map(h =>
      `Пользователь: ${h.user}\nАня: ${h.bot}`
    ).join("\n\n");
  },

  // ============================================================
  // СРЕДНЯЯ ДЛИНА СООБЩЕНИЙ ПОЛЬЗОВАТЕЛЯ
  // ============================================================
  avgUserLength(within = 20) {
    const recent = this.history.slice(-within);
    if (recent.length === 0) return 0;
    const sum = recent.reduce((acc, h) => acc + (h.user ? h.user.length : 0), 0);
    return sum / recent.length;
  },

  // ============================================================
  // СРЕДНЯЯ ДЛИНА СООБЩЕНИЙ АНИ
  // ============================================================
  avgBotLength(within = 20) {
    const recent = this.history.slice(-within);
    if (recent.length === 0) return 0;
    const sum = recent.reduce((acc, h) => acc + (h.bot ? h.bot.length : 0), 0);
    return sum / recent.length;
  },

  // ============================================================
  // БЫЛА ЛИ КОМАНДА (по паттерну)
  // ============================================================
  hasCommand(pattern, within = 3) {
    if (!pattern) return false;
    const re = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
    return this.history.slice(-within).some(h => h.user && re.test(h.user));
  },

  // ============================================================
  // ОЧИСТИТЬ КОНТЕКСТ
  // ============================================================
  clear() {
    this.history = [];
  },

  // ============================================================
  // ПОЛУЧИТЬ ВСЮ ИСТОРИЮ
  // ============================================================
  all() {
    return this.history;
  },

  // ============================================================
  // ЭКСПОРТ (для отладки)
  // ============================================================
  export() {
    return JSON.stringify(this.history, null, 2);
  },

  // ============================================================
  // ИМПОРТ (для отладки)
  // ============================================================
  import(json) {
    try {
      const data = typeof json === "string" ? JSON.parse(json) : json;
      if (Array.isArray(data)) {
        this.history = data.slice(-this.MAX);
      }
    } catch (e) {
      console.warn("Не удалось импортировать контекст:", e);
    }
  }
};