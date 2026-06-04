# FlashFit

> Study smarter. Stay healthier.

FlashFit is a wellness-integrated flashcard study platform built for Filipino
students who need more than just another study tool. It combines
spaced-repetition flashcard study, Pomodoro focus sessions, and a built-in
wellness system into one cohesive experience. No account needed, no
installation required — just open it in a browser and start studying.

Built by **Gym Bilog** as a final project.

---

## Features

- **Flashcard Study** — Flip-based card interface with an Again and Got It
  system that tracks accuracy and recycles missed cards until they are answered
  correctly
- **Pomodoro Timer** — Customizable focus and break intervals with a circular
  SVG countdown ring and session tracking
- **Hearts System** — Start with 5 hearts, lose one for every wrong answer, and
  restore them through exercise breaks
- **Exercise Break Overlay** — 25 exercises across 4 categories (Movement,
  Breathing, Eye Relief, Stretching) with a countdown timer and heart
  restoration mechanic
- **20-20-20 Eye Care Timer** — A persistent eye break timer that runs across
  all pages and fires a reminder every 20 minutes
- **Deck Management** — Create, edit, and delete custom decks with subject
  icons, color coding, and live progress bars
- **Edit Cards Panel** — Add, edit, and remove flashcards from a deck directly
  during a study session
- **Wellness Hub** — Weekly focus bar chart, mood trend line, session history,
  and exercise log all in one place
- **Mood Check-in** — A simple 1 to 5 daily mood logger that feeds into the
  mood trend chart
- **State Persistence** — All data is saved to localStorage so nothing is lost
  between sessions

---

## How to Run

FlashFit is built with pure HTML, CSS, and JavaScript. There is no build
process, no package manager, and no server required.

1. Clone or download the repository
2. Open `index.html` in any modern browser
3. That is it

```bash
git clone https://github.com/your-username/flashfit.git
cd flashfit
open index.html
```

---

## File Structure

```
flashfit/
├── index.html          # Landing page
├── dashboard.html      # My Decks dashboard
├── study.html          # Study and Pomodoro page
├── wellness.html       # Wellness Hub
├── about.html          # About page
├── assets/
│   └── flashfit_logo.png
├── styles/
│   ├── dashboard.css   # Shared base styles for all pages
│   ├── index.css       # Landing page styles
│   ├── study.css       # Study page styles
│   ├── wellness.css    # Wellness Hub styles
│   └── about.css       # About page styles
└── scripts/
    ├── dashboard.js    # Dashboard logic and state
    ├── index.js        # Landing page logic
    ├── study.js        # Flashcard, Pomodoro, and break logic
    ├── wellness.js     # Wellness charts and logs
    └── about.js        # About page logic
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and content |
| CSS3 | Styling, layout, and animations |
| JavaScript | Interactivity, state management, and all app logic |
| localStorage API | Persistent data storage across sessions |
| Tabler Icons | Icon library used throughout the UI |
| Plus Jakarta Sans | Primary font via Google Fonts |

---

## SDG Alignment

**SDG 3 — Good Health and Well-being**
FlashFit integrates physical and mental wellness directly into the study
experience through eye care reminders, movement-based exercise breaks, and mood
tracking. It treats student health as a core feature, not an afterthought.

**SDG 4 — Quality Education**
FlashFit gives students a free, accessible, and effective study tool built
around proven techniques like active recall and structured focus intervals. It
runs in any browser with no account or cost required, making quality study
tools available to any student regardless of their resources.

---

## Meet the Team

**Gym Bilog**

- Alvin
- Kian
- Kenneth
- Levan

---

## License

© 2026 FlashFit. All rights reserved.
