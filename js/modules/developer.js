// ============================================================
// DEVELOPER.JS — Сообщение про разработчика
// Срабатывает только на точное слово "разработчик" (маленькими)
// ============================================================

const DEVELOPER_TRIGGER = "разработчик";

const DEVELOPER_MESSAGE =
  "Клим сделал меня, чтобы показать тебе, Аня, насколько много ты для него значишь. " +
  "Я думаю, что он безнадёжно в тебя влюблён и тебе стоит прислушаться к этому. " +
  "Как ты к нему относишься?";

const DEVELOPER_PROJECTS =
  "\n\n📂 Проекты Клима для Ани:\n\n" +
  "1. NEON // Аня — умный чат-бот\n" +
  "   https://klimakorykin-sudo.github.io/anya_ai/\n\n" +
  "2. Аня · Вдохновение — персональный сайт\n" +
  "   https://klimakorykin-sudo.github.io/11533191120/index.html\n\n" +
  "3. Anya — ещё один проект для неё\n" +
  "   https://klimakorykin-sudo.github.io/Anya/\n\n" +
  "4. Game Anya v5.34.68 — игра про Аню\n" +
  "   https://klimakorykin-sudo.github.io/game_anya_v5.34.68/";

const DeveloperModule = {
  handle(text) {
    const trimmed = text.trim();
    if (trimmed === DEVELOPER_TRIGGER) {
      return { text: DEVELOPER_MESSAGE + DEVELOPER_PROJECTS };
    }
    return null;
  }
};
