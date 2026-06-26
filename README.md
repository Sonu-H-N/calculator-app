# 🧮 CALC — Advanced Scientific Calculator

> A professional scientific calculator with graphing, voice input, currency conversion, AI-powered step-by-step solving, and persistent calculation history — built with vanilla HTML, CSS, and JavaScript.

![PWA Ready](https://img.shields.io/badge/PWA-Installable-63cab7?style=flat-square)
![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

🔗 **Live Demo:** https://sonu-h-n.github.io/calculator-app/

---

## ✨ Features

### 🔢 Calculator Core
- Basic arithmetic: `+`, `−`, `×`, `÷`, `%`
- Scientific functions: sin, cos, tan, asin, acos, atan, log, ln, √, π, x²
- Safe expression evaluation via **Math.js** (no `eval()`)
- Live preview — see the result as you type, before hitting `=`
- DEG / RAD angle mode toggle

### 🧠 AI Solve (Step-by-Step)
A client-side rule engine that analyses the current expression and explains how to solve it:
- **Quadratic expressions** — calculates discriminant, finds roots using the quadratic formula
- **Percentage expressions** — breaks down the percentage operation
- **Power operations** — explains the base and exponent
- **Trigonometric expressions** — identifies the function and current angle mode
- **General arithmetic** — identifies operations and applies order-of-operations logic

Runs entirely offline, no external API — your expressions are never sent anywhere.

### 📊 Graph Plotting
- Type any expression containing `x` and hit **Plot Graph**
- Plots f(x) from x = −10 to x = 10 using Chart.js
- Interactive line chart with theme-aware colours

### 📋 Steps Panel
- Every calculation (and AI Solve) populates a step-by-step breakdown panel
- Shows what operations were detected and how the result was reached

### 💱 Currency Converter
- Converts USD → INR using live exchange rates (ExchangeRate-API)
- Shows the live rate in the toast notification
- Adds the conversion to calculation history

### 🎤 Voice Input
- Speak arithmetic naturally: "twelve plus forty-five", "sine of thirty"
- Converts spoken words (plus, minus, times, divided by, point, percent) to symbols
- Graceful fallback with a notification if the browser doesn't support it

### 🧮 Memory Functions
- **M+** — add current value to memory
- **M−** — subtract current value from memory
- **MR** — recall memory into display
- **MC** — clear memory (shows MEM indicator when memory is non-zero)

### 🕘 History
- Every calculation saved to localStorage automatically
- Click any history entry to load it back into the display
- Export full history as a `.txt` file
- Clear history with one button

### ⌨️ Keyboard Support
| Key | Action |
|---|---|
| `0–9`, `+−*/%.()` | Input character |
| `Enter` | Calculate |
| `Backspace` | Delete last character |
| `Escape` | Clear display |

### 🎨 Interface
- Dark/light theme toggle, **persisted across sessions**
- Subtle noise texture and grid background for an editorial aesthetic
- Error sound feedback (`error.mp3`) on invalid operations
- Synthetic click sound feedback on button presses (Web Audio API)
- Toast notifications for all actions
- Responsive layout — works on mobile and desktop

### 📱 PWA Support
- Installable to home screen and desktop
- Full offline support via a Service Worker (cache-first for the app shell, network-first for live exchange rates)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | CSS-variable theming (dark/light), responsive layout, animations |
| Vanilla JavaScript (ES6+) | All app logic, no frameworks |
| [Math.js](https://mathjs.org/) | Safe expression parsing and evaluation |
| [Chart.js](https://www.chartjs.org/) | f(x) graph plotting |
| Web Speech API | Voice recognition input |
| Web Audio API | Synthetic click feedback (no external file needed) |
| ExchangeRate-API | Live USD→INR conversion |
| localStorage | History and theme persistence |
| Service Worker | PWA offline caching |

---

## 📂 Project Structure

```
calculator-app/
├── index.html          # App markup — display, buttons, graph, history panel
├── style.css             # Design system: dark/light themes, all component styles
├── script.js               # All logic: eval, AI solve, graph, voice, currency, memory, SW
├── service-worker.js         # PWA offline caching with activate/cleanup
├── manifest.json               # PWA manifest (installable, standalone)
├── error.mp3                     # Audio feedback for error states
└── README.md                       # This file
```

> **No build tools. No npm. No backend.** Open `index.html` in a browser or run with Live Server.

---

## ⚙️ How to Run

### Option 1 — Open directly
```
Double-click index.html  →  Works immediately
```

### Option 2 — Live Server (recommended for Service Worker + Voice)
```bash
# VS Code extension
Install "Live Server" → Right-click index.html → "Open with Live Server"

# Or with Python
python -m http.server 8080
```
> Service workers and the Web Speech API require `http://` or `https://` — they don't work on `file://`.

---

## ⚠️ Known Limitations

- **Currency conversion** requires an active internet connection — it fetches live rates from ExchangeRate-API. The app works fully offline for everything else.
- **Voice input** depends on browser support (Chrome/Edge work best; Firefox and Safari may be limited).
- **AI Solve** is a rule-based client-side solver, not a hosted AI model. It explains common expression types (quadratic, trig, percentage, power, arithmetic) but doesn't cover every possible expression.

---

## 🔮 Possible Extensions

- Unit converter (length, weight, temperature)
- More graph customization (range, colour, multiple functions)
- Multi-currency support (EUR, GBP, JPY…)
- Cloud history sync
- More AI Solve patterns (logarithms, systems of equations)

---

## 👨‍💻 Author

**Sonu H N**
GitHub: https://github.com/Sonu-H-N

⭐ If you like this project, consider giving it a star on GitHub!

---

## 📜 License

This project is open-source under the MIT License.
