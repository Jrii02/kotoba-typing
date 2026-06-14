/**
 * KOTOBA TYPING - JAPANESE SPEED RUN
 * Vanilla JS Mobile-First Web Application
 */

// ==========================================
// FALLBACK DICTIONARIES (In case of CORS/offline load errors)
// ==========================================
const FALLBACK_VERBS = [
  { kanji: "食べる", kana: "たべる", arti: "makan" },
  { kanji: "飲む", kana: "のむ", arti: "minum" },
  { kanji: "行く", kana: "いく", arti: "pergi" },
  { kanji: "来る", kana: "くる", arti: "datang" },
  { kanji: "見る", kana: "みる", arti: "melihat" },
  { kanji: "話す", kana: "はなす", arti: "berbicara" },
  { kanji: "書く", kana: "かく", arti: "menulis" },
  { kanji: "読む", kana: "よむ", arti: "membaca" },
  { kanji: "聞く", kana: "きく", arti: "mendengar" },
  { kanji: "買う", kana: "かう", arti: "membeli" },
  { kanji: "する", kana: "する", arti: "melakukan" },
  { kanji: "ある", kana: "ある", arti: "ada (benda mati)" },
  { kanji: "いる", kana: "いる", arti: "ada (benda hidup)" },
  { kanji: "待つ", kana: "まつ", arti: "menunggu" },
  { kanji: "帰る", kana: "かえる", arti: "pulang" }
];

const FALLBACK_ADJECTIVES = [
  { kanji: "美味しい", kana: "おいしい", arti: "enak" },
  { kanji: "大きい", kana: "おおきい", arti: "besar" },
  { kanji: "小さい", kana: "ちいさい", arti: "kecil" },
  { kanji: "新しい", kana: "あたらしい", arti: "baru" },
  { kanji: "古い", kana: "ふるい", arti: "lama/tua" },
  { kanji: "良い", kana: "いい", arti: "baik/bagus" },
  { kanji: "悪い", kana: "わるい", arti: "buruk/jelek" },
  { kanji: "高い", kana: "たかい", arti: "tinggi/mahal" },
  { kanji: "安い", kana: "やすい", arti: "murah" },
  { kanji: "面白い", kana: "おもしろい", arti: "menarik/lucu" },
  { kanji: "難しい", kana: "むずかしい", arti: "sulit" },
  { kanji: "楽しい", kana: "たのしい", arti: "menyenangkan" }
];

const FALLBACK_NOUNS = [
  { kanji: "日本", kana: "にほん", arti: "Jepang" },
  { kanji: "先生", kana: "せんせい", arti: "guru" },
  { kanji: "学校", kana: "がっこう", arti: "sekolah" },
  { kanji: "友達", kana: "ともだち", arti: "teman" },
  { kanji: "水", kana: "みず", arti: "air" },
  { kanji: "本", kana: "ほん", arti: "buku" },
  { kanji: "車", kana: "くるま", arti: "mobil" },
  { kanji: "お金", kana: "おかね", arti: "uang" },
  { kanji: "時間", kana: "じかん", arti: "waktu" },
  { kanji: "人", kana: "ひと", arti: "orang" }
];

const FALLBACK_ADVERBS = [
  { kanji: "いつも", kana: "いつも", arti: "selalu" },
  { kanji: "とても", kana: "とても", arti: "sangat" },
  { kanji: "少し", kana: "すこし", arti: "sedikit" },
  { kanji: "また", kana: "また", arti: "lagi" },
  { kanji: "もっと", kana: "もっと", arti: "lebih" },
  { kanji: "ゆっくり", kana: "ゆっくり", arti: "perlahan-lahan" },
  { kanji: "早く", kana: "はやく", arti: "dengan cepat" }
];

// ==========================================
// WEB AUDIO SYNTHESIZER FOR SOUND EFFECTS
// ==========================================
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if it was suspended (autoplay policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle(forceState = null) {
    this.enabled = forceState !== null ? forceState : !this.enabled;
    return this.enabled;
  }

  playCorrect() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    // Arpeggio sound: C5 (523.25 Hz) then E5 (659.25 Hz)
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playWrong() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'triangle';
    // Deep buzzy dropping frequency
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.28);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  playTick() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playStart() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(261.63, now); // C4
    osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.35); // C5

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  playGameOver() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    
    // Sad arpeggio: G3 (196 Hz), Eb3 (155.56 Hz), C3 (130.81 Hz)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(196.00, now);
    osc.frequency.setValueAtTime(155.56, now + 0.15);
    osc.frequency.setValueAtTime(130.81, now + 0.3);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.start(now);
    osc.stop(now + 0.6);
  }
}

