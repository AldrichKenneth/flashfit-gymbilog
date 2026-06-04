// ─── Constants ────────────────────────────────────────────────────────────────
const STATE_KEY    = 'flashfit_state';
const EYE_KEY      = 'flashfit_eye_reset';
const RING_C       = 2 * Math.PI * 52;
const DECK_COLORS  = { blue: '#4D9FFF', green: '#23D18B', pink: '#FF4D8B' };

const EXERCISES = [
  { name: 'Desk Push-Ups', category: 'Movement',
    desc: 'Get the blood pumping without leaving your desk.',
    steps: ['Place hands on desk edge, shoulder-width apart', 'Lower chest toward desk, keeping back straight', 'Push back up to starting position', 'Do 10 reps, rest 15 seconds, then do one more set'] },
  { name: 'Calf Raises', category: 'Movement',
    desc: 'A quick leg reset you can do standing right where you are.',
    steps: ['Stand behind your chair, holding the back lightly', 'Rise up slowly onto your tiptoes', 'Hold for 2 seconds at the top', 'Lower slowly and repeat 20 times'] },
  { name: 'Shoulder Rolls', category: 'Movement',
    desc: 'Release the tension that builds from hunching over a screen.',
    steps: ['Sit or stand upright', 'Roll both shoulders forward in wide circles — 10 reps', 'Reverse direction — 10 reps backward', 'Shake your arms gently to finish'] },
  { name: 'Jumping Jacks', category: 'Movement',
    desc: 'A full-body reset to spike your heart rate fast.',
    steps: ['Stand in an open space near your desk', 'Jump feet out while raising arms overhead', 'Jump back to starting position', 'Do 15 to 20 reps at a steady rhythm'] },
  { name: 'Arm Circles', category: 'Movement',
    desc: 'Loosen up your shoulders and upper back quickly.',
    steps: ['Stand with arms extended straight out to your sides', 'Make small forward circles, gradually widening — 15 reps', 'Reverse direction for 15 more reps', 'Drop arms and shake out your wrists'] },
  { name: 'Standing March', category: 'Movement',
    desc: 'March in place to get circulation going without needing space.',
    steps: ['Stand up straight beside your desk', 'Alternate lifting each knee toward your chest', 'Swing opposite arms naturally as you march', 'Keep a brisk pace for 45 seconds'] },
  { name: 'Wall Sit', category: 'Movement',
    desc: 'A quiet, focused hold that fires up your legs.',
    steps: ['Slide your back down a wall until thighs are parallel to the floor', 'Keep feet flat and knees at 90 degrees', 'Hold and breathe steadily', 'Aim for 30 seconds and push to 45 if you can'] },
  { name: 'Hip Circles', category: 'Movement',
    desc: 'Undo the damage of sitting by opening up your hips.',
    steps: ['Stand with feet hip-width apart, hands on hips', 'Rotate hips in a wide circle — 8 times clockwise', 'Then 8 times counter-clockwise', 'Move slowly and breathe throughout'] },
  { name: 'Box Breathing', category: 'Breathing',
    desc: 'A Navy SEAL technique that calms the nervous system and sharpens focus.',
    steps: ['Breathe in slowly through your nose for 4 counts', 'Hold your breath for 4 counts', 'Breathe out slowly through your mouth for 4 counts', 'Hold empty for 4 counts', 'Repeat the full cycle 4 times'] },
  { name: '4-7-8 Breathing', category: 'Breathing',
    desc: 'A natural relaxant that is especially effective after frustration.',
    steps: ['Exhale completely through your mouth to start', 'Inhale through your nose for 4 counts', 'Hold your breath for 7 counts', 'Exhale fully through your mouth for 8 counts', 'Repeat 3 full cycles'] },
  { name: 'Deep Belly Breathing', category: 'Breathing',
    desc: 'Reset your breathing pattern to re-oxygenate your brain.',
    steps: ['Sit upright with one hand on your belly', 'Inhale slowly and let your belly push your hand out, not your chest', 'Exhale fully, letting the belly fall inward', 'Keep each breath slow — 5 counts in, 5 out', 'Repeat for 6 full breaths'] },
  { name: 'Alternate Nostril Breathing', category: 'Breathing',
    desc: 'A yogic technique known for balancing focus and calm.',
    steps: ['Close your right nostril with your right thumb', 'Inhale through the left nostril for 4 counts', 'Close left with ring finger, release thumb, exhale right for 4', 'Inhale right, switch, exhale left — that is 1 cycle', 'Repeat 5 cycles'] },
  { name: 'Pursed Lip Breathing', category: 'Breathing',
    desc: 'Slows the breath and reduces anxiety fast.',
    steps: ['Relax your neck and shoulders completely', 'Inhale slowly through your nose for 2 counts', 'Pucker your lips as if about to whistle', 'Exhale slowly through pursed lips for 4 counts', 'Repeat 6 times at an easy rhythm'] },
  { name: 'Resonance Breathing', category: 'Breathing',
    desc: 'Breathe at 5 breaths per minute to enter a focused, calm state.',
    steps: ['Find a comfortable seated position', 'Inhale slowly and steadily for 6 full counts', 'Exhale slowly and steadily for 6 full counts', 'Keep the breath smooth with no pauses', 'Continue for 5 full cycles'] },
  { name: '20-20-20 Eye Break', category: 'Eye Relief',
    desc: 'Give your eye muscles a full reset from screen strain.',
    steps: ['Look completely away from your screen', 'Find something at least 20 feet (6 metres) away', 'Focus on it softly without squinting', 'Hold your gaze there for 20 full seconds', 'Blink slowly a few times, then return'] },
  { name: 'Palm Your Eyes', category: 'Eye Relief',
    desc: 'Complete darkness gives tired eyes their deepest rest.',
    steps: ['Rub your palms together briskly until warm', 'Cup them gently over your closed eyes without pressing', 'Relax your face, jaw, and shoulders completely', 'Breathe slowly and enjoy the dark for 30 seconds', 'Remove palms slowly and let eyes adjust'] },
  { name: 'Eye Figure-8s', category: 'Eye Relief',
    desc: 'Loosen stiff eye muscles with a slow, flowing movement.',
    steps: ['Focus on a point about 10 feet in front of you', 'Trace a large figure-8 with your eyes without moving your head', 'Move slowly and smoothly in one direction — 5 times', 'Then reverse direction — 5 more times', 'Close eyes and rest for 10 seconds'] },
  { name: 'Near-Far Focus Shift', category: 'Eye Relief',
    desc: 'Flex the focusing muscles to fight screen fatigue.',
    steps: ['Hold one finger about 10 cm from your face', 'Focus on your finger for 5 seconds', 'Shift focus to something across the room for 5 seconds', 'Alternate back and forth 10 times', 'Finish by closing your eyes for 15 seconds'] },
  { name: 'Rapid Blink Reset', category: 'Eye Relief',
    desc: 'Re-moisturise dry eyes since screen users barely blink.',
    steps: ['Blink rapidly and lightly 20 times', 'Close your eyes fully and hold for 20 seconds', 'Open slowly and look up, down, left, right', 'Blink normally 10 more times', 'Close eyes and rest for another 10 seconds'] },
  { name: 'Neck Side Stretch', category: 'Stretching',
    desc: 'Release the neck and trap tension from screen time.',
    steps: ['Sit tall and drop your right ear toward your right shoulder', 'Feel the stretch along the left side of your neck', 'Hold for 30 seconds, breathing slowly', 'Return to center and repeat on the left side', 'Keep shoulders relaxed throughout'] },
  { name: 'Chest Opener', category: 'Stretching',
    desc: 'Counter the hunched posture from long study sessions.',
    steps: ['Sit on the edge of your chair with feet flat', 'Clasp hands behind your lower back', 'Squeeze shoulder blades together and lift your chest upward', 'Hold for 30 seconds, breathing deeply', 'Release and roll shoulders forward slowly'] },
  { name: 'Seated Spinal Twist', category: 'Stretching',
    desc: 'Release lower back tightness with a gentle rotation.',
    steps: ['Sit upright with feet flat on the floor', 'Place your right hand on your left knee, left hand behind on the chair', 'Exhale and gently twist your torso to the left', 'Hold for 30 seconds, breathing into the stretch', 'Return to center and repeat on the other side'] },
  { name: 'Wrist and Forearm Stretch', category: 'Stretching',
    desc: 'Essential for anyone who types a lot — prevents long-term strain.',
    steps: ['Extend your right arm in front, palm facing up', 'With your left hand, gently pull the fingers back toward you', 'Hold for 20 seconds, feeling the stretch in your forearm', 'Flip palm down and press fingers down for 20 seconds', 'Repeat both stretches on the left arm'] },
  { name: 'Upper Back Stretch', category: 'Stretching',
    desc: 'Target the muscles most burdened by sitting at a desk.',
    steps: ['Extend both arms in front at shoulder height', 'Clasp hands and round your back, pushing arms away', 'Drop your head between your arms', 'Feel the stretch across your upper back and hold 30 seconds', 'Release, pull shoulders back, and sit tall'] },
  { name: 'Eagle Arms Stretch', category: 'Stretching',
    desc: 'A yoga-inspired move that goes deep into shoulder tension.',
    steps: ['Extend arms forward at shoulder height', 'Cross your right arm over your left, bending elbows to wrap forearms', 'Press palms together as close as you can manage', 'Lift elbows slightly and hold for 30 seconds', 'Unwind, shake arms out, then repeat with left over right'] }
];

