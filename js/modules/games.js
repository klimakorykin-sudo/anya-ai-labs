// ============================================================
// GAMES.JS — Игры с Аней + ссылки на онлайн-игры
// ============================================================

const GamesModule = {
  state: {
    active: null,
    target: null,
    tries: 0,
    word: null,
    guessed: [],
    board: null,
    checkersBoard: null,
    battleship: null,
    wordleWord: null,
    wordleTries: [],
    blackjack: null
  },

  games: {
    guess: "🎯 Угадай число",
    quiz: "🧠 Викторина",
    rps: "✊ Камень-ножницы-бумага",
    hangman: "🎭 Виселица",
    cities: "🏙 Города",
    tictactoe: "❌⭕ Крестики-нолики",
    truth: "💭 Правда или действие",
    whoami: "🎭 Кто я?",
    checkers: "⚫⚪ Шашки",
    battleship: "🚢 Морской бой",
    blackjack: "🃏 21 (очко)",
    wordle: "📝 Угадай слово"
  },

  // Ссылки на онлайн-игры
  onlineGames: {
    "логические": [
      "🧩 Sudoku — sudoku.com",
      "🎯 2048 — play2048.co",
      "🧠 Судоку-мастер — sudoku-master.com",
      "♟ Шахматы — chess.com",
      "♟ Личесс — lichess.org",
      "🎲 Шашки онлайн — playok.com"
    ],
    "аркады": [
      "🐍 Slither.io — slither.io",
      "🟢 Agar.io — agar.io",
      "🎮 Krunker — krunker.io",
      "🚀 Diep.io — diep.io"
    ],
    "головоломки": [
      "🧩 Puzzle.gg — puzzle.gg",
      "🎨 Jigsaw — jigsawplanet.com",
      "🔢 Wordle — powerlanguage.co.uk/wordle"
    ],
    "настольные": [
      "🎲 Шахматы — chess.com",
      "♟ Личесс — lichess.org",
      "🎯 Шашки — playok.com",
      "🃏 Карточные — 24h.pchome.com.tw (крупнейший сайт)"
    ],
    "слова": [
      "📝 Wordle (рус) — wordle-ru.ru",
      "🎯 Скрабл — scrabble.ru",
      "💬 Балда — balda-game.ru"
    ]
  },

  handle(text) {
    const t = text.toLowerCase();

    // === СПИСОК ИГР ===
    if (/(поиграем|игр|game|развлеки|во что поиграть)/.test(t) && !this.state.active && !/(ссылк|онлайн|сайт)/.test(t)) {
      return { text:
        "🎮 ВО ЧТО СЫГРАЕМ?\n\n" +
        "1. Угадай число (напиши «угадай число»)\n" +
        "2. Викторина («викторина»)\n" +
        "3. Камень-ножницы-бумага («кнб»)\n" +
        "4. Виселица («виселица»)\n" +
        "5. Города («города»)\n" +
        "6. Крестики-нолики («крестики»)\n" +
        "7. Правда или действие («правда или действие»)\n" +
        "8. Кто я? («сыграем в кто я»)\n" +
        "9. Шашки («шашки»)\n" +
        "10. Морской бой («морской бой»)\n" +
        "11. 21 (очко) («21»)\n" +
        "12. Угадай слово («угадай слово»)\n\n" +
        "📱 Онлайн-игры — напиши «ссылки на игры»"
      };
    }

    // === ССЫЛКИ НА ОНЛАЙН-ИГРЫ ===
    if (/(ссылк.*игр|онлайн.*игр|игр.*онлайн|играть.*онлайн|сайт.*игр|где поиграть)/.test(t)) {
      return { text: this.formatOnlineGames(t) };
    }

    // === ИГРА 1: УГАДАЙ ЧИСЛО ===
    if (/угадай числ/.test(t)) return this.startGuess();
    if (this.state.active === "guess") return this.playGuess(text);

    // === ИГРА 2: ВИКТОРИНА ===
    if (/викторин|quiz/.test(t)) return this.startQuiz();
    if (this.state.active === "quiz") return this.playQuiz(text);

    // === ИГРА 3: КНБ ===
    if (/кнб|камень.*ножниц|ножниц.*бумаг/.test(t)) return this.startRPS();
    if (this.state.active === "rps") return this.playRPS(text);

    // === ИГРА 4: ВИСЕЛИЦА ===
    if (/виселиц|hangman/.test(t)) return this.startHangman();
    if (this.state.active === "hangman") return this.playHangman(text);

    // === ИГРА 5: ГОРОДА ===
    if (/^города$|поиграем.*город|игра.*город/.test(t)) return this.startCities();
    if (this.state.active === "cities") return this.playCities(text);

    // === ИГРА 6: КРЕСТИКИ-НОЛИКИ ===
    if (/крестики|нолики|tictactoe/.test(t) && !this.state.active) return this.startTicTacToe();
    if (this.state.active === "ttt") return this.playTicTacToe(text);

    // === ИГРА 7: ПРАВДА ИЛИ ДЕЙСТВИЕ ===
    if (/правда.*действ|действ.*правд/.test(t)) return this.startTruth();
    if (this.state.active === "truth") return this.playTruth(text);

    // === ИГРА 8: КТО Я? ===
    if (/(сыграем в кто я|поиграем в кто я|угадай кто я|начать игру кто я|игра.*кто я)/.test(t)) {
      return this.startWhoAmI();
    }
    if (this.state.active === "whoami") return this.playWhoAmI(text);

    // === ИГРА 9: ШАШКИ ===
    if (/шашк/.test(t) && !this.state.active) return this.startCheckers();
    if (this.state.active === "checkers") return this.playCheckers(text);

    // === ИГРА 10: МОРСКОЙ БОЙ ===
    if (/морск.*бой|battleship/.test(t) && !this.state.active) return this.startBattleship();
    if (this.state.active === "battleship") return this.playBattleship(text);

    // === ИГРА 11: 21 (ОЧКО) ===
    if (/(^|\s)21(\s|$)|очко|блэкджек|blackjack/.test(t) && !this.state.active) return this.startBlackjack();
    if (this.state.active === "blackjack") return this.playBlackjack(text);

    // === ИГРА 12: УГАДАЙ СЛОВО ===
    if (/угадай слов|wordle|вордл/.test(t) && !this.state.active) return this.startWordle();
    if (this.state.active === "wordle") return this.playWordle(text);

    // === СДАЮСЬ ===
    if (/сдаюсь|хватит|стоп.*игр|выйти из игр|закончить/.test(t) && this.state.active) {
      this.state.active = null;
      return { text: "Хорошо! Сыграем в другой раз 💫" };
    }

    return null;
  },

  // ============================================================
  // ССЫЛКИ НА ОНЛАЙН-ИГРЫ
  // ============================================================
  formatOnlineGames(t) {
    // Если указана категория
    for (const [cat, links] of Object.entries(this.onlineGames)) {
      if (t.includes(cat.slice(0, 5))) {
        let out = "🎮 " + cat.toUpperCase() + " ИГРЫ:\n\n";
        links.forEach(l => out += l + "\n");
        return { text: out };
      }
    }

    // Общий список
    let out = "🎮 ОНЛАЙН-ИГРЫ (бесплатно, в браузере):\n\n";
    for (const [cat, links] of Object.entries(this.onlineGames)) {
      out += "📌 " + cat.charAt(0).toUpperCase() + cat.slice(1) + ":\n";
      links.forEach(l => out += "• " + l + "\n");
      out += "\n";
    }
    out += "Напиши категорию: «логические игры», «аркады», «головоломки»";
    return { text: out };
  },

  // ============================================================
  // 1. УГАДАЙ ЧИСЛО
  // ============================================================
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
      return { text: "🎉 Угадал! Это было " + num + ". Попыток: " + tries + ". Молодец! ✨" };
    }
    if (num < this.state.target) return { text: "📈 Больше!" };
    return { text: "📉 Меньше!" };
  },

  // ============================================================
  // 2. ВИКТОРИНА
  // ============================================================
  quizQuestions: [
    { q: "Какая планета ближе всего к Солнцу?", a: ["меркурий", "б"], correct: "Меркурий" },
    { q: "Сколько планет в Солнечной системе?", a: ["8", "восемь"], correct: "8" },
    { q: "Кто написал «Евгения Онегина»?", a: ["пушкин"], correct: "Пушкин" },
    { q: "Какой газ мы выдыхаем?", a: ["углекислый", "co2"], correct: "Углекислый газ (CO₂)" },
    { q: "Столица Франции?", a: ["париж"], correct: "Париж" },
    { q: "Самое большое животное на Земле?", a: ["кит", "синий кит"], correct: "Синий кит" },
    { q: "Сколько дней в високосном году?", a: ["366"], correct: "366" },
    { q: "Кто написал «Войну и мир»?", a: ["толстой", "лев"], correct: "Лев Толстой" },
    { q: "Химический символ воды?", a: ["h2o", "н2о"], correct: "H₂O" },
    { q: "Кто изобрёл лампочку?", a: ["эдисон"], correct: "Томас Эдисон" },
    { q: "Сколько континентов на Земле?", a: ["6", "шесть"], correct: "6" },
    { q: "Самая длинная река?", a: ["амазонка", "нил"], correct: "Амазонка / Нил" },
    { q: "Химический элемент O?", a: ["кислород"], correct: "Кислород" },
    { q: "Кто первый полетел в космос?", a: ["гагарин"], correct: "Юрий Гагарин" },
    { q: "Сколько струн у гитары?", a: ["6", "шесть"], correct: "6" }
  ],
  startQuiz() {
    this.state.active = "quiz";
    this.state.quizIndex = rnd(0, this.quizQuestions.length - 1);
    const q = this.quizQuestions[this.state.quizIndex];
    return { text: "🧠 ВИКТОРИНА:\n\n" + q.q + "\n\nНапиши ответ!" };
  },
  playQuiz(text) {
    const q = this.quizQuestions[this.state.quizIndex];
    const t = text.toLowerCase();
    const correct = q.a.some(a => t.includes(a));
    this.state.active = null;
    if (correct) {
      return { text: "✅ Верно! " + q.correct + "\n\nХочешь ещё? Напиши «викторина»." };
    }
    return { text: "❌ Не то. Правильный ответ: " + q.correct + "\n\nЕщё? Напиши «викторина»." };
  },

  // ============================================================
  // 3. КНБ
  // ============================================================
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
    return { text: "Ты: " + emojis[user] + " " + user + "\nЯ: " + emojis[bot] + " " + bot + "\n\n" + result + "\n\nЕщё? Напиши «кнб»." };
  },

  // ============================================================
  // 4. ВИСЕЛИЦА
  // ============================================================
  hangmanWords: ["кошка", "собака", "школа", "книга", "солнце", "цветок", "дерево", "машина", "телефон", "компьютер", "мама", "друг", "музыка", "игра", "аниме", "весна", "зима", "лето", "осень", "море"],
  startHangman() {
    this.state.active = "hangman";
    this.state.word = pick(this.hangmanWords);
    this.state.guessed = [];
    return { text: "🎭 ВИСЕЛИЦА\n\nСлово: " + this.hangmanDisplay() + "\n\nНапиши букву!" };
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
      return { text: "🎉 Угадал! Слово: " + w + "\n\nЕщё? Напиши «виселица»." };
    }
    if (this.state.guessed.length >= 6) {
      const w = this.state.word;
      this.state.active = null;
      return { text: "😢 Не угадал. Слово было: " + w + "\n\nЕщё? Напиши «виселица»." };
    }
    return { text: display + "\n\nПопыток: " + this.state.guessed.length + "/6" };
  },

  // ============================================================
  // 5. ГОРОДА
  // ============================================================
  cities: ["Москва", "Питер", "Казань", "Сочи", "Новосибирск", "Екатеринбург", "Владивосток", "Краснодар", "Мурманск", "Тула", "Рязань", "Самара", "Уфа", "Омск", "Томск", "Иркутск", "Волгоград", "Воронеж", "Пермь", "Челябинск"],
  startCities() {
    this.state.active = "cities";
    const start = pick(this.cities);
    this.state.lastCity = start;
    return { text: "🏙 ГОРОДА!\n\nЯ начинаю: " + start + "\n\nТвой город на последнюю букву «" + this.lastLetter(start) + "»" };
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
      return { text: "Нужен город на «" + needed + "» 🤔" };
    }
    this.state.lastCity = city;
    const my = pick(this.cities.filter(c => c[0].toLowerCase() === this.lastLetter(city).toLowerCase()));
    if (!my) {
      this.state.active = null;
      return { text: "🎉 Я не знаю больше городов — ты победил! Молодец!" };
    }
    this.state.lastCity = my;
    return { text: "Мой: " + my + "\n\nТвой на «" + this.lastLetter(my) + "»" };
  },

  // ============================================================
  // 6. КРЕСТИКИ-НОЛИКИ
  // ============================================================
  startTicTacToe() {
    this.state.active = "ttt";
    this.state.board = Array(9).fill("");
    return { text: this.tttDisplay() + "\n\nНапиши номер клетки (1-9)" };
  },
  tttDisplay() {
    const b = this.state.board;
    const cells = b.map((c, i) => c || (i + 1));
    return "❌⭕ КРЕСТИКИ-НОЛИКИ\n\n" +
      cells[0] + " | " + cells[1] + " | " + cells[2] + "\n" +
      "---------\n" +
      cells[3] + " | " + cells[4] + " | " + cells[5] + "\n" +
      "---------\n" +
      cells[6] + " | " + cells[7] + " | " + cells[8];
  },
  playTicTacToe(text) {
    const num = parseInt(text.replace(/\D/g, ""));
    if (isNaN(num) || num < 1 || num > 9) {
      return { text: "Напиши номер клетки 1-9" };
    }
    const idx = num - 1;
    if (this.state.board[idx]) {
      return { text: "Эта клетка занята! Выбери другую." };
    }
    this.state.board[idx] = "❌";

    // Проверка победы игрока
    if (this.checkWin("❌")) {
      const display = this.tttDisplay();
      this.state.active = null;
      return { text: display + "\n\n🎉 Ты победил! Молодец!" };
    }

    // Ход Ани
    const empty = this.state.board.map((c, i) => c === "" ? i : -1).filter(i => i !== -1);
    if (empty.length === 0) {
      const display = this.tttDisplay();
      this.state.active = null;
      return { text: display + "\n\n🤝 Ничья!" };
    }
    // Умный ход
    const botMove = this.smartTTTMove();
    this.state.board[botMove] = "⭕";

    if (this.checkWin("⭕")) {
      const display = this.tttDisplay();
      this.state.active = null;
      return { text: display + "\n\n😄 Я победила! Ещё? Напиши «крестики»" };
    }

    const display = this.tttDisplay();
    return { text: display + "\n\nТвой ход (1-9)" };
  },
  smartTTTMove() {
    const b = this.state.board;
    // Попробовать выиграть
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "⭕";
        if (this.checkWin("⭕")) { b[i] = ""; return i; }
        b[i] = "";
      }
    }
    // Заблокировать игрока
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "❌";
        if (this.checkWin("❌")) { b[i] = ""; return i; }
        b[i] = "";
      }
    }
    // Центр
    if (!b[4]) return 4;
    // Углы
    const corners = [0, 2, 6, 8].filter(i => !b[i]);
    if (corners.length) return pick(corners);
    // Любая
    const empty = b.map((c, i) => c === "" ? i : -1).filter(i => i !== -1);
    return pick(empty);
  },
  checkWin(symbol) {
    const b = this.state.board;
    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    return wins.some(line => line.every(i => b[i] === symbol));
  },

  // ============================================================
  // 7. ПРАВДА ИЛИ ДЕЙСТВИЕ
  // ============================================================
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
      return { text: "💭 " + pick(this.truths) };
    }
    if (/действ/.test(t)) {
      this.state.active = null;
      return { text: "🎬 " + pick(this.actions) };
    }
    return { text: "Напиши «правда» или «действие»" };
  },

  // ============================================================
  // 8. КТО Я?
  // ============================================================
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

    if (/это |ты /.test(t)) {
      const guess = t.replace(/это |ты /g, "").trim();
      if (this.state.secret.toLowerCase().includes(guess) || guess.includes(this.state.secret.toLowerCase())) {
        const s = this.state.secret;
        this.state.active = null;
        return { text: "🎉 Угадал! Это " + s + "! Молодец ✨" };
      }
    }

    if (this.state.whoamiTries > 10) {
      const s = this.state.secret;
      this.state.active = null;
      return { text: "Хватит попыток! Это был(а) " + s + ". Сыграем ещё? Напиши «сыграем в кто я»." };
    }

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

    return { text: hint + "\nПопыток: " + this.state.whoamiTries + "/10" };
  },
  isPerson(s) {
    return /моцарт|пикассо|клеопатра/i.test(s);
  },
  isAnime(s) {
    return /чебур|гарри|наруто|пикачу|сейлор|бэтмен|человек-паук|эльза|шрек/i.test(s);
  },

  // ============================================================
  // 9. ШАШКИ (упрощённо — на 3x3, «уголки»)
  // ============================================================
  startCheckers() {
    this.state.active = "checkers";
    // 3x3 доска
    this.state.checkersBoard = [
      ["⚫", "", "⚪"],
      ["", "⚫", ""],
      ["⚪", "", "⚫"]
    ];
    return { text: this.checkersDisplay() + "\n\nНапиши: «ход 1-1 2-2» (откуда-куда)" };
  },
  checkersDisplay() {
    const b = this.state.checkersBoard;
    return "⚫⚪ ШАШКИ (упрощённо 3x3)\n\n" +
      "  a  b  c\n" +
      "1 " + b[0][0] + " " + b[0][1] + " " + b[0][2] + "\n" +
      "2 " + b[1][0] + " " + b[1][1] + " " + b[1][2] + "\n" +
      "3 " + b[2][0] + " " + b[2][1] + " " + b[2][2] + "\n\n" +
      "Ты — ⚫. Напиши: «ход a1 b2»";
  },
  playCheckers(text) {
    const t = text.toLowerCase();
    const match = t.match(/([a-c])([1-3])\s+([a-c])([1-3])/);
    if (!match) {
      return { text: "Напиши: «ход a1 b2»\n\n" + this.checkersDisplay() };
    }
    const fromX = match[1].charCodeAt(0) - 97;
    const fromY = parseInt(match[2]) - 1;
    const toX = match[3].charCodeAt(0) - 97;
    const toY = parseInt(match[4]) - 1;

    if (this.state.checkersBoard[fromY][fromX] !== "⚫") {
      return { text: "Это не твоя шашка!" };
    }
    if (this.state.checkersBoard[toY][toX] !== "") {
      return { text: "Клетка занята!" };
    }

    // Движение
    this.state.checkersBoard[toY][toX] = "⚫";
    this.state.checkersBoard[fromY][fromX] = "";

    // Проверка победы
    const black = this.countCheckers("⚫");
    const white = this.countCheckers("⚪");
    if (white === 0) {
      this.state.active = null;
      return { text: this.checkersDisplay() + "\n\n🎉 Ты победил!" };
    }

    // Ход Ани — случайный
    const myMoves = this.getCheckerMoves("⚪");
    if (myMoves.length === 0) {
      this.state.active = null;
      return { text: this.checkersDisplay() + "\n\n🎉 Ты победил (у меня нет ходов)!" };
    }
    const myMove = pick(myMoves);
    this.state.checkersBoard[myMove.toY][myMove.toX] = "⚪";
    this.state.checkersBoard[myMove.fromY][myMove.fromX] = "";

    const black2 = this.countCheckers("⚫");
    if (black2 === 0) {
      this.state.active = null;
      return { text: this.checkersDisplay() + "\n\n😄 Я победила!" };
    }

    return { text: this.checkersDisplay() + "\n\nТвой ход!" };
  },
  countCheckers(symbol) {
    return this.state.checkersBoard.flat().filter(c => c === symbol).length;
  },
  getCheckerMoves(symbol) {
    const b = this.state.checkersBoard;
    const moves = [];
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (b[y][x] === symbol) {
          // Проверяем соседние клетки
          const dirs = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]];
          for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < 3 && ny >= 0 && ny < 3 && b[ny][nx] === "") {
              moves.push({ fromX: x, fromY: y, toX: nx, toY: ny });
            }
          }
        }
      }
    }
    return moves;
  },

  // ============================================================
  // 10. МОРСКОЙ БОЙ (упрощённый 5x5)
  // ============================================================
  startBattleship() {
    this.state.active = "battleship";
    // Поле Ани (5x5), 3 корабля по 1 клетке + 1 по 2
    this.state.myShips = this.generateShips();
    this.state.myHits = [];
    this.state.playerShips = this.generateShips();
    this.state.playerHits = [];
    this.state.playerShots = [];  // куда стрелял игрок
    return { text: this.battleshipDisplay() + "\n\nСтреляй: «а3», «б4» (буква-цифра)" };
  },
  generateShips() {
    const ships = [];
    while (ships.length < 4) {
      const x = rnd(0, 4);
      const y = rnd(0, 4);
      const key = x + "-" + y;
      if (!ships.includes(key)) ships.push(key);
    }
    return ships;
  },
  battleshipDisplay() {
    const letters = ["а", "б", "в", "г", "д"];
    let out = "🚢 МОРСКОЙ БОЙ (5x5)\n\n";
    out += "   " + letters.join(" ") + "\n";
    for (let y = 0; y < 5; y++) {
      out += (y + 1) + "  ";
      for (let x = 0; x < 5; x++) {
        const key = x + "-" + y;
        if (this.state.playerShots.includes(key)) {
          if (this.state.myShips.includes(key)) out += "💥 ";
          else out += "• ";
        } else {
          out += "~ ";
        }
      }
      out += "\n";
    }
    return out;
  },
  playBattleship(text) {
    const t = text.toLowerCase();
    const letters = { "а": 0, "б": 1, "в": 2, "г": 3, "д": 4 };
    const match = t.match(/([а-д])\s*([1-5])/);
    if (!match) {
      return { text: "Напиши координаты: «а3», «б4»\n\n" + this.battleshipDisplay() };
    }
    const x = letters[match[1]];
    const y = parseInt(match[2]) - 1;
    const key = x + "-" + y;

    if (this.state.playerShots.includes(key)) {
      return { text: "Ты уже стрелял сюда!\n\n" + this.battleshipDisplay() };
    }
    this.state.playerShots.push(key);

    let hit = false;
    if (this.state.myShips.includes(key)) {
      hit = true;
      this.state.myHits.push(key);
    }

    // Проверка победы игрока
    if (this.state.myHits.length === this.state.myShips.length) {
      this.state.active = null;
      return { text: this.battleshipDisplay() + "\n\n🎉 Ты потопил все мои корабли! Победа!" };
    }

    // Ход Ани — стреляет случайно в поле игрока
    const avail = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const k = i + "-" + j;
        if (!this.state.playerHits.includes(k)) avail.push(k);
      }
    }
    const myShot = pick(avail);
    let myHit = false;
    if (this.state.playerShips.includes(myShot)) {
      myHit = true;
      this.state.playerHits.push(myShot);
    }

    let status = hit ? "💥 Попал!" : "💦 Мимо!";
    status += "\nЯ стреляю в " + myShot.split("-").map((v, i) => i === 0 ? "абвгд"[v] : (parseInt(v) + 1)).join("") + ": ";
    status += myHit ? "💥 Попала!" : "💦 Мимо!";

    return { text: this.battleshipDisplay() + "\n\n" + status };
  },

  // ============================================================
  // 11. 21 (ОЧКО)
  // ============================================================
  startBlackjack() {
    this.state.active = "blackjack";
    this.state.playerCards = [this.drawCard(), this.drawCard()];
    this.state.myCards = [this.drawCard(), this.drawCard()];
    return { text: this.blackjackDisplay() + "\n\n«ещё» — взять карту, «хватит» — остановиться" };
  },
  drawCard() {
    const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11]; // 11 = туз
    return pick(cards);
  },
  sumCards(cards) {
    let sum = cards.reduce((a, b) => a + b, 0);
    // Если туз = 11 и перебор, считаем как 1
    let aces = cards.filter(c => c === 11).length;
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces--;
    }
    return sum;
  },
  blackjackDisplay() {
    return "🃏 21 (ОЧКО)\n\n" +
      "Твои карты: " + this.state.playerCards.join(", ") + " (сумма: " + this.sumCards(this.state.playerCards) + ")\n" +
      "Мои карты: " + this.state.myCards[0] + ", ?";
  },
  playBlackjack(text) {
    const t = text.toLowerCase();

    if (/(ещё|еще|взять|дай)/.test(t)) {
      this.state.playerCards.push(this.drawCard());
      const sum = this.sumCards(this.state.playerCards);

      if (sum > 21) {
        this.state.active = null;
        return { text: "🃏 Перебор! " + sum + ". Я победила! 😄\n\nЕщё? Напиши «21»" };
      }

      return { text: this.blackjackDisplay() + "\n\n(сумма: " + sum + ")\n\n«ещё» или «хватит»" };
    }

    if (/(хватит|стоп|достаточно|пас)/.test(t)) {
      // Аня добирает до 17+
      while (this.sumCards(this.state.myCards) < 17) {
        this.state.myCards.push(this.drawCard());
      }

      const mySum = this.sumCards(this.state.myCards);
      const playerSum = this.sumCards(this.state.playerCards);

      let result;
      if (mySum > 21) result = "🎉 У меня перебор! Ты победил!";
      else if (playerSum > mySum) result = "🎉 Ты победил!";
      else if (playerSum === mySum) result = "🤝 Ничья!";
      else result = "😄 Я победила!";

      this.state.active = null;
      return { text:
        "🃏 ИТОГ:\n\n" +
        "Твои карты: " + this.state.playerCards.join(", ") + " = " + playerSum + "\n" +
        "Мои карты: " + this.state.myCards.join(", ") + " = " + mySum + "\n\n" +
        result + "\n\nЕщё? Напиши «21»"
      };
    }

    return { text: "Напиши «ещё» или «хватит»" };
  },

  // ============================================================
  // 12. УГАДАЙ СЛОВО (Wordle-стиль)
  // ============================================================
  wordleWords: ["КОШКА", "СОБАКА", "ШКОЛА", "КНИГА", "СОЛНЦЕ", "ЦВЕТОК", "ДЕРЕВО", "МАШИНА", "ТЕЛЕФОН", "ДРУГ", "МУЗЫКА", "ИГРА", "АНИМЕ", "ВЕСНА", "ЗИМА", "ЛЕТО", "ОСЕНЬ", "МОРЕ", "ПЕСНЯ", "ЗВЕЗДА", "СВЕТ", "ДОЖДЬ"],
  startWordle() {
    this.state.active = "wordle";
    this.state.wordleWord = pick(this.wordleWords);
    this.state.wordleTries = [];
    return { text: "📝 УГАДАЙ СЛОВО\n\nЯ загадала слово из " + this.state.wordleWord.length + " букв.\n\nПравила:\n✅ — буква на месте\n🟨 — буква есть, но не там\n⬜ — буквы нет\n\nПиши слово!" };
  },
  playWordle(text) {
    const t = text.trim().toUpperCase();
    if (!/^[А-ЯЁ]+$/.test(t)) {
      return { text: "Напиши слово русскими буквами!" };
    }
    if (t.length !== this.state.wordleWord.length) {
      return { text: "Слово должно быть из " + this.state.wordleWord.length + " букв!" };
    }

    // Проверка
    const result = this.checkWordle(t);
    this.state.wordleTries.push({ word: t, result });

    if (t === this.state.wordleWord) {
      const word = this.state.wordleWord;
      const tries = this.state.wordleTries.length;
      this.state.active = null;
      return { text: this.wordleDisplay() + "\n\n🎉 Угадал! Слово: " + word + "\nПопыток: " + tries + "\n\nЕщё? Напиши «угадай слово»" };
    }

    if (this.state.wordleTries.length >= 6) {
      const word = this.state.wordleWord;
      this.state.active = null;
      return { text: this.wordleDisplay() + "\n\n😢 Не угадал. Слово было: " + word + "\n\nЕщё? Напиши «угадай слово»" };
    }

    return { text: this.wordleDisplay() + "\n\nПопыток: " + this.state.wordleTries.length + "/6" };
  },
  checkWordle(word) {
    const target = this.state.wordleWord;
    const result = [];
    const used = Array(target.length).fill(false);

    // Сначала правильные
    for (let i = 0; i < word.length; i++) {
      if (word[i] === target[i]) {
        result[i] = "✅";
        used[i] = true;
      }
    }
    // Потом остальные
    for (let i = 0; i < word.length; i++) {
      if (!result[i]) {
        for (let j = 0; j < target.length; j++) {
          if (!used[j] && word[i] === target[j]) {
            result[i] = "🟨";
            used[j] = true;
            break;
          }
        }
        if (!result[i]) result[i] = "⬜";
      }
    }
    return result;
  },
  wordleDisplay() {
    let out = "📝 УГАДАЙ СЛОВО\n\n";
    this.state.wordleTries.forEach(t => {
      out += t.word.split("").map((c, i) => c + t.result[i]).join(" ") + "\n";
    });
    return out;
  }
};
