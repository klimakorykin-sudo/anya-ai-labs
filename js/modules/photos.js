// ============================================================
// PHOTOS.JS — Фото Ани + комплименты
// ============================================================

const PhotosModule = {

  list: ["anya/1.jpg", "anya/2.jpg", "anya/3.jpg"],

  photoCompliments: [
    "💖 Спасибо! Ты тоже классный!",
    "🌸 Ой, спасибо! Смущаешь меня ✨",
    "✨ Рада, что тебе нравится!",
    "💫 Ты очень добрый!",
    "🥰 Спасибо! Обнимаю!",
    "💖 Ты делаешь мне приятно!",
    "🌸 Спасибо-спасибо!",
    "✨ Ты лучший!",
    "💖 Обнимаю крепко! 🫂",
    "🌸 Ты делаешь мой день лучше!"
  ],

  praiseReactions: [
    "💖 Спасибо! Ты тоже!",
    "✨ Рада, что нравится!",
    "🌸 Ты очень добрый!",
    "💫 Спасибо-спасибо!",
    "🥰 Обнимаю!",
    "💖 Ты лучший!",
    "✨ Ты делаешь мой день!"
  ],

  complimentTriggers: [
    "красавица", "красивая", "красив", "милая", "мил", "симпатичная", "симпатичн",
    "хорошенькая", "хороша", "прекрасная", "прекрасн", "классная", "классн",
    "супер", "вау", "крутая", "лучшая", "чудо", "обалденная", "шикарная",
    "восхитительная", "бомба", "огонь", "роскошная", "обворожительная", "нежная"
  ],

  praiseTriggers: [
    "хорош", "круто", "класс", "молодец", "отлично", "супер", "вау",
    "здорово", "прекрасно", "замечательно", "идеально", "топ"
  ],

  random() {
    return pick(this.list);
  },

  handle(text) {
    const t = text.toLowerCase().trim();

    // === ЗАПОМНИ / СОХРАНИ — НЕ наши ===
    if (/(запомни|сохрани|запиши|в заметк|в дневник|в избранн)/.test(t)) {
      return null;
    }

    // === Хочет фото (расширенные триггеры) ===
    const wantsPhoto = /(фото|фотк|picture|photo|img|картинк)/.test(t)
                    || /покаж[иуе]шь?/i.test(t)
                    || /показать/i.test(t)
                    || /ещё\s+не\s+покаж/i.test(t)
                    || /еще\s+не\s+покаж/i.test(t)
                    || /ещё\s+покаж/i.test(t)
                    || /еще\s+покаж/i.test(t)
                    || /дай.*(фото|себя|аню)/i.test(t)
                    || /можно.*(фото|себя|аню)/i.test(t);

    // Исключения
    if (/(код|сочинени|поищи|найди в инет|загугли)/.test(t)) {
      return null;
    }

    if (wantsPhoto) {
      return {
        text: pick(PHRASES.photo),
        photo: this.random()
      };
    }

    // === Комплимент на фото ===
    const photoRecently = typeof Context !== "undefined" && (
      Context.mentioned("фото", 3) ||
      Context.mentioned("покажи", 3) ||
      Context.mentioned("себя", 3)
    );

    if (photoRecently) {
      for (const trigger of this.complimentTriggers) {
        if (t.includes(trigger)) {
          return { text: pick(this.photoCompliments) };
        }
      }
    }

    // === Похвала ===
    for (const trigger of this.praiseTriggers) {
      const re = new RegExp("^" + trigger + "[!?.\\s]*$", "i");
      if (re.test(t)) {
        return { text: pick(this.praiseReactions) };
      }
    }

    // === Комплимент без контекста ===
    for (const trigger of this.complimentTriggers) {
      if (t === trigger || t === trigger + "!" || t === trigger + ".") {
        return { text: pick(this.photoCompliments) };
      }
    }

    return null;
  }
};
