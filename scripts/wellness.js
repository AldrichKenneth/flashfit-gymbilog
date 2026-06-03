// ─── Constants ────────────────────────────────────────────────────────────────
const STATE_KEY = 'flashfit_state';
const EYE_KEY   = 'flashfit_eye_reset';
const DECK_COLORS = { blue: '#4D9FFF', green: '#23D18B', pink: '#FF4D8B' };

const CAT_META = {
  'Movement':   { icon: 'ti-run',         cls: 'movement',   bg: 'rgba(77,159,255,0.12)',  color: '#4D9FFF' },
  'Breathing':  { icon: 'ti-wind',        cls: 'breathing',  bg: 'rgba(35,209,139,0.12)', color: '#23D18B' },
  'Eye Relief': { icon: 'ti-eye',         cls: 'eye-relief', bg: 'rgba(77,196,255,0.12)', color: '#4DC8FF' },
  'Stretching': { icon: 'ti-accessibility', cls: 'stretching', bg: 'rgba(255,77,139,0.12)', color: '#FF4D8B' },
};

const MOOD_META = [
  null,
  { emoji: '😔', label: 'Rough',  color: '#FF4D8B' },
  { emoji: '😕', label: 'Low',    color: '#FF8B4D' },
  { emoji: '😊', label: 'Okay',   color: '#4D9FFF' },
  { emoji: '😄', label: 'Good',   color: '#23D18B' },
  { emoji: '🤩', label: 'Great!', color: '#23D18B' },
];

// ─── State ────────────────────────────────────────────────────────────────────
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STATE_KEY)) || {};
    if (s.hearts        === undefined) s.hearts        = 3;
    if (!s.decks)                      s.decks         = [];
    if (s.sessionsDone  === undefined) s.sessionsDone  = 0;
    if (s.exercisesDone === undefined) s.exercisesDone = 0;
    if (s.streak        === undefined) s.streak        = 0;
    s.mood = (s.mood !== undefined) ? s.mood : null;
    s.decks.forEach(d => { if (!d.cardData) d.cardData = []; });
    return s;
  } catch {
    return { hearts: 3, decks: [], sessionsDone: 0, exercisesDone: 0, streak: 0, mood: null };
  }
}
function saveState() { localStorage.setItem(STATE_KEY, JSON.stringify(state)); }
let state = loadState();

