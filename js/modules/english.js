const EnglishModule = {

  irregular: {
    go: "went / gone", eat: "ate / eaten", see: "saw / seen",
    take: "took / taken", come: "came / come", do: "did / done",
    have: "had / had", be: "was/were / been", make: "made / made",
    know: "knew / known", write: "wrote / written", read: "read / read",
    give: "gave / given", get: "got / gotten", say: "said / said",
    find: "found / found", think: "thought / thought", tell: "told / told",
    become: "became / become", show: "showed / shown", leave: "left / left",
    feel: "felt / felt", put: "put / put", bring: "brought / brought",
    begin: "began / begun", keep: "kept / kept", hold: "held / held",
    stand: "stood / stood", hear: "heard / heard", let: "let / let",
    mean: "meant / meant", set: "set / set", meet: "met / met",
    run: "ran / run", pay: "paid / paid", sit: "sat / sat",
    speak: "spoke / spoken", lie: "lay / lain", lead: "led / led",
    grow: "grew / grown", lose: "lost / lost", fall: "fell / fallen",
    send: "sent / sent", build: "built / built", understand: "understood / understood",
    draw: "drew / drawn", break: "broke / broken", spend: "spent / spent",
    cut: "cut / cut", rise: "rose / risen", drive: "drove / driven",
    buy: "bought / bought", wear: "wore / worn", choose: "chose / chosen",
    fly: "flew / flown", swim: "swam / swum", sing: "sang / sung",
    drink: "drank / drunk", forget: "forgot / forgotten", teach: "taught / taught",
    catch: "caught / caught", fight: "fought / fought", sleep: "slept / slept"
  },

  handle(text) {
    const t = text.toLowerCase();

    // Все неправильные глаголы
    if (/(неправильн.*глагол|irregular|список.*глагол)/.test(t)) {
      const keys = Object.keys(this.irregular).slice(0, 20);
      let out = "📚 Неправильные глаголы (20 из " + Object.keys(this.irregular).length + "):\n\n";
      keys.forEach(inf => {
        out += `• ${inf} → ${this.irregular[inf]}\n`;
      });
      out += "\nСпроси: «Past Simple у go» — покажу конкретный.";
      return { text: out };
    }

    // Прошлое конкретного глагола
    for (const [inf, forms] of Object.entries(this.irregular)) {
      const re = new RegExp(`\\b${inf}\\b`, "i");
      if (re.test(t) && /(прош|past|врем|форм|как будет)/.test(t)) {
        return { text: `📚 ${inf} → ${forms}` };
      }
    }

    // Времена
    if (/(past simple|простое прошедшее)/.test(t)) {
      return { text:
        "📚 PAST SIMPLE:\n\n" +
        "Формула: V2 (вторая форма глагола)\n" +
        "Пример: I went to school yesterday.\n" +
        "Вопрос: Did you go?\n" +
        "Отрицание: I didn't go."
      };
    }
    if (/(present simple|простое настоящее)/.test(t)) {
      return { text:
        "📚 PRESENT SIMPLE:\n\n" +
        "Формула: V1 (для I/you/we/they), V-s (для he/she/it)\n" +
        "Пример: I play. He plays.\n" +
        "Вопрос: Do you play? Does he play?\n" +
        "Отрицание: I don't play. He doesn't play."
      };
    }
    if (/(present continuous|настоящее продолженное)/.test(t)) {
      return { text:
        "📚 PRESENT CONTINUOUS:\n\n" +
        "Формула: am/is/are + V-ing\n" +
        "Пример: I am reading. She is playing.\n" +
        "Вопрос: Are you reading?\n" +
        "Отрицание: I am not reading."
      };
    }
    if (/(future simple|будущее)/.test(t)) {
      return { text:
        "📚 FUTURE SIMPLE:\n\n" +
        "Формула: will + V1\n" +
        "Пример: I will go tomorrow.\n" +
        "Вопрос: Will you go?\n" +
        "Отрицание: I won't go."
      };
    }

    // Базовые фразы
    if (/(фраз.*англ|как сказать)/.test(t)) {
      return { text:
        "🇬🇧 БАЗОВЫЕ ФРАЗЫ:\n\n" +
        "• Привет — Hello / Hi\n" +
        "• Как дела? — How are you?\n" +
        "• Спасибо — Thank you\n" +
        "• Пожалуйста — Please\n" +
        "• Извини — Sorry\n" +
        "• Меня зовут... — My name is...\n" +
        "• Я не понимаю — I don't understand\n" +
        "• Сколько это стоит? — How much is it?\n" +
        "• Где туалет? — Where is the toilet?\n" +
        "• Помогите! — Help!"
      };
    }

    return null;
  }
};