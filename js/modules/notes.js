const NotesModule = {

  async handle(text) {
    const t = text.toLowerCase();

    // Добавить заметку
    if (/(запомни|запиши|добавь.*заметк|сохрани)/.test(t) && !/покажи|список|мои заметк|очисти|удали/.test(t)) {
      const note = text
        .replace(/.*?(запомни|запиши|добавь.*заметк|сохрани)\s*:?\s*/i, "")
        .trim();

      if (!note) {
        return { text: "📝 Что записать? Напиши, например: «Запомни: купить хлеб»" };
      }

      await MemoryDB.addNote(note);
      return { text: `📝 Записала: «${note}»` };
    }

    // Показать заметки
    if (/(покажи.*заметк|мои заметк|список заметок|что.*записал)/.test(t)) {
      const notes = await MemoryDB.allNotes();
      if (notes.length === 0) {
        return { text: "📝 Заметок пока нет. Скажи «Запомни: ...» — и я сохраню!" };
      }
      const list = notes.map((n, i) => `${i + 1}. ${n.text}`).join("\n");
      return { text: `📝 Твои заметки (${notes.length}):\n\n${list}` };
    }

    // Очистить заметки
    if (/(очисти.*заметк|удали.*заметк|стереть.*заметк)/.test(t)) {
      await MemoryDB.clearNotes();
      return { text: "🗑 Заметки очищены." };
    }

    return null;
  }
};