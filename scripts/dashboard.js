// ─── State ────────────────────────────────────────────────────────────────────
const STATE_KEY = 'flashfit_state';
const DECK_COLORS = { blue: '#4D9FFF', green: '#23D18B', pink: '#FF4D8B' };
const COLOR_CYCLE = ['blue', 'green', 'pink'];

function getDefaultState() {
  return {
    hearts: 3, streak: 4, cardsStudied: 248,
    sessionsDone: 2, exercisesDone: 3, mood: null,
    pomoSettings: { focus: 25, shortBreak: 5, longBreak: 15 },
    decks: [
      { id: 1, name: 'Math Finals',   icon: '∑',  cards: 3, progress: 40, color: 'green', lastStudied: 'Yesterday',  cardData: [
        { id: 101, question: 'What is the derivative of sin(x)?',   answer: 'cos(x)' },
        { id: 102, question: 'What is the integral of cos(x)?',     answer: 'sin(x) + C' },
        { id: 103, question: 'What is the Pythagorean theorem?',    answer: 'a² + b² = c²' }
      ]},
      { id: 2, name: 'History Notes', icon: '📖', cards: 3, progress: 55, color: 'pink',  lastStudied: '2 days ago', cardData: [
        { id: 201, question: 'In what year did World War II end?',  answer: '1945' },
        { id: 202, question: 'Who was the first US President?',     answer: 'George Washington' },
        { id: 203, question: 'What year did the Berlin Wall fall?', answer: '1989' }
      ]},
      { id: 3, name: 'Biology Ch. 3', icon: '🧪', cards: 0, progress: 0,  color: 'blue',  lastStudied: 'Never', cardData: [] }
    ]
  };
}

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STATE_KEY)) || getDefaultState();
    if (!s.pomoSettings) s.pomoSettings = { focus: 25, shortBreak: 5, longBreak: 15 };
    s.decks.forEach(d => { if (!d.cardData) d.cardData = []; });
    return s;
  } catch { return getDefaultState(); }
}
function saveState() { localStorage.setItem(STATE_KEY, JSON.stringify(state)); }

let state = loadState();

// ─── 20-20-20 Eye Timer (persistent across pages) ────────────────────────────
const EYE_KEY = 'flashfit_eye_reset';
let eyeSecs = 20 * 60, eyeInterval = null, eyePaused = false;

function initEyeTimer() {
  const stored = localStorage.getItem(EYE_KEY);
  const target = stored ? parseInt(stored) : Date.now() + 20 * 60 * 1000;
  if (!stored) localStorage.setItem(EYE_KEY, target);
  eyeSecs = Math.max(0, Math.round((target - Date.now()) / 1000));
  updateEyeDisplay(fmt(eyeSecs));

  function tick() {
    if (eyePaused) return;
    eyeSecs--;
    if (eyeSecs <= 0) {
      eyeSecs = 0; clearInterval(eyeInterval); eyeInterval = null;
      updateEyeDisplay('00:00'); showEyeToast(); return;
    }
    updateEyeDisplay(fmt(eyeSecs));
  }

  document.getElementById('toastDismiss').addEventListener('click', () => {
    document.getElementById('eyeToast').style.display = 'none';
    const newTarget = Date.now() + 20 * 60 * 1000;
    localStorage.setItem(EYE_KEY, newTarget);
    eyeSecs = 20 * 60; eyePaused = false;
    clearInterval(eyeInterval);
    eyeInterval = setInterval(tick, 1000);
    updateEyeDisplay(fmt(eyeSecs));
  });

  if (eyeSecs <= 0) { showEyeToast(); return; }
  eyeInterval = setInterval(tick, 1000);
}
function fmt(s) {
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}
function updateEyeDisplay(t) {
  document.getElementById('timerDisplay').textContent = t;
  document.getElementById('popupTimerDisplay').textContent = t;
}
function showEyeToast() { document.getElementById('eyeToast').style.display = 'flex'; }


// ─── Hearts UI ───────────────────────────────────────────────────────────────
function updateHeartsUI() {
  const h = state.hearts;
  document.getElementById('heartsDisplay').textContent = `${h} heart${h !== 1 ? 's' : ''}`;
  const iconsEl = document.getElementById('popupHeartsIcons');
  iconsEl.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const icon = document.createElement('i');
    icon.className      = 'ti ti-heart';
    icon.style.fontSize = '20px';
    icon.style.color    = i < h ? '#FF4D8B' : 'rgba(255,77,139,0.15)';
    iconsEl.appendChild(icon);
  }
  document.getElementById('popupHeartsLabel').textContent = `${h} of 5 hearts remaining`;
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function updateStats() {
  document.getElementById('statDecks').textContent      = state.decks.length;
  document.getElementById('statCards').textContent      = state.cardsStudied;
  document.getElementById('statStreak').textContent     = `${state.streak} days`;
  document.getElementById('sessionsDone').textContent   = state.sessionsDone;
  document.getElementById('exercisesDone').textContent  = state.exercisesDone;
}