// Instantiate Sound System
const synth = new SoundSynth();

// ==========================================
// GAME STATE MANAGEMENT
// ==========================================
const state = {
  highScore: 0,
  score: 0,
  timeRemaining: 60,
  streak: 0,
  maxStreak: 0,
  correctCount: 0,
  wrongCount: 0,
  
  verbsList: [],
  adjectivesList: [],
  nounsList: [],
  adverbsList: [],
  activePool: [], // Currently selected words filter pool
  gameWords: [],  // Randomized list for current game run
  currentWord: null,
  
  mistakesList: [], // List of { word, typedAnswer }
  isRevengeMode: false,
  
  gameActive: false,
  timerInterval: null,
  
  // Vocabulary State
  currentVocabFilter: 'all',
  currentVocabQuery: '',
  
  // Mastery Profile for weighted SRS in gameplay
  masteryProfile: {} // { "たべる": 3, "おいしい": -2 }
};

// ==========================================
// DOM ELEMENT CACHE
// ==========================================
const DOM = {
  // Screens
  screenStart: document.getElementById('screen-start'),
  screenGame: document.getElementById('screen-game'),
  screenGameover: document.getElementById('screen-gameover'),
  
  // Header / Configs
  btnSoundToggle: document.getElementById('btn-sound-toggle'),
  soundOnIcon: document.getElementById('sound-on-icon'),
  soundOffIcon: document.getElementById('sound-off-icon'),
  labelHighScore: document.getElementById('label-high-score'),
  catKerja: document.getElementById('cat-kerja'),
  catSifat: document.getElementById('cat-sifat'),
  catBenda: document.getElementById('cat-benda'),
  catKeterangan: document.getElementById('cat-keterangan'),
  settingKanji: document.getElementById('setting-kanji'),
  btnStart: document.getElementById('btn-start'),
  
  // Gameplay HUD
  btnGameHome: document.getElementById('btn-game-home'),
  hudScore: document.getElementById('hud-score'),
  hudTimer: document.getElementById('hud-timer'),
  timerBarFill: document.getElementById('timer-bar-fill'),
  hudStreak: document.getElementById('hud-streak'),
  streakAnnouncer: document.getElementById('streak-announcer'),
  streakCount: document.getElementById('streak-count'),
  kanjiBonusFloat: document.getElementById('kanji-bonus-float'),
  
  // Word Card
  kanjiClue: document.getElementById('kanji-clue'),
  targetMeaning: document.getElementById('target-meaning'),
  feedbackOverlay: document.getElementById('feedback-overlay'),
  
  // Game Input Form
  gameInputForm: document.getElementById('game-input-form'),
  gameInput: document.getElementById('game-input'),
  
  // Gameplay Stats Footer
  statCorrectCount: document.getElementById('stat-correct-count'),
  statWrongCount: document.getElementById('stat-wrong-count'),
  
  // Game Over Results
  goScore: document.getElementById('go-score'),
  goStreak: document.getElementById('go-streak'),
  goAccuracy: document.getElementById('go-accuracy'),
  newHighscoreBadge: document.getElementById('new-highscore-badge'),
  btnRevenge: document.getElementById('btn-revenge'),
  btnRestart: document.getElementById('btn-restart'),
  btnHome: document.getElementById('btn-home'),
  
  // Mistakes Section
  mistakesSection: document.getElementById('mistakes-section'),
  mistakesTbody: document.getElementById('mistakes-tbody'),

  // Vocabulary Screen
  screenVocab: document.getElementById('screen-vocab'),
  btnOpenVocab: document.getElementById('btn-open-vocab'),
  btnVocabClose: document.getElementById('btn-vocab-close'),
  vocabSearch: document.getElementById('vocab-search'),
  vocabListItems: document.getElementById('vocab-list-items')
};