// ─── State ────────────────────────────────────────────────────────────────────
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STATE_KEY)) || {};
    if (s.hearts        === undefined) s.hearts        = 3;
    if (!s.decks)                      s.decks         = [];
    if (!s.pomoSettings)               s.pomoSettings  = { focus: 25, shortBreak: 5, longBreak: 15 };
    if (s.sessionsDone  === undefined) s.sessionsDone  = 0;
    if (s.exercisesDone === undefined) s.exercisesDone = 0;
    if (s.cardsStudied  === undefined) s.cardsStudied  = 0;
    s.decks.forEach(d => { if (!d.cardData) d.cardData = []; });
    return s;
  } catch {
    return { hearts: 3, decks: [], pomoSettings: { focus: 25, shortBreak: 5, longBreak: 15 }, sessionsDone: 0, exercisesDone: 0, cardsStudied: 0, streak: 0, mood: null };
  }
}
function saveState() { localStorage.setItem(STATE_KEY, JSON.stringify(state)); }
let state = loadState();

// ─── Session State ────────────────────────────────────────────────────────────
let selectedDeck        = null;
let cardQueue           = [];
let sessionCorrect      = 0;
let sessionAgain        = 0;
let sessionFirstCorrect = 0;
let againSet            = new Set();
let heartsLostSession   = 0;
let isFlipped           = false;
let sessionStarted      = false;

