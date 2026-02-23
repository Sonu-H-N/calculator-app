let display = document.getElementById("display");
let historyList = document.getElementById("historyList");

let isDegree = true;

/* Sound */
let clickSound = new Audio("click.mp3");

/* Load History */
window.onload = () => {
    let saved = localStorage.getItem("calcHistory");
    if (saved) {
        historyList.innerHTML = saved;
    }
};

/* Basic */

function appendValue(val) {
    playSound();
    display.value += val;
}

function appendFunction(func) {
    playSound();
    display.value += func;
}

function clearDisplay() {
    display.value = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

/* Calculate */

function calculate() {
    try {
        let expression = display.value;
        let result = eval(expression);

        addToHistory(expression + " = " + result);
        display.value = result;

    } catch {
        display.value = "Error";
    }
}

/* Trigonometry */

function applyTrig(func) {
    let value = parseFloat(display.value);

    if (isNaN(value)) return;

    if (isDegree) value = value * Math.PI / 180;

    let result = Math[func](value);

    addToHistory(func + "(" + display.value + ") = " + result);

    display.value = result;
}

/* History */

function addToHistory(item) {
    let li = document.createElement("li");
    li.textContent = item;
    historyList.prepend(li);

    localStorage.setItem("calcHistory", historyList.innerHTML);
}

function clearHistory() {
    historyList.innerHTML = "";
    localStorage.removeItem("calcHistory");
}

/* Copy */

function copyResult() {
    navigator.clipboard.writeText(display.value);
    alert("Copied!");
}

/* Keyboard */

document.addEventListener("keydown", (e) => {

    if (!isNaN(e.key) || "+-*/.%".includes(e.key)) {
        appendValue(e.key);
    }

    if (e.key === "Enter") calculate();
    if (e.key === "Backspace") deleteLast();
    if (e.key === "Escape") clearDisplay();
});

/* Theme */

function toggleTheme() {
    document.body.classList.toggle("light");
}

/* Degree / Radian */

function toggleMode() {
    isDegree = !isDegree;
    alert(isDegree ? "Degree Mode" : "Radian Mode");
}

/* Sound */

function playSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

/* PWA Service Worker */

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}