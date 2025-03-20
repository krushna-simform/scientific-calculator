import { Expression } from "./expression.js";
import { History } from "./history.js";

class Calculator {
    constructor (calculatorSelector, inputFieldSelector, buttonSelectors) {
        // DOM Selectors
        this.calculatorContainer = document.querySelector(calculatorSelector);
        this.inputField = document.querySelector(inputFieldSelector);
        this.buttons = document.querySelectorAll(buttonSelectors);

        this.currentInput = "0";
        this.resultDisplayed = false;
        this.history = [];
        this.isDegreeMode = false;
        this.isSecondPrimary = false;

        this.sinBtn = document.querySelector("button[value='sin']");
        this.cosBtn = document.querySelector("button[value='cos']");
        this.tanBtn = document.querySelector("button[value='tan']");

        this.expression = new Expression();
        this.h = new History(this.history, "history");
        
        this.init();
    }

    init () {
        this.buttons.forEach(button => {
            button.addEventListener("click", (e) => this.handleButtonClick(e));
        });

        document.addEventListener("keydown", (e) => this.handleKeyEvent(e));

        this.setupPopup("button[value='trigonometry']", "trig-popup");
        this.setupPopup("button[value='functions']", "func-popup");
    }

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
        let lastChar = this.currentInput.slice(-1);
        let operator = ["+", "-", "*", "/"];

        if (operator.includes(value) && operator.includes(lastChar)) {
            return;
        } else if (this.resultDisplayed && /[0-9.]/.test(value)) {
            this.clearInputField();
        } else if (value === "." && lastChar === ".") {
            return;
        } else if (value === "." && this.currentInput.split(/[\+\-\*\/]/).pop().includes(".")) {
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
        
        this.history.push({ question: this.currentInput, answer: result});
        this.currentInput = result.toString();
        this.inputField.textContent = this.currentInput;
        this.h.historySave();
    }
}

export { Calculator };