// ─── Date Helpers ─────────────────────────────────────────────────────────────
function dayLabel(offset) {
  const d = new Date();
  d.setDate(d.getDate() - (offset || 0));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function dayOfWeek(offset) {
  const d = new Date();
  d.setDate(d.getDate() - (offset || 0));
  return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
}
function fmt(s) {
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Seed Sample Data (one-time if no history exists) ─────────────────────────
function ensureWellnessData() {
  let changed = false;

  // Focus log: minutes focused per date
  if (!state.focusLog) {
    state.focusLog = {};
    const seed = [50, 0, 75, 25, 100, 25, state.sessionsDone * (state.pomoSettings ? state.pomoSettings.focus : 25)];
    for (let i = 6; i >= 0; i--) {
      const mins = seed[6 - i];
      if (mins > 0) state.focusLog[dayLabel(i)] = mins;
    }
    changed = true;
  }
  // Ensure today's session count is reflected
  if (state.sessionsDone > 0) {
    const focus  = (state.pomoSettings || {}).focus || 25;
    const stored = state.focusLog[dayLabel(0)] || 0;
    const computed = state.sessionsDone * focus;
    if (computed > stored) {
      state.focusLog[dayLabel(0)] = computed;
      changed = true;
    }
  }

  // Mood log: mood level per date
  if (!state.moodLog) {
    state.moodLog = {};
    const seed = [3, 4, 4, 5, null, 3, null];
    for (let i = 6; i >= 1; i--) {
      const m = seed[6 - i];
      if (m !== null) state.moodLog[dayLabel(i)] = m;
    }
    changed = true;
  }
  // Sync today's mood from state.mood
  if (state.mood !== null && state.mood !== undefined) {
    state.moodLog[dayLabel(0)] = state.mood;
    changed = true;
  }

  // Session log: history of study sessions
  if (!state.sessionLog) {
    state.sessionLog = [];
    const decks = state.decks;
    if (decks.length >= 1) state.sessionLog.push({ date: dayLabel(0), deckName: decks[0].name, icon: decks[0].icon, color: decks[0].color, correct: 8, again: 2 });
    if (decks.length >= 2) state.sessionLog.push({ date: dayLabel(1), deckName: decks[1].name, icon: decks[1].icon, color: decks[1].color, correct: 6, again: 4 });
    if (decks.length >= 1) state.sessionLog.push({ date: dayLabel(2), deckName: decks[0].name, icon: decks[0].icon, color: decks[0].color, correct: 10, again: 2 });
    if (decks.length >= 2) state.sessionLog.push({ date: dayLabel(4), deckName: decks[1].name, icon: decks[1].icon, color: decks[1].color, correct: 5,  again: 1 });
    if (decks.length >= 1) state.sessionLog.push({ date: dayLabel(6), deckName: decks[0].name, icon: decks[0].icon, color: decks[0].color, correct: 7,  again: 3 });
    changed = true;
  }

  // Exercise log: history of completed exercises
  if (!state.exerciseLog) {
    state.exerciseLog = [
      { date: dayLabel(0), name: 'Box Breathing',        category: 'Breathing'  },
      { date: dayLabel(0), name: 'Desk Push-Ups',        category: 'Movement'   },
      { date: dayLabel(1), name: '20-20-20 Eye Break',   category: 'Eye Relief' },
      { date: dayLabel(1), name: 'Neck Side Stretch',    category: 'Stretching' },
      { date: dayLabel(2), name: '4-7-8 Breathing',      category: 'Breathing'  },
      { date: dayLabel(2), name: 'Calf Raises',          category: 'Movement'   },
      { date: dayLabel(3), name: 'Palm Your Eyes',       category: 'Eye Relief' },
      { date: dayLabel(4), name: 'Chest Opener',         category: 'Stretching' },
    ];
    changed = true;
  }

  if (changed) saveState();
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
function renderStats() {
  document.getElementById('wStatStreak').textContent    = `${state.streak} day${state.streak !== 1 ? 's' : ''}`;
  document.getElementById('wStatSessions').textContent  = state.sessionsDone;
  document.getElementById('wStatExercises').textContent = state.exercisesDone;

  const mood = state.mood;
  if (mood && MOOD_META[mood]) {
    const m = MOOD_META[mood];
    document.getElementById('wStatMoodEmoji').textContent  = m.emoji;
    document.getElementById('wStatMoodLabel').textContent  = m.label;
    document.getElementById('wStatMoodLabel').style.color  = m.color;
  } else {
    document.getElementById('wStatMoodEmoji').textContent  = '—';
    document.getElementById('wStatMoodLabel').textContent  = 'Not set';
    document.getElementById('wStatMoodLabel').style.color  = 'var(--text-muted)';
  }

  // Streak dots — show last 7 days
  const dotsEl = document.getElementById('streakDots');
  if (dotsEl) {
    dotsEl.innerHTML = '';
    for (let i = 6; i >= 0; i--) {
      const dot = document.createElement('div');
      dot.className = 'w-streak-dot ' + (i < state.streak ? 'w-streak-dot--on' : 'w-streak-dot--off');
      dotsEl.appendChild(dot);
    }
  }

  // Mood buttons
  document.querySelectorAll('.w-mood-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.mood) === state.mood);
    btn.addEventListener('click', () => {
      state.mood = parseInt(btn.dataset.mood);
      if (!state.moodLog) state.moodLog = {};
      state.moodLog[dayLabel(0)] = state.mood;
      saveState();
      renderStats();
      renderMoodChart();
    });
  });
}

// ─── Focus Bar Chart ──────────────────────────────────────────────────────────
function renderFocusChart() {
  const el = document.getElementById('focusChart');
  if (!el) return;

  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push({
      label:   dayOfWeek(i),
      date:    dayLabel(i),
      isToday: i === 0,
      minutes: state.focusLog[dayLabel(i)] || 0,
    });
  }

  const maxMins = Math.max(...days.map(d => d.minutes), 1);
  const MAX_H   = 90; // max bar height in px

  // Update total label
  const totalMins = days.reduce((s, d) => s + d.minutes, 0);
  const totalEl = document.getElementById('focusTotal');
  if (totalEl) totalEl.textContent = totalMins + ' min this week';

  el.innerHTML = '';
  days.forEach(day => {
    const h = day.minutes > 0
      ? Math.max(Math.round((day.minutes / maxMins) * MAX_H), 5)
      : 3;
    const barCls = day.minutes === 0
      ? 'bar-chart__bar bar-chart__bar--zero'
      : day.isToday
        ? 'bar-chart__bar bar-chart__bar--today'
        : 'bar-chart__bar bar-chart__bar--filled';

    const item = document.createElement('div');
    item.className = 'bar-chart__item';
    item.innerHTML = `
      <span class="bar-chart__value">${day.minutes > 0 ? day.minutes + 'm' : ''}</span>
      <div class="${barCls}" style="height:${h}px;"></div>
      <span class="bar-chart__label ${day.isToday ? 'bar-chart__label--today' : ''}">${day.label}</span>
    `;
    el.appendChild(item);
  });
}

// ─── Mood Trend SVG ───────────────────────────────────────────────────────────
function renderMoodChart() {
  const container = document.getElementById('moodChartWrap');
  if (!container) return;

  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push({
      label:   dayOfWeek(i),
      date:    dayLabel(i),
      isToday: i === 0,
      mood:    state.moodLog ? (state.moodLog[dayLabel(i)] || null) : null,
    });
  }

  const W = 380, H = 110;
  const padL = 8, padR = 8, padT = 14, padB = 22;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const xOf = i  => padL + (i / 6) * innerW;
  const yOf = m  => padT + innerH - ((m - 1) / 4) * innerH;

  const validPts = days
    .map((d, i) => ({ ...d, i }))
    .filter(d => d.mood !== null);

  let linePath = '';
  let areaPath = '';
  if (validPts.length >= 2) {
    linePath = validPts
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'}${xOf(p.i).toFixed(1)},${yOf(p.mood).toFixed(1)}`)
      .join(' ');
    const first = validPts[0];
    const last  = validPts[validPts.length - 1];
    areaPath = `${linePath} L${xOf(last.i).toFixed(1)},${(padT + innerH).toFixed(1)} L${xOf(first.i).toFixed(1)},${(padT + innerH).toFixed(1)} Z`;
  } else if (validPts.length === 1) {
    const p = validPts[0];
    linePath = `M${xOf(p.i).toFixed(1)},${yOf(p.mood).toFixed(1)}`;
  }

  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  <defs>
    <linearGradient id="moodAreaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#23D18B" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#23D18B" stop-opacity="0"/>
    </linearGradient>
  </defs>`;

  // Subtle horizontal gridlines at each mood level
  for (let m = 1; m <= 5; m++) {
    const y = yOf(m).toFixed(1);
    svg += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="rgba(255,255,255,0.045)" stroke-width="1"/>`;
  }

  // Filled area
  if (areaPath) {
    svg += `<path d="${areaPath}" fill="url(#moodAreaGrad)"/>`;
  }

  // Line
  if (linePath && validPts.length >= 2) {
    svg += `<path d="${linePath}" fill="none" stroke="#23D18B" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>`;
  }

  // Dots + day labels
  days.forEach((day, i) => {
    const x = xOf(i).toFixed(1);
    const yLabel = (H - 5).toFixed(1);
    const labelCls = day.isToday ? '#4D9FFF' : 'rgba(168,180,200,0.55)';

    svg += `<text x="${x}" y="${yLabel}" text-anchor="middle" fill="${labelCls}" font-size="8.5" font-family="'Plus Jakarta Sans',sans-serif" font-weight="${day.isToday ? '700' : '500'}">${day.label}</text>`;

    if (day.mood !== null) {
      const y = yOf(day.mood).toFixed(1);
      if (day.isToday) {
        // Today: filled dot with glow ring
        svg += `<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="#23D18B" stroke-width="1" opacity="0.3"/>`;
        svg += `<circle cx="${x}" cy="${y}" r="4.5" fill="#23D18B"/>`;
        svg += `<circle cx="${x}" cy="${y}" r="4.5" fill="none" stroke="#23D18B" stroke-width="1.5"/>`;
      } else {
        // Past days: outlined dot
        svg += `<circle cx="${x}" cy="${y}" r="3" fill="var(--bg-deep,#080A0E)" stroke="#23D18B" stroke-width="1.8"/>`;
      }
      // Mini mood value label above dot
      if (i > 0 && i < 6) { // don't crowd edges
        svg += `<text x="${x}" y="${(yOf(day.mood) - 8).toFixed(1)}" text-anchor="middle" fill="rgba(35,209,139,0.55)" font-size="8" font-family="'Plus Jakarta Sans',sans-serif">${day.mood}</text>`;
      }
    } else {
      // No entry: small open placeholder dot
      const yMid = (padT + innerH / 2).toFixed(1);
      svg += `<circle cx="${x}" cy="${yMid}" r="2" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
    }
  });

  svg += `</svg>`;
  container.innerHTML = svg;
}

// ─── Session History ──────────────────────────────────────────────────────────
function renderSessionHistory() {
  const el = document.getElementById('sessionList');
  if (!el) return;

  const sessions = state.sessionLog || [];
  if (!sessions.length) {
    el.innerHTML = `<div class="wcard__empty"><i class="ti ti-books"></i>No sessions yet.<br>Start studying to see your history here.</div>`;
    return;
  }

  el.innerHTML = '';
  sessions.slice(0, 8).forEach(s => {
    const total    = (s.correct || 0) + (s.again || 0);
    const acc      = total > 0 ? Math.round((s.correct || 0) / total * 100) : 0;
    const color    = DECK_COLORS[s.color] || DECK_COLORS.blue;
    const accColor = acc >= 75
      ? 'var(--accent-green)'
      : acc >= 45
        ? 'var(--accent-blue)'
        : 'var(--accent-pink)';

    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <div class="history-item__deckicon" style="background:${color}1A; border:1px solid ${color}30;">${escHtml(s.icon || '📚')}</div>
      <div class="history-item__info">
        <div class="history-item__name">${escHtml(s.deckName || 'Unknown deck')}</div>
        <div class="history-item__meta">${s.correct || 0} correct · ${s.again || 0} again · ${s.date}</div>
      </div>
      <div class="history-item__acc" style="color:${accColor}">${total > 0 ? acc + '%' : '—'}</div>
    `;
    el.appendChild(item);
  });
}