// ==========================================
// CSV PARSING & DATA INITIALIZATION
// ==========================================
async function loadDatabases() {
  const loadCSV = (url) => {
    return new Promise((resolve, reject) => {
      Papa.parse(url, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn(`PapaParse reported errors loading ${url}:`, results.errors);
          }
          resolve(results.data);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  };

  const normalizeCSVData = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    // Inspect keys of the first item
    const firstItem = data[0];
    const keys = Object.keys(firstItem);
    
    // Default key mappings based on indices
    let kanjiKey = keys[0];
    let kanaKey = keys[1];
    let artiKey = keys[2];
    
    // Inspect headers for keyword matching
    keys.forEach(key => {
      const kLower = key.toLowerCase().trim();
      if (kLower.includes('kanji') || kLower === 'a') {
        kanjiKey = key;
      } else if (kLower.includes('kana') || kLower.includes('baca') || kLower === 'b') {
        kanaKey = key;
      } else if (kLower.includes('arti') || kLower.includes('indo') || kLower === 'c') {
        artiKey = key;
      }
    });
    
    return data.map(item => {
      return {
        kanji: (item[kanjiKey] || '').trim(),
        kana: (item[kanaKey] || '').trim(),
        arti: (item[artiKey] || '').trim()
      };
    }).filter(item => item.kana && item.arti);
  };

  try {
    // Attempt parallel load of all databases
    const [verbs, adjectives, nouns, adverbs] = await Promise.all([
      loadCSV('data/kata_kerja.csv'),
      loadCSV('data/kata_sifat.csv'),
      loadCSV('data/kata_benda.csv'),
      loadCSV('data/kata_keterangan.csv')
    ]);
    
    state.verbsList = normalizeCSVData(verbs);
    state.adjectivesList = normalizeCSVData(adjectives);
    state.nounsList = normalizeCSVData(nouns);
    state.adverbsList = normalizeCSVData(adverbs);
    console.log(`Databases loaded! Verbs: ${state.verbsList.length}, Adjectives: ${state.adjectivesList.length}, Nouns: ${state.nounsList.length}, Adverbs: ${state.adverbsList.length}`);
  } catch (error) {
    console.error("Failed to load CSV files via Fetch. Switching to static fallback dictionaries.", error);
    state.verbsList = FALLBACK_VERBS;
    state.adjectivesList = FALLBACK_ADJECTIVES;
    state.nounsList = FALLBACK_NOUNS;
    state.adverbsList = FALLBACK_ADVERBS;
  }
}

// Shuffle elements using Fisher-Yates algorithm
function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ==========================================
// CORE GAME PLAY MECHANICS
// ==========================================

function initSession() {
  state.score = 0;
  state.timeRemaining = 60;
  state.streak = 0;
  state.maxStreak = 0;
  state.correctCount = 0;
  state.wrongCount = 0;
  
  // HUD updates
  DOM.hudScore.textContent = '0';
  DOM.hudTimer.textContent = '60';
  DOM.hudStreak.textContent = '0';
  DOM.statCorrectCount.textContent = '0';
  DOM.statWrongCount.textContent = '0';
  DOM.timerBarFill.style.width = '100%';
  DOM.timerBarFill.classList.remove('warning');
  DOM.hudTimer.parentElement.classList.remove('warning');
  
  // Clear any existing announcer
  DOM.streakAnnouncer.classList.add('hidden');
}

function startGame(revengeOnly = false) {
  initSession();
  
  if (revengeOnly) {
    // Revenge Mode: gameWords is populated only from the prior game's mistake list
    // Make sure we have a fresh copy and shuffle it
    state.gameWords = shuffleArray(state.mistakesList.map(m => m.word));
    state.isRevengeMode = true;
  } else {
    // Normal Mode: create active pool based on selected checkboxes
    state.activePool = [];
    if (DOM.catKerja.checked) {
      state.activePool = state.activePool.concat(state.verbsList);
    }
    if (DOM.catSifat.checked) {
      state.activePool = state.activePool.concat(state.adjectivesList);
    }
    if (DOM.catBenda.checked) {
      state.activePool = state.activePool.concat(state.nounsList);
    }
    if (DOM.catKeterangan.checked) {
      state.activePool = state.activePool.concat(state.adverbsList);
    }
    
    // Fallback safeguard in case no category is selected
    if (state.activePool.length === 0) {
      state.activePool = state.verbsList.concat(state.adjectivesList, state.nounsList, state.adverbsList);
    }
    
    // Load fresh mastery data from localStorage
    loadMastery();

    // Create weighted pool based on mastery
    let weightedPool = [];
    state.activePool.forEach(word => {
      const m = getWordMastery(word); // Ranges from -5 to 5
      const weight = Math.max(1, 6 - m); // Mastery 5 -> weight 1, Mastery -5 -> weight 11
      for (let i = 0; i < weight; i++) {
        weightedPool.push(word);
      }
    });

    state.gameWords = shuffleArray(weightedPool);
    state.mistakesList = [];
    state.isRevengeMode = false;
  }
  
  state.currentWordIndex = 0;
  state.gameActive = true;
  
  // Transition Screens
  switchScreen(DOM.screenGame);
  
  // Sound
  synth.playStart();
  
  // Set focus on input field (Critical for mobile)
  setTimeout(() => {
    DOM.gameInput.focus();
  }, 100);
  
  // Load first word
  nextWord();
  
  // Start Game Timer
  startTimer();
}

// ==========================================
// SPACED REPETITION SYSTEM (SRS) HELPERS
// ==========================================
function loadMastery() {
  const saved = localStorage.getItem('kotoba_mastery');
  if (saved !== null) {
    try {
      state.masteryProfile = JSON.parse(saved);
    } catch(e) {
      console.warn("Failed to parse mastery data. Resetting.", e);
      state.masteryProfile = {};
    }
  } else {
    state.masteryProfile = {};
  }
}

function saveMastery() {
  localStorage.setItem('kotoba_mastery', JSON.stringify(state.masteryProfile));
}

function getWordMastery(word) {
  const key = word.kana;
  if (state.masteryProfile[key] === undefined) {
    state.masteryProfile[key] = 0;
  }
  return state.masteryProfile[key];
}

function updateWordMastery(word, scoreChange) {
  const key = word.kana;
  const current = getWordMastery(word);
  let updated = current + scoreChange;
  updated = Math.max(-5, Math.min(5, updated));
  state.masteryProfile[key] = updated;
  saveMastery();
  return updated;
}

// ==========================================
// VOCABULARY GLOSSARY LOGIC
// ==========================================
function renderVocabList() {
  const filter = state.currentVocabFilter;
  const query = state.currentVocabQuery.toLowerCase().trim();
  DOM.vocabListItems.innerHTML = '';

  // Concatenate lists and mark their type
  const allWords = [
    ...state.verbsList.map(w => ({ ...w, type: 'kerja' })),
    ...state.adjectivesList.map(w => ({ ...w, type: 'sifat' })),
    ...state.nounsList.map(w => ({ ...w, type: 'benda' })),
    ...state.adverbsList.map(w => ({ ...w, type: 'keterangan' }))
  ];

  // Filter by type or mastery
  let filtered = allWords;
  if (filter === 'reviu') {
    filtered = filtered.filter(w => getWordMastery(w) < 0);
  } else if (filter !== 'all') {
    filtered = filtered.filter(w => w.type === filter);
  }

  // Filter by search query (Indonesian, Kanji, or Kana)
  if (query) {
    filtered = filtered.filter(w => 
      w.arti.toLowerCase().includes(query) ||
      w.kana.includes(query) ||
      (w.kanji && w.kanji.includes(query))
    );
  }

  if (filtered.length === 0) {
    DOM.vocabListItems.innerHTML = `
      <div class="vocab-item" style="justify-content: center; color: var(--text-muted); font-size: 0.82rem; padding: 24px; text-align: center; width: 100%;">
        Tidak ada kosakata yang cocok.
      </div>
    `;
    return;
  }

  filtered.forEach(word => {
    const mastery = getWordMastery(word);
    const isDifficult = mastery < 0;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = `vocab-item${isDifficult ? ' difficult' : ''}`;
    
    // Japanese container (Kanji + Kana)
    const jpContainer = document.createElement('div');
    jpContainer.className = 'vocab-item-jp';
    
    const kanjiSpan = document.createElement('span');
    kanjiSpan.className = 'vocab-kanji';
    kanjiSpan.textContent = word.kanji || word.kana;
    
    jpContainer.appendChild(kanjiSpan);
    
    // Only show reading in parentheses if word has Kanji
    if (word.kanji && word.kanji !== word.kana) {
      const kanaSpan = document.createElement('span');
      kanaSpan.className = 'vocab-kana';
      kanaSpan.textContent = `(${word.kana})`;
      jpContainer.appendChild(kanaSpan);
    }
    
    // Indonesian meaning + difficulty badge container
    const idContainer = document.createElement('div');
    idContainer.className = 'vocab-item-id-container';
    
    const idSpan = document.createElement('span');
    idSpan.className = 'vocab-item-id';
    idSpan.textContent = word.arti;
    idContainer.appendChild(idSpan);
    
    if (isDifficult) {
      const badge = document.createElement('span');
      badge.className = 'vocab-difficulty-badge';
      badge.textContent = '⚠️ Reviu';
      idContainer.appendChild(badge);
    }
    
    itemDiv.appendChild(jpContainer);
    itemDiv.appendChild(idContainer);
    
    DOM.vocabListItems.appendChild(itemDiv);
  });
}

function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  
  const tickTime = 100; // Tick every 100ms for smoother visual bar countdown
  let totalTicks = state.timeRemaining * 10;
  
  state.timerInterval = setInterval(() => {
    if (!state.gameActive) return;
    
    totalTicks--;
    state.timeRemaining = Math.max(0, totalTicks / 10);
    
    // Update textual countdown on whole seconds
    if (totalTicks % 10 === 0) {
      DOM.hudTimer.textContent = Math.ceil(state.timeRemaining);
      
      // Play alert tick sound on low time (<10s)
      if (state.timeRemaining <= 10 && state.timeRemaining > 0) {
        synth.playTick();
      }
    }
    
    // Progress Bar Fill Percentage
    const percentage = Math.min(100, (state.timeRemaining / 60) * 100);
    DOM.timerBarFill.style.width = `${percentage}%`;
    
    // Low time visual warnings
    if (state.timeRemaining <= 10) {
      DOM.timerBarFill.classList.add('warning');
      DOM.hudTimer.parentElement.classList.add('warning');
    } else {
      DOM.timerBarFill.classList.remove('warning');
      DOM.hudTimer.parentElement.classList.remove('warning');
    }
    
    if (totalTicks <= 0) {
      clearInterval(state.timerInterval);
      endGame();
    }
  }, tickTime);
}

