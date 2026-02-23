let display = document.getElementById("display");
let historyList = document.getElementById("historyList");

function appendValue(value) {
    display.value += value;
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

function addToHistory(item) {
    let li = document.createElement("li");
    li.textContent = item;
    historyList.prepend(li);
}

function clearHistory() {
    historyList.innerHTML = "";
}