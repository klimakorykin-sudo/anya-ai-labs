// ============================================================
// MOOD-GRAPH.JS — График настроения (canvas)
// ============================================================

const MoodGraphModule = {

  // Цвета для настроений
  colors: {
    happy: "#4dff88",
    joy: "#4dff88",
    love: "#ff6ec7",
    okay: "#6ecfff",
    neutral: "#a0a0a0",
    tired: "#b3b3b3",
    sad: "#6ea8ff",
    anxious: "#ffb347",
    angry: "#ff3a3a"
  },

  moodToValue: {
    happy: 5,
    joy: 5,
    love: 5,
    okay: 4,
    neutral: 3,
    tired: 2,
    sad: 2,
    anxious: 2,
    angry: 1
  },

  moodEmoji: {
    happy: "😊",
    joy: "😊",
    love: "💖",
    okay: "🙂",
    neutral: "😐",
    tired: "😴",
    sad: "😢",
    anxious: "😰",
    angry: "😡"
  },

  // ============================================================
  // ПОЛУЧИТЬ ДАННЫЕ ЗА N ДНЕЙ
  // ============================================================
  async getMoodData(days) {
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.getFullYear() + "-" +
                  String(d.getMonth() + 1).padStart(2, "0") + "-" +
                  String(d.getDate()).padStart(2, "0");

      let mood = null;
      try {
        if (typeof MemoryDB !== "undefined") {
          mood = await MemoryDB.getMood(key);
        }
      } catch (e) {}

      data.push({
        date: key,
        shortDate: String(d.getDate()).padStart(2, "0") + "." + String(d.getMonth() + 1).padStart(2, "0"),
        mood: mood,
        value: mood ? (this.moodToValue[mood] || 3) : null
      });
    }

    return data;
  },

  // ============================================================
  // НАРИСОВАТЬ ГРАФИК
  // ============================================================
  drawGraph(data, title) {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 320;
    canvas.style.width = "100%";
    canvas.style.maxWidth = "600px";
    canvas.style.height = "auto";
    canvas.style.borderRadius = "12px";
    canvas.style.marginTop = "12px";
    canvas.style.background = "rgba(0,0,0,0.3)";
    canvas.style.display = "block";

    const ctx = canvas.getContext("2d");

    const padding = 50;
    const w = canvas.width - padding * 2;
    const h = canvas.height - padding * 2;
    const bottom = canvas.height - padding;

    // Фон
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Заголовок
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, 28);

    // Ось Y — уровни настроения
    const levels = [
      { val: 5, label: "😊", color: "#4dff88" },
      { val: 4, label: "🙂", color: "#6ecfff" },
      { val: 3, label: "😐", color: "#a0a0a0" },
      { val: 2, label: "😢", color: "#6ea8ff" },
      { val: 1, label: "😡", color: "#ff3a3a" }
    ];

    levels.forEach((level, idx) => {
      const y = padding + (idx / (levels.length - 1)) * h;
      // Линия
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();

      // Emoji слева
      ctx.font = "20px Arial";
      ctx.textAlign = "right";
      ctx.fillStyle = level.color;
      ctx.fillText(level.label, padding - 10, y + 7);
    });

    // Ось X — даты
    const stepX = w / Math.max(data.length - 1, 1);

    ctx.textAlign = "center";
    ctx.font = "11px Segoe UI, sans-serif";
    data.forEach((d, i) => {
      const x = padding + i * stepX;
      // Показываем каждую 2-ю дату если много точек
      if (data.length <= 10 || i % 2 === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText(d.shortDate, x, bottom + 18);
      }
    });

    // Точки и линия
    const points = [];
    data.forEach((d, i) => {
      if (d.value !== null) {
        const x = padding + i * stepX;
        const y = padding + ((5 - d.value) / 4) * h;
        points.push({ x, y, mood: d.mood, value: d.value });
      }
    });

    // Линия
    if (points.length > 1) {
      ctx.strokeStyle = "#ff6ec7";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else {
          // Плавная линия
          const prev = points[i - 1];
          const cpX = (prev.x + p.x) / 2;
          ctx.bezierCurveTo(cpX, prev.y, cpX, p.y, p.x, p.y);
        }
      });
      ctx.stroke();
    }

    // Точки
    points.forEach(p => {
      const color = this.colors[p.mood] || "#fff";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Emoji сверху
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(this.moodEmoji[p.mood] || "❓", p.x, p.y - 14);
    });

    // Если нет данных
    if (points.length === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "16px Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Нет данных о настроении", canvas.width / 2, canvas.height / 2);
      ctx.font = "13px Segoe UI, sans-serif";
      ctx.fillText("Отмечай настроение эмодзи — например 😊 или 😢", canvas.width / 2, canvas.height / 2 + 25);
    }

    return canvas;
  },

  // ============================================================
  // СТАТИСТИКА
  // ============================================================
  analyzeData(data) {
    const moods = data.filter(d => d.mood).map(d => d.mood);
    if (moods.length === 0) return null;

    const counts = {};
    moods.forEach(m => counts[m] = (counts[m] || 0) + 1);

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top = sorted[0];

    const avg = moods.reduce((sum, m) => sum + (this.moodToValue[m] || 3), 0) / moods.length;

    return {
      total: moods.length,
      topMood: top[0],
      topCount: top[1],
      average: avg.toFixed(1),
      counts: counts
    };
  },

  // ============================================================
  // ГЛАВНАЯ ФУНКЦИЯ
  // ============================================================
  async handle(text) {
    const t = text.toLowerCase().trim();

    if (!/(график.*настроени|настроени.*график|покажи.*график|диаграмм.*настроени|статистик.*настроени.*график)/.test(t)) {
      return null;
    }

    // Определяем период
    let days = 7;
    let periodName = "за неделю";
    if (/месяц|30\s*дн/.test(t)) { days = 30; periodName = "за месяц"; }
    else if (/год|365\s*дн/.test(t)) { days = 365; periodName = "за год"; }
    else if (/две недел|14\s*дн/.test(t)) { days = 14; periodName = "за 2 недели"; }

    const data = await this.getMoodData(days);
    const stats = this.analyzeData(data);

    // Создаём сообщение с canvas
    const canvas = this.drawGraph(data, "📊 Настроение " + periodName);

    // Возвращаем как объект для core.js
    return {
      text: this.formatStats(stats, periodName),
      graphCanvas: canvas
    };
  },

  formatStats(stats, periodName) {
    let out = "📊 ГРАФИК НАСТРОЕНИЯ " + periodName.toUpperCase() + "\n\n";

    if (!stats) {
      return out + "Пока нет данных.\n\nОтправь эмодзи 😊 или 😢 — я запишу настроение. Через несколько дней появится график!";
    }

    out += "📈 Записей: " + stats.total + "\n";
    out += "💫 Среднее настроение: " + stats.average + " / 5\n";
    out += "🏆 Чаще всего: " + (this.moodEmoji[stats.topMood] || "❓") + " (" + stats.topCount + " раз)\n\n";

    if (stats.average >= 4) {
      out += "✨ Отличное настроение! Продолжай в том же духе!";
    } else if (stats.average >= 3) {
      out += "🙂 Нормальное настроение. Всё ок!";
    } else if (stats.average >= 2) {
      out += "🫂 Настроение не очень. Если что-то беспокоит — я рядом.";
    } else {
      out += "💙 Ты часто грустишь. Расскажи, что случилось? Напиши «поговори со мной».";
    }

    return out;
  }
};