// ─── Pomodoro State ───────────────────────────────────────────────────────────
let pomoState      = 'idle';
let pomoSecs       = 0;
let pomoInterval   = null;
let pomoBlocksDone = 0;
let isLongBreak    = false;
let exerciseQueued = false;
let isManualBreak  = false;

// ─── Eye Timer State ──────────────────────────────────────────────────────────
let eyeSecs     = 20 * 60;
let eyeInterval = null;
let eyePaused   = false;

// ─── Exercise State ───────────────────────────────────────────────────────────
let exSecs     = 0;
let exTotal    = 0;
let exInterval = null;
let currentExercise = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function setRingOffset(el, progress) {
  if (el) el.style.strokeDashoffset = RING_C * (1 - Math.max(0, Math.min(1, progress)));
}
function todayLabel() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
  pomoSecs = state.pomoSettings.focus * 60;
  updateHeartsUI();
  renderHeartsCard();
  renderFlashcard();
  updateProgress();
  initDeckSelector();
  initPomodoro();
  initEditPanel();
  initExerciseOverlay();
  initDoItNow();
  initEyeTimer();
  updateSidebarWellness();
  const preId = localStorage.getItem('flashfit_selectedDeck');
  if (preId) {
    const deck = state.decks.find(d => d.id === parseInt(preId));
    if (deck) selectDeck(deck);
    localStorage.removeItem('flashfit_selectedDeck');
  }
}

// ─── Hearts UI ────────────────────────────────────────────────────────────────
function updateHeartsUI() {
  const h = state.hearts;
  $('heartsDisplay').textContent = `${h} heart${h !== 1 ? 's' : ''}`;
  const pop = $('popupHeartsIcons');
  if (pop) {
    pop.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const el = document.createElement('i');
      el.className = 'ti ti-heart';
      el.style.fontSize = '20px';
      el.style.color = i < h ? '#FF4D8B' : 'rgba(255,77,139,0.15)';
      pop.appendChild(el);
    }
    $('popupHeartsLabel').textContent = `${h} of 5 hearts remaining`;
  }
}
function renderHeartsCard() {
  const h   = state.hearts;
  const el  = $('heartsCardIcons');
  el.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const icon = document.createElement('i');
    icon.className = 'ti ti-heart';
    icon.style.color = i < h ? '#FF4D8B' : 'rgba(255,77,139,0.15)';
    el.appendChild(icon);
  }
  const hint = $('heartsCardHint');
  if (h === 0) {
    hint.textContent = 'No hearts — do an exercise to restore one and continue.';
    hint.style.color = 'var(--accent-pink)';
  } else if (h <= 2) {
    hint.textContent = `Only ${h} heart${h !== 1 ? 's' : ''} left — study carefully!`;
    hint.style.color = 'rgba(255,77,139,0.75)';
  } else {
    hint.textContent = 'Wrong answers cost a heart. Do a break exercise to restore one.';
    hint.style.color = '';
  }
}

