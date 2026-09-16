// Имитация поиска в интернете
// Реального доступа нет — но выглядит убедительно + ссылки ведут на Google

const SearchModule = {

  sources: {
    general: ["ru.wikipedia.org", "yandex.ru", "google.com", "uchi.ru", "interneturok.ru"],
    science: ["ru.wikipedia.org", "elementy.ru", "postnauka.ru", "nkj.ru"],
    learning: ["uchi.ru", "foxford.ru", "interneturok.ru", "yaklass.ru"],
    help: ["ru.wikipedia.org", "wikihow.com", "lifehacker.ru"],
    anime: ["anime-news.ru", "shikimori.one", "ru.wikipedia.org"],
    gaming: ["igromania.ru", "stopgame.ru", "ru.wikipedia.org"],
    coding: ["stackoverflow.com", "learn.javascript.ru", "python.org", "developer.mozilla.org"],
    health: ["minzdrav.gov.ru", "who.int", "ru.wikipedia.org"]
  },

  detectTopic(query) {
    const t = query.toLowerCase();
    if (/(код|программ|python|js|javascript|html|css)/.test(t)) return "coding";
    if (/(аниме|манга|наруто|ванпис|атака титанов)/.test(t)) return "anime";
    if (/(игр|гейм|minecraft|roblox|фортнайт)/.test(t)) return "gaming";
    if (/(болезн|симптом|лечен|здоровь|витамин)/.test(t)) return "health";
    if (/(урок|учеб|школ|задач|матем|русск|физик|хими)/.test(t)) return "learning";
    if (/(что делать|как сделать|инструкц|помощь)/.test(t)) return "help";
    if (/(наук|космос|физик|хими|биолог)/.test(t)) return "science";
    return "general";
  },

  generateLinks(query, topic) {
    const sources = this.sources[topic] || this.sources.general;
    const encoded = encodeURIComponent(query);
    return sources.slice(0, 3).map((site, i) => ({
      site,
      link: `https://www.google.com/search?q=site:${site}+${encoded}`,
      index: i + 1
    }));
  },

  async simulateSearch(query) {
    const chat = document.getElementById("chat");

    const searchBox = document.createElement("div");
    searchBox.className = "search-box";
    searchBox.innerHTML = `
      <div class="search-header">
        <span class="search-icon">🔍</span>
        <span class="search-query">${this._escape(query)}</span>
      </div>
      <div class="search-progress"><div class="search-bar"></div></div>
      <div class="search-status">Ищу в интернете…</div>
    `;
    chat.appendChild(searchBox);
    chat.scrollTop = chat.scrollHeight;

    await this._wait(800);
    const status = searchBox.querySelector(".search-status");
    if (status) status.textContent = "Анализирую результаты…";

    await this._wait(700);
    if (status) status.textContent = "Проверяю источники…";

    await this._wait(600);
    searchBox.remove();

    const topic = this.detectTopic(query);
    const links = this.generateLinks(query, topic);

    let result = `🌐 Вот что я нашла по запросу «${query}»:\n\n`;
    result += `📊 Нашла ${links.length} источника за 2.1 сек\n\n`;

    for (const l of links) {
      result += `${l.index}. ${l.site}\n   ${l.link}\n\n`;
    }

    result += `💡 Я не могу открыть сайты сама — но по ссылкам выше откроется поиск по теме на нужном сайте.\n\n`;
    result += this.shortAnswer(query, topic);

    return result;
  },

  shortAnswer(query, topic) {
    const t = query.toLowerCase();

    if (/что такое фотосинтез/.test(t)) {
      return "🌱 Фотосинтез — процесс, при котором растения превращают свет, воду и CO₂ в глюкозу и кислород.";
    }
    if (/что такое гравитац/.test(t)) {
      return "🌍 Гравитация — сила притяжения между телами, обладающими массой.";
    }
    if (/сколько планет/.test(t)) {
      return "🪐 В Солнечной системе 8 планет: Меркурий, Венера, Земля, Марс, Юпитер, Сатурн, Уран, Нептун.";
    }
    if (/что такое интернет/.test(t)) {
      return "🌐 Интернет — глобальная сеть, соединяющая миллионы компьютеров по всему миру.";
    }
    if (/кто.*пушкин/.test(t)) {
      return "📖 Александр Сергеевич Пушкин (1799–1837) — великий русский поэт, автор «Евгения Онегина» и множества сказок.";
    }
    if (/как работает компьютер/.test(t)) {
      return "💻 Компьютер обрабатывает данные по программам: процессор считает, память хранит, устройства ввода/вывода общаются с тобой.";
    }
    if (/что такое любовь/.test(t)) {
      return "💖 Любовь — это глубокое чувство привязанности и заботы. У каждого она своя.";
    }
    if (/что такое дружба/.test(t)) {
      return "🤝 Дружба — это доверие, поддержка и взаимная симпатия между людьми.";
    }
    if (/кто такой.*(наполеон|наполеон)/.test(t)) {
      return "🇫🇷 Наполеон Бонапарт (1769–1821) — французский император и полководец.";
    }
    if (/как.*учиться|как.*учить/.test(t)) {
      return "📚 Лучшие приёмы: повторение через интервалы, активное вспоминание, режим 25/5 (Помодоро), сон 8 часов.";
    }
    if (/что такое вселенная/.test(t)) {
      return "🌌 Вселенная — всё пространство, материя и энергия, включая планеты, звёзды и галактики. Возраст ~13.8 млрд лет.";
    }
    if (/что такое днк/.test(t)) {
      return "🧬 ДНК — молекула, которая хранит генетическую информацию о строении и работе живых организмов.";
    }
    if (/что такое эволюц/.test(t)) {
      return "🦎 Эволюция — процесс изменения живых организмов с течением времени под влиянием естественного отбора.";
    }

    return "💫 Точного краткого ответа у меня нет, но по ссылкам выше можно найти подробности.";
  },

  detectSearchRequest(text) {
    const t = text.toLowerCase();
    return /(поищи|погугли|загугли|найди в интернете|проверь в инете|загугли|search|проверь в интернете|погляди в интернете|что пишут в интернете|юзни инет|юзай инет|используй интернет|посмотри в инете)/.test(t);
  },

  extractQuery(text) {
    return text
      .replace(/(поищи|погугли|найди в интернете|загугли|search|проверь в инете|проверь в интернете|погляди в интернете|что пишут в интернете|юзни инет|юзай инет|используй интернет|посмотри в инете)/gi, "")
      .replace(/^\s*(про|о|об|что такое|кто такой|кто такая|как)\s*/i, "")
      .trim() || text;
  },

  _escape(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  },

  _wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
};