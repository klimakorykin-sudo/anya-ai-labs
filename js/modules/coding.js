// ============================================================
// CODING.JS — Генератор кода (18 языков)
// ============================================================

const CodingModule = {

  templates: {
    python: {
      hello: "print(\"Привет, мир!\")",
      calc: "def calc(a, b, op):\n    if op == \"+\": return a + b\n    if op == \"-\": return a - b\n    if op == \"*\": return a * b\n    if op == \"/\": return a / b if b else \"деление на 0\"\n\nprint(calc(5, 3, \"+\"))",
      calc_full: "# Полноценный калькулятор на Python\ndef calc():\n    print(\"Калькулятор\")\n    a = float(input(\"Первое число: \"))\n    op = input(\"Операция (+ - * /): \")\n    b = float(input(\"Второе число: \"))\n    \n    if op == \"+\": print(a + b)\n    elif op == \"-\": print(a - b)\n    elif op == \"*\": print(a * b)\n    elif op == \"/\": print(a / b if b != 0 else \"Деление на 0\")\n    else: print(\"Неизвестная операция\")\n\ncalc()",
      fib: "def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint(list(fib(10)))",
      sort: "arr = [5, 2, 8, 1, 9]\narr.sort()\nprint(arr)",
      guess: "import random\nnum = random.randint(1, 100)\nwhile True:\n    x = int(input(\"Угадай: \"))\n    if x == num:\n        print(\"Верно!\")\n        break\n    print(\"Больше\" if x < num else \"Меньше\")",
      default: "# Python-пример\ndef main():\n    print(\"Привет! 👋\")\n\nif __name__ == \"__main__\":\n    main()"
    },
    js: {
      hello: "console.log(\"Привет, мир!\");",
      calc: "function calc(a, b, op) {\n  switch(op){\n    case \"+\": return a + b;\n    case \"-\": return a - b;\n    case \"*\": return a * b;\n    case \"/\": return b ? a / b : \"деление на 0\";\n  }\n}\nconsole.log(calc(5, 3, \"+\"));",
      calc_full: "// Полноценный калькулятор\nconst a = +prompt(\"Первое число:\");\nconst op = prompt(\"Операция (+ - * /):\");\nconst b = +prompt(\"Второе число:\");\nlet result;\nswitch (op) {\n  case \"+\": result = a + b; break;\n  case \"-\": result = a - b; break;\n  case \"*\": result = a * b; break;\n  case \"/\": result = b ? a / b : \"Деление на 0\"; break;\n}\nalert(\"Результат: \" + result);",
      fib: "function fib(n){\n  let a = 0, b = 1, out = [];\n  for(let i = 0; i < n; i++){\n    out.push(a);\n    [a, b] = [b, a + b];\n  }\n  return out;\n}\nconsole.log(fib(10));",
      sort: "const arr = [5, 2, 8, 1, 9];\narr.sort((a, b) => a - b);\nconsole.log(arr);",
      default: "function hello(name) {\n  return `Привет, ${name}!`;\n}\nconsole.log(hello(\"мир\"));"
    },
    html: {
      page: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Моя страница</title>\n</head>\n<body>\n  <h1>Привет! 🌸</h1>\n  <p>Моя первая страница</p>\n</body>\n</html>",
      calc: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Калькулятор</title>\n</head>\n<body>\n  <h2>Калькулятор</h2>\n  <input id=\"a\" type=\"number\" placeholder=\"Число 1\">\n  <select id=\"op\">\n    <option>+</option>\n    <option>-</option>\n    <option>*</option>\n    <option>/</option>\n  </select>\n  <input id=\"b\" type=\"number\" placeholder=\"Число 2\">\n  <button onclick=\"calc()\">=</button>\n  <p id=\"result\"></p>\n  <script>\n    function calc() {\n      const a = +document.getElementById(\"a\").value;\n      const b = +document.getElementById(\"b\").value;\n      const op = document.getElementById(\"op\").value;\n      let r;\n      if (op === \"+\") r = a + b;\n      if (op === \"-\") r = a - b;\n      if (op === \"*\") r = a * b;\n      if (op === \"/\") r = b ? a / b : \"ошибка\";\n      document.getElementById(\"result\").textContent = r;\n    }\n  </script>\n</body>\n</html>",
      default: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head><meta charset=\"UTF-8\"><title>Страница</title></head>\n<body>\n  <h1>Привет! 🌸</h1>\n</body>\n</html>"
    },
    css: {
      default: "body {\n  background: linear-gradient(135deg, #ff6ec7, #a06bff);\n  color: #fff;\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}",
      button: "button {\n  background: linear-gradient(135deg, #ff6ec7, #a06bff);\n  color: #fff;\n  border: none;\n  padding: 12px 24px;\n  border-radius: 12px;\n  font-size: 16px;\n  cursor: pointer;\n}\n\nbutton:hover {\n  transform: scale(1.05);\n}"
    },
    cpp: {
      default: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Привет, мир!\" << endl;\n    return 0;\n}"
    },
    java: {
      default: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Привет, мир!\");\n    }\n}"
    },
    csharp: {
      default: "using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine(\"Привет, мир!\");\n    }\n}"
    },
    pascal: {
      default: "program Hello;\nbegin\n  writeln('Привет, мир!');\nend."
    },
    lua: {
      default: "print(\"Привет, мир!\")"
    },
    go: {
      default: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Привет, мир!\")\n}"
    },
    rust: {
      default: "fn main() {\n    println!(\"Привет, мир!\");\n}"
    },
    ruby: {
      hello: "puts \"Привет, мир!\"",
      calc: "def calc(a, b, op)\n  case op\n  when \"+\" then a + b\n  when \"-\" then a - b\n  when \"*\" then a * b\n  when \"/\" then b.zero? ? \"деление на 0\" : a / b\n  end\nend\n\nputs calc(5, 3, \"+\")",
      fib: "def fib(n)\n  a, b = 0, 1\n  n.times.map { r = a; a, b = b, a + b; r }\nend\n\nputs fib(10).inspect",
      default: "# Ruby-пример\ndef greet(name)\n  \"Привет, #{name}!\"\nend\n\nputs greet(\"мир\")"
    },
    php: {
      hello: "<?php\necho \"Привет, мир!\";\n?>",
      calc: "<?php\nfunction calc($a, $b, $op) {\n    switch ($op) {\n        case \"+\": return $a + $b;\n        case \"-\": return $a - $b;\n        case \"*\": return $a * $b;\n        case \"/\": return $b != 0 ? $a / $b : \"деление на 0\";\n    }\n}\n\necho calc(5, 3, \"+\");\n?>",
      default: "<?php\nfunction greet($name) {\n    return \"Привет, $name!\";\n}\n\necho greet(\"мир\");\n?>"
    },
    swift: {
      hello: "print(\"Привет, мир!\")",
      calc: "func calc(_ a: Double, _ b: Double, _ op: String) -> String {\n    switch op {\n    case \"+\": return String(a + b)\n    case \"-\": return String(a - b)\n    case \"*\": return String(a * b)\n    case \"/\": return b != 0 ? String(a / b) : \"деление на 0\"\n    default: return \"?\"\n    }\n}\n\nprint(calc(5, 3, \"+\"))",
      default: "// Swift-пример\nfunc greet(_ name: String) -> String {\n    return \"Привет, \\(name)!\"\n}\n\nprint(greet(\"мир\"))"
    },
    kotlin: {
      hello: "fun main() {\n    println(\"Привет, мир!\")\n}",
      calc: "fun calc(a: Double, b: Double, op: String): String {\n    return when (op) {\n        \"+\" -> (a + b).toString()\n        \"-\" -> (a - b).toString()\n        \"*\" -> (a * b).toString()\n        \"/\" -> if (b != 0.0) (a / b).toString() else \"деление на 0\"\n        else -> \"?\"\n    }\n}\n\nfun main() {\n    println(calc(5.0, 3.0, \"+\"))\n}",
      default: "// Kotlin-пример\nfun greet(name: String) = \"Привет, $name!\"\n\nfun main() {\n    println(greet(\"мир\"))\n}"
    },
    typescript: {
      hello: "console.log(\"Привет, мир!\");",
      calc: "function calc(a: number, b: number, op: string): number | string {\n    switch (op) {\n        case \"+\": return a + b;\n        case \"-\": return a - b;\n        case \"*\": return a * b;\n        case \"/\": return b !== 0 ? a / b : \"деление на 0\";\n        default: return \"?\";\n    }\n}\n\nconsole.log(calc(5, 3, \"+\"));",
      default: "// TypeScript-пример\nfunction greet(name: string): string {\n    return `Привет, ${name}!`;\n}\n\nconsole.log(greet(\"мир\"));"
    },
    sql: {
      hello: "-- Создание таблицы\nCREATE TABLE users (\n    id INTEGER PRIMARY KEY,\n    name TEXT NOT NULL,\n    age INTEGER\n);\n\n-- Вставка данных\nINSERT INTO users (name, age) VALUES ('Клим', 13);\n\n-- Выборка\nSELECT * FROM users WHERE age > 10;",
      calc: "-- SQL не для калькуляторов, но можно так:\nSELECT 5 + 3 AS result;",
      default: "-- SQL-пример\nSELECT 'Привет, мир!' AS greeting;"
    },
    bash: {
      hello: "echo \"Привет, мир!\"",
      calc: "#!/bin/bash\necho \"Первое число:\"\nread a\necho \"Операция (+ - * /):\"\nread op\necho \"Второе число:\"\nread b\n\ncase $op in\n    +) echo $((a + b)) ;;\n    -) echo $((a - b)) ;;\n    \\*) echo $((a * b)) ;;\n    /) echo $((a / b)) ;;\nesac",
      default: "#!/bin/bash\n# Bash-пример\ngreet() {\n    echo \"Привет, $1!\"\n}\n\ngreet \"мир\""
    }
  },

  escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },

  detectLang(t) {
    // Новые языки
    if (/typescript|\bts\b|тайпскрипт/.test(t)) return "typescript";
    if (/ruby|руби|руб/.test(t)) return "ruby";
    if (/php|пхп/.test(t)) return "php";
    if (/swift|свифт/.test(t)) return "swift";
    if (/kotlin|котлин/.test(t)) return "kotlin";
    if (/\bsql\b|эс-кью-эл|сиквел/.test(t)) return "sql";
    if (/\bbash\b|баш|шелл|shell/.test(t)) return "bash";

    // Старые
    if (/\bjs\b|javascript|джаваскрипт/.test(t)) return "js";
    if (/html|хтмл/.test(t)) return "html";
    if (/css|цсс/.test(t)) return "css";
    if (/c\+\+|cpp|си\+\+/.test(t)) return "cpp";
    if (/\bjava\b/.test(t) && !/javascript/.test(t)) return "java";
    if (/c#|csharp|си шарп/.test(t)) return "csharp";
    if (/pascal|паскаль/.test(t)) return "pascal";
    if (/lua|луа/.test(t)) return "lua";
    if (/\bgo\b|golang/.test(t)) return "go";
    if (/rust|раст/.test(t)) return "rust";
    if (/python|питон|пайтон/.test(t)) return "python";
    return null;
  },

  detectTask(t) {
    if (/(калькулятор|calc)/.test(t)) return "calc_full";
    if (/(привет|hello|hello world)/.test(t)) return "hello";
    if (/(фибонач|fib)/.test(t)) return "fib";
    if (/(сортиров|sort)/.test(t)) return "sort";
    if (/(угадай.*числ|guess.*num)/.test(t)) return "guess";
    if (/(кнопк|button)/.test(t)) return "button";
    if (/(страниц|page)/.test(t)) return "page";
    return "default";
  },

  handle(text) {
    const t = text.toLowerCase();

    // Учебник по Python
    if (/(как.*учить.*python|учебник.*python|основ.*python)/.test(t)) {
      return { text:
        "📚 PYTHON — ОСНОВЫ:\n\n" +
        "1. Переменные: x = 5\n" +
        "2. Условия: if x > 0: ...\n" +
        "3. Циклы: for i in range(10): ...\n" +
        "4. Функции: def name(): ...\n" +
        "5. Списки: [1, 2, 3]\n" +
        "6. Словари: {'ключ': 'значение'}\n" +
        "7. Импорт: import math\n" +
        "8. Файлы: open('file.txt')\n\n" +
        "Спроси «код на Python» — покажу пример!"
      };
    }

    // Хочет код
    const wantsCode = /(код|code|программ|скрипт|напиши.*(python|js|javascript|html|css|c\+\+|java|c#|pascal|lua|go|rust|питон|паскаль|хтмл|цсс|ruby|php|swift|kotlin|typescript|sql|bash|руби|пхп|свифт|котлин|баш))/i.test(t);
    const justLang = /^(html|хтмл|css|цсс|python|питон|пайтон|js|javascript|джаваскрипт|c\+\+|cpp|java|джава|c#|csharp|pascal|паскаль|lua|луа|go|golang|rust|раст|ruby|руби|php|пхп|swift|свифт|kotlin|котлин|typescript|тайпскрипт|sql|сиквел|bash|баш)\s*[?!.]?$/i.test(t.trim());
    const wantsCalc = /(калькулятор|calc)/i.test(t);
    const wantsGive = /(дай|дашь|давай|сделай|покажи).{0,20}(код|html|css|python|js|javascript|калькулятор|программ|ruby|php|swift|kotlin|typescript|sql|bash)/i.test(t);

    if (!wantsCode && !justLang && !wantsCalc && !wantsGive) {
      return null;
    }

    let lang = this.detectLang(t);

    if (!lang && wantsCalc) lang = "python";

    if (!lang) {
      if (/(^|\s)(код|программ|скрипт)(\s|$|\?|!)/i.test(t) && !/html|css|python|js|java|c\+\+|c#|pascal|lua|go|rust|питон|паскаль|хтмл|цсс|ruby|php|swift|kotlin|typescript|sql|bash/i.test(t)) {
        return { text:
          "💻 На каком языке? Могу на:\n\n" +
          "🐍 Python\n" +
          "✨ JavaScript\n" +
          "🌐 HTML\n" +
          "🎨 CSS\n" +
          "📘 TypeScript\n" +
          "🍎 Ruby\n" +
          "🐘 PHP\n" +
          "🦅 Swift\n" +
          "🎯 Kotlin\n" +
          "🗄 SQL\n" +
          "🖥 Bash\n" +
          "⚙️ C, C++, C#, Java\n" +
          "📜 Pascal, Lua, Go, Rust\n\n" +
          "Напиши: «код на Python» или «ruby»..."
        };
      }
      return null;
    }

    const task = this.detectTask(t);
    const langTemplates = this.templates[lang] || this.templates.python;
    const code = langTemplates[task] || langTemplates.default;

    let header = "💻 Код на " + lang.toUpperCase() + ":";
    if (task === "calc_full" || task === "calc") {
      header = "🧮 Калькулятор на " + lang.toUpperCase() + ":";
    } else if (task === "page") {
      header = "🌐 HTML-страница:";
    } else if (task === "button") {
      header = "🎨 CSS-кнопка:";
    }

    return {
      text: header + "\n<pre>" + this.escapeHtml(code) + "</pre>"
    };
  }
};
