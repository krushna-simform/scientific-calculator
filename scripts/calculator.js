import { Expression } from "./expression.js";
import { History } from "./history.js";
import { Memory } from "./memory.js";

class Calculator {
    constructor (calculatorSelector, inputFieldSelector, buttonSelectors) {
        // DOM Selectors
        this.calculatorContainer = document.querySelector(calculatorSelector);
        this.inputField = document.querySelector(inputFieldSelector);
        this.buttons = document.querySelectorAll(buttonSelectors);

        this.currentInput = "0";
        this.resultDisplayed = false;
        this.isDegreeMode = false;
        this.isSecondPrimary = false;

        this.sinBtn = document.querySelector("button[value='sin']");
        this.cosBtn = document.querySelector("button[value='cos']");
        this.tanBtn = document.querySelector("button[value='tan']");

        this.expression = new Expression();
        this.h = new History("history");
        this.memory = new Memory();
        
        this.init();
    }

    init () {
        this.buttons.forEach(button => {
            button.addEventListener("click", (e) => this.handleButtonClick(e));
        });

        document.addEventListener("keydown", (e) => this.handleKeyEvent(e));

        document.getElementById("history-logo").addEventListener("click", () => this.toggleHistoryPopup());
        document.querySelector("#clear-history").addEventListener("click", () => this.clearHistory());

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

        popup.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", (e) => {
                const value = e.target.getAttribute("value");
                if (value) {
                    this.updateInputField(value + "(");
                }
                popup.classList.add("hidden");
            });
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
        let operator = ["+", "-", "*", "/"];

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
            this.displayValue();
            this.resultDisplayed = true;
        } catch (err) {
            alert("Invalid Expression");
        }
    }

    // Toggle RED and DEG button
    toggleDegRed(button) {
        if (button.value == "degree") {
            button.value = "radian";
            button.textContent = "RAD";
            button.ariaLabel = "Radian Mode";
            this.isDegreeMode = true;
        } else {
            button.value = "degree";
            button.textContent = "DEG";
            button.ariaLabel = "Degree Mode";
            this.isDegreeMode = false;
        }
    }

    // Toggle 2nd and Primary button
    toggleSecondPrimary (button) {
        if (button.value == "second-function") {
            button.value = "primary-function";
            button.ariaLabel = "Primary Functions";
            button.textContent = "Primary";
            this.isSecondPrimary = true;

            this.sinBtn.value = this.sinBtn.ariaLabel = this.sinBtn.textContent = "asin"
            this.cosBtn.value = this.cosBtn.ariaLabel = this.cosBtn.textContent = "acos"
            this.tanBtn.value = this.tanBtn.ariaLabel = this.tanBtn.textContent = "atan"
            
        } else {
            button.value = "second-function";
            button.ariaLabel = "Second Functions";
            button.textContent = "2nd";
            this.isSecondPrimary = false;
            
            this.sinBtn.value = this.sinBtn.ariaLabel = this.sinBtn.textContent = "sin"
            this.cosBtn.value = this.cosBtn.ariaLabel = this.cosBtn.textContent = "cos"
            this.tanBtn.value = this.tanBtn.ariaLabel = this.tanBtn.textContent = "tan"
        }
        console.log(this.isSecondPrimary);
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

    // Handle mouse events
    handleButtonClick (e) {
        const button = e.target.closest("button");
        if(!button) return;
        const value = button.value;

        const notPrintValue = ["trigonometry", "functions"];

        if (notPrintValue.includes(value)) {
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
            case "memory-clear": 
                this.memory.memoryClear();
                break;
            case "memory-recall":
                this.updateInputField(this.memory.memoryRecall().toString());
                break;
            case "memory-add":
                this.memory.memoryAdd(parseFloat(this.currentInput) || 0);
                break;
            case "memory-subtract":
                this.memory.memorySubtract(parseFloat(this.currentInput) || 0);
                break;
            case "memory-store":
                this.memory.memoryStore(parseFloat(this.currentInput) || 0);
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

    // Handle keybord events
    handleKeyEvent (e) {
        const key = e.key;

        if (/[0-9.()\+\-\*\/^\!]/.test(key)) {
            this.updateInputField(key);
        } else if (key === "Backspace") {
            this.removeLastCharacter();
        } else if (key.toLowerCase() === "c"){
            this.clearInputField();
        } else if (key === "Enter") {
            this.calculateResult();
        }   
    }

    // Display calculated value in input field and store that value in localstorage
    displayValue () {
        const result = this.expression.evaluateExpression(this.currentInput, this.isDegreeMode);

        if(isNaN(result)) return;
        
        this.h.dataPush({ question: this.currentInput, answer: result}, () => {
            this.displayHistory();
        });
        this.currentInput = result.toString();
        this.inputField.textContent = this.currentInput;
    }
}

export { Calculator };