// Голосовой ввод через Web Speech API (микрофон)
const VoiceInput = {
  recognition: null,
  isRecording: false,
  supported: false,
  lang: "ru-RU",

  init() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
      this.supported = false;
      const micBtn = document.getElementById("micBtn");
      if (micBtn) micBtn.classList.add("hidden");
      return;
    }

    this.supported = true;
    this.recognition = new SR();
    this.recognition.lang = this.lang;
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isRecording = true;
      this._updateUI();
    };

    this.recognition.onresult = (e) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }

      const input = document.getElementById("input");
      if (input) input.value = transcript;

      // Если финальный результат — отправляем
      if (e.results[e.results.length - 1].isFinal) {
        setTimeout(() => {
          if (transcript.trim()) {
            if (typeof handleSend === "function") {
              handleSend();
            } else {
              const sendBtn = document.getElementById("send");
              if (sendBtn) sendBtn.click();
            }
          }
        }, 300);
      }
    };

    this.recognition.onerror = (e) => {
      console.warn("Ошибка распознавания:", e.error);
      this.isRecording = false;
      this._updateUI();

      const input = document.getElementById("input");
      if (e.error === "not-allowed") {
        if (input) input.placeholder = "Разреши доступ к микрофону";
      } else if (e.error === "no-speech") {
        if (input) input.placeholder = "Не расслышала. Попробуй ещё раз";
      }
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      this._updateUI();
    };

    const micBtn = document.getElementById("micBtn");
    if (micBtn) {
      micBtn.addEventListener("click", () => this.toggle());
    }
  },

  toggle() {
    if (!this.supported) return;
    if (this.isRecording) this.stop();
    else this.start();
  },

  start() {
    if (!this.supported || this.isRecording) return;
    try {
      this.recognition.start();
    } catch (e) {
      console.warn("Не удалось запустить:", e);
    }
  },

  stop() {
    if (!this.supported || !this.isRecording) return;
    try {
      this.recognition.stop();
    } catch (e) {}
  },

  _updateUI() {
    const micBtn = document.getElementById("micBtn");
    const indicator = document.getElementById("recordingIndicator");

    if (micBtn) {
      micBtn.classList.toggle("recording", this.isRecording);
      micBtn.textContent = this.isRecording ? "⏹" : "🎤";
      micBtn.title = this.isRecording ? "Остановить" : "Голосовой ввод";
    }

    if (indicator) {
      indicator.classList.toggle("active", this.isRecording);
    }

    const statusLabel = document.getElementById("statusLabel");
    if (statusLabel) {
      statusLabel.textContent = this.isRecording ? "слушаю..." : "онлайн";
    }
  }
};