// ============================================================
// NOTES.JS — Заметки (текст + фото)
// ============================================================

const NotesModule = {

  async handle(text) {
    const t = text.toLowerCase().trim();

    // ============================================================
    // ЗАПОМНИТЬ ПОСЛЕДНЕЕ ФОТО
    // ============================================================
    if (/(запомни|сохрани|запиши|добавь).*(это\s+фото|фото\s+это|последн.*фото|фото\s+ан[ию]|ан[ию]\s+фото)/.test(t)
        || /^(запомни|сохрани)\s+это\s+фото[!?.\s]*$/i.test(t)
        || /^(запомни|сохрани)\s+фото[!?.\s]*$/i.test(t)) {
      const lastPhoto = this.getLastPhoto();
      if (!lastPhoto) {
        return { text: "🤔 Я показывала фото? Напиши «покажи фото» — потом сохраню." };
      }

      const saved = await this.savePhotoNote(lastPhoto);
      if (!saved) {
        return { text: "📝 Это фото уже в заметках!" };
      }

      const count = await this.countPhotoNotes();
      return { text:
        "📝 Сохранила фото в заметки:\n\n" +
        "📷 " + lastPhoto + "\n\n" +
        "Всего фото: " + count
      };
    }

    // ============================================================
    // ЗАПОМНИТЬ КОНКРЕТНОЕ ФОТО
    // ============================================================
    const photoMatch = text.match(/(?:запомни|сохрани|запиши)\s+(?:фото\s+)?(anya\/\d+\.(?:jpg|png|jpeg))/i);
    if (photoMatch) {
      const path = photoMatch[1];
      const saved = await this.savePhotoNote(path);
      if (!saved) {
        return { text: "📝 Это фото уже в заметках!" };
      }
      return { text: "📝 Сохранила фото: " + path };
    }

    // ============================================================
    // ПОКАЗАТЬ ЗАМЕТКИ (расширенные триггеры)
    // ============================================================
    if (/(покажи.*заметк|мои заметк|список заметок|что.*записал|что в заметк|^заметк[иа]?\s*$|^заметки[!?.\s]*$)/.test(t)) {
      const notes = await MemoryDB.allNotes();
      if (notes.length === 0) {
        return { text: "📝 Заметок пока нет. Скажи «Запомни: ...» — и я сохраню!" };
      }

      const textNotes = notes.filter(n => !this.isPhotoNote(n.text));
      const photoNotes = notes.filter(n => this.isPhotoNote(n.text));

      let out = "📝 Твои заметки (" + notes.length + "):\n\n";

      if (textNotes.length > 0) {
        textNotes.forEach((n, i) => {
          out += (i + 1) + ". " + n.text + "\n";
        });
        out += "\n";
      }

      if (photoNotes.length > 0) {
        out += "📷 ФОТО (" + photoNotes.length + "):\n";
        photoNotes.forEach((n, i) => {
          const path = n.text.replace("[ФОТО] ", "");
          out += (i + 1) + ". " + path + "\n";
        });
      }

      return {
        text: out.trim(),
        photoList: photoNotes.map(n => n.text.replace("[ФОТО] ", ""))
      };
    }

    // ============================================================
    // ЗАПОМНИТЬ ТЕКСТ
    // ============================================================
    const saveMatch = text.match(/(?:запомни|запиши|сохрани|добавь в заметки|добавь в заметку|в заметки|в заметку)[:\s]*\s*(.+)/i);
    if (saveMatch && saveMatch[1] && saveMatch[1].trim().length > 0) {
      const note = saveMatch[1].trim();
      if (/(это\s+фото|последн.*фото)/.test(note)) return null;
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
    // ОЧИСТИТЬ
    // ============================================================
    if (/(очисти.*заметк|удали.*заметк|стереть.*заметк|почисти.*заметк)/.test(t)) {
      await MemoryDB.clearNotes();
      return { text: "🗑 Заметки очищены." };
    }

    // ============================================================
    // СКОЛЬКО ФОТО
    // ============================================================
    if (/(сколько.*фото.*заметк|сколько.*запомнил.*фото)/.test(t)) {
      const count = await this.countPhotoNotes();
      return { text: "📷 В заметках " + count + " фото." };
    }

    return null;
  },

  isPhotoNote(text) {
    return /^\[ФОТО\]\s/.test(text);
  },

  async savePhotoNote(path) {
    const note = "[ФОТО] " + path;
    const notes = await MemoryDB.allNotes();
    if (notes.some(n => n.text === note)) {
      return false;
    }
    await MemoryDB.addNote(note);
    return true;
  },

  async countPhotoNotes() {
    const notes = await MemoryDB.allNotes();
    return notes.filter(n => this.isPhotoNote(n.text)).length;
  },

  getLastPhoto() {
    if (typeof Context === "undefined") return null;
    const recent = Context.history.slice(-5);
    for (let i = recent.length - 1; i >= 0; i--) {
      const bot = recent[i].bot || "";
      let m = bot.match(/\[ФОТО:(anya\/\d+\.(jpg|png|jpeg))\]/i);
      if (m) return m[1];
      m = bot.match(/anya\/\d+\.(jpg|png|jpeg)/i);
      if (m) return m[0];
    }
    return null;
  }
};