// ─── Deck Selector ────────────────────────────────────────────────────────────
function initDeckSelector() {
  renderDeckDropdown();
  $('deckSelector').addEventListener('click', e => {
    if (e.target.closest('.deck-dropdown')) return;
    $('deckDropdown').classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('#deckSelector')) $('deckDropdown').classList.remove('open');
  });
}
function renderDeckDropdown() {
  const dd = $('deckDropdown');
  dd.innerHTML = '';
  if (!state.decks.length) {
    dd.innerHTML = '<div class="deck-dropdown__empty">No decks yet. Go to My Decks to create one.</div>';
    return;
  }
  state.decks.forEach(deck => {
    const item  = document.createElement('div');
    item.className = 'deck-dropdown__item';
    const color = DECK_COLORS[deck.color] || DECK_COLORS.blue;
    const count = (deck.cardData || []).length;
    item.innerHTML = `<span class="deck-dropdown__dot" style="background:${color};"></span><span class="deck-dropdown__name">${deck.icon} ${escHtml(deck.name)}</span><span class="deck-dropdown__count">${count} card${count !== 1 ? 's' : ''}</span>`;
    item.addEventListener('click', () => { selectDeck(deck); $('deckDropdown').classList.remove('open'); });
    dd.appendChild(item);
  });
}
function selectDeck(deck) {
  selectedDeck      = deck;
  cardQueue         = shuffle([...(deck.cardData || [])]);
  sessionCorrect      = 0;
  sessionAgain        = 0;
  sessionFirstCorrect = 0;
  againSet            = new Set();
  heartsLostSession   = 0;
  isFlipped           = false;
  sessionStarted      = false;
  $('deckSelectorLabel').textContent = `${deck.icon} ${deck.name}`;
  $('deckSelectorLabel').style.color = 'var(--text-primary)';
  updateProgress();
  renderFlashcard();
}

// ─── Flashcard ────────────────────────────────────────────────────────────────
function renderFlashcard() {
  ['flashcardEmpty','flashcardNoCards','flashcardBlocked','flashcardScene','sessionComplete']
    .forEach(id => $(id).style.display = 'none');
  $('answerBtns').style.display = 'none';

  if (!selectedDeck)    { $('flashcardEmpty').style.display   = 'flex'; return; }
  if (!(selectedDeck.cardData || []).length) { $('flashcardNoCards').style.display = 'flex'; return; }
  if (state.hearts <= 0) { $('flashcardBlocked').style.display = 'flex'; return; }
  if (!cardQueue.length) {
    $('sessionComplete').style.display = 'flex';
    $('finalCorrect').textContent = `${sessionCorrect} correct`;
    $('finalAgain').textContent   = `${sessionAgain} again`;
    // Update deck progress on completion
    if (selectedDeck && (sessionCorrect + sessionAgain) > 0) {
      const totalCards = (selectedDeck.cardData || []).length;
      
      saveState();
    }
    return;
  }
  const card = cardQueue[0];
  $('cardQuestion').textContent    = card.question;
  $('cardAnswer').textContent      = card.answer;
  const left = cardQueue.length;
  $('cardCounter').textContent     = `${left} left`;
  $('cardCounterBack').textContent = `${left} left`;
  isFlipped = false;
  $('flashcard').classList.remove('flipped');
  $('flashcardScene').style.display = 'block';
  $('answerBtns').style.display     = 'none';
}

$('flashcardScene').addEventListener('click', () => {
  if (!selectedDeck || !cardQueue.length || state.hearts <= 0) return;
  isFlipped = !isFlipped;
  $('flashcard').classList.toggle('flipped', isFlipped);
  $('answerBtns').style.display = isFlipped ? 'grid' : 'none';
});

function flipBackThen(callback) {
  if (!isFlipped) { callback(); return; }
  $('answerBtns').style.display = 'none';
  $('cardQuestion').textContent = '';
  $('cardAnswer').textContent   = '';
  $('flashcard').classList.remove('flipped');
  isFlipped = false;
  setTimeout(callback, 580);
}

$('btnGot').addEventListener('click', () => {
  if (!sessionStarted) { sessionStarted = true; if (selectedDeck) selectedDeck.lastStudied = todayLabel(); }
  if (!againSet.has(cardQueue[0].id)) sessionFirstCorrect++;
  sessionCorrect++;
  state.cardsStudied++;
  flipBackThen(() => {
      cardQueue.shift();
      if (selectedDeck) {
        const totalCards = (selectedDeck.cardData || []).length;
        selectedDeck.progress = totalCards > 0
          ? Math.round((totalCards - cardQueue.length) / totalCards * 100)
          : 0;
      }
      saveState(); updateProgress(); renderFlashcard();
  });
});

