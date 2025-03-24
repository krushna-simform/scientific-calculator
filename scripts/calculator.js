import { Expression } from "./expression.js";
import { History } from "./history.js";
import { MemoryStorage } from "./calculatorMemoryStorage.js";

class Calculator {
    constructor (calculatorSelector, inputFieldSelector, buttonSelectors, feButton, sinButton, cosButton, tanButton) {
        // DOM Selectors
        this.calculatorContainer = document.querySelector(calculatorSelector);
        this.inputField = document.querySelector(inputFieldSelector);
        this.buttons = document.querySelectorAll(buttonSelectors);

        this.currentInput = "0";
        this.resultDisplayed = false;
        this.isDegreeMode = true;
        this.isSecondPrimary = false;
        this.feMode = false;

        this.feButton = document.querySelector(feButton);

        this.sinBtn = document.querySelector(sinButton);
        this.cosBtn = document.querySelector(cosButton);
        this.tanBtn = document.querySelector(tanButton);

        this.expression = new Expression();
        this.h = new History("history");
        this.memory = new MemoryStorage();
        
        this.init();
    }

    init () {
        this.buttons.forEach(button => {
            button.addEventListener("click", (e) => this.handleButtonClick(e));
        });

        document.addEventListener("keydown", (e) => this.handleKeyEvent(e));

        this.feButton.addEventListener("click", () => this.toggleFE());

        document.getElementById("history-logo").addEventListener("click", () => this.toggleHistoryPopup());
        document.querySelector("#clear-history").addEventListener("click", () => this.clearHistory());
        document.querySelector("#close-button").addEventListener("click", () => this.toggleHistoryPopup());

        this.setupPopup("button[value='trigonometry']", "trig-popup");
        this.setupPopup("button[value='functions']", "func-popup");
    }

