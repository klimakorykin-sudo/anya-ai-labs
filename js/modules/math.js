const MathModule = {

  handle(text) {
    const t = text.toLowerCase();

    // Линейное уравнение: ax+b=c
    const eq = text.match(/([-\d]*)x\s*([+\-]\s*\d+)?\s*=\s*([-\d]+)/);
    if (eq && /(уравнени|реши)/.test(t)) {
      try {
        const a = eq[1] === "" || eq[1] === "+" ? 1 : eq[1] === "-" ? -1 : parseFloat(eq[1]);
        const b = eq[2] ? parseFloat(eq[2].replace(/\s/g, "")) : 0;
        const c = parseFloat(eq[3]);
        if (a === 0) return { text: "❌ a не может быть 0 в линейном уравнении" };
        const x = (c - b) / a;
        return { text:
          `✏️ Уравнение: ${a}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)} = ${c}\n\n` +
          `Шаги:\n` +
          `1. ${a}x = ${c} ${b >= 0 ? "- " + b : "+ " + Math.abs(b)}\n` +
          `2. ${a}x = ${c - b}\n` +
          `3. x = ${c - b} / ${a}\n\n` +
          `✅ x = ${x}`
        };
      } catch (e) {}
    }

    // Площадь круга
    const circle = text.match(/круг.*r\s*=?\s*(\d+(?:[.,]\d+)?)|радиус\s*=?\s*(\d+(?:[.,]\d+)?)/);
    if (circle && /площад/.test(t)) {
      const r = parseFloat((circle[1] || circle[2]).replace(",", "."));
      const s = Math.PI * r * r;
      return { text: `📐 Площадь круга с r=${r}:\nS = π × r² = π × ${r * r} ≈ ${s.toFixed(2)}` };
    }

    // Длина окружности
    if (circle && /длин.*окружност/.test(t)) {
      const r = parseFloat((circle[1] || circle[2]).replace(",", "."));
      const c = 2 * Math.PI * r;
      return { text: `📐 Длина окружности с r=${r}:\nC = 2 × π × r ≈ ${c.toFixed(2)}` };
    }

    // Площадь прямоугольника
    const rect = text.match(/(\d+(?:[.,]\d+)?)\s*[x×*на]\s*(\d+(?:[.,]\d+)?)/);
    if (rect && /(площад.*прямоуг|прямоуг.*площад)/.test(t)) {
      const a = parseFloat(rect[1].replace(",", "."));
      const b = parseFloat(rect[2].replace(",", "."));
      return { text: `📐 Площадь прямоугольника ${a}×${b} = ${(a * b).toFixed(2)}` };
    }

    // Простой пример
    if (/(посчитай|сколько будет|вычисли|реши)/.test(t)) {
      const expr = text.match(/[\d\s+\-*/().,]+/);
      if (expr) {
        try {
          const clean = expr[0].replace(/,/g, ".").replace(/[^0-9+\-*/().\s]/g, "");
          if (clean.replace(/\s/g, "").length < 2) return null;
          const r = Function(`"use strict"; return (${clean})`)();
          if (typeof r === "number" && isFinite(r)) {
            return { text: `🧮 ${clean.trim()} = ${r}` };
          }
        } catch (e) {}
      }
    }

    // Таблица умножения
    const multMatch = t.match(/таблиц[ауы].*умнож|умнож.*(\d+)/);
    if (multMatch && /таблиц/.test(t)) {
      const n = parseInt(multMatch[1]) || 5;
      let out = `🧮 Таблица умножения на ${n}:\n\n`;
      for (let i = 1; i <= 10; i++) {
        out += `${n} × ${i} = ${n * i}\n`;
      }
      return { text: out };
    }

    // Проценты
    const pct = text.match(/(\d+(?:[.,]\d+)?)\s*%\s*от\s*(\d+(?:[.,]\d+)?)/);
    if (pct) {
      const p = parseFloat(pct[1].replace(",", "."));
      const n = parseFloat(pct[2].replace(",", "."));
      return { text: `🧮 ${p}% от ${n} = ${(p * n / 100).toFixed(2)}` };
    }

    return null;
  }
};