function nextWord() {
  if (state.gameWords.length === 0) {
    // If pool is empty, refill by shuffling the active category pool with weights
    if (state.isRevengeMode) {
      // In revenge mode, restart the list of mistakes if they cleared it
      state.gameWords = shuffleArray(state.mistakesList.map(m => m.word));
      if (state.gameWords.length === 0) {
        // Handled: user successfully corrected all mistakes!
        endGame();
        return;
      }
    } else {
      let weightedPool = [];
      state.activePool.forEach(word => {
        const m = getWordMastery(word);
        const weight = Math.max(1, 6 - m);
        for (let i = 0; i < weight; i++) {
          weightedPool.push(word);
        }
      });
      state.gameWords = shuffleArray(weightedPool);
    }
    state.currentWordIndex = 0;
  }
  
  // Take next word
  state.currentWord = state.gameWords[state.currentWordIndex];
  state.currentWordIndex = (state.currentWordIndex + 1) % state.gameWords.length;
  
  // Get mastery level
  const mastery = getWordMastery(state.currentWord);
  
  // Render targets
  if (mastery < 0) {
    DOM.kanjiClue.classList.add('difficult');
    DOM.targetMeaning.innerHTML = `<span class="txt-danger" style="font-size: 0.8rem; display: block; margin-bottom: 4px; font-weight: 700; letter-spacing: 0.5px;">⚠️ REVIU (SULIT)</span>${state.currentWord.arti}`;
  } else {
    DOM.kanjiClue.classList.remove('difficult');
    DOM.targetMeaning.textContent = state.currentWord.arti;
  }
  
  // Show/Hide Kanji based on setting (Only if the word actually has distinct Kanji)
  const hasRealKanji = state.currentWord.kanji && state.currentWord.kanji !== state.currentWord.kana;
  if (DOM.settingKanji.checked && hasRealKanji) {
    DOM.kanjiClue.textContent = state.currentWord.kanji;
    DOM.kanjiClue.classList.remove('hidden');
  } else {
    DOM.kanjiClue.classList.add('hidden');
  }
  
  // Clear field
  DOM.gameInput.value = '';
}

