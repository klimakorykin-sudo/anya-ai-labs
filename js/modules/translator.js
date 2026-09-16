const TranslatorModule = {

  flagMap: {
    en: "🇬🇧", de: "🇩🇪", fr: "🇫🇷", es: "🇪🇸",
    it: "🇮🇹", zh: "🇨🇳", ja: "🇯🇵"
  },

  langNames: {
    en: "Английский", de: "Немецкий", fr: "Французский",
    es: "Испанский", it: "Итальянский", zh: "Китайский", ja: "Японский"
  },

  handle(text) {
    const t = text.toLowerCase();
    if (!/(переведи|translate|как будет|как сказать)/.test(t)) return null;

    // Ищем слово из словаря
    for (const [ru, langs] of Object.entries(DICTIONARY)) {
      if (t.includes(ru)) {
        let out = `🌍 Перевод слова «${ru}»:\n\n`;
        for (const [lang, word] of Object.entries(langs)) {
          const flag = this.flagMap[lang] || "🌍";
          out += `${flag} ${this.langNames[lang] || lang.toUpperCase()}: ${word}\n`;
        }
        return { text: out.trim() };
      }
    }

    // Не нашли слово
    const words = Object.keys(DICTIONARY).slice(0, 10).join(", ");
    return { text:
      `🌍 Пока в словаре мало слов — только базовые.\n\n` +
      `Попробуй: ${words}...\n\n` +
      `Напиши: «Переведи привет»`
    };
  }
};