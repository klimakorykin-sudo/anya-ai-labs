// ============================================================
// NOTES.JS — Заметки (сохранение текста, не фото)
// ============================================================

const NotesModule = {

  async handle(text) {
    const t = text.toLowerCase().trim();

    // === ЗАПОМНИТЬ ФОТО / ССЫЛКУ / СЛОВО ===
    // «запомни своё фото», «сохрани в заметки: ...», «запиши ...»
    const saveMatch = text.match(/(?:запомни|запиши|сохрани|добавь в заметки|добавь в заметку|в заметки|в заметку)[:\s]*\s*(.+)/i);
    if (saveMatch && saveMatch[1] && saveMatch[1].trim().length > 0) {
      let note = saveMatch[1].trim();
      // Убираем «своё», «моё», «фото» в конце, если это просто «запомни фото»
      // Но оставляем текст как есть — сохраняем то, что написал
      await MemoryDB.addNote(note);
      return { text: "📝 Записала: «" + note + "»" };
    }

    // === ЗАПОМНИ БЕЗ ДВОЕТОЧИЯ ===
    // «запомни купить хлеб»
    if (/^запомни\s+/i.test(t) && !saveMatch) {
      const note = text.replace(/^запомни\s+/i, "").trim();
      if (note.length > 0) {
        await MemoryDB.addNote(note);
        return { text: "📝 Записала: «" + note + "»" };
      }
    }

    // === ПОКАЗАТЬ ЗАМЕТКИ ===
    if (/(покажи.*заметк|мои заметк|список заметок|что.*записал|что в заметк)/.test(t)) {
      const notes = await MemoryDB.allNotes();
      if (notes.length === 0) {
        return { text: "📝 Заметок пока нет. Скажи «Запомни: ...» — и я сохраню!" };
      }
      const list = notes.map((n, i) => (i + 1) + ". " + n.text).join("\n");
      return { text: "📝 Твои заметки (" + notes.length + "):\n\n" + list };
    }

    // === ОЧИСТИТЬ ЗАМЕТКИ ===
    if (/(очисти.*заметк|удали.*заметк|стереть.*заметк|почисти.*заметк)/.test(t)) {
      await MemoryDB.clearNotes();
      return { text: "🗑 Заметки очищены." };
    }

    return null;
  }
};
