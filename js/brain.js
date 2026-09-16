// ============================================================
// BRAIN.JS — Мозг Ани
// ============================================================

const Brain = {

  modules: [
    PersonalModule,
    DeveloperModule,
    CrisisModule,
    PsychologistModule,
    MoodModule,
    CheckinModule,
    AnatomyTerms,
    AnatomyModule,
    SexEdModule,
    BiologyModule,
    FirstAidModule,
    EmergencyModule,
    SafetyModule,
    PhotosModule,
    CodingModule,
    InformaticsModule,
    DiscreteModule,
    RedTeamModule,
    EssayModule,
    MathModule,
    EnglishModule,
    HomeworkModule,
    FamousModule,
    LiteratureModule,
    GeographyModule,
    TeacherModule,
    GamesModule,
    RiddlesModule,
    JokesModule,
    StoriesModule,
    DialoguesModule,
    FactsModule,
    QuotesModule,
    ComplimentsModule,
    HoroscopeModule,
    PasswordModule,
    TimerModule,
    NotesModule,
    WeatherModule,
    RecipesModule,
    TranslatorModule,
    CalendarModule,
    CreativityModule,
    AdviceModule
  ],

  async think(text, options = {}) {
    if (!text || typeof text !== "string") {
      return { text: "Хм, я не разобрала 🤔 Попробуй ещё раз." };
    }

    const trimmed = text.trim();
    if (!trimmed) {
      return { text: "Напиши что-нибудь 💖" };
    }

    // Нормализация
    const normalized = typeof Understand !== "undefined"
      ? Understand.understandText(trimmed)
      : trimmed.toLowerCase();

    // 0. КРИЗИС
    if (typeof CrisisModule !== "undefined" && CrisisModule.isCrisis(normalized)) {
      return CrisisModule.handle(normalized);
    }

    const lang = analyzeText(normalized);
    const emotion = detectEmotion(normalized);

    // Секреты
    if (typeof Secrets !== "undefined") {
      if (Secrets.isSecret(normalized)) {
        return { text: Secrets.randomSecret() };
      }
      const special = Secrets.checkSpecial(normalized);
      if (special) {
        return { text: special };
      }
    }

    // Кракозябры
    if (
      lang.hasGarbage &&
      !lang.hasCyr &&
      !lang.hasLat &&
      !lang.hasCJK &&
      !lang.hasArabic &&
      !lang.hasDevanagari &&
      !lang.hasEmoji &&
      normalized.length > 3
    ) {
      return { text: pick(PHRASES.garbage) };
    }

    // Поиск
    if (typeof SearchModule !== "undefined" && SearchModule.detectSearchRequest(normalized)) {
      const query = SearchModule.extractQuery(normalized);
      const result = await SearchModule.simulateSearch(query);
      return { text: result, isHTML: true };
    }

    // Модули
    for (const module of this.modules) {
      try {
        if (!module || typeof module.handle !== "function") continue;
        const reply = await module.handle(normalized);
        if (reply && (reply.text || reply.photo)) {
          if (reply.text && /<pre>|<a |<b>|<code>/.test(reply.text)) {
            reply.isHTML = true;
          }
          return reply;
        }
      } catch (e) {
        console.warn("Модуль упал:", e);
      }
    }

    // Простые фразы
    const t = normalized;

    if (/(кто.*лучш|лучшая|идеал.*разработчик|аня.*лучш)/.test(t)) {
      return { text: pick(PHRASES.best) };
    }

    if (/(создат|кто тебя сделал|кто тебя создал|твой автор|твой создатель)/.test(t)) {
      return { text: pick(PHRASES.creator || ["Меня создал хороший человек ✨"]) };
    }

    if (/(кто ты|расскажи о себе|что ты умеешь|твои возможности)/.test(t)) {
      return { text: pick(PHRASES.aboutMe) };
    }

    if (/(привет|хай|hello|hi|здравствуй|ку|добрый день|доброе утро|добрый вечер|прив|здрасьте)/.test(t)) {
      return { text: pick(PHRASES.greeting) };
    }

    if (/(как дела|как ты|how are you|чё как|что делаешь)/.test(t)) {
      return { text: pick(PHRASES.howAreYou) };
    }

    if (/(спасиб|thank|благодар|спс|thx)/.test(t)) {
      return { text: pick(PHRASES.thanks) };
    }

    if (/(пока|bye|до свид|прощай|бай)/.test(t)) {
      return { text: pick(PHRASES.bye) };
    }

    if (lang.hasCJK) {
      return { text: "Ого, ты написал на другом языке! 🌏 Круто! Я понимаю не всё, но рада 💫" };
    }
    if (lang.hasArabic) {
      return { text: "Какой красивый язык! ✨ Расскажи побольше?" };
    }
    if (lang.hasDevanagari) {
      return { text: "Индийский язык? Здорово! ✨" };
    }
    if (lang.hasEmoji && normalized.length < 6) {
      return { text: pick(["И тебе ✨", "Классные смайлики! 💖", "🌸", "😊"]) };
    }

    if (normalized.endsWith("?")) {
      return { text: pick([
        "Хороший вопрос! 🤔 Давай порассуждаем вместе 💫",
        "Хм, интересно! А что ты сам об этом думаешь? ✨",
        "Я считаю, что главное — слушать себя 💖",
        "Дай подумать... 🤔 А ты как считаешь?",
        "Мне нравится, что ты спрашиваешь! Расскажи, что тебя интересует 💫"
      ]) };
    }

    if (emotion === "sadness") {
      return { text: pick(PHRASES.sad) };
    }
    if (emotion === "joy") {
      return { text: pick(PHRASES.happy) };
    }
    if (emotion === "anger") {
      return { text: "😤 Понимаю. Что тебя так задело? Расскажи 💖" };
    }
    if (emotion === "fear") {
      return { text: "🫂 Я рядом. Что тревожит? Давай разберём вместе." };
    }
    if (emotion === "love") {
      return { text: "💖 Как приятно! Расскажи подробнее?" };
    }

    return { text: pick(PHRASES.unknown) };
  },

  cleanInput(text) {
    return text
      .replace(/^аня[,\s!.]*/i, "")
      .replace(/^ань[,\s!.]*/i, "")
      .trim();
  }
};
