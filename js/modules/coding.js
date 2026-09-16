const CodingModule = {

  templates: {
    python: {
      hello: `print("Привет, мир!")`,
      calc: `def calc(a, b, op):\n    if op == "+": return a + b\n    if op == "-": return a - b\n    if op == "*": return a * b\n    if op == "/": return a / b if b else "деление на 0"\n\nprint(calc(5, 3, "+"))`,
      calc_full: `# Полноценный калькулятор на Python\ndef calc():\n    print("Калькулятор")\n    a = float(input("Первое число: "))\n    op = input("Операция (+ - * /): ")\n    b = float(input("Второе число: "))\n    \n    if op == "+": print(a + b)\n    elif op == "-": print(a - b)\n    elif op == "*": print(a * b)\n    elif op == "/": print(a / b if b != 0 else "Деление на 0")\n    else: print("Неизвестная операция")\n\ncalc()`,
      fib: `def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint(list(fib(10)))`,
      sort: `arr = [5, 2, 8, 1, 9]\narr.sort()\nprint(arr)`,
      guess: `import random\nnum = random.randint(1, 100)\nwhile True:\n    x = int(input("Угадай: "))\n    if x == num:\n        print("Верно!")\n        break\n    print("Больше" if x < num else "Меньше")`,
      default: `# Python-пример\ndef main():\n    print("Привет! 👋")\n\nif __name__ == "__main__":\n    main()`
    },
    js: {
      hello: `console.log("Привет, мир!");`,
      calc: `function calc(a, b, op) {\n  switch(op){\n    case "+": return a + b;\n    case "-": return a - b;\n    case "*": return a * b;\n    case "/": return b ? a / b : "деление на 0";\n  }\n}\nconsole.log(calc(5, 3, "+"));`,
      calc_full: `// Полноценный калькулятор\nconst a = +prompt("Первое число:");\nconst op = prompt("Операция (+ - * /):");\nconst b = +prompt("Второе число:");\nlet result;\nswitch (op) {\n  case "+": result = a + b; break;\n  case "-": result = a - b; break;\n  case "*": result = a * b; break;\n  case "/": result = b ? a / b : "Деление на 0"; break;\n}\nalert("Результат: " + result);`,
      fib: `function fib(n){\n  let a = 0, b = 1, out = [];\n  for(let i = 0; i < n; i++){\n    out.push(a);\n    [a, b] = [b, a + b];\n  }\n  return out;\n}\nconsole.log(fib(10));`,
      sort: `const arr = [5, 2, 8, 1, 9];\narr.sort((a, b) => a - b);\nconsole.log(arr);`,
      default: `function hello(name) {\n  return \`Привет, \${name}!\`;\n}\nconsole.log(hello("мир"));`
    },
    html: {
      page: `<!DOCTYPE html>\n<html lang="ru">\n<head>\n  <meta charset="UTF-8">\n  <title>Моя страница</title>\n</head>\n<body>\n  <h1>Привет! 🌸</h1>\n  <p>Моя первая страница</p>\n</body>\n</html>`,
      calc: `<!DOCTYPE html>\n<html lang="ru">\n<head>\n  <meta charset="UTF-8">\n  <title>Калькулятор</title>\n</head>\n<body>\n  <h2>Калькулятор</h2>\n  <input id="a" type="number" placeholder="Число 1">\n  <select id="op">\n    <option>+</option>\n    <option>-</option>\n    <option>*</option>\n    <option>/</option>\n  </select>\n  <input id="b" type="number" placeholder="Число 2">\n  <button onclick="calc()">=</button>\n  <p id="result"></p>\n  <script>\n    function calc() {\n      const a = +document.getElementById("a").value;\n      const b = +document.getElementById("b").value;\n      const op = document.getElementById("op").value;\n      let r;\n      if (op === "+") r = a + b;\n      if (op === "-") r = a - b;\n      if (op === "*") r = a * b;\n      if (op === "/") r = b ? a / b : "ошибка";\n      document.getElementById("result").textContent = r;\n    }\n  <\/script>\n</body>\n</html>`,
      default: `<!DOCTYPE html>\n<html lang="ru">\n<head><meta charset="UTF-8"><title>Страница</title></head>\n<body>\n  <h1>Привет! 🌸</h1>\n</body>\n</html>`
    },
    css: {
      default: `body {\n  background: linear-gradient(135deg, #ff6ec7, #a06bff);\n  color: #fff;\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}`,
      button: `button {\n  background: linear-gradient(135deg, #ff6ec7, #a06bff);\n  color: #fff;\n  border: none;\n  padding: 12px 24px;\n  border-radius: 12px;\n  font-size: 16px;\n  cursor: pointer;\n}\n\nbutton:hover {\n  transform: scale(1.05);\n}`
    },
    cpp: {
      default: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Привет, мир!" << endl;\n    return 0;\n}`
    },
    java: {
      default: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Привет, мир!");\n    }\n}`
    },
    csharp: {
      default: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Привет, мир!");\n    }\n}`
    },
    pascal: {
      default: `program Hello;\nbegin\n  writeln('Привет, мир!');\nend.`
    },
    lua: {
      default: `print("Привет, мир!")`
    },
    go: {
      default: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Привет, мир!")\n}`
    },
    rust: {
      default: `fn main() {\n    println!("Привет, мир!");\n}`
    }
  },

  escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },

  detectLang(t) {
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
    return null; // ← не определяем по умолчанию
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

    // === Учебник по Python ===
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

    // === ТРИГГЕРЫ КОДА (расширенные!) ===

    // 1. Прямой запрос: "код", "напиши код", "программа", "скрипт"
    const wantsCode = /(код|code|программ|скрипт|напиши.*(python|js|javascript|html|css|c\+\+|java|c#|pascal|lua|go|rust|питон|паскаль|хтмл|цсс))/i.test(t);

    // 2. Просто название языка (html, css, python, js и т.д.)
    const justLang = /^(html|хтмл|css|цсс|python|питон|пайтон|js|javascript|джаваскрипт|c\+\+|cpp|java|джава|c#|csharp|pascal|паскаль|lua|луа|go|golang|rust|раст)\s*[?!.]?$/i.test(t.trim());

    // 3. Запрос на калькулятор
    const wantsCalc = /(калькулятор|calc)/i.test(t);

    // 4. Запрос "дай X"
    const wantsGive = /(дай|дашь|давай|сделай|покажи).{0,20}(код|html|css|python|js|javascript|калькулятор|программ)/i.test(t);

    if (!wantsCode && !justLang && !wantsCalc && !wantsGive) {
      return null;
    }

    // Определяем язык
    let lang = this.detectLang(t);

    // Если язык не определён — но просят калькулятор — даём Python
    if (!lang && wantsCalc) lang = "python";

    // Если язык не определён и это не просто язык — не отвечаем
    if (!lang) {
      // Если просят просто "код" — спрашиваем какой
      if (/(^|\s)(код|программ|скрипт)(\s|$|\?|!)/i.test(t) && !/html|css|python|js|java|c\+\+|c#|pascal|lua|go|rust|питон|паскаль|хтмл|цсс/i.test(t)) {
        return { text:
          "💻 На каком языке? Могу на:\n\n" +
          "• Python 🐍\n" +
          "• JavaScript ✨\n" +
          "• HTML 🌐\n" +
          "• CSS 🎨\n" +
          "• C++, Java, C#\n" +
          "• Pascal, Lua, Go, Rust\n\n" +
          "Напиши: «код на Python», «html», «css»..."
        };
      }
      return null;
    }

    const task = this.detectTask(t);
    const langTemplates = this.templates[lang] || this.templates.python;
    const code = langTemplates[task] || langTemplates.default;

    // Специальные заголовки
    let header = `💻 Код на ${lang.toUpperCase()}:`;
    if (task === "calc_full" || task === "calc") {
      header = `🧮 Калькулятор на ${lang.toUpperCase()}:`;
    } else if (task === "page") {
      header = `🌐 HTML-страница:`;
    } else if (task === "button") {
      header = `🎨 CSS-кнопка:`;
    }

    return {
      text: `${header}\n<pre>${this.escapeHtml(code)}</pre>`
    };
  }
};