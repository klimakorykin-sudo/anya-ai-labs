const GamesModule = {
  state: {
    active: null,
    target: null,
    tries: 0,
    word: null,
    guessed: [],
    board: null
  },

  games: {
    guess: "🎯 Угадай число",
    quiz: "🧠 Викторина",
    rps: "✊ Камень-ножницы-бумага",
    hangman: "🎭 Виселица",
    cities: "🏙 Города",
    tictactoe: "❌⭕ Крестики-нолики",
    truth: "💭 Правда или действие",
    whoami: "🎭 Кто я?"
  },

  handle(text) {
    const t = text.toLowerCase();

    // ⚠️ ЗАЩИТА: если это имя известного человека — не перехватываем
    const knownNames = /(пушкин|чехов|толстой|достоевск|лермонтов|гоголь|тургенев|булгаков|шекспир|эйнштейн|ньютон|тесла|кюри|менделеев|ломоносов|гагарин|наполеон|пётр|петр|екатерина|давинчи|да винчи|моцарт|пикассо|клеопатра)/i;

    // Если упомянуто известное имя с триггером "расскажи" / "кто" / "про" — пропускаем
    if (knownNames.test(t) && /(расскажи|про|о|кто такой|кто такая|что)/i.test(t)) {
      return null;
    }

    // Если короткое сообщение (1-2 слова) — это имя? Пропускаем
    if (knownNames.test(t) && t.split(/\s+/).length <= 2 && !this.state.active) {
      return null;
    }

    // Старт: список игр
    if (/(поиграем|игр|game|развлеки|во что поиграть)/.test(t) && !this.state.active) {
      return { text:
        "🎮 ВО ЧТО СЫГРАЕМ?\n\n" +
        "1. Угадай число (напиши «угадай число»)\n" +
        "2. Викторина («викторина»)\n" +
        "3. Камень-ножницы-бумага («кнб»)\n" +
        "4. Виселица («виселица»)\n" +
        "5. Города («города»)\n" +
        "6. Крестики-нолики («крестики»)\n" +
        "7. Правда или действие («правда или действие»)\n" +
        "8. Кто я? («сыграем в кто я»)\n\n" +
        "Напиши название!"
      };
    }

    // Угадай число
    if (/угадай числ/.test(t)) return this.startGuess();
    if (this.state.active === "guess") return this.playGuess(text);

    // Викторина
    if (/викторин|quiz/.test(t)) return this.startQuiz();
    if (this.state.active === "quiz") return this.playQuiz(text);

    // КНБ
    if (/кнб|камень.*ножниц|ножниц.*бумаг/.test(t)) return this.startRPS();
    if (this.state.active === "rps") return this.playRPS(text);

    // Виселица
    if (/виселиц|hangman/.test(t)) return this.startHangman();
    if (this.state.active === "hangman") return this.playHangman(text);

    // Города
    if (/^города$|поиграем.*город|игра.*город/.test(t)) return this.startCities();
    if (this.state.active === "cities") return this.playCities(text);

    // Крестики-нолики
    if (/крестики|нолики|tictactoe/.test(t) && !this.state.active) return this.startTicTacToe();

    // Правда или действие
    if (/правда.*действ|действ.*правд/.test(t)) return this.startTruth();

    // Кто я — ТОЛЬКО явные команды
    if (/(сыграем в кто я|поиграем в кто я|угадай кто я|начать игру кто я|игра.*кто я)/.test(t)) {
      return this.startWhoAmI();
    }
    if (this.state.active === "whoami") return this.playWhoAmI(text);

    // Сдаюсь
    if (/сдаюсь|хватит|стоп.*игр|выйти из игр/.test(t) && this.state.active) {
      this.state.active = null;
      return { text: "Хорошо! Сыграем в другой раз 💫" };
    }

    return null;
  },

  // === УГАДАЙ ЧИСЛО ===
  startGuess() {
    this.state.active = "guess";
    this.state.target = rnd(1, 100);
    this.state.tries = 0;
    return { text: "🎯 Я загадала число от 1 до 100. Пиши варианты!" };
  },
  playGuess(text) {
    const num = parseInt(text.replace(/\D/g, ""));
    if (isNaN(num)) return { text: "Напиши число! 🤔" };
    this.state.tries++;
    if (num === this.state.target) {
      const tries = this.state.tries;
      this.state.active = null;
      return { text: `🎉 Угадал! Это было ${num}. Попыток: ${tries}. Молодец! ✨` };
    }
    if (num < this.state.target) return { text: "📈 Больше!" };
    return { text: "📉 Меньше!" };
  },

  // === ВИКТОРИНА ===
  quizQuestions: [
    { q: "Какая планета ближе всего к Солнцу?", a: ["меркурий", "б"], correct: "Меркурий" },
    { q: "Сколько планет в Солнечной системе?", a: ["8", "восемь"], correct: "8" },
    { q: "Кто написал «Евгения Онегина»?", a: ["пушкин", "александр"], correct: "Пушкин" },
    { q: "Какой газ мы выдыхаем?", a: ["углекислый", "co2", "со2"], correct: "Углекислый газ (CO₂)" },
    { q: "Столица Франции?", a: ["париж"], correct: "Париж" },
    { q: "Самое большое животное на Земле?", a: ["кит", "синий кит"], correct: "Синий кит" },
    { q: "Сколько дней в високосном году?", a: ["366"], correct: "366" },
    { q: "Кто написал «Войну и мир»?", a: ["толстой", "лев"], correct: "Лев Толстой" },
    { q: "Какой химический символ воды?", a: ["h2o", "н2о"], correct: "H₂O" },
    { q: "Кто изобрёл лампочку?", a: ["эдисон"], correct: "Томас Эдисон" }
  ],
  startQuiz() {
    this.state.active = "quiz";
    this.state.quizIndex = rnd(0, this.quizQuestions.length - 1);
    const q = this.quizQuestions[this.state.quizIndex];
    return { text: `🧠 ВИКТОРИНА:\n\n${q.q}\n\nНапиши ответ!` };
  },
  playQuiz(text) {
    const q = this.quizQuestions[this.state.quizIndex];
    const t = text.toLowerCase();
    const correct = q.a.some(a => t.includes(a));
    this.state.active = null;
    if (correct) {
      return { text: `✅ Верно! ${q.correct}\n\nХочешь ещё вопрос? Напиши «викторина».` };
    }
    return { text: `❌ Не то. Правильный ответ: ${q.correct}\n\nЕщё? Напиши «викторина».` };
  },

  // === КНБ ===
  startRPS() {
    this.state.active = "rps";
    return { text: "✊✋✌️ Камень, ножницы или бумага? Напиши!" };
  },
  playRPS(text) {
    const t = text.toLowerCase();
    let user = null;
    if (/камен|rock|✊/.test(t)) user = "камень";
    else if (/ножниц|scissors|✌/.test(t)) user = "ножницы";
    else if (/бумаг|paper|✋/.test(t)) user = "бумага";

    if (!user) return { text: "Напиши: камень, ножницы или бумага 🤔" };

    const options = ["камень", "ножницы", "бумага"];
    const bot = pick(options);
    const emojis = { камень: "✊", ножницы: "✌️", бумага: "✋" };

    let result;
    if (user === bot) result = "🤝 Ничья!";
    else if (
      (user === "камень" && bot === "ножницы") ||
      (user === "ножницы" && bot === "бумага") ||
      (user === "бумага" && bot === "камень")
    ) result = "🎉 Ты победил!";
    else result = "😄 Я победила!";

    this.state.active = null;
    return { text: `Ты: ${emojis[user]} ${user}\nЯ: ${emojis[bot]} ${bot}\n\n${result}\n\nЕщё? Напиши «кнб».` };
  },

  // === ВИСЕЛИЦА ===
  hangmanWords: ["кошка", "собака", "школа", "книга", "солнце", "цветок", "дерево", "машина", "телефон", "компьютер", "мама", "друг", "музыка", "игра", "аниме"],
  startHangman() {
    this.state.active = "hangman";
    this.state.word = pick(this.hangmanWords);
    this.state.guessed = [];
    return { text: `🎭 ВИСЕЛИЦА\n\nСлово: ${this.hangmanDisplay()}\n\nНапиши букву!` };
  },
  hangmanDisplay() {
    return this.state.word.split("").map(c =>
      this.state.guessed.includes(c) ? c : "_"
    ).join(" ");
  },
  playHangman(text) {
    const letter = text.trim().toLowerCase()[0];
    if (!letter || !/[а-яё]/.test(letter)) {
      return { text: "Напиши одну русскую букву!" };
    }
    if (this.state.guessed.includes(letter)) {
      return { text: "Уже была эта буква. Другая?" };
    }
    this.state.guessed.push(letter);

    const display = this.hangmanDisplay();
    if (!display.includes("_")) {
      const w = this.state.word;
      this.state.active = null;
      return { text: `🎉 Угадал! Слово: ${w}\n\nЕщё? Напиши «виселица».` };
    }
    if (this.state.guessed.length >= 6) {
      const w = this.state.word;
      this.state.active = null;
      return { text: `😢 Не угадал. Слово было: ${w}\n\nЕщё? Напиши «виселица».` };
    }
    return { text: `${display}\n\nПопыток: ${this.state.guessed.length}/6` };
  },

  // === ГОРОДА ===
  cities: ["Москва", "Питер", "Казань", "Сочи", "Новосибирск", "Екатеринбург", "Владивосток", "Краснодар", "Мурманск", "Тула", "Рязань", "Самара", "Уфа", "Омск", "Томск", "Иркутск"],
  startCities() {
    this.state.active = "cities";
    const start = pick(this.cities);
    this.state.lastCity = start;
    return { text: `🏙 ГОРОДА!\n\nЯ начинаю: ${start}\n\nТвой город на последнюю букву «${this.lastLetter(start)}»` };
  },
  lastLetter(city) {
    let last = city[city.length - 1].toLowerCase();
    if (last === "ь" || last === "ъ" || last === "ы") last = city[city.length - 2].toLowerCase();
    return last.toUpperCase();
  },
  playCities(text) {
    const city = text.trim();
    if (!city) return { text: "Напиши город!" };
    const needed = this.lastLetter(this.state.lastCity);
    if (city[0].toUpperCase() !== needed) {
      return { text: `Нужен город на «${needed}» 🤔` };
    }
    this.state.lastCity = city;
    const my = pick(this.cities.filter(c => c[0].toLowerCase() === this.lastLetter(city).toLowerCase()));
    if (!my) {
      this.state.active = null;
      return { text: "🎉 Я не знаю больше городов — ты победил! Молодец!" };
    }
    this.state.lastCity = my;
    return { text: `Мой: ${my}\n\nТвой на «${this.lastLetter(my)}»` };
  },

  // === КРЕСТИКИ-НОЛИКИ ===
  startTicTacToe() {
    this.state.active = "ttt";
    this.state.board = Array(9).fill("");
    return { text: `❌⭕ КРЕСТИКИ-НОЛИКИ\n\nТы — ❌. Напиши номер клетки (1-9):\n\n1️⃣2️⃣3️⃣\n4️⃣5️⃣6️⃣\n7️⃣8️⃣9️⃣` };
  },

  // === ПРАВДА ИЛИ ДЕЙСТВИЕ ===
  truths: [
    "Какая твоя самая большая мечта?",
    "Что тебя в последний раз рассмешило до слёз?",
    "Кем ты хотел стать в детстве?",
    "Какой твой самый неловкий момент?",
    "Есть ли у тебя секрет, о котором никто не знает?",
    "Кого ты больше всего ценишь?",
    "Что бы ты изменил в своей жизни?",
    "Какой фильм заставил тебя плакать?",
    "Что ты обычно делаешь, когда грустно?"
  ],
  actions: [
    "Напиши комплимент самому себе 💖",
    "Скажи «Аня лучшая» 😄",
    "Напиши 3 вещи, за которые благодарен сегодня",
    "Спой куплет любимой песни (в голове 😆)",
    "Сделай 10 приседаний",
    "Напиши стих из 4 строк",
    "Расскажи шутку",
    "Скажи скороговорку: «Шла Саша по шоссе»",
    "Улыбнись прямо сейчас 😊"
  ],
  startTruth() {
    this.state.active = "truth";
    return { text: "💭 ПРАВДА или ДЕЙСТВИЕ? Напиши «правда» или «действие»" };
  },
  playTruth(text) {
    const t = text.toLowerCase();
    if (/правд/.test(t)) {
      this.state.active = null;
      return { text: `💭 ${pick(this.truths)}` };
    }
    if (/действ/.test(t)) {
      this.state.active = null;
      return { text: `🎬 ${pick(this.actions)}` };
    }
    return { text: "Напиши «правда» или «действие»" };
  },

  // === КТО Я? ===
  whoamiList: [
    "Моцарт", "Пикассо", "Клеопатра",
    "Чебурашка", "Гарри Поттер", "Наруто", "Пикачу", "Сейлор Мун",
    "Бэтмен", "Человек-паук", "Эльза", "Шрек"
  ],
  startWhoAmI() {
    this.state.active = "whoami";
    this.state.secret = pick(this.whoamiList);
    this.state.whoamiTries = 0;
    return { text: "🎭 Я загадала известную личность/персонажа!\n\nЗадавай вопросы типа «ты человек?», «ты из аниме?»\n\nИли напиши «это <имя>» — проверим!" };
  },
  playWhoAmI(text) {
    const t = text.toLowerCase();
    this.state.whoamiTries++;

    // Попытка угадать
    if (/это |ты /.test(t)) {
      const guess = t.replace(/это |ты /g, "").trim();
      if (this.state.secret.toLowerCase().includes(guess) || guess.includes(this.state.secret.toLowerCase())) {
        const s = this.state.secret;
        this.state.active = null;
        return { text: `🎉 Угадал! Это ${s}! Молодец ✨` };
      }
    }

    // Ответы на вопросы
    if (this.state.whoamiTries > 10) {
      const s = this.state.secret;
      this.state.active = null;
      return { text: `Хватит попыток! Это был(а) ${s}. Сыграем ещё? Напиши «сыграем в кто я».` };
    }

    // Подсказки
    const secret = this.state.secret;
    let hint = "🤔 Хм, подумай ещё!";
    if (/человек|живой/.test(t)) {
      hint = this.isPerson(secret) ? "Да, это человек ✅" : "Нет, не человек ❌";
    } else if (/аниме|мульт|персонаж/.test(t)) {
      hint = this.isAnime(secret) ? "Да, из аниме/мульт ✅" : "Нет ❌";
    } else if (/учён|науч/.test(t)) {
      hint = /эйнштейн|ньютон|да винчи/i.test(secret) ? "Да ✅" : "Нет ❌";
    } else if (/музык|композитор/.test(t)) {
      hint = /моцарт/i.test(secret) ? "Да ✅" : "Нет ❌";
    } else if (/космос|космонавт/.test(t)) {
      hint = /гагарин/i.test(secret) ? "Да ✅" : "Нет ❌";
    } else if (/писател|поэт/.test(t)) {
      hint = /пушкин|шекспир/i.test(secret) ? "Да ✅" : "Нет ❌";
    }

    return { text: `${hint}\nПопыток: ${this.state.whoamiTries}/10` };
  },
  isPerson(s) {
    return /моцарт|пикассо|клеопатра/i.test(s);
  },
  isAnime(s) {
    return /чебур|гарри|наруто|пикачу|сейлор|бэтмен|человек-паук|эльза|шрек/i.test(s);
  }
};
