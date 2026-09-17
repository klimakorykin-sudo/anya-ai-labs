// ============================================================
// CHAT-SEARCH.JS — Поиск по чату
// Работает через текст: "найди", "поиск", "где говорили"
// ============================================================

const ChatSearch = {

  // ============================================================
  // ГЛАВНЫЙ МЕТОД — ищет и возвращает результат
  // ============================================================
  async search(query, limit = 10) {
    if (!query || query.length < 2) {
      return { text: "🔍 Что искать? Напиши: «найди про школу»" };
    }

    const q = query.toLowerCase().trim();
    let messages = [];

    // Берём из текущего чата
    if (typeof ChatsDB !== "undefined" && typeof Chats !== "undefined" && Chats.currentChatId) {
      try {
        messages = await ChatsDB.getMessages(Chats.currentChatId);
      } catch (e) {
        messages = [];
      }
    }

    // Fallback — общая история
    if (messages.length === 0 && typeof MemoryDB !== "undefined") {
      try {
        messages = await MemoryDB.recentHistory(500);
      } catch (e) {
        messages = [];
      }
    }

    if (messages.length === 0) {
      return { text: "🔍 Пока нечего искать — поговори со мной!" };
    }

    // Фильтруем
    const found = messages.filter(m => {
      const userText = (m.user || "").toLowerCase();
      const botText = (m.bot || "").toLowerCase();
      return userText.includes(q) || botText.includes(q);
    });

    if (found.length === 0) {
      return { text: `🔍 По запросу «${query}» ничего не нашла.\n\nПопробуй другие слова.` };
    }

    // Показываем последние N
    const recent = found.slice(-limit);
    let out = `🔍 Нашла ${found.length} ${this.plural(found.length, "сообщение", "сообщения", "сообщений")} по запросу «${query}»:\n\n`;

    recent.forEach((m, i) => {
      const date = m.time ? this.formatDate(m.time) : "";
      const userText = (m.user || "").slice(0, 100);
      const botText = (m.bot || "").slice(0, 100);

      out += `${i + 1}. [${date}]\n`;
      if (userText) out += `   Ты: ${userText}\n`;
      if (botText) out += `   Аня: ${botText}\n`;
      out += `\n`;
    });

    if (found.length > limit) {
      out += `...и ещё ${found.length - limit}.\n`;
    }

    return { text: out.trim() };
  },

  // ============================================================
  // ФОРМАТИРОВАНИЕ ДАТЫ
  // ============================================================
  formatDate(timestamp) {
    try {
      const d = new Date(timestamp);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const hour = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");
      return `${day}.${month} ${hour}:${min}`;
    } catch (e) {
      return "";
    }
  },

  // ============================================================
  // ПЛЮРАЛИЗАЦИЯ
  // ============================================================
  plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  },

  // ============================================================
  // МОДУЛЬ — обработчик текста
  // ============================================================
  async handle(text) {
    const t = text.toLowerCase().trim();

    // Триггеры поиска
    const searchPatterns = [
      /^найди\s+(?:сообщение\s+)?(?:про|о|об|где)\s+(.+)/i,
      /^поиск[:\s]+(.+)/i,
      /^поищи\s+(?:сообщение\s+)?(?:про|о|об)\s+(.+)/i,
      /^где\s+(?:мы\s+)?(?:говорили|писали|обсуждали)\s+(?:про|о|об)\s+(.+)/i,
      /^найди\s+(.+)/i,
      /^найти\s+(.+)/i
    ];

    for (const pattern of searchPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const query = match[1].trim().replace(/[?!.]+$/, "");
        if (query.length >= 2) {
          return await this.search(query);
        }
      }
    }

    // Если просто «поиск по чату» — подсказка
    if (/^(поиск по чату|искать в чате|найти в чате|поиск в переписке)[!?.\s]*$/.test(t)) {
      return { text:
        "🔍 ПОИСК ПО ЧАТУ:\n\n" +
        "Напиши:\n" +
        "• «найди про школу»\n" +
        "• «где мы говорили про футбол»\n" +
        "• «поиск: математика»\n" +
        "• «поищи сообщение про Аню»"
      };
    }

    return null;
  }
};
