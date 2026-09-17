const PhotosModule = {

  list: ["anya/1.jpg", "anya/2.jpg", "anya/3.jpg"],

  // Комплименты на фото
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

  // Триггеры комплиментов
  complimentTriggers: [
    "красавица", "красивая", "красив", "милая", "мил", "симпатичная", "симпатичн",
    "хорошенькая", "хороша", "прекрасная", "прекрасн", "классная", "классн",
    "супер", "вау", "крутая", "крутая", "лучшая", "чудо", "обалденная", "шикарная",
    "восхитительная", "бомба", "огонь", "роскошная", "обворожительная", "нежная"
  ],

  random() {
    return pick(this.list);
  },

  handle(text) {
    const t = text.toLowerCase();

    // === Хочет фото ===
    const wantsPhoto = /(фото|фотк|покажи.*(себя|аню)|picture|photo|img|картинк)/.test(t)
                    && !/(код|сочинени|поищи|найди)/.test(t);

    if (wantsPhoto) {
      return {
        text: pick(PHRASES.photo),
        photo: this.random()
      };
    }

    // === Комплимент на фото ===
    // Если пользователь недавно запросил фото (последние 3 сообщения)
    const photoRecently = typeof Context !== "undefined" && (
      Context.mentioned("фото", 3) ||
      Context.mentioned("покажи", 3) ||
      Context.mentioned("себя", 3)
    );

    if (photoRecently) {
      // Проверяем комплимент
      for (const trigger of this.complimentTriggers) {
        if (t.includes(trigger)) {
          return { text: pick(this.photoCompliments) };
        }
      }
    }

    // === Просто комплимент без фото (без контекста) ===
    for (const trigger of this.complimentTriggers) {
      if (t === trigger || t === trigger + "!" || t === trigger + ".") {
        return { text: pick(this.photoCompliments) };
      }
    }

    return null;
  }
};
