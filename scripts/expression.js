class Expression {
    evaluateExpression (expression) {
        try {
            // Remove 0 value exp: 03 => 3
            expression = expression.replace(/\b0+(\d+)/g, "$1");

            if (eval(expression) == "Infinity") {
                alert("Inifinity | Invalid expression");
            } else {
                return eval(expression);
            }
        } catch (err) {
            throw new Error("Invalid Expression");
        }
    }
}

export { Expression };