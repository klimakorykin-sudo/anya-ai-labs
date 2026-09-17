// ============================================================
// FAVORITES.JS — Избранное (localStorage)
// ============================================================

const FavoritesModule = {

  KEY: "anya_favorites",

  // ============================================================
  // ЗАГРУЗКА / СОХРАНЕНИЕ
  // ============================================================
  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  save(items) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(items));
    } catch (e) {}
  },

  // ============================================================
  // ДОБАВИТЬ В ИЗБРАННОЕ
  // ============================================================
  add(text, source) {
    const items = this.load();
    const item = {
      id: Date.now(),
      date: new Date().toISOString(),
      text: text,
      source: source || "сообщение"
    };
    items.unshift(item);
    if (items.length > 200) items.length = 200;
    this.save(items);
    return item;
  },

  // ============================================================
  // УДАЛИТЬ
  // ============================================================
  remove(id) {
    let items = this.load();
    items = items.filter(i => i.id !== id);
    this.save(items);
  },

  clear() {
    try {
      localStorage.removeItem(this.KEY);
    } catch (e) {}
  },

  // ============================================================
  // ФОРМАТ ДАТЫ
  // ============================================================
  formatDate(iso) {
    try {
      const d = new Date(iso);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return day + "." + month + "." + year;
    } catch (e) {
      return iso;
    }
  },

  // ============================================================
  // ГЛАВНАЯ ФУНКЦИЯ
  // ============================================================
  async handle(text) {
    const t = text.toLowerCase().trim();

    // === СОХРАНИТЬ ПОСЛЕДНЕЕ СООБЩЕНИЕ АНИ ===
    if (/^(сохрани это|в избранное|запомни это|сохрани сообщение)[!?.\s]*$/.test(t)) {
      const lastBot = typeof Context !== "undefined" ? Context.lastBot() : null;
      if (!lastBot) {
        return { text: "🤔 Нечего сохранять. Сначала поговори со мной." };
      }
      const item = this.add(lastBot, "сообщение Ани");
      return { text:
        "⭐ Сохранила в избранное:\n\n" +
        "«" + (lastBot.length > 150 ? lastBot.slice(0, 150) + "..." : lastBot) + "»"
      };
    }

    // === СОХРАНИТЬ СВОЙ ТЕКСТ ===
    const saveMatch = text.match(/(?:сохрани|в избранное|запомни)[:\s]+(.+)/i);
    if (saveMatch && saveMatch[1] && saveMatch[1].trim().length > 1) {
      const content = saveMatch[1].trim();
      if (!/(это|сообщение)[!?.\s]*$/i.test(content)) {
        const item = this.add(content, "твоё");
        return { text:
          "⭐ Сохранила в избранное:\n\n" +
          "«" + content + "»"
        };
      }
    }

    // === ПОКАЗАТЬ ИЗБРАННОЕ ===
    if (/^(покажи избранное|мои избранные|избранное|список избранного|что я сохранил)[!?.\s]*$/.test(t)) {
      const items = this.load();
      if (items.length === 0) {
        return { text:
          "⭐ Избранное пусто.\n\n" +
          "Напиши «сохрани это» после сообщения Ани — и я сохраню его."
        };
      }

      let out = "⭐ ТВОЁ ИЗБРАННОЕ (" + items.length + " " + this.plural(items.length, "запись", "записи", "записей") + "):\n\n";
      items.slice(0, 10).forEach((item, i) => {
        out += (i + 1) + ". [" + this.formatDate(item.date) + "] " + item.source + "\n";
        out += "   " + (item.text.length > 120 ? item.text.slice(0, 120) + "..." : item.text) + "\n\n";
      });

      if (items.length > 10) {
        out += "...и ещё " + (items.length - 10) + "\n\n";
      }

      out += "Скажи «удали из избранного N» — удалю N-ю запись.";
      return { text: out };
    }

    // === УДАЛИТЬ ПО НОМЕРУ ===
    const delMatch = t.match(/удали.*избранн.*(\d+)/);
    if (delMatch) {
      const idx = parseInt(delMatch[1]) - 1;
      const items = this.load();
      if (idx < 0 || idx >= items.length) {
        return { text: "🤔 Нет записи под таким номером." };
      }
      const removed = items[idx];
      this.remove(removed.id);
      return { text: "🗑 Удалила из избранного:\n«" + (removed.text.length > 80 ? removed.text.slice(0, 80) + "..." : removed.text) + "»" };
    }

    // === УДАЛИТЬ ПОСЛЕДНЮЮ ===
    if (/(удали.*последн.*избранн|удали.*последнюю.*запись)/.test(t)) {
      const items = this.load();
      if (items.length === 0) {
        return { text: "⭐ Избранное пусто." };
      }
      const last = items[0];
      this.remove(last.id);
      return { text: "🗑 Удалила последнюю запись из избранного." };
    }

    // === ОЧИСТИТЬ ===
    if (/(очисти.*избранн|удали.*избранн|стереть.*избранн)/.test(t) && !delMatch) {
      this.clear();
      return { text: "🗑 Избранное очищено." };
    }

    // === СКОЛЬКО ЗАПИСЕЙ ===
    if (/(сколько.*избранн|сколько.*сохранил)/.test(t)) {
      const items = this.load();
      if (items.length === 0) {
        return { text: "⭐ Избранное пусто." };
      }
      return { text: "⭐ В избранном " + items.length + " " + this.plural(items.length, "запись", "записи", "записей") + "." };
    }

    return null;
  },

  // ============================================================
  // ПЛЮРАЛИЗАЦИЯ
  // ============================================================
  plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }
};