function checkAnswer(answer) {
  if (!state.gameActive) return;
  
  const targetWord = state.currentWord;
  
  // Helper to generate all clean acceptable variations of a target string
  const getAcceptedVariations = (rawStr) => {
    if (!rawStr) return [];
    
    // Normalize slashes (support standard / and full-width ／)
    const normalized = rawStr.replace(/／/g, '/');
    const options = normalized.split('/');
    
    const variations = new Set();
    
    options.forEach(opt => {
      // 1. Strip all spaces (standard and Japanese full-width space \u3000)
      const cleanOpt = opt.replace(/[\s\u3000]+/g, '');
      if (!cleanOpt) return;
      
      // Variation A: Remove parentheses and their contents completely (e.g. 嫌（な） -> 嫌)
      const varA = cleanOpt.replace(/\([^)]*\)|（[^）]*）/g, '');
      if (varA) variations.add(varA);
      
      // Variation B: Remove only the parenthesis symbols, keeping contents (e.g. 嫌（な） -> 嫌na)
      const varB = cleanOpt.replace(/[()（）]/g, '');
      if (varB) variations.add(varB);
    });
    
    return Array.from(variations);
  };

  // Clean user's input (strip spaces)
  const cleanAnswer = answer.replace(/[\s\u3000]+/g, '');
  
  const allowedKanas = getAcceptedVariations(targetWord.kana);
  const allowedKanjis = getAcceptedVariations(targetWord.kanji);
  
  const isCorrectKana = allowedKanas.includes(cleanAnswer);
  const isCorrectKanji = allowedKanjis.includes(cleanAnswer);
  
  const isCorrect = isCorrectKana || isCorrectKanji;
  
  if (isCorrect) {
    // Update mastery: correct gives +1
    updateWordMastery(targetWord, 1);

    // Check if Kanji conversion bonus applies
    // Bonus applies if user successfully typed one of the allowed Kanji spellings,
    // and it is NOT identical to any of the accepted Kana readings.
    const usedKanji = isCorrectKanji && !isCorrectKana;
    
    // Set time bonus (+3s for Kanji conversion, +2s standard)
    const timeBonus = usedKanji ? 3 : 2;
    if (usedKanji) {
      triggerKanjiBonusAnnouncer();
    }

    // Update score metrics
    state.score++;
    state.correctCount++;
    state.streak++;
    if (state.streak > state.maxStreak) {
      state.maxStreak = state.streak;
    }
    
    // Add bonus time (capping visual timer progress at 60s max)
    state.timeRemaining = Math.min(60, state.timeRemaining + timeBonus);
    // Sync the timer ticks interval
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      startTimer();
    }
    
    // Sound & HUD
    synth.playCorrect();
    DOM.hudScore.textContent = state.score;
    DOM.hudStreak.textContent = state.streak;
    DOM.statCorrectCount.textContent = state.correctCount;
    
    // Streak animation fire triggers
    triggerStreakAnnouncer();
    
    // UI Correct Glow flash
    triggerFlashOverlay('correct');
    
  } else {
    // Update mastery: wrong penalizes with -2
    updateWordMastery(targetWord, -2);

    // Wrong Answer metrics
    state.wrongCount++;
    state.streak = 0;
    
    // Time Penalty: subtract 5 seconds
    state.timeRemaining = Math.max(0, state.timeRemaining - 5);
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      startTimer();
    }
    
    // Sound & HUD
    synth.playWrong();
    DOM.hudStreak.textContent = '0';
    DOM.statWrongCount.textContent = state.wrongCount;
    
    // Hide active streak overlay
    DOM.streakAnnouncer.classList.add('hidden');
    
    // Add to mistakes list if not already inside it
    const alreadyExists = state.mistakesList.some(m => m.word.kana === targetWord.kana);
    if (!alreadyExists) {
      state.mistakesList.push({
        word: targetWord,
        typedAnswer: answer || '[Kosong]'
      });
    }
    
    // Shake & red glow flash
    triggerFlashOverlay('wrong');
    triggerCardShake();
  }
  
  // Load next prompt
  nextWord();
}

