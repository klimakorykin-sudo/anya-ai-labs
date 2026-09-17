// ============================================================
// NOTES.JS — Заметки (текст + фото)
// ============================================================

const NotesModule = {

  async handle(text) {
    const t = text.toLowerCase().trim();

    // ============================================================
    // ЗАПОМНИТЬ ПОСЛЕДНЕЕ ФОТО
    // ============================================================
    if (/(запомни|сохрани|запиши|добавь).*(это\s+фото|фото\s+это|последн.*фото|фото\s+ан[ию]|ан[ию]\s+фото)/.test(t)) {
      // Берём последнее фото из Context
      const lastPhoto = this.getLastPhoto();
      if (!lastPhoto) {
        return { text: "🤔 Я показывала фото? Напиши «покажи фото» — потом сохраню." };
      }

      await this.savePhotoNote(lastPhoto);
      return { text:
        "📝 Сохранила фото в заметки:\n\n" +
        "📷 " + lastPhoto + "\n\n" +
        "Всего фото: " + (await this.countPhotoNotes())
      };
    }

    // ============================================================
    // ЗАПОМНИТЬ КОНКРЕТНОЕ ФОТО ПО ИМЕНИ
    // ============================================================
    const photoMatch = text.match(/(?:запомни|сохрани|запиши)\s+(?:фото\s+)?(anya\/\d+\.(?:jpg|png|jpeg))/i);
    if (photoMatch) {
      const path = photoMatch[1];
      await this.savePhotoNote(path);
      return { text: "📝 Сохранила фото: " + path };
    }

    // ============================================================
    // ЗАПОМНИТЬ ТЕКСТ
    // ============================================================
    const saveMatch = text.match(/(?:запомни|запиши|сохрани|добавь в заметки|добавь в заметку|в заметки|в заметку)[:\s]*\s*(.+)/i);
    if (saveMatch && saveMatch[1] && saveMatch[1].trim().length > 0) {
      const note = saveMatch[1].trim();
      // Если это команда про фото — уже обработали выше
      if (/(это\s+фото|последн.*фото)/.test(note)) {
        return null;
      }
      await MemoryDB.addNote(note);
      return { text: "📝 Записала: «" + note + "»" };
    }

    // ============================================================
    // ЗАПОМНИ БЕЗ ДВОЕТОЧИЯ
    // ============================================================
    if (/^запомни\s+/i.test(t) && !saveMatch) {
      const note = text.replace(/^запомни\s+/i, "").trim();
      if (note.length > 0 && !/(фото|это|последн)/.test(note)) {
        await MemoryDB.addNote(note);
        return { text: "📝 Записала: «" + note + "»" };
      }
    }

    // ============================================================
    // ПОКАЗАТЬ ЗАМЕТКИ
    // ============================================================
    if (/(покажи.*заметк|мои заметк|список заметок|что.*записал|что в заметк)/.test(t)) {
      const notes = await MemoryDB.allNotes();
      if (notes.length === 0) {
        return { text: "📝 Заметок пока нет. Скажи «Запомни: ...» — и я сохраню!" };
      }

      // Текстовые заметки
      const textNotes = notes.filter(n => !this.isPhotoNote(n.text));
      // Фото-заметки
      const photoNotes = notes.filter(n => this.isPhotoNote(n.text));

      let out = "📝 Твои заметки (" + notes.length + "):\n\n";

      // Текстовые
      if (textNotes.length > 0) {
        textNotes.forEach((n, i) => {
          out += (i + 1) + ". " + n.text + "\n";
        });
      }

      // Фото
      if (photoNotes.length > 0) {
        out += "\n📷 ФОТО (" + photoNotes.length + "):\n";
        photoNotes.forEach((n, i) => {
          const path = n.text.replace("[ФОТО] ", "");
          out += (i + 1) + ". " + path + "\n";
        });
      }

      // Отправляем с фото
      return {
        text: out.trim(),
        photoList: photoNotes.map(n => n.text.replace("[ФОТО] ", ""))
      };
    }

    // ============================================================
    // ОЧИСТИТЬ ЗАМЕТКИ
    // ============================================================
    if (/(очисти.*заметк|удали.*заметк|стереть.*заметк|почисти.*заметк)/.test(t)) {
      await MemoryDB.clearNotes();
      return { text: "🗑 Заметки очищены." };
    }

    // ============================================================
    // СКОЛЬКО ФОТО В ЗАМЕТКАХ
    // ============================================================
    if (/(сколько.*фото.*заметк|сколько.*запомнил.*фото)/.test(t)) {
      const count = await this.countPhotoNotes();
      return { text: "📷 В заметках " + count + " " + this.plural(count, "фото", "фото", "фото") + "." };
    }

    return null;
  },

  // ============================================================
  // ОПРЕДЕЛИТЬ — ЭТО ФОТО-ЗАМЕТКА?
  // ============================================================
  isPhotoNote(text) {
    return /^\[ФОТО\]\s/.test(text);
  },

  // ============================================================
  // СОХРАНИТЬ ФОТО-ЗАМЕТКУ
  // ============================================================
  async savePhotoNote(path) {
    const note = "[ФОТО] " + path;
    // Проверяем, нет ли уже такой
    const notes = await MemoryDB.allNotes();
    if (notes.some(n => n.text === note)) {
      return false;
    }
    await MemoryDB.addNote(note);
    return true;
  },

  // ============================================================
  // СКОЛЬКО ФОТО-ЗАМЕТОК
  // ============================================================
  async countPhotoNotes() {
    const notes = await MemoryDB.allNotes();
    return notes.filter(n => this.isPhotoNote(n.text)).length;
  },

  // ============================================================
  // ПОЛУЧИТЬ ПОСЛЕДНЕЕ ФОТО ИЗ КОНТЕКСТА
  // ============================================================
  getLastPhoto() {
    if (typeof Context === "undefined") return null;
    // Смотрим историю за последние 3 сообщения
    const recent = Context.history.slice(-3);
    for (let i = recent.length - 1; i >= 0; i--) {
      const bot = recent[i].bot || "";
      const m = bot.match(/anya\/\d+\.(jpg|png|jpeg)/i);
      if (m) return m[0];
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
