// Определение эмоции текста
const EMOTION_WORDS = {
  joy: [
    "рад", "счаст", "ура", "круто", "супер", "happy", "отлично",
    "класс", "люблю", "улыб", "кайф", "здорово", "восторг",
    "весел", "прикольн", "обожаю", "хорошо", "прекрасно"
  ],
  sadness: [
    "грусть", "плохо", "печаль", "sad", "устал", "тяжело", "больно",
    "одиноко", "плак", "тоск", "расстроен", "тоска", "депрес",
    "не хочу", "скучно", "хренов", "тошно", "потерял"
  ],
  anger: [
    "зл", "бесит", "ненавиж", "ярост", "angry", "раздраж",
    "достал", "надоел", "взбешен", "ярость", "гнев", "ругаюсь"
  ],
  fear: [
    "боюсь", "страшно", "тревог", "паник", "fear", "ужас",
    "нервнич", "волнуюсь", "переживаю", "опасно", "жутко"
  ],
  love: [
    "люблю", "влюб", "нравится", "симпати", "сердце",
    "обожаю", "дорог", "близк"
  ]
};

function detectEmotion(text) {
  if (!text) return "neutral";
  const t = text.toLowerCase();

  // Веса: сначала проверяем яркие триггеры
  const scores = { joy: 0, sadness: 0, anger: 0, fear: 0, love: 0 };

  for (const [emo, words] of Object.entries(EMOTION_WORDS)) {
    for (const w of words) {
      if (t.includes(w)) scores[emo] += 1;
    }
  }

  // Ищем максимальный счёт
  let best = "neutral", bestScore = 0;
  for (const [emo, score] of Object.entries(scores)) {
    if (score > bestScore) {
      best = emo;
      bestScore = score;
    }
  }

  return bestScore > 0 ? best : "neutral";
}

// Эмодзи-индикатор для настроения
function emotionEmoji(emotion) {
  return {
    joy: "😊",
    sadness: "😢",
    anger: "😠",
    fear: "😰",
    love: "💖",
    neutral: "🙂"
  }[emotion] || "🙂";
}

// Сила эмоции (для определения кризиса)
function emotionIntensity(text) {
  if (!text) return 0;
  const t = text.toLowerCase();
  let intensity = 0;
  if (/очень|ужасно|сильно|жутко|кошмар|невозможно|совсем/.test(t)) intensity += 2;
  if (/!!+|!!!+/.test(text)) intensity += 1;
  if (text.length > 200) intensity += 1;
  return intensity;
}