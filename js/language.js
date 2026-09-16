// Определяет язык, кракозябры, эмодзи, спецсимволы
function analyzeText(text) {
  if (!text || typeof text !== "string") {
    return {
      hasCyr: false, hasLat: false, hasEmoji: false,
      hasCJK: false, hasArabic: false, hasDevanagari: false,
      hasGarbage: false, lower: "", length: 0
    };
  }

  const hasCyr = /[а-яё]/i.test(text);
  const hasLat = /[a-z]/i.test(text);
  const hasEmoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u.test(text);
  const hasCJK = /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(text);
  const hasArabic = /[\u0600-\u06ff]/.test(text);
  const hasDevanagari = /[\u0900-\u097f]/.test(text);

  // Мусор = что-то, что не буквы/цифры/пунктуация/эмодзи/CJK/арабский
  const hasGarbage = /[^\w\sа-яё.,!?;:()\-«»"'@#$%^&*+=/\\|<>~`{}[\]\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{4e00}-\u{9fff}\u{3040}-\u{30ff}\u{ac00}-\ud7af}\u{0600}-\u{06ff}\u{0900}-\u{097f}]/iu.test(text);

  return {
    hasCyr,
    hasLat,
    hasEmoji,
    hasCJK,
    hasArabic,
    hasDevanagari,
    hasGarbage,
    lower: text.toLowerCase().trim(),
    length: text.length,
    original: text
  };
}

// Нечёткое сравнение слов (расстояние Левенштейна)
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}

// Проверка: похоже ли слово на эталон (с опечатками)
function fuzzyMatch(word, target, maxDist = 1) {
  word = word.toLowerCase();
  target = target.toLowerCase();
  if (Math.abs(word.length - target.length) > maxDist) return false;
  return levenshtein(word, target) <= maxDist;
}

// Есть ли в тексте хотя бы одно слово из списка (с опечатками)
function containsAny(text, words, maxDist = 1) {
  const t = text.toLowerCase();
  const tokens = t.split(/\s+/);
  return words.some(w => {
    const wl = w.toLowerCase();
    if (t.includes(wl)) return true;
    return tokens.some(tok => fuzzyMatch(tok, wl, maxDist));
  });
}