// ─── Exercise Log ─────────────────────────────────────────────────────────────
function renderExerciseLog() {
  const el = document.getElementById('exerciseList');
  if (!el) return;

  const exercises = state.exerciseLog || [];
  if (!exercises.length) {
    el.innerHTML = `<div class="wcard__empty"><i class="ti ti-run"></i>No exercises logged yet.<br>Complete a break exercise on the Study page.</div>`;
    return;
  }

  // Update total label
  const totalEl = document.getElementById('exerciseTotal');
  if (totalEl) totalEl.textContent = exercises.length + ' total';

  el.innerHTML = '';
  exercises.slice(0, 8).forEach(ex => {
    const cat     = CAT_META[ex.category] || CAT_META['Movement'];
    const badgeCls = ex.category ? ex.category.toLowerCase().replace(/\s+/g, '-') : 'movement';

    const item = document.createElement('div');
    item.className = 'log-item';
    item.innerHTML = `
      <div class="log-item__caticon" style="background:${cat.bg}; border:1px solid ${cat.color}30;">
        <i class="ti ${cat.icon}" style="color:${cat.color};"></i>
      </div>
      <div class="log-item__info">
        <div class="log-item__name">${escHtml(ex.name)}</div>
        <div class="log-item__date">${ex.date}</div>
      </div>
      <span class="log-item__badge badge--${badgeCls}">${escHtml(ex.category)}</span>
    `;
    el.appendChild(item);
  });
}

