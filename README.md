# 🧮 CALC — Advanced Scientific Calculator

> A professional, browser-based scientific calculator with graphing, voice input, currency conversion, AI-powered step-by-step solving, and persistent calculation history.

![PWA Ready](https://img.shields.io/badge/PWA-Installable-63cab7?style=flat-square)
![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

🔗 **[Live Demo](https://sonu-h-n.github.io/calculator-app/)**

## ✨ Features

- **Calculator core:** Basic arithmetic, scientific functions, safe Math.js expression evaluation, live previews, and DEG/RAD angle modes.
- **AI Solve:** Client-side step-by-step explanations for quadratic, percentage, power, trigonometric, and general arithmetic expressions.
- **Graph plotting:** Plot expressions containing `x` from −10 to 10 with an interactive Chart.js graph.
- **Currency converter:** Convert USD to INR using live ExchangeRate-API rates.
- **Voice input:** Enter expressions naturally, such as “twelve plus forty-five” or “sine of thirty”.
- **Memory functions:** M+, M−, MR, and MC with a visible memory indicator.
- **Calculation history:** Automatically saves calculations to localStorage, supports reloading entries, exporting history, and clearing all records.
- **Keyboard support:**

  | Key | Action |
  |---|---|
  | `0–9`, `+−*/%.()` | Enter characters |
  | `Enter` | Calculate |
  | `Backspace` | Delete the last character |
  | `Escape` | Clear the display |

- **Responsive interface:** Dark/light themes, toast notifications, sound feedback, and mobile/desktop layouts.
- **PWA support:** Installable with offline support through a service worker. Currency conversion still requires an internet connection.

All calculator and AI Solve processing runs in the browser; expressions are not sent to an external service.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Theming, responsive layout, and animations |
| Vanilla JavaScript (ES6+) | Application logic and interactions |
| [Math.js](https://mathjs.org/) | Safe expression parsing and evaluation |
| [Chart.js](https://www.chartjs.org/) | Function graphing |
| Web Speech API | Voice recognition input |
| Web Audio API | Synthetic button feedback |
| ExchangeRate-API | Live USD→INR conversion |
| localStorage | History, memory, and theme persistence |
| Service Worker | Offline caching and PWA support |

## 📂 Project Structure

```text
calculator-app/
├── index.html          # App markup and calculator controls
├── style.css           # Themes, layout, and component styles
├── script.js           # Calculator, graph, voice, currency, and history logic
├── service-worker.js   # Offline caching and cleanup
├── manifest.json       # Installable PWA manifest
├── error.mp3           # Error-state audio feedback
└── README.md           # Project documentation
```

> **No build tools, npm, or backend are required.** Open `index.html` directly or use a local server.

## ⚙️ How to Run

### Option 1 — Open directly

Double-click `index.html` to run the calculator immediately.

### Option 2 — Use a local server (recommended)

A local server is recommended for service-worker and Web Speech API support:

```bash
# Python
python -m http.server 8080
```

Or install the **Live Server** extension in VS Code, then right-click `index.html` and choose **Open with Live Server**.

Open `http://localhost:8080` in your browser when using the Python server.

> Service workers and the Web Speech API require `http://` or `https://`; they do not work from `file://` URLs.

## ⚠️ Known Limitations

- **Currency conversion** requires an active internet connection to fetch live rates.
- **Voice input** depends on browser support; Chrome and Edge generally provide the best experience.
- **AI Solve** is a rule-based client-side solver, not a hosted AI model. It supports common expression types but does not cover every possible expression.

## 🔮 Possible Extensions

- Unit conversion for length, weight, and temperature
- More graph customization, including ranges, colours, and multiple functions
- Multi-currency support for EUR, GBP, JPY, and more
- Cloud history synchronization
- Additional AI Solve patterns, such as logarithms and systems of equations

## 👨‍💻 Author

**Sonu H N**  
GitHub: https://github.com/Sonu-H-N

⭐ If you like this project, consider giving it a star on GitHub!

## 📜 License

This project is open source under the MIT License.
