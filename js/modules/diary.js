// ============================================================
// DIARY.JS — Личный дневник (localStorage)
// ============================================================

const DiaryModule = {

  KEY: "anya_diary",

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

  save(entries) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(entries));
    } catch (e) {
      console.warn("Не удалось сохранить дневник:", e);
    }
  },

  // ============================================================
  // ДОБАВИТЬ ЗАПИСЬ
  // ============================================================
  add(text) {
    const entries = this.load();
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      text: text
    };
    entries.unshift(entry); // новые сверху
    // Ограничим 500 записей
    if (entries.length > 500) entries.length = 500;
    this.save(entries);
    return entry;
  },

  // ============================================================
  // УДАЛИТЬ ЗАПИСЬ
  // ============================================================
  remove(id) {
    let entries = this.load();
    entries = entries.filter(e => e.id !== id);
    this.save(entries);
  },

  // ============================================================
  // УДАЛИТЬ ВСЁ
  // ============================================================
  clear() {
    try {
      localStorage.removeItem(this.KEY);
    } catch (e) {}
  },

  // ============================================================
  // ФОРМАТИРОВАНИЕ ДАТЫ
  // ============================================================
  formatDate(iso) {
    try {
      const d = new Date(iso);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const hour = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");
      return day + "." + month + "." + year + " " + hour + ":" + min;
    } catch (e) {
      return iso;
    }
  },

  formatDateShort(iso) {
    try {
      const d = new Date(iso);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      return day + "." + month;
    } catch (e) {
      return iso;
    }
  },

  // ============================================================
  // ЗАПИСИ ЗА ПЕРИОД
  // ============================================================
  getByDays(days) {
    const entries = this.load();
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return entries.filter(e => new Date(e.date).getTime() >= cutoff);
  },

  // ============================================================
  // ГЛАВНАЯ ФУНКЦИЯ
  // ============================================================
  async handle(text) {
    const t = text.toLowerCase().trim();

    // === ЗАПИСАТЬ В ДНЕВНИК ===
    const addMatch = text.match(/(?:запиши в дневник|запиши в дневничок|добавь в дневник|запись в дневник|дневник[:\s]+)\s*:?\s*(.+)/i);
    if (addMatch && addMatch[1] && addMatch[1].trim().length > 1) {
      const entryText = addMatch[1].trim();
      const entry = this.add(entryText);
      return { text:
        "📔 Записала в дневник:\n\n" +
        "«" + entryText + "»\n\n" +
        "📅 " + this.formatDate(entry.date) + "\n\n" +
        "Спасибо, что делишься 💖"
      };
    }

    // === ПОКАЗАТЬ ДНЕВНИК ===
    if (/^(покажи дневник|мой дневник|дневник|открой дневник|что в дневнике)[!?.\s]*$/.test(t)) {
      const entries = this.load();
      if (entries.length === 0) {
        return { text:
          "📔 Дневник пока пуст.\n\n" +
          "Напиши: «Запиши в дневник: сегодня было хорошо» — и я сохраню!"
        };
      }

      let out = "📔 ТВОЙ ДНЕВНИК (" + entries.length + " " + this.plural(entries.length, "запись", "записи", "записей") + "):\n\n";
      entries.slice(0, 10).forEach((e, i) => {
        out += (i + 1) + ". [" + this.formatDate(e.date) + "]\n";
        out += "   " + e.text + "\n\n";
      });

      if (entries.length > 10) {
        out += "...и ещё " + (entries.length - 10) + ".\n\n";
      }

      out += "Скажи «дневник за неделю» — покажу последние 7 дней.";
      return { text: out };
    }

    // === ДНЕВНИК ЗА НЕДЕЛЮ ===
    if (/(дневник.*недел|недел.*дневник|за неделю)/.test(t)) {
      const entries = this.getByDays(7);
      if (entries.length === 0) {
        return { text: "📔 За последнюю неделю записей нет." };
      }
      let out = "📔 ДНЕВНИК ЗА НЕДЕЛЮ (" + entries.length + "):\n\n";
      entries.forEach((e, i) => {
        out += (i + 1) + ". [" + this.formatDate(e.date) + "]\n";
        out += "   " + e.text + "\n\n";
      });
      return { text: out };
    }

    // === ДНЕВНИК ЗА МЕСЯЦ ===
    if (/(дневник.*месяц|месяц.*дневник|за месяц)/.test(t)) {
      const entries = this.getByDays(30);
      if (entries.length === 0) {
        return { text: "📔 За последний месяц записей нет." };
      }
      let out = "📔 ДНЕВНИК ЗА МЕСЯЦ (" + entries.length + "):\n\n";
      entries.slice(0, 20).forEach((e, i) => {
        out += (i + 1) + ". [" + this.formatDate(e.date) + "]\n";
        out += "   " + e.text + "\n\n";
      });
      if (entries.length > 20) {
        out += "...и ещё " + (entries.length - 20) + ".";
      }
      return { text: out };
    }

    // === СКОЛЬКО ЗАПИСЕЙ ===
    if (/(сколько.*записей.*дневник|сколько.*дневник)/.test(t)) {
      const entries = this.load();
      if (entries.length === 0) {
        return { text: "📔 Дневник пока пуст." };
      }
      return { text: "📔 В дневнике " + entries.length + " " + this.plural(entries.length, "запись", "записи", "записей") + "." };
    }

    // === УДАЛИТЬ ДНЕВНИК ===
    if (/(удали.*дневник|очисти.*дневник|стереть.*дневник)/.test(t)) {
      this.clear();
      return { text: "🗑 Дневник очищен." };
    }

    // === УДАЛИТЬ ПОСЛЕДНЮЮ ЗАПИСЬ ===
    if (/(удали.*последн.*запис|отмени.*запис)/.test(t)) {
      const entries = this.load();
      if (entries.length === 0) {
        return { text: "📔 Дневник пуст." };
      }
      const last = entries[0];
      this.remove(last.id);
      return { text: "🗑 Удалила последнюю запись:\n«" + last.text + "»" };
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