$('btnAgain').addEventListener('click', () => {
  if (!sessionStarted) { sessionStarted = true; if (selectedDeck) selectedDeck.lastStudied = todayLabel(); }
  sessionAgain++;
  heartsLostSession++;
  state.hearts = Math.max(0, state.hearts - 1);
  flipBackThen(() => {
    againSet.add(cardQueue[0].id);
    const failed = cardQueue.shift();
    cardQueue.push(failed);
    saveState(); updateProgress(); updateHeartsUI(); renderHeartsCard(); renderFlashcard();
  });
});

$('restartBtn').addEventListener('click', () => {
  if (!selectedDeck) return;
  cardQueue           = shuffle([...(selectedDeck.cardData || [])]);
  sessionCorrect      = 0;
  sessionAgain        = 0;
  sessionFirstCorrect = 0;
  againSet            = new Set();
  heartsLostSession   = 0;
  sessionStarted      = false;
  updateProgress(); renderFlashcard();
});

function updateProgress() {
  $('progCorrect').textContent    = sessionCorrect;
  $('progAgain').textContent      = sessionAgain;
  $('progRemaining').textContent  = cardQueue.length || '—';
  $('statCardsDone').textContent  = sessionCorrect + sessionAgain;
  $('statHeartsLost').textContent = heartsLostSession;
  $('statSessions').textContent   = state.sessionsDone || 0;
}

