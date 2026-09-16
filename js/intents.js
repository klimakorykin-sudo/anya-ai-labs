// Взвешенное определение намерения
// Если суммарный вес слов >= threshold — это интент

const INTENTS = {
  firstaid_cpr: {
    weight: 3,
    threshold: 3,
    words: ["слр", "cpr", "реанимац", "не дышит", "без сознания", "остановка сердца", "массаж сердца"]
  },
  firstaid_bleed: {
    weight: 3,
    threshold: 3,
    words: ["кровотеч", "кровь", "рана", "порез", "жгут", "льётся кровь"]
  },
  firstaid_burn: {
    weight: 3,
    threshold: 3,
    words: ["ожог", "обжёг", "обжог", "кипяток", "burn"]
  },
  firstaid_choking: {
    weight: 3,
    threshold: 3,
    words: ["подавил", "задых", "удуш", "choking", "поперхнул"]
  },
  firstaid_faint: {
    weight: 3,
    threshold: 3,
    words: ["обморок", "потерял сознани", "faint"]
  },
  firstaid_fracture: {
    weight: 3,
    threshold: 3,
    words: ["перелом", "вывих", "сломал", "трещин"]
  },
  firstaid_poison: {
    weight: 3,
    threshold: 3,
    words: ["отравл", "яд", "poison", "траванул"]
  },
  firstaid_seizure: {
    weight: 3,
    threshold: 3,
    words: ["судорог", "приступ", "эпилепс", "seizure"]
  },
  emergency_fire: {
    weight: 3,
    threshold: 2,
    words: ["пожар", "горит", "огонь", "fire", "дым"]
  },
  emergency_quake: {
    weight: 3,
    threshold: 2,
    words: ["землетряс", "трясёт", "quake"]
  },
  emergency_flood: {
    weight: 3,
    threshold: 2,
    words: ["наводнен", "затопило", "flood"]
  },
  emergency_gas: {
    weight: 3,
    threshold: 2,
    words: ["утечк", "пахнет газ", "газ"]
  },
  photo: {
    weight: 2,
    threshold: 2,
    words: ["фото", "фотк", "покажи", "картинк", "photo", "picture"]
  },
  coding: {
    weight: 2,
    threshold: 2,
    words: ["код", "code", "программ", "скрипт", "python", "javascript", "html", "css", "c++"]
  },
  essay: {
    weight: 2,
    threshold: 2,
    words: ["сочинени", "essay", "текст про"]
  },
  internet_search: {
    weight: 2,
    threshold: 2,
    words: ["поищи", "погугли", "загугли", "найди в интернете", "проверь в инете",
            "юзни инет", "юзай инет", "используй интернет", "что пишут в интернете",
            "посмотри в инете", "погляди в интернете", "search"]
  },
  crisis: {
    weight: 10,
    threshold: 10,
    words: ["не хочу жить", "хочу исчезнуть", "покончить", "резать себя",
            "причинить себе", "умереть", "самоубий", "суицид", "порезать вены"]
  }
};

function scoreIntent(text, intent) {
  const t = text.toLowerCase();
  let score = 0;
  for (const w of intent.words) {
    if (t.includes(w)) score += intent.weight;
  }
  return score;
}

function bestIntent(text) {
  let best = null, bestScore = 0;
  for (const [name, intent] of Object.entries(INTENTS)) {
    const s = scoreIntent(text, intent);
    if (s >= intent.threshold && s > bestScore) {
      best = name;
      bestScore = s;
    }
  }
  return { name: best, score: bestScore };
}

// Проверка конкретного интента
function hasIntent(text, intentName) {
  const intent = INTENTS[intentName];
  if (!intent) return false;
  return scoreIntent(text, intent) >= intent.threshold;
}