// ─── Decks ────────────────────────────────────────────────────────────────────
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderDecks() {
  const grid   = document.getElementById('decksGrid');
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  const list   = state.decks.filter(d => d.name.toLowerCase().includes(search));

  grid.innerHTML = '';

  list.forEach(deck => {
    const color = DECK_COLORS[deck.color] || DECK_COLORS.blue;
    const card  = document.createElement('div');
    card.className = 'deck-card';
    card.style.setProperty('--deck-color', color);
    card.innerHTML = `
      <div class="deck-card__icon">${deck.icon}</div>
      <div class="deck-card__name">${escHtml(deck.name)}</div>
      <div class="deck-card__meta">${(deck.cardData || []).length} card${(deck.cardData||[]).length !== 1 ? 's' : ''} · ${deck.lastStudied}</div>
      <div class="deck-card__progress-header">
        <span>Progress</span>
        <span class="deck-card__progress-pct">${deck.progress}%</span>
      </div>
      <div class="deck-card__progress-bar">
        <div class="deck-card__progress-fill" style="width:${deck.progress}%;"></div>
      </div>
      <div class="deck-card__actions">
        <button class="deck-card__study-btn">Study Now</button>
        <button class="deck-card__delete-btn" data-id="${deck.id}" title="Delete deck">
          <i class="ti ti-trash"></i>
        </button>
      </div>`;

    card.querySelector('.deck-card__study-btn').addEventListener('click', e => {
      e.stopPropagation();
      localStorage.setItem('flashfit_selectedDeck', deck.id);
      window.location.href = 'study.html';
    });

    card.querySelector('.deck-card__delete-btn').addEventListener('click', e => {
      e.stopPropagation();
      state.decks = state.decks.filter(d => d.id !== deck.id);
      saveState();
      updateStats();
      renderDecks();
    });

    grid.appendChild(card);
  });

  const newCard = document.createElement('div');
  newCard.className = 'deck-card--new';
  newCard.innerHTML = `<div class="plus-circle"><i class="ti ti-plus"></i></div><span>New Deck</span>`;
  newCard.addEventListener('click', openModal);
  grid.appendChild(newCard);
}

document.getElementById('searchInput').addEventListener('input', renderDecks);

// ─── Mood ─────────────────────────────────────────────────────────────────────
function initMood() {
  document.querySelectorAll('.mood-btn').forEach(btn => {
    if (parseInt(btn.dataset.mood) === state.mood) btn.classList.add('active');
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mood = parseInt(btn.dataset.mood);
      saveState();
    });
  });
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function openModal() {
  document.getElementById('modalOverlay').style.display = 'flex';
  document.getElementById('deckNameInput').focus();
}
function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
  document.getElementById('deckNameInput').value = '';
  document.querySelectorAll('.icon-option').forEach((b,i) => b.classList.toggle('active', i === 0));
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target.id === 'modalOverlay') closeModal();
});
document.getElementById('modalConfirm').addEventListener('click', () => {
  const name = document.getElementById('deckNameInput').value.trim();
  if (!name) { document.getElementById('deckNameInput').focus(); return; }
  const iconEl = document.querySelector('.icon-option.active');
  const icon   = iconEl ? iconEl.dataset.icon : '📚';
  const color  = COLOR_CYCLE[state.decks.length % COLOR_CYCLE.length];
  state.decks.push({ id: Date.now(), name, icon, cards: 0, progress: 0, color, lastStudied: 'Never' });
  saveState(); renderDecks(); updateStats(); closeModal();
});
document.getElementById('deckNameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('modalConfirm').click();
});
document.querySelectorAll('.icon-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.icon-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});


// ─── Init ─────────────────────────────────────────────────────────────────────
function updateSidebarWellness() {
  const s = document.getElementById('sidebarSessions');
  const e = document.getElementById('sidebarExercises');
  if (s) s.textContent = state.sessionsDone  || 0;
  if (e) e.textContent = state.exercisesDone || 0;
}

function init() {
  updateHeartsUI();
  updateStats();
  renderDecks();
  initMood();
  initEyeTimer();
  updateSidebarWellness();

  const startBtn    = document.getElementById('startSessionBtn');
  const wellnessBtn = document.getElementById('wellnessCheckBtn');
  const aboutBtn    = document.getElementById('aboutBtn');
  if (startBtn)    startBtn.addEventListener('click',    () => { window.location.href = 'study.html'; });
  if (wellnessBtn) wellnessBtn.addEventListener('click', () => { window.location.href = 'wellness.html'; });
  if (aboutBtn)    aboutBtn.addEventListener('click',    () => { window.location.href = 'about.html'; });
}

init();