    // Toggle trigonometry and functions popup
    setupPopup(triggerSelector, popupId) {
        const trigger = document.querySelector(triggerSelector);
        const popup = document.getElementById(popupId);

        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            popup.classList.toggle("hidden");
        });

        popup.addEventListener("click", (e) => {
            const button = e.target.closest("button");
            if (button) {
              const value = button.getAttribute("value");
              if (value) {
                this.updateInputField(value + "(");
              }
              popup.classList.add("hidden");
            }
        });

        document.addEventListener("click", (e) => {
            if (!popup.contains(e.target) && !trigger.contains(e.target)) {
                popup.classList.add("hidden");
            }
        });
    }

    // Update input field values
    updateInputField (value) {
        if (this.currentInput.length >= 25) {
            alert("You can only add up to 25 characters");
            return;
        }

        let lastChar = this.currentInput.slice(-1);
        let operator = ["+", "-", "*", "/", "%", "^"];

        if (operator.includes(value) && operator.includes(lastChar)) {
            return;
        } else if (this.resultDisplayed && /[0-9.]/.test(value)) {
            this.clearInputField();
        } else if (value === "." && lastChar === ".") {
            return;
        } 
        // Prevents multiple decimal points in a single number (exp = "12.12.2")
        else if (value === "." && this.currentInput.split(/[\+\-\*\/]/).pop().includes(".")) {
            return;
        }   

        this.resultDisplayed = false;
        if (this.inputField.textContent.trim() === "0") {
            this.currentInput = value;
        } else {
            this.currentInput += value
        }
        this.inputField.textContent = this.currentInput;
        this.inputField.scrollTo(this.inputField.offsetWidth, 0);
    }

    // Clear eniter input field
    clearInputField () {
        this.currentInput = "0";
        this.inputField.textContent = this.currentInput;
    }

    // Removes only the last character
    removeLastCharacter () {
        this.currentInput = this.currentInput.slice(0, -1);
        this.inputField.textContent = this.currentInput;
        if (this.inputField.textContent.trim() === "") {
            this.clearInputField();
        }
    }

    calculateResult () {
        try {
            let result = this.expression.evaluateExpression(this.currentInput, this.isDegreeMode);

            if (this.feMode) {
                result = this.toEngineeringNotation(result);
            }

            this.displayValue(result);
            this.resultDisplayed = true;
        } catch (err) {
            alert("Invalid Expression");
        }
    }

    // Convert value into engineering notation
    toEngineeringNotation(value) {
        if (value === 0) return "0";

        let exponent = Math.floor(Math.log10(Math.abs(value)) / 3) * 3;
        let coefficient = value / Math.pow(10, exponent);

        return `${coefficient.toFixed(3)}E${exponent}`;
    }

    // Toggle RED and DEG button
    toggleDegRed(button) {
        const isDeg = this.isDegreeMode;
        button.value = isDeg ? "radian" : "degree";
        button.textContent = isDeg ? "RAD" : "DEG";
        button.ariaLabel = isDeg ? "Radian Mode" : "Degree Mode";
        this.isDegreeMode = !isDeg;
    }

    // Toggle 2nd and Primary button
    toggleSecondPrimary (button) {
        const isSecondMode = this.isSecondPrimary;
        button.value = isSecondMode ? "second-function" : "primary-function";
        button.ariaLabel = isSecondMode ? "Second Functions": "Primary Functions";
        button.textContent = isSecondMode ? "2nd" : "Primary";

        this.sinBtn.value = this.sinBtn.ariaLabel = this.sinBtn.textContent = isSecondMode ? "sin" : "asin";
        this.cosBtn.value = this.cosBtn.ariaLabel = this.cosBtn.textContent = isSecondMode ? "cos" : "acos";
        this.tanBtn.value = this.tanBtn.ariaLabel = this.tanBtn.textContent = isSecondMode ? "tan" : "atan";

        this.isSecondPrimary = !isSecondMode;
    }

    // Toggle history popup
    toggleHistoryPopup() {
        const historyPopup = document.getElementById("history-popup");
        historyPopup.classList.toggle("hidden");
        this.displayHistory();
    }

    // Display history for histroy popup
    displayHistory() {
        const historyList = document.getElementById("history-list");
        historyList.innerHTML = "";
        const historyData = this.h.getHistory();

        if (historyData.length === 0) {
            historyList.innerHTML = "<li>No history available</li>";
            return;
        }

        historyData.forEach(entry => {
            const li = document.createElement("li");
            li.textContent = entry;
            historyList.appendChild(li);
        });
    }

    clearHistory() {
        this.h.clearHistory();
        this.displayHistory();
    }

    // Toggle Engineering notation
    toggleFE() {
        const isFeMode = this.feMode;
        this.feButton.value = isFeMode ? "f-e" : "ex";
        this.feButton.textContent = isFeMode ? "F-E" : "E";
        this.feButton.ariaLabel = isFeMode ? "Default Notation Mode" : "Scientific Notation Mode";

        this.feMode = !isFeMode;
    }

    // Handle mouse events
    handleButtonClick (e) {
        const button = e.target.closest("button");
        if(!button) return;
        const value = button.value;

        const notPrintValue = ["trigonometry", "functions", "f-e", "ex"];

        if (notPrintValue.includes(value)) {
            return;
        } else if (value.startsWith("memory")) {
            this.handleMemoryOperations(value);
            return;
        }

        switch (value) {
            case "clear-all":
                this.clearInputField();
                this.resultDisplayed = false;
                break;
            case "backspace":
                this.removeLastCharacter();
                break;
            case "calculate":
                this.calculateResult();
                break;
            case "degree":
            case "radian":
                this.toggleDegRed(button);
                break;
            case "second-function":
            case "primary-function":
                this.toggleSecondPrimary(button);
                break;
            case "plus-minus":
                if (this.currentInput === "0") return;
                        
                if (this.currentInput.startsWith("-")) {
                    this.currentInput = this.currentInput.slice(1); // remove (-)
                } else {
                    this.currentInput = "-" + this.currentInput; // add (+)
                }
                    
                this.inputField.textContent = this.currentInput;
                break;
            default:
                if (this.resultDisplayed && !/[\+\-\*\/]/.test(value)) {
                    this.clearInputField();
                }
                this.updateInputField(value);
        }
    }

    handleMemoryOperations (value) {
        switch (value) {
            case "memory-clear":
                this.memory.clearMemory();
                break;
            case "memory-recall":
                this.updateInputField(this.memory.recallMemory().toString());
                break;
            case "memory-add":
                this.memory.addToMemory(parseFloat(this.currentInput) || 0);
                break;
            case "memory-subtract":
                this.memory.subtractFromMemory(parseFloat(this.currentInput) || 0);
                break;
            case "memory-store":
                this.memory.storeMemory(parseFloat(this.currentInput) || 0);
                break;
        }
    }

    // Handle keybord events
    handleKeyEvent (e) {
        const key = e.key;

        // Remove focus from last clicked button
        if (document.activeElement.tagName === "BUTTON") {
            document.activeElement.blur();
        }

       if (key === "Backspace") {
            this.removeLastCharacter();
        } else if (key.toLowerCase() === "c") {
            this.clearInputField();
        } else if (key === "Enter") {
            this.calculateResult();
        } else if (key === "E") {
            this.updateInputField("e");
        } else if (/[0-9.()\+\-\*\/^\!e\%]/.test(key)) { 
            this.updateInputField(key.toLowerCase());
        }   
    }

    // Display calculated value in input field and store that value in localstorage
    displayValue (result) {
        if(isNaN(result)) return;
        
        this.h.dataPush({ question: this.currentInput, answer: result}, () => {
            this.displayHistory();
        });
        this.currentInput = result.toString();
        this.inputField.textContent = this.currentInput;
    }
}

export { Calculator };