function triggerKanjiBonusAnnouncer() {
  DOM.kanjiBonusFloat.classList.remove('hidden');
  
  // Force restart CSS animation
  DOM.kanjiBonusFloat.style.animation = 'none';
  void DOM.kanjiBonusFloat.offsetWidth; // layout reflow
  DOM.kanjiBonusFloat.style.animation = 'float-up-fade 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
  
  // Hide after animation finishes
  setTimeout(() => {
    DOM.kanjiBonusFloat.classList.add('hidden');
  }, 800);
}

// UI Animation triggers
function triggerFlashOverlay(type) {
  DOM.feedbackOverlay.className = `feedback-overlay ${type}`;
  setTimeout(() => {
    DOM.feedbackOverlay.className = 'feedback-overlay';
  }, 350);
}

function triggerCardShake() {
  const container = document.querySelector('.question-container');
  container.classList.add('shake');
  setTimeout(() => {
    container.classList.remove('shake');
  }, 350);
}

function triggerStreakAnnouncer() {
  if (state.streak >= 3) {
    DOM.streakCount.textContent = state.streak;
    DOM.streakAnnouncer.classList.remove('hidden');
    
    // Scale bump visual effect
    DOM.streakAnnouncer.style.animation = 'none';
    // Trigger layout reflow to restart animation
    void DOM.streakAnnouncer.offsetWidth;
    DOM.streakAnnouncer.style.animation = 'streak-pop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
  } else {
    DOM.streakAnnouncer.classList.add('hidden');
  }
}

