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

        this.expression = new Expression();
        this.h = new History(this.history, "history");
        
        this.init();
    }

    init () {
        this.buttons.forEach(button => {
            button.addEventListener("click", (e) => this.handleButtonClick(e));
        });

        document.addEventListener("keydown", (e) => this.handleKeyEvent(e));
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

    // Handle mouse events
    handleButtonClick (e) {
        const button = e.target.closest("button");
        if(!button) return;
        const value = button.value;

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

        if (/[0-9.()\+\-\*\/^]/.test(key)) {
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
        const result = this.expression.evaluateExpression(this.currentInput);

        if(isNaN(result)) return;
        
        this.history.push({ question: this.currentInput, answer: result});
        this.currentInput = result.toString();
        this.inputField.textContent = this.currentInput;
        this.h.historySave();
    }
}

export { Calculator };