// ─── Hearts UI ────────────────────────────────────────────────────────────────
function updateHeartsUI() {
  const h = state.hearts;
  document.getElementById('heartsDisplay').textContent = `${h} heart${h !== 1 ? 's' : ''}`;
  const iconsEl = document.getElementById('popupHeartsIcons');
  if (iconsEl) {
    iconsEl.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const el = document.createElement('i');
      el.className = 'ti ti-heart';
      el.style.fontSize = '20px';
      el.style.color = i < h ? '#FF4D8B' : 'rgba(255,77,139,0.15)';
      iconsEl.appendChild(el);
    }
    document.getElementById('popupHeartsLabel').textContent = `${h} of 5 hearts remaining`;
  }
}

// ─── Eye Timer (persistent across pages) ─────────────────────────────────────
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
function updateEyeDisplay(t) {
  const d = document.getElementById('timerDisplay');
  const p = document.getElementById('popupTimerDisplay');
  if (d) d.textContent = t;
  if (p) p.textContent = t;
}
function showEyeToast() {
  document.getElementById('eyeToast').style.display = 'flex';
}

function updateSidebarWellness() {
  const s = document.getElementById('sidebarSessions');
  const e = document.getElementById('sidebarExercises');
  if (s) s.textContent = state.sessionsDone  || 0;
  if (e) e.textContent = state.exercisesDone || 0;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
  ensureWellnessData();
  updateHeartsUI();
  renderStats();
  renderFocusChart();
  renderMoodChart();
  renderSessionHistory();
  renderExerciseLog();
  initEyeTimer();
  updateSidebarWellness();
  const studyBtn = document.getElementById('wellnessStudyBtn');
  if (studyBtn) studyBtn.addEventListener('click', () => { window.location.href = 'study.html'; });
}

init();