// ─── Pomodoro ─────────────────────────────────────────────────────────────────
function initPomodoro() {
  $('setFocus').value      = state.pomoSettings.focus;
  $('setShortBreak').value = state.pomoSettings.shortBreak;
  $('setLongBreak').value  = state.pomoSettings.longBreak;
  updatePomoDisplay();
  updatePomoMode();
  updatePomoButtons();
  updatePomoMini();

  $('pomoPlayBtn').addEventListener('click', togglePomo);
  $('pomoSkipBtn').addEventListener('click', skipPomo);
  $('pomoMiniBtn').addEventListener('click', togglePomo);

  $('pomoGearBtn').addEventListener('click', e => {
    e.stopPropagation();
    const p = $('pomoSettingsPopover');
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.pomo-settings-wrap')) $('pomoSettingsPopover').style.display = 'none';
  });
  $('saveSettingsBtn').addEventListener('click', savePomoSettings);
}
function savePomoSettings() {
  const f  = Math.max(1, Math.min(60, parseInt($('setFocus').value)      || 25));
  const sb = Math.max(1, Math.min(30, parseInt($('setShortBreak').value) || 5));
  const lb = Math.max(1, Math.min(60, parseInt($('setLongBreak').value)  || 15));
  state.pomoSettings = { focus: f, shortBreak: sb, longBreak: lb };
  saveState();
  if (pomoState === 'idle') { pomoSecs = f * 60; updatePomoDisplay(); updatePomoMini(); }
  $('pomoSettingsPopover').style.display = 'none';
}
function togglePomo() {
  if (pomoState === 'idle' || pomoState === 'paused') startPomo();
  else if (pomoState === 'running') pausePomo();
}
function startPomo() {
  pomoState = 'running';
  $('pomoLabel').textContent = 'remaining';
  const ring = $('pomoRingProgress');
  if (ring) ring.style.opacity = '1';
  updatePomoButtons(); updatePomoMini();
  clearInterval(pomoInterval);
  pomoInterval = setInterval(tickPomo, 1000);
}
function pausePomo() {
  pomoState = 'paused';
  clearInterval(pomoInterval); pomoInterval = null;
  $('pomoLabel').textContent = 'Paused';
  const ring = $('pomoRingProgress');
  if (ring) ring.style.opacity = '0.3';
  updatePomoButtons(); updatePomoMini();
}
function tickPomo() {
  if (pomoState !== 'running') return;
  pomoSecs--;
  if (pomoSecs <= 0) {
    pomoSecs = 0; updatePomoDisplay(); updatePomoMini();
    clearInterval(pomoInterval); pomoInterval = null;
    onPomoBlockEnd();
    return;
  }
  updatePomoDisplay(); updatePomoMini();
}
function onPomoBlockEnd() {
  if (pomoState !== 'break') {
    pomoBlocksDone++;
    state.sessionsDone = (state.sessionsDone || 0) + 1;
    if (!state.sessionLog) state.sessionLog = [];
    if (selectedDeck) {
      state.sessionLog.unshift({
        date: todayLabel(),
        deckName: selectedDeck.name,
        icon: selectedDeck.icon,
        color: selectedDeck.color,
        correct: sessionCorrect,
        again: sessionAgain
      });
    }
    saveState(); $('statSessions').textContent = state.sessionsDone;
    updateSidebarWellness();
    isLongBreak = pomoBlocksDone % 4 === 0;
    const breakSecs = (isLongBreak ? state.pomoSettings.longBreak : state.pomoSettings.shortBreak) * 60;
    pomoState = 'break'; pomoSecs = breakSecs;
    updatePomoMode(); updatePomoButtons(); updatePomoDisplay(); updatePomoMini();
    isManualBreak = false;
    showExerciseOverlay(breakSecs);
  } else {
    pomoState = 'idle'; pomoSecs = state.pomoSettings.focus * 60;
    updatePomoMode(); updatePomoButtons(); updatePomoDisplay(); updatePomoMini();
    startPomo();
  }
}
function skipPomo() {
  clearInterval(pomoInterval); pomoInterval = null;
  pomoSecs = 0; updatePomoDisplay(); onPomoBlockEnd();
}
function updatePomoDisplay() {
  $('pomoTime').textContent = fmt(pomoSecs);
  $('pomoTime').style.color = pomoState === 'break' ? 'var(--accent-green)' : 'var(--accent-blue)';
  const total = pomoState === 'break'
    ? (isLongBreak ? state.pomoSettings.longBreak : state.pomoSettings.shortBreak) * 60
    : state.pomoSettings.focus * 60;
  setRingOffset($('pomoRingProgress'), total > 0 ? pomoSecs / total : 1);
  const ring = $('pomoRingProgress');
  if (ring) ring.style.stroke = pomoState === 'break' ? 'var(--accent-green)' : 'var(--accent-blue)';
}
function updatePomoMode() {
  $('pomoMode').textContent = pomoState === 'break'
    ? (isLongBreak ? 'Long break' : 'Short break')
    : `Focus block · ${(pomoBlocksDone % 4) + 1} of 4`;
}
function updatePomoButtons() {
  const icon  = $('pomoPlayIcon');
  const label = $('pomoPlayLabel');
  if (pomoState === 'running') {
    icon.className = 'ti ti-player-pause'; label.textContent = 'Pause';
  } else {
    icon.className = 'ti ti-player-play'; label.textContent = pomoState === 'paused' ? 'Resume' : 'Start';
  }
}
function updatePomoMini() {
  $('pomoMiniTime').textContent = fmt(pomoSecs);
  $('pomoMiniTime').style.color = pomoState === 'break' ? 'var(--accent-green)' : 'var(--accent-blue)';
  $('pomoMiniMode').textContent = pomoState === 'idle'    ? 'Ready'
    : pomoState === 'running'   ? (pomoState === 'break' ? 'Break' : `Block ${(pomoBlocksDone % 4) + 1}`)
    : pomoState === 'paused'    ? 'Paused'
    : pomoState === 'break'     ? (isLongBreak ? 'Long break' : 'Break')
    : 'Ready';
  const miniIcon = $('pomoMiniBtnIcon');
  if (miniIcon) miniIcon.className = pomoState === 'running' ? 'ti ti-player-pause' : 'ti ti-player-play';
  const miniBtn = $('pomoMiniBtn');
  if (miniBtn) {
    miniBtn.style.background = pomoState === 'break' ? 'rgba(35,209,139,0.15)' : 'rgba(77,159,255,0.15)';
    miniBtn.style.borderColor = pomoState === 'break' ? 'rgba(35,209,139,0.3)' : 'rgba(77,159,255,0.3)';
    miniBtn.style.color = pomoState === 'break' ? 'var(--accent-green)' : 'var(--accent-blue)';
  }
  const mini = $('pomoMini');
  if (mini) mini.style.borderColor = pomoState === 'break' ? 'rgba(35,209,139,0.3)' : 'rgba(77,159,255,0.22)';
}

// ─── Exercise Request ─────────────────────────────────────────────────────────
function handleExerciseRequest() {
  if (pomoState === 'running') $('doItNowOverlay').style.display = 'flex';
  else { isManualBreak = true; showExerciseOverlay(state.pomoSettings.shortBreak * 60); }
}
$('restoreBtn').addEventListener('click',        handleExerciseRequest);
$('blockedExerciseBtn').addEventListener('click', handleExerciseRequest);