// ==========================================
// GAME OVER & HIGHSCORE LOGIC
// ==========================================
function endGame() {
  state.gameActive = false;
  if (state.timerInterval) clearInterval(state.timerInterval);
  
  synth.playGameOver();
  
  // Calculate stats
  const totalAnswers = state.correctCount + state.wrongCount;
  const accuracy = totalAnswers > 0 ? Math.round((state.correctCount / totalAnswers) * 100) : 0;
  
  // Check High Score
  let isNewHighScore = false;
  // If we are in revenge mode, we do NOT overwrite the main highscore record
  if (!state.isRevengeMode) {
    if (state.score > state.highScore) {
      state.highScore = state.score;
      localStorage.setItem('kotoba_high_score', state.highScore);
      isNewHighScore = true;
    }
  }
  
  // Update Game Over UI values
  DOM.goScore.textContent = state.score;
  DOM.goStreak.textContent = state.maxStreak;
  DOM.goAccuracy.textContent = `${accuracy}%`;
  
  // High score UI decoration
  if (isNewHighScore) {
    DOM.newHighscoreBadge.classList.remove('hidden');
    updateHighScoreLabel();
    triggerConfetti();
  } else {
    DOM.newHighscoreBadge.classList.add('hidden');
  }
  
  // Render Mistake lists & revenge controls
  renderMistakesUI();
  
  // Transition screen
  switchScreen(DOM.screenGameover);
}

