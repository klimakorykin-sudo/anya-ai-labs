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

  complimentTriggers: [
    "красавица", "красивая", "красив", "милая", "мил", "симпатичная", "симпатичн",
    "хорошенькая", "хороша", "прекрасная", "прекрасн", "классная", "классн",
    "супер", "вау", "крутая", "лучшая", "чудо", "обалденная", "шикарная",
    "восхитительная", "бомба", "огонь", "роскошная", "обворожительная", "нежная"
  ],

  random() {
    return pick(this.list);
  },

  handle(text) {
    const t = text.toLowerCase();

    // === ЗАПОМНИ / СОХРАНИ / ЗАПИШИ — НЕ наши ===
    if (/(запомни|сохрани|запиши|в заметк|в дневник|в избранн)/.test(t)) {
      return null;
    }

    // === Хочет фото ===
    const wantsPhoto = /(фото|фотк|покажи.*(себя|аню)|покажешь.*(себя|аню)|показать.*(себя|аню)|можно.*(фото|себя|аню)|дай.*(фото|себя)|ещё.*(фото|себя)|еще.*(фото|себя)|picture|photo|img|картинк)/.test(t)
                    && !/(код|сочинени|поищи|найди в инет|загугли)/.test(t);

    if (wantsPhoto) {
      return {
        text: pick(PHRASES.photo),
        photo: this.random()
      };
    }

    // === Комплимент на фото (если недавно просили фото) ===
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

    // === Просто комплимент без контекста ===
    for (const trigger of this.complimentTriggers) {
      if (t === trigger || t === trigger + "!" || t === trigger + ".") {
        return { text: pick(this.photoCompliments) };
      }
    }

    return null;
  }
};
