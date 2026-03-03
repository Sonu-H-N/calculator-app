/* ===============================
   Advanced Scientific Calculator
   Professional Structured Version
================================== */

document.addEventListener("DOMContentLoaded", () => {

    const display = document.getElementById("display");
    const historyList = document.getElementById("historyList");
    const graphCanvas = document.getElementById("graph");

    let isDegree = true;
    let clickSound = new Audio("click.mp3");
    let chartInstance = null;

    /* ===============================
       Utility Functions
    ================================== */

    const playSound = () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    };

    const safeEval = (expression) => {
        try {
            return Function(`"use strict"; return (${expression})`)();
        } catch {
            return null;
        }
    };

    const saveHistory = () => {
        localStorage.setItem("calcHistory", historyList.innerHTML);
    };

    const loadHistory = () => {
        const saved = localStorage.getItem("calcHistory");
        if (saved) historyList.innerHTML = saved;
    };

    /* ===============================
       Basic Operations
    ================================== */

    window.appendValue = (val) => {
        playSound();
        display.value += val;
    };

    window.appendFunction = (func) => {
        playSound();
        display.value += func;
    };

    window.clearDisplay = () => display.value = "";

    window.deleteLast = () =>
        display.value = display.value.slice(0, -1);

    window.calculate = () => {
        const result = safeEval(display.value);

        if (result === null) {
            display.value = "Error";
            return;
        }

        addToHistory(`${display.value} = ${result}`);
        display.value = result;
    };

    /* ===============================
       Trigonometry
    ================================== */

    window.applyTrig = (func) => {
        let value = parseFloat(display.value);
        if (isNaN(value)) return;

        if (isDegree) value = value * Math.PI / 180;

        const result = Math[func](value);
        addToHistory(`${func}(${display.value}) = ${result}`);
        display.value = result;
    };

    /* ===============================
       History
    ================================== */

    const addToHistory = (item) => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.prepend(li);
        saveHistory();
    };

    window.clearHistory = () => {
        historyList.innerHTML = "";
        localStorage.removeItem("calcHistory");
    };

    /* ===============================
       Copy Result
    ================================== */

    window.copyResult = async () => {
        try {
            await navigator.clipboard.writeText(display.value);
        } catch {}
    };

    /* ===============================
       Keyboard Support
    ================================== */

    document.addEventListener("keydown", (e) => {

        if (!isNaN(e.key) || "+-*/.%".includes(e.key)) {
            display.value += e.key;
        }

        if (e.key === "Enter") window.calculate();
        if (e.key === "Backspace") window.deleteLast();
        if (e.key === "Escape") window.clearDisplay();
    });

    /* ===============================
       Theme & Mode
    ================================== */

    window.toggleTheme = () => {
        document.body.classList.toggle("light");
    };

    window.toggleMode = () => {
        isDegree = !isDegree;
    };

    /* ===============================
       Voice Recognition
    ================================== */

    window.startVoice = () => {

        if (!('webkitSpeechRecognition' in window)) return;

        const recognition =
            new (window.SpeechRecognition || window.webkitSpeechRecognition)();

        recognition.onresult = (event) => {
            let speech = event.results[0][0].transcript;

            speech = speech
                .replace(/plus/gi, "+")
                .replace(/minus/gi, "-")
                .replace(/multiply|into/gi, "*")
                .replace(/divide/gi, "/");

            display.value = speech;
            window.calculate();
        };

        recognition.start();
    };

    /* ===============================
       Graph Plotting
    ================================== */

    window.plotGraph = () => {

        if (!display.value.includes("x")) return;

        const dataX = [];
        const dataY = [];

        for (let x = -10; x <= 10; x++) {
            const exp = display.value.replace(/x/g, x);
            const y = safeEval(exp);

            if (y !== null) {
                dataX.push(x);
                dataY.push(y);
            }
        }

        if (chartInstance) chartInstance.destroy();

        chartInstance = new Chart(graphCanvas, {
            type: "line",
            data: {
                labels: dataX,
                datasets: [{
                    label: "Graph",
                    data: dataY,
                    borderWidth: 2,
                    tension: 0.3
                }]
            }
        });
    };

    /* ===============================
       Currency Converter
    ================================== */

    window.convertCurrency = async () => {

        const amount = parseFloat(display.value);
        if (isNaN(amount)) return;

        try {
            const res = await fetch(
                "https://api.exchangerate-api.com/v4/latest/USD"
            );
            const data = await res.json();

            const converted = amount * data.rates.INR;
            display.value = converted.toFixed(2);

        } catch {
            display.value = "Conversion Error";
        }
    };

    /* ===============================
       Service Worker
    ================================== */

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("service-worker.js")
            .catch(() => {});
    }

    loadHistory();
});