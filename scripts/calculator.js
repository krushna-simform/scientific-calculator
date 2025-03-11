import { Expression } from "./expression.js";

class Calculator {
    constructor (calculatorSelector, inputFieldSelector, buttonSelectors) {
        // DOM Selectors
        this.calculatorContainer = document.querySelector(calculatorSelector);
        this.inputField = document.querySelector(inputFieldSelector);
        this.buttons = document.querySelectorAll(buttonSelectors);

        this.currentInput = "";

        this.expression = new Expression();
        
        this.init();
    }

    init () {
        this.buttons.forEach(button => {
            button.addEventListener("click", (e) => this.handleButtonClick(e));
        });
    }

    updateInputField (value) {
        this.currentInput += value;
        this.inputField.textContent = this.currentInput;
        this.inputField.scrollTo(this.inputField.offsetWidth, 0);
    }

    clearInputField () {
        this.currentInput = "";
        this.inputField.textContent = this.currentInput;
    }

    removeLastCharacter () {
        this.currentInput = this.currentInput.slice(0, -1);
        this.inputField.textContent = this.currentInput;
    }

    handleButtonClick (e) {
        const value = e.target.closest("button").value;

        switch (value) {
            case "clear-all":
                this.clearInputField();
                break;
            case "backspace":
                this.removeLastCharacter();
                break;
            case "calculate":
                try {
                    this.displayValue();
                } catch (err) {
                    alert("Invalid Expression");
                }
                break;
            default:
                this.updateInputField(value);
                break;
        }
    }

    displayValue () {
        const result = this.expression.evaluateExpression(this.currentInput);
        this.currentInput = result.toString();
        this.inputField.textContent = this.currentInput;
    }
}

export { Calculator };