// ─── Do It Now ────────────────────────────────────────────────────────────────
function initDoItNow() {
  $('doItNowClose').addEventListener('click', () => $('doItNowOverlay').style.display = 'none');
  $('doItNowOverlay').addEventListener('click', e => {
    if (e.target.id === 'doItNowOverlay') $('doItNowOverlay').style.display = 'none';
  });
  $('doItNowWait').addEventListener('click', () => {
    $('doItNowOverlay').style.display = 'none';
    exerciseQueued = true;
    $('heartsCardHint').textContent = 'Exercise queued — will appear at your next break.';
    $('heartsCardHint').style.color = 'rgba(77,159,255,0.75)';
  });
  $('doItNowConfirm').addEventListener('click', () => {
    $('doItNowOverlay').style.display = 'none';
    isManualBreak = true; pausePomo();
    showExerciseOverlay(state.pomoSettings.shortBreak * 60);
  });
}

// ─── Exercise Overlay ─────────────────────────────────────────────────────────
function showExerciseOverlay(durationSecs) {
  const ex = EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
  currentExercise = ex;
  exTotal = durationSecs; exSecs = durationSecs;
  clearInterval(exInterval);
  $('exBadge').textContent    = isManualBreak ? 'Exercise break' : (isLongBreak ? 'Long break' : 'Break time');
  $('exCategory').textContent = ex.category;
  $('exTitle').textContent    = ex.name;
  $('exDesc').textContent     = ex.desc;
  const stepsEl = $('exSteps');
  stepsEl.innerHTML = '';
  ex.steps.forEach((step, i) => {
    const div = document.createElement('div');
    div.className = 'exercise-step';
    div.innerHTML = `<div class="exercise-step__num">${i + 1}</div><div class="exercise-step__text">${step}</div>`;
    stepsEl.appendChild(div);
  });
  updateExDisplay();
  $('exerciseOverlay').style.display = 'flex';
  exInterval = setInterval(() => {
    exSecs = Math.max(0, exSecs - 1);
    updateExDisplay();
    if (exSecs <= 0) clearInterval(exInterval);
  }, 1000);
}
function updateExDisplay() {
  $('exTime').textContent = fmt(exSecs);
  setRingOffset($('exRingProgress'), exTotal > 0 ? exSecs / exTotal : 0);
}
function closeExerciseOverlay(giveHeart) {
  clearInterval(exInterval);
  $('exerciseOverlay').style.display = 'none';
  exerciseQueued = false;
  if (giveHeart && state.hearts < 5) {
    state.hearts++;
    state.exercisesDone = (state.exercisesDone || 0) + 1;
    if (!state.exerciseLog) state.exerciseLog = [];
    if (currentExercise) {
        state.exerciseLog.push({
            date: todayLabel(),
            name: currentExercise.name,
            category: currentExercise.category
        });
    }
    saveState(); updateHeartsUI(); renderHeartsCard(); renderFlashcard();
    updateSidebarWellness();
}
  if (isManualBreak) {
    isManualBreak = false; startPomo();
  } else {
    pomoState = 'idle'; pomoSecs = state.pomoSettings.focus * 60;
    updatePomoMode(); updatePomoButtons(); updatePomoDisplay(); updatePomoMini();
    const ring = $('pomoRingProgress');
    if (ring) ring.style.opacity = '1';
    startPomo();
  }
}
function initExerciseOverlay() {
  $('exDoneBtn').addEventListener('click', () => closeExerciseOverlay(true));
  $('exSkipBtn').addEventListener('click', () => closeExerciseOverlay(false));
}

