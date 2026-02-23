let display = document.getElementById("display");
let historyList = document.getElementById("historyList");

let isDegree = true;

/* Basic */

function appendValue(val) {
    display.value += val;
}

function appendFunction(func) {
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
}

function clearHistory() {
    historyList.innerHTML = "";
}

/* Keyboard Support */

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