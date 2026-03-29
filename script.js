/* ===============================
   CALC — Advanced Scientific Calculator
   Professional Structured Script
================================== */

let memory = 0;

document.addEventListener("DOMContentLoaded", () => {

    const display     = document.getElementById("display");
    const previewEl   = document.getElementById("preview");
    const historyList = document.getElementById("historyList");
    const graphCanvas = document.getElementById("graph");
    const graphSection= document.getElementById("graphSection");
    const memIndicator= document.getElementById("memIndicator");
    const angleModeEl = document.getElementById("angleMode");
    const emptyMsg    = document.getElementById("emptyMsg");

    let isDegree      = true;
    let chartInstance = null;

    /* =====================
       Safe Evaluator
    ===================== */

    const safeEval = (expression) => {
        try {
            return math.evaluate(expression);
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
        setTimeout(() => t.classList.remove("show"), 2000);
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
                // Re-attach click handlers
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
    };

    /* =====================
       Core Operations
    ===================== */

    window.appendValue = (val) => {
        display.value += val;
        updatePreview();
    };

    window.appendFunction = (func) => {
        display.value += func;
        updatePreview();
    };

    window.clearDisplay = () => {
        display.value = "";
        previewEl.textContent = "—";
    };

    window.deleteLast = () => {
        display.value = display.value.slice(0, -1);
        updatePreview();
    };

    window.calculate = () => {
        const expr = display.value;
        if (!expr) return;

        const result = safeEval(expr);

        if (result === null || result === undefined || !isFinite(result)) {
            display.value = "Error";
            previewEl.textContent = "—";
            return;
        }

        const formatted = parseFloat(result.toFixed(10));
        addToHistory(expr, formatted);
        display.value = String(formatted);
        previewEl.textContent = "—";
    };

    /* =====================
       Trigonometry
    ===================== */

    window.applyTrig = (func) => {
        let value = parseFloat(display.value);
        if (isNaN(value)) { showToast("Enter a number first"); return; }

        let result;
        if (['asin', 'acos', 'atan'].includes(func)) {
            // Inverse trig: input is value, output in radians, convert to degrees if needed
            result = Math[func](value);
            if (isDegree) result = result * 180 / Math.PI;
        } else {
            // Direct trig: convert input to radians if needed
            if (isDegree) value = value * Math.PI / 180;
            result = Math[func](value);
        }

        const formatted = parseFloat(result.toFixed(10));
        addToHistory(`${func}(${display.value})`, formatted);
        display.value = String(formatted);
        updatePreview();
    };

    /* =====================
       Memory Functions
    ===================== */

    window.memoryAdd = () => {
        const v = parseFloat(display.value);
        if (!isNaN(v)) {
            memory += v;
            memIndicator.classList.remove("hidden");
            showToast(`M = ${memory}`);
        }
    };

    window.memorySubtract = () => {
        const v = parseFloat(display.value);
        if (!isNaN(v)) {
            memory -= v;
            memIndicator.classList.remove("hidden");
            showToast(`M = ${memory}`);
        }
    };

    window.memoryRecall = () => {
        display.value = String(memory);
        updatePreview();
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
        }
        if (e.key === "Enter")     window.calculate();
        if (e.key === "Backspace") window.deleteLast();
        if (e.key === "Escape")    window.clearDisplay();
    });

    /* =====================
       Theme & Mode
    ===================== */

    window.toggleTheme = () => {
        document.body.classList.toggle("light");
        const isDark = !document.body.classList.contains("light");
        showToast(isDark ? "Dark mode" : "Light mode");
    };

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
        if (!SR) { showToast("Voice not supported"); return; }

        const recognition = new SR();
        showToast("Listening...");

        recognition.onresult = (event) => {
            let speech = event.results[0][0].transcript
                .replace(/plus/gi, "+")
                .replace(/minus/gi, "-")
                .replace(/times|multiply|into/gi, "*")
                .replace(/divide(d by)?/gi, "/")
                .replace(/point/gi, ".")
                .replace(/\s+/g, "");

            display.value = speech;
            updatePreview();
            window.calculate();
        };

        recognition.onerror = () => showToast("Voice error");
        recognition.start();
    };

    /* =====================
       Graph Plotting
    ===================== */

    window.plotGraph = () => {
        const expr = display.value;
        if (!expr.includes("x")) {
            showToast("Include 'x' to plot a graph");
            return;
        }

        const dataX = [], dataY = [];

        for (let x = -10; x <= 10; x += 0.5) {
            const result = safeEval(expr.replace(/x/g, `(${x})`));
            if (result !== null && isFinite(result)) {
                dataX.push(x);
                dataY.push(result);
            }
        }

        graphSection.style.display = "block";
        if (chartInstance) chartInstance.destroy();

        const isDark = !document.body.classList.contains("light");

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
                    fill: true,
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
                    x: {
                        ticks: { color: isDark ? "rgba(232,232,240,0.4)" : "rgba(0,0,0,0.4)" },
                        grid:  { color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }
                    },
                    y: {
                        ticks: { color: isDark ? "rgba(232,232,240,0.4)" : "rgba(0,0,0,0.4)" },
                        grid:  { color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }
                    }
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
        if (isNaN(amount)) { showToast("Enter an amount first"); return; }

        showToast("Fetching rates...");
        try {
            const res  = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
            const data = await res.json();
            const converted = (amount * data.rates.INR).toFixed(2);
            addToHistory(`$${amount} → ₹`, converted);
            display.value = String(converted);
            updatePreview();
            showToast(`$${amount} = ₹${converted}`);
        } catch {
            showToast("Conversion failed");
            display.value = "Error";
        }
    };

    /* =====================
       AI Solve (placeholder)
    ===================== */

    window.solveAI = () => {
        if (!display.value) { showToast("Enter an expression"); return; }
        showToast("AI Solve: coming soon");
    };

    /* =====================
       Service Worker
    ===================== */

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("service-worker.js").catch(() => {});
    }

    /* Init */
    loadHistory();
});