// ─── Edit Panel ───────────────────────────────────────────────────────────────
let editingId = null;
function initEditPanel() {
  $('editCardsBtn').addEventListener('click', () => {
    if (!selectedDeck) return;
    $('editPanelTitle').textContent = `Edit Cards — ${selectedDeck.name}`;
    renderEditList();
    $('editPanel').classList.add('open');
    $('editPanelOverlay').classList.add('open');
    $('editCardsBtn').classList.add('edit-cards-btn--active');
  });
  $('editPanelClose').addEventListener('click',   closeEditPanel);
  $('editPanelOverlay').addEventListener('click', closeEditPanel);
  $('addCardBtn').addEventListener('click',  () => showCardForm(null));
  $('cancelCardBtn').addEventListener('click', hideCardForm);
  $('saveCardBtn').addEventListener('click',   saveCard);
  $('cardQInput').addEventListener('keydown', e => { if (e.key === 'Tab') { e.preventDefault(); $('cardAInput').focus(); } });
  $('cardAInput').addEventListener('keydown', e => { if (e.key === 'Enter' && e.ctrlKey) saveCard(); });

  $('shuffleCardsBtn').addEventListener('click', () => {
    if (!selectedDeck || !(selectedDeck.cardData || []).length) return;
    selectedDeck.cardData = shuffle(selectedDeck.cardData);
    saveState(); renderEditList();
    cardQueue = shuffle([...selectedDeck.cardData]);
    updateProgress(); renderFlashcard();
    const btn = $('shuffleCardsBtn');
    btn.innerHTML = '<i class="ti ti-check"></i><span>Shuffled!</span>';
    setTimeout(() => { btn.innerHTML = '<i class="ti ti-arrows-shuffle"></i><span>Shuffle order</span>'; }, 1800);
  });
}
function closeEditPanel() {
  $('editPanel').classList.remove('open');
  $('editPanelOverlay').classList.remove('open');
  $('editCardsBtn').classList.remove('edit-cards-btn--active');
  hideCardForm();
}
function showCardForm(card) {
  editingId = card ? card.id : null;
  $('cardQInput').value = card ? card.question : '';
  $('cardAInput').value = card ? card.answer   : '';
  $('editCardForm').style.display = 'flex';
  $('addCardBtn').style.display   = 'none';
  $('saveCardBtn').textContent    = card ? 'Save changes' : 'Save card';
  $('cardQInput').focus();
}
function hideCardForm() {
  editingId = null;
  $('editCardForm').style.display = 'none';
  $('addCardBtn').style.display   = 'flex';
  $('cardQInput').value = '';
  $('cardAInput').value = '';
}
function saveCard() {
  const q = $('cardQInput').value.trim();
  const a = $('cardAInput').value.trim();
  if (!q) { $('cardQInput').focus(); return; }
  if (!a) { $('cardAInput').focus(); return; }
  if (!selectedDeck.cardData) selectedDeck.cardData = [];
  if (editingId) {
    const c = selectedDeck.cardData.find(x => x.id === editingId);
    if (c) { c.question = q; c.answer = a; }
  } else {
    selectedDeck.cardData.push({ id: Date.now(), question: q, answer: a });
  }
  selectedDeck.cards = selectedDeck.cardData.length;
  saveState(); hideCardForm(); renderEditList();
  cardQueue = shuffle([...selectedDeck.cardData]);
  updateProgress(); renderFlashcard(); renderDeckDropdown();
}
function deleteCard(id) {
  if (!selectedDeck.cardData) return;
  selectedDeck.cardData = selectedDeck.cardData.filter(c => c.id !== id);
  selectedDeck.cards    = selectedDeck.cardData.length;
  saveState(); renderEditList();
  cardQueue = shuffle([...selectedDeck.cardData]);
  updateProgress(); renderFlashcard(); renderDeckDropdown();
}
function renderEditList() {
  const body = $('editPanelBody');
  body.innerHTML = '';
  const cards = selectedDeck.cardData || [];
  if (!cards.length) {
    body.innerHTML = '<div class="edit-panel__empty">No cards yet. Add your first one below.</div>';
    return;
  }
  cards.forEach(card => {
    const item = document.createElement('div');
    item.className = 'edit-card-item';
    item.innerHTML = `
      <div class="edit-card-item__q">${escHtml(card.question)}</div>
      <div class="edit-card-item__a">${escHtml(card.answer)}</div>
      <div class="edit-card-item__actions">
        <button class="edit-card-item__btn--edit"><i class="ti ti-pencil"></i>Edit</button>
        <button class="edit-card-item__btn--del"><i class="ti ti-trash"></i>Delete</button>
      </div>`;
    item.querySelector('.edit-card-item__btn--edit').addEventListener('click', () => showCardForm(card));
    item.querySelector('.edit-card-item__btn--del').addEventListener('click',  () => deleteCard(card.id));
    body.appendChild(item);
  });
}

// ─── Eye Timer (persistent across pages) ─────────────────────────────────────
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

  $('toastDismiss').addEventListener('click', () => {
    $('eyeToast').style.display = 'none';
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
  const d = $('timerDisplay'); const p = $('popupTimerDisplay');
  if (d) d.textContent = t; if (p) p.textContent = t;
}
function showEyeToast() { $('eyeToast').style.display = 'flex'; }

// ─── Sidebar Wellness Mini ────────────────────────────────────────────────────
function updateSidebarWellness() {
  const s = document.getElementById('sidebarSessions');
  const e = document.getElementById('sidebarExercises');
  if (s) s.textContent = state.sessionsDone  || 0;
  if (e) e.textContent = state.exercisesDone || 0;
}

// ─── Start ────────────────────────────────────────────────────────────────────
init();