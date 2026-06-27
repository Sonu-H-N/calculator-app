/* ===============================
   CALC — Advanced Scientific Calculator
   Professional Structured Script
================================== */

/* =====================
   Audio Feedback
===================== */
const errorSound = new Audio("error.mp3");
const clickSound = new AudioContext
  ? (() => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      return {
        play() {
          try {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.frequency.value = 880;
            o.type = "sine";
            g.gain.setValueAtTime(0.06, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
            o.start(); o.stop(ctx.currentTime + 0.06);
          } catch {}
        }
      };
    })()
  : null;

function playError()  { try { errorSound.currentTime = 0; errorSound.play(); } catch {} }
function playClick()  { if (clickSound) clickSound.play(); }

let memory = 0;

document.addEventListener("DOMContentLoaded", () => {

    const display      = document.getElementById("display");
    const previewEl    = document.getElementById("preview");
    const historyList  = document.getElementById("historyList");
    const graphCanvas  = document.getElementById("graph");
    const graphSection = document.getElementById("graphSection");
    const memIndicator = document.getElementById("memIndicator");
    const angleModeEl  = document.getElementById("angleMode");
    const emptyMsg     = document.getElementById("emptyMsg");

    let isDegree      = true;
    let chartInstance = null;

    /* =====================
       Safe Evaluator (Math.js)
    ===================== */
    const safeEval = (expression) => {
        try {
            const result = math.evaluate(expression);
            return typeof result === "number" ? result : null;
        } catch {
            return null;
        }
    };

    /* =====================
       Display Preview
    ===================== */
    const updatePreview = () => {
        const val = display.value;
        if (!val) { previewEl.textContent = "—"; return; }
        const result = safeEval(val);
        previewEl.textContent = (result !== null && result !== undefined)
            ? "= " + parseFloat(result.toFixed(10))
            : "—";
    };

    /* =====================
       Toast Notification
    ===================== */
    const showToast = (msg) => {
        const t = document.getElementById("toast");
        t.textContent = msg;
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 2400);
    };

    /* =====================
       History
    ===================== */
    const saveHistory = () => {
        try { localStorage.setItem("calcHistory", historyList.innerHTML); } catch {}
    };

    const loadHistory = () => {
        try {
            const saved = localStorage.getItem("calcHistory");
            if (saved) {
                historyList.innerHTML = saved;
                emptyMsg.style.display = "none";
                historyList.querySelectorAll("li").forEach(li => {
                    li.addEventListener("click", () => {
                        const res = li.dataset.result;
                        if (res) { display.value = res; updatePreview(); }
                    });
                });
            }
        } catch {}
    };

    const addToHistory = (expr, result) => {
        emptyMsg.style.display = "none";
        const li = document.createElement("li");
        li.dataset.result = result;
        li.innerHTML = `${expr}<br><span class="hi-result">= ${result}</span>`;
        li.addEventListener("click", () => {
            display.value = String(result);
            updatePreview();
        });
        historyList.prepend(li);
        saveHistory();
    };

    window.clearHistory = () => {
        historyList.innerHTML = "";
        emptyMsg.style.display = "block";
        try { localStorage.removeItem("calcHistory"); } catch {}
        showToast("History cleared");
    };

    /* =====================
       Core Operations
    ===================== */
    window.appendValue = (val) => {
        playClick();
        display.value += val;
        updatePreview();
    };

    window.appendFunction = (func) => {
        playClick();
        display.value += func;
        updatePreview();
    };

    window.clearDisplay = () => {
        playClick();
        display.value = "";
        previewEl.textContent = "—";
        document.getElementById("stepsList").innerHTML = "";
    };

    window.deleteLast = () => {
        playClick();
        display.value = display.value.slice(0, -1);
        updatePreview();
    };

    window.calculate = () => {
        const expr = display.value;
        if (!expr) return;

        const result = safeEval(expr);

        if (result === null || result === undefined || !isFinite(result)) {
            playError();
            display.value = "Error";
            previewEl.textContent = "—";
            return;
        }

        const formatted = parseFloat(result.toFixed(10));
        addToHistory(expr, formatted);
        showSteps(expr, formatted);
        display.value = String(formatted);
        previewEl.textContent = "—";
        playClick();
    };

    /* =====================
       Steps Panel
    ===================== */
    const showSteps = (expr, result) => {
        const list = document.getElementById("stepsList");
        if (!list) return;
        list.innerHTML = "";

        const steps = buildSteps(expr, result);
        steps.forEach(step => {
            const li = document.createElement("li");
            li.textContent = step;
            list.appendChild(li);
        });
    };

    const buildSteps = (expr, result) => {
        const steps = [];
        steps.push(`Expression: ${expr}`);

        // Detect and explain special constructs
        if (expr.includes("**")) {
            steps.push(`Detected: power operation (**)`);
        }
        if (expr.includes("sqrt") || expr.includes("√")) {
            steps.push(`Detected: square root`);
        }
        if (expr.includes("log")) {
            steps.push(`Detected: logarithm`);
        }
        if (expr.includes("sin") || expr.includes("cos") || expr.includes("tan")) {
            steps.push(`Detected: trigonometric function`);
        }
        if (expr.includes("PI") || expr.includes("pi")) {
            steps.push(`π ≈ 3.14159265358979`);
        }

        // Break down simple a op b expressions
        const simpleMatch = expr.match(/^(-?\d+\.?\d*)\s*([+\-*/])\s*(-?\d+\.?\d*)$/);
        if (simpleMatch) {
            const [, a, op, b] = simpleMatch;
            const opNames = { "+": "Add", "-": "Subtract", "*": "Multiply", "/": "Divide" };
            steps.push(`${opNames[op] || "Operate"}: ${a} ${op} ${b}`);
        }

        steps.push(`Result: ${result}`);
        return steps;
    };

    /* =====================
       Trigonometry
    ===================== */
    window.applyTrig = (func) => {
        let value = parseFloat(display.value);
        if (isNaN(value)) { playError(); showToast("Enter a number first"); return; }

        let result;
        if (["asin", "acos", "atan"].includes(func)) {
            result = Math[func](value);
            if (isDegree) result = result * 180 / Math.PI;
        } else {
            if (isDegree) value = value * Math.PI / 180;
            result = Math[func](value);
        }

        if (!isFinite(result)) { playError(); showToast("Math error"); return; }

        const formatted = parseFloat(result.toFixed(10));
        addToHistory(`${func}(${display.value})`, formatted);
        display.value = String(formatted);
        updatePreview();
        playClick();
    };

    /* =====================
       Memory Functions
    ===================== */
    window.memoryAdd = () => {
        const v = parseFloat(display.value);
        if (!isNaN(v)) {
            memory += v;
            memIndicator.classList.remove("hidden");
            showToast(`M+ → M = ${memory}`);
        }
    };

    window.memorySubtract = () => {
        const v = parseFloat(display.value);
        if (!isNaN(v)) {
            memory -= v;
            memIndicator.classList.remove("hidden");
            showToast(`M− → M = ${memory}`);
        }
    };

    window.memoryRecall = () => {
        display.value = String(memory);
        updatePreview();
        showToast(`MR = ${memory}`);
    };

    window.memoryClear = () => {
        memory = 0;
        memIndicator.classList.add("hidden");
        showToast("Memory cleared");
    };

    /* =====================
       Copy Result
    ===================== */
    window.copyResult = async () => {
        try {
            await navigator.clipboard.writeText(display.value);
            showToast("Copied to clipboard");
        } catch {
            showToast("Copy failed");
        }
    };

    /* =====================
       Download History
    ===================== */
    window.downloadHistory = () => {
        const items = [...historyList.querySelectorAll("li")];
        if (!items.length) { showToast("No history to export"); return; }
        const text = items.map(li => li.textContent.replace(/\n/g, " ")).join("\n");
        const blob = new Blob([text], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "calc-history.txt";
        a.click();
        showToast("History exported");
    };

    /* =====================
       Keyboard Support
    ===================== */
    document.addEventListener("keydown", (e) => {
        if (e.target === display) return;
        if (!isNaN(e.key) || "+-*/.%()".includes(e.key)) {
            display.value += e.key;
            updatePreview();
            playClick();
        }
        if (e.key === "Enter")     { e.preventDefault(); window.calculate(); }
        if (e.key === "Backspace") window.deleteLast();
        if (e.key === "Escape")    window.clearDisplay();
    });

    /* =====================
       Theme (with persistence)
    ===================== */
    window.toggleTheme = () => {
        document.body.classList.toggle("light");
        const isLight = document.body.classList.contains("light");
        localStorage.setItem("theme", isLight ? "light" : "dark");
        showToast(isLight ? "Light mode" : "Dark mode");
    };

    const initTheme = () => {
        if (localStorage.getItem("theme") === "light") {
            document.body.classList.add("light");
        }
    };

    /* =====================
       Angle Mode
    ===================== */
    window.toggleMode = () => {
        isDegree = !isDegree;
        const label = isDegree ? "DEG" : "RAD";
        document.getElementById("modeLabel").textContent = label;
        angleModeEl.textContent = label;
        showToast(`Angle mode: ${label}`);
    };

    /* =====================
       Voice Recognition
    ===================== */
    window.startVoice = () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { showToast("Voice not supported in this browser"); return; }

        const recognition = new SR();
        showToast("Listening…");

        recognition.onresult = (event) => {
            let speech = event.results[0][0].transcript
                .replace(/plus/gi, "+")
                .replace(/minus/gi, "-")
                .replace(/times|multiply|into|multiplied by/gi, "*")
                .replace(/divided? by/gi, "/")
                .replace(/point/gi, ".")
                .replace(/percent/gi, "%")
                .replace(/open (bracket|parenthesis)/gi, "(")
                .replace(/close (bracket|parenthesis)/gi, ")")
                .replace(/\s+/g, "");

            display.value = speech;
            updatePreview();
            window.calculate();
        };

        recognition.onerror = () => { playError(); showToast("Voice recognition failed"); };
        recognition.start();
    };

    /* =====================
       Graph Plotting
    ===================== */
    window.plotGraph = () => {
        const expr = display.value;
        if (!expr.includes("x")) {
            playError();
            showToast("Include 'x' in the expression to plot");
            return;
        }

        const dataX = [], dataY = [];
        for (let x = -10; x <= 10; x += 0.25) {
            const result = safeEval(expr.replace(/x/g, `(${x})`));
            if (result !== null && isFinite(result)) {
                dataX.push(parseFloat(x.toFixed(2)));
                dataY.push(result);
            }
        }

        if (dataY.length === 0) {
            playError();
            showToast("Nothing to plot — expression produced no valid values");
            return;
        }

        graphSection.style.display = "block";
        if (chartInstance) chartInstance.destroy();

        const isDark = !document.body.classList.contains("light");
        const tickColor = isDark ? "rgba(232,232,240,0.4)" : "rgba(0,0,0,0.4)";
        const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";

        chartInstance = new Chart(graphCanvas, {
            type: "line",
            data: {
                labels: dataX,
                datasets: [{
                    label: `f(x) = ${expr}`,
                    data: dataY,
                    borderColor: "#63cab7",
                    backgroundColor: "rgba(99,202,183,0.05)",
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 0,
                    fill: true
                }]
            },
            options: {
                animation: { duration: 600 },
                plugins: {
                    legend: {
                        labels: {
                            color: isDark ? "#e8e8f0" : "#111118",
                            font: { family: "'DM Mono', monospace", size: 11 }
                        }
                    }
                },
                scales: {
                    x: { ticks: { color: tickColor }, grid: { color: gridColor } },
                    y: { ticks: { color: tickColor }, grid: { color: gridColor } }
                }
            }
        });

        showToast("Graph plotted");
    };

    /* =====================
       Currency Converter
    ===================== */
    window.convertCurrency = async () => {
        const amount = parseFloat(display.value);
        if (isNaN(amount)) { playError(); showToast("Enter an amount first"); return; }

        showToast("Fetching live rate…");
        try {
            const res  = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
            const data = await res.json();
            const rate = data.rates.INR;
            const converted = (amount * rate).toFixed(2);
            addToHistory(`$${amount} → ₹`, converted);
            display.value = String(converted);
            updatePreview();
            showToast(`$${amount} = ₹${converted}  (rate: ${rate.toFixed(2)})`);
        } catch {
            playError();
            showToast("Conversion failed — check internet connection");
        }
    };

    /* =====================
       AI Solve
       A rule-based step solver for common expression types.
       Runs entirely client-side — no external API needed.
    ===================== */
    window.solveAI = () => {
        const expr = display.value.trim();
        if (!expr) { showToast("Enter an expression first"); return; }

        const steps = [];
        const result = safeEval(expr);

        // Quadratic detection: ax^2 + bx + c (simple numeric)
        const quadMatch = expr.match(/^(-?\d*\.?\d*)\*?x\*\*2\s*([+-]\s*\d*\.?\d*)\*?x\s*([+-]\s*\d+\.?\d*)$/);
        if (quadMatch) {
            const a = parseFloat(quadMatch[1] || "1");
            const b = parseFloat(quadMatch[2].replace(/\s/g, ""));
            const c = parseFloat(quadMatch[3].replace(/\s/g, ""));
            const disc = b * b - 4 * a * c;
            steps.push("Detected: Quadratic Expression ax² + bx + c");
            steps.push(`a=${a}, b=${b}, c=${c}`);
            steps.push(`Discriminant Δ = b²−4ac = ${b}²−4·${a}·${c} = ${disc}`);
            if (disc > 0) {
                const x1 = ((-b + Math.sqrt(disc)) / (2 * a)).toFixed(4);
                const x2 = ((-b - Math.sqrt(disc)) / (2 * a)).toFixed(4);
                steps.push(`Two real roots: x₁ = ${x1}, x₂ = ${x2}`);
            } else if (disc === 0) {
                const x = (-b / (2 * a)).toFixed(4);
                steps.push(`One real root: x = ${x}`);
            } else {
                steps.push(`No real roots (Δ < 0)`);
            }
        }

        // Percentage detection
        else if (/^\d+\.?\d*%\d+\.?\d*$/.test(expr)) {
            const parts = expr.split("%");
            steps.push(`Percentage: ${parts[0]}% of ${parts[1]}`);
            steps.push(`= (${parts[0]} / 100) × ${parts[1]}`);
            if (result !== null) steps.push(`= ${result}`);
        }

        // Power detection
        else if (expr.includes("**")) {
            const [base, exp] = expr.split("**");
            steps.push(`Power operation: ${base.trim()} raised to ${exp.trim()}`);
            if (result !== null) steps.push(`= ${parseFloat(result.toFixed(10))}`);
        }

        // Trig detection
        else if (/^(sin|cos|tan|asin|acos|atan)/.test(expr)) {
            const fn = expr.match(/^(sin|cos|tan|asin|acos|atan)/)[0];
            steps.push(`Trigonometric function: ${fn}`);
            steps.push(`Mode: ${isDegree ? "Degrees" : "Radians"}`);
            if (result !== null) steps.push(`Result: ${parseFloat(result.toFixed(10))}`);
        }

        // General arithmetic fallback
        else {
            steps.push(`Expression: ${expr}`);
            if (expr.match(/[+\-*/]/)) {
                const ops = [];
                if (expr.includes("+")) ops.push("addition");
                if (expr.includes("-") && !expr.startsWith("-")) ops.push("subtraction");
                if (expr.includes("*")) ops.push("multiplication");
                if (expr.includes("/")) ops.push("division");
                steps.push(`Operations: ${ops.join(", ") || "arithmetic"}`);
                steps.push(`Evaluating using Math.js (order of operations)`);
            }
            if (result !== null) steps.push(`Result: ${parseFloat(result.toFixed(10))}`);
            else steps.push(`Could not evaluate — check the expression`);
        }

        // Update steps panel
        const list = document.getElementById("stepsList");
        list.innerHTML = "";
        steps.forEach(s => {
            const li = document.createElement("li");
            li.textContent = s;
            list.appendChild(li);
        });

        showToast("AI analysis complete");
    };

    /* =====================
       Service Worker
    ===================== */
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    }

    /* =====================
       Init
    ===================== */
    initTheme();
    loadHistory();
    display.addEventListener("input", updatePreview);

});
