// ============================================================
// MUSIC.JS — Музыка по настроению
// ============================================================

const MusicModule = {

  // ============================================================
  // БАЗА МУЗЫКИ ПО НАСТРОЕНИЮ
  // ============================================================
  playlists: {
    sad: {
      name: "Грустное / спокойное",
      emoji: "💙",
      desc: "Когда грустно — эти песни мягкие, как объятие",
      songs: [
        "🎵 Billie Eilish — lovely",
        "🎵 Adele — Someone Like You",
        "🎵 Coldplay — Fix You",
        "🎵 Rihanna — Stay",
        "🎵 Земфира — Ромашки",
        "🎵 Баста — Сансара",
        "🎵 Макс Корж — Малиновый закат",
        "🎵 Sia — Breathe Me",
        "🎵 Lana Del Rey — Summertime Sadness",
        "🎵 Кино — Печаль",
        "🎵 Radiohead — Creep",
        "🎵 Passenger — Let Her Go"
      ]
    },
    happy: {
      name: "Весёлое / танцевальное",
      emoji: "💛",
      desc: "Когда радостно — под это хочется танцевать",
      songs: [
        "🎵 Pharrell Williams — Happy",
        "🎵 Katy Perry — Roar",
        "🎵 Dua Lipa — Don't Start Now",
        "🎵 The Weeknd — Blinding Lights",
        "🎵 ABBA — Dancing Queen",
        "🎵 Земфира — Прогулка",
        "🎵 Мумий Тролль — Владивосток 2000",
        "🎵 Marshmello — Happier",
        "🎵 Ed Sheeran — Shivers",
        "🎵 Bruno Mars — Uptown Funk"
      ]
    },
    angry: {
      name: "Злое / энергичное",
      emoji: "❤️‍🔥",
      desc: "Когда злит — выпусти пар",
      songs: [
        "🎵 Linkin Park — Numb",
        "🎵 Rage Against the Machine — Killing in the Name",
        "🎵 Slipknot — Duality",
        "🎵 System of a Down — Chop Suey!",
        "🎵 Metallica — Enter Sandman",
        "🎵 Bring Me The Horizon — Can You Feel My Heart",
        "🎵 Twenty One Pilots — Jumpsuit",
        "🎵 The Prodigy — Firestarter",
        "🎵 Skrillex — Bangarang",
        "🎵 Би-2 — Полковнику никто не пишет"
      ]
    },
    bored: {
      name: "Энергичное / бодрое",
      emoji: "⚡",
      desc: "Когда скучно — встряхнись!",
      songs: [
        "🎵 Imagine Dragons — Believer",
        "🎵 Fall Out Boy — Centuries",
        "🎵 Panic! At The Disco — High Hopes",
        "🎵 ONE OK ROCK — The Beginning",
        "🎵 Skillet — Monster",
        "🎵 Green Day — American Idiot",
        "🎵 Arctic Monkeys — Do I Wanna Know?",
        "🎵 Молчат Дома — Судно",
        "🎵 IC3PEAK — Сказка"
      ]
    },
    anxious: {
      name: "Успокаивающее / ambient",
      emoji: "🌙",
      desc: "Когда тревожно — расслабься",
      songs: [
        "🎵 Brian Eno — An Ending (Ascent)",
        "🎵 Ólafur Arnalds — Near Light",
        "🎵 Ludovico Einaudi — Nuvole Bianche",
        "🎵 Yiruma — River Flows in You",
        "🎵 Max Richter — On the Nature of Daylight",
        "🎵 Hammock — Breathturn",
        "🎵 Sigur Rós — Samskeyti",
        "🎵 Nils Frahm — Says",
        "🎵 Aphex Twin — Avril 14th",
        "🎵 Hans Zimmer — Time"
      ]
    },
    love: {
      name: "Романтичное / тёплое",
      emoji: "💖",
      desc: "Когда влюблён — эти песни о чувствах",
      songs: [
        "🎵 Ed Sheeran — Perfect",
        "🎵 John Legend — All of Me",
        "🎵 Elvis Presley — Can't Help Falling in Love",
        "🎵 Adele — Make You Feel My Love",
        "🎵 Coldplay — Yellow",
        "🎵 Баста — Мама",
        "🎵 Макс Корж — Жить в кайф",
        "🎵 Мумий Тролль — Медведица",
        "🎵 Земфира — Хочешь?",
        "🎵 Танцы Минус — Город"
      ]
    },
    focus: {
      name: "Для учёбы / сосредоточения",
      emoji: "📚",
      desc: "Когда делаешь уроки — помогает сфокусироваться",
      songs: [
        "🎵 Hans Zimmer — Interstellar OST",
        "🎵 Ludovico Einaudi — Experience",
        "🎵 Nils Frahm — All Melody",
        "🎵 Ólafur Arnalds — Re:member",
        "🎵 Bonobo — Kerala",
        "🎵 Tycho — Awake",
        "🎵 Boards of Canada — Roygbiv",
        "🎵 Aphex Twin — Xtal",
        "🎵 Kiasmos — Looped",
        "🎵 Jon Hopkins — Light Through the Veins"
      ]
    },
    night: {
      name: "Ночное / мечтательное",
      emoji: "🌌",
      desc: "Для позднего вечера, перед сном",
      songs: [
        "🎵 Cigarettes After Sex — Apocalypse",
        "🎵 The xx — Intro",
        "🎵 Beach House — Space Song",
        "🎵 M83 — Midnight City",
        "🎵 Lana Del Rey — Video Games",
        "🎵 Radiohead — No Surprises",
        "🎵 Молчат Дома — Клетка",
        "🎵 Каспийский Груз — Табак",
        "🎵 Boulevard Depo — Проснись и пой"
      ]
    }
  },

  // ============================================================
  // ОПРЕДЕЛЕНИЕ НАСТРОЕНИЯ
  // ============================================================
  detectMood(text) {
    const t = text.toLowerCase();

    if (/(груст|печаль|плохо|тоск|расстроен|плак|одинок)/.test(t)) return "sad";
    if (/(радост|счаст|весел|ура|круто|супер|отличн|класс)/.test(t)) return "happy";
    if (/(злюсь|бесит|ненавиж|ярост|раздраж|гнев|агресс)/.test(t)) return "angry";
    if (/(скучно|скучн|нечего делать|лень)/.test(t)) return "bored";
    if (/(тревог|беспоко|нервнич|волну|паник|страшно)/.test(t)) return "anxious";
    if (/(влюб|любов|нравится|симпати|сердц)/.test(t)) return "love";
    if (/(учеб|уроки|домашк|занимат|сосредоточ|работ|пис|читаю)/.test(t)) return "focus";
    if (/(ноч|поздно|спать|сон|вечер)/.test(t)) return "night";

    return null;
  },

  // ============================================================
  // ПОДБОРКА ПО НАСТРОЕНИЮ
  // ============================================================
  formatPlaylist(mood, count) {
    const pl = this.playlists[mood];
    if (!pl) return null;

    count = count || 5;
    const shuffled = pl.songs.slice().sort(() => Math.random() - 0.5).slice(0, count);

    let out = pl.emoji + " МУЗЫКА ПО НАСТРОЕНИЮ\n\n";
    out += "📌 " + pl.name + "\n";
    out += "💬 " + pl.desc + "\n\n";
    out += "🎵 Подборка:\n\n";
    shuffled.forEach(s => out += s + "\n");
    out += "\n💡 Хочешь больше песен? Напиши «ещё».";
    out += "\n💡 Другая подборка? Напиши «музыка весёлая», «музыка для учёбы» и т.д.";
    return out;
  },

  // ============================================================
  // ВСЕ КАТЕГОРИИ
  // ============================================================
  formatCategories() {
    let out = "🎵 МУЗЫКА ПО НАСТРОЕНИЮ\n\n";
    out += "Какие подборки есть:\n\n";
    for (const [key, pl] of Object.entries(this.playlists)) {
      out += pl.emoji + " " + pl.name + "\n   " + pl.desc + "\n\n";
    }
    out += "Напиши: «музыка для грусти», «весёлая музыка», «музыка для учёбы»...";
    return out;
  },

  // ============================================================
  // ГЛАВНАЯ ФУНКЦИЯ
  // ============================================================
  handle(text) {
    const t = text.toLowerCase().trim();
    this.lastMood = this.lastMood || null;

    // === «ЕЩЁ» — повторить подборку ===
    if (/^(ещё|еще|давай ещё|повтори)[!?.\s]*$/i.test(t) && this.lastMood) {
      return { text: this.formatPlaylist(this.lastMood, 5) };
    }

    // === СПИСОК ВСЕХ КАТЕГОРИЙ ===
    if (/(какая бывает музыка|список музыки|все подборки|какие подборки|музыка по настроению)/.test(t) && !/^музыка\s+\w+/.test(t)) {
      return { text: this.formatCategories() };
    }

    // === КОНКРЕТНАЯ КАТЕГОРИЯ ===
    let mood = null;

    if (/музык.*груст|груст.*музык|печальн.*музык|музык.*печальн|меланхол.*музык/.test(t)) mood = "sad";
    else if (/музык.*весёл|музык.*весел|весёл.*музык|радостн.*музык|музык.*радостн|танцев.*музык/.test(t)) mood = "happy";
    else if (/музык.*зл|зл.*музык|агрессивн.*музык|музык.*агрессивн|рок.*музык|музык.*рок|металл/.test(t)) mood = "angry";
    else if (/музык.*скучн|бодр.*музык|энергичн.*музык|музык.*энергичн/.test(t)) mood = "bored";
    else if (/музык.*тревог|успокаив.*музык|музык.*успокаив|музык.*спокойн|спокойн.*музык|ambient|эмбиент/.test(t)) mood = "anxious";
    else if (/музык.*люб|люб.*музык|романтичн.*музык|музык.*романтичн|музык.*влюб|влюб.*музык/.test(t)) mood = "love";
    else if (/музык.*учёб|музык.*учеб|музык.*работ|музык.*сосредоточ|музык.*для.*дел|музык.*для.*урок/.test(t)) mood = "focus";
    else if (/музык.*ноч|ноч.*музык|музык.*вечер|вечер.*музык|музык.*сон|музык.*спат/.test(t)) mood = "night";

    // Если просто "музыка" — по текущей эмоции
    if (/^(музык[ауы]?|посоветуй.*музык|подбери.*музык|что послушать|дай.*музык)[!?.\s]*$/i.test(t)) {
      const detected = this.detectMood(t);
      if (detected) mood = detected;
      else return { text:
        "🎵 Какую музыку хочешь?\n\n" +
        "• Грустную\n" +
        "• Весёлую\n" +
        "• Энергичную\n" +
        "• Успокаивающую\n" +
        "• Романтичную\n" +
        "• Для учёбы\n" +
        "• Ночную\n\n" +
        "Напиши: «музыка для грусти», «весёлая музыка»..."
      };
    }

    if (mood) {
      this.lastMood = mood;
      return { text: this.formatPlaylist(mood, 5) };
    }

    return null;
  }
};