function renderMistakesUI() {
  DOM.mistakesTbody.innerHTML = '';
  
  if (state.mistakesList.length > 0) {
    DOM.mistakesSection.classList.remove('hidden');
    DOM.btnRevenge.classList.remove('hidden');
    
    state.mistakesList.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.word.kanji || '-'}</td>
        <td>${item.word.kana}</td>
        <td>${item.word.arti}</td>
      `;
      DOM.mistakesTbody.appendChild(row);
    });
  } else {
    DOM.mistakesSection.classList.add('hidden');
    DOM.btnRevenge.classList.add('hidden');
  }
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Confetti shoots from left and right sides
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }
}

// ==========================================
// UTILITIES & HELPER FUNCTIONS
// ==========================================

function switchScreen(targetScreen) {
  // Hide all screens
  DOM.screenStart.classList.remove('active');
  DOM.screenGame.classList.remove('active');
  DOM.screenGameover.classList.remove('active');
  DOM.screenVocab.classList.remove('active');
  
  // Show target
  targetScreen.classList.add('active');
}

function updateHighScoreLabel() {
  DOM.labelHighScore.textContent = state.highScore;
}

function loadHighScore() {
  const savedScore = localStorage.getItem('kotoba_high_score');
  if (savedScore !== null) {
    state.highScore = parseInt(savedScore, 10) || 0;
  }
  updateHighScoreLabel();
}

function loadSoundSettings() {
  const savedSetting = localStorage.getItem('kotoba_sound_enabled');
  if (savedSetting !== null) {
    const isEnabled = savedSetting === 'true';
    synth.toggle(isEnabled);
    updateSoundUI(isEnabled);
  }
}

function updateSoundUI(enabled) {
  if (enabled) {
    DOM.soundOnIcon.classList.remove('hidden');
    DOM.soundOffIcon.classList.add('hidden');
  } else {
    DOM.soundOnIcon.classList.add('hidden');
    DOM.soundOffIcon.classList.remove('hidden');
  }
}

// ==========================================
// BIND EVENT LISTENERS
// ==========================================
function bindEvents() {
  // Start button
  DOM.btnStart.addEventListener('click', () => {
    synth.init(); // Initialize audio context on user gesture
    startGame(false);
  });
  
  // Submit action inside Form
  DOM.gameInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const typed = DOM.gameInput.value.trim();
    checkAnswer(typed);
    DOM.gameInput.value = '';
    
    // Focus Lock: keep the input focused for continuous typing
    DOM.gameInput.focus();
  });
  
  // Keep focus on input card touch (Anti-Keyboard Drop trick)
  DOM.screenGame.addEventListener('touchend', (e) => {
    // If user interacts with sound button, home button or inside input wrapper buttons, let them do it
    if (e.target.closest('#btn-sound-toggle') || e.target.closest('#btn-game-home') || e.target.closest('.submit-btn')) {
      return;
    }
    
    // Refocus the input field
    e.preventDefault(); // Prevent double trigger
    DOM.gameInput.focus();
  });
  
  DOM.screenGame.addEventListener('click', (e) => {
    if (e.target.closest('#btn-sound-toggle') || e.target.closest('#btn-game-home') || e.target.closest('.submit-btn')) {
      return;
    }
    DOM.gameInput.focus();
  });
  
  // Game Home button (from active gameplay)
  DOM.btnGameHome.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm("Apakah Anda yakin ingin menghentikan permainan dan kembali ke menu utama?")) {
      state.gameActive = false;
      if (state.timerInterval) clearInterval(state.timerInterval);
      switchScreen(DOM.screenStart);
    }
  });
  
  // Revenge button ("Balas Dendam")
  DOM.btnRevenge.addEventListener('click', () => {
    startGame(true);
  });
  
  // Play again button
  DOM.btnRestart.addEventListener('click', () => {
    startGame(false);
  });
  
  // Home button
  DOM.btnHome.addEventListener('click', () => {
    switchScreen(DOM.screenStart);
  });
  
  // Sound toggle button
  DOM.btnSoundToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent refocusing input on menu screens
    synth.init();
    const currentlyEnabled = synth.toggle();
    localStorage.setItem('kotoba_sound_enabled', currentlyEnabled ? 'true' : 'false');
    updateSoundUI(currentlyEnabled);
  });

  // VOCABULARY SCREEN CONTROLS
  DOM.btnOpenVocab.addEventListener('click', (e) => {
    e.stopPropagation();
    state.currentVocabFilter = 'all';
    state.currentVocabQuery = '';
    DOM.vocabSearch.value = '';
    
    // Reset active states for filter pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
      if (pill.getAttribute('data-filter') === 'all') {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    switchScreen(DOM.screenVocab);
    renderVocabList();
  });

  DOM.btnVocabClose.addEventListener('click', (e) => {
    e.stopPropagation();
    switchScreen(DOM.screenStart);
  });

  DOM.vocabSearch.addEventListener('input', (e) => {
    state.currentVocabQuery = e.target.value;
    renderVocabList();
  });

  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      state.currentVocabFilter = pill.getAttribute('data-filter');
      renderVocabList();
    });
  });

  // Enable horizontal mouse wheel scroll on filter row for desktop users
  const filterRow = document.querySelector('.vocab-filter-row');
  if (filterRow) {
    filterRow.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        filterRow.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  }
}

// ==========================================
// INITIAL SETUP ON WINDOW LOAD
// ==========================================
window.addEventListener('DOMContentLoaded', async () => {
  // Load local database CSVs
  await loadDatabases();
  
  // Bind UI buttons
  bindEvents();
  
  // LocalStorage check
  loadHighScore();
  loadSoundSettings();
  loadMastery();
});
