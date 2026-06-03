// ─── State ────────────────────────────────────────────────────────────────────
const STATE_KEY = 'flashfit_state';

function loadState() {
  try { return JSON.parse(localStorage.getItem(STATE_KEY)) || { hearts: 3 }; }
  catch { return { hearts: 3 }; }
}

const state = loadState();

// ─── Hearts UI ────────────────────────────────────────────────────────────────
function updateHeartsUI() {
  const h = state.hearts ?? 3;
  document.getElementById('heartsDisplay').textContent = `${h} heart${h !== 1 ? 's' : ''}`;
  const iconsEl = document.getElementById('popupHeartsIcons');
  iconsEl.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const icon = document.createElement('i');
    icon.className = 'ti ti-heart';
    icon.style.fontSize = '20px';
    icon.style.color = i < h ? '#FF4D8B' : 'rgba(255,77,139,0.15)';
    iconsEl.appendChild(icon);
  }
  document.getElementById('popupHeartsLabel').textContent = `${h} of 5 hearts remaining`;
}

// ─── 20-20-20 Eye Timer ───────────────────────────────────────────────────────
const EYE_KEY = 'flashfit_eye_reset';
let eyeSecs = 20 * 60, eyeInterval = null;

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
function updateEyeDisplay(t) {
  document.getElementById('timerDisplay').textContent = t;
  document.getElementById('popupTimerDisplay').textContent = t;
}
function showEyeToast() {
  document.getElementById('eyeToast').style.display = 'flex';
}

function initEyeTimer() {
  const stored = localStorage.getItem(EYE_KEY);
  const target = stored ? parseInt(stored) : Date.now() + 20 * 60 * 1000;
  if (!stored) localStorage.setItem(EYE_KEY, target);
  eyeSecs = Math.max(0, Math.round((target - Date.now()) / 1000));
  updateEyeDisplay(fmt(eyeSecs));

  function tick() {
    eyeSecs--;
    if (eyeSecs <= 0) {
      eyeSecs = 0;
      clearInterval(eyeInterval);
      eyeInterval = null;
      updateEyeDisplay('00:00');
      showEyeToast();
      return;
    }
    updateEyeDisplay(fmt(eyeSecs));
  }

  document.getElementById('toastDismiss').addEventListener('click', () => {
    document.getElementById('eyeToast').style.display = 'none';
    const newTarget = Date.now() + 20 * 60 * 1000;
    localStorage.setItem(EYE_KEY, newTarget);
    eyeSecs = 20 * 60;
    clearInterval(eyeInterval);
    eyeInterval = setInterval(tick, 1000);
    updateEyeDisplay(fmt(eyeSecs));
  });

  if (eyeSecs <= 0) { showEyeToast(); return; }
  eyeInterval = setInterval(tick, 1000);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
updateHeartsUI();
initEyeTimer();