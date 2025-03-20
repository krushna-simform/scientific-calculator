class Expression {
    evaluateExpression (expression) {
        try {
            // Remove 0 value exp: 03 => 3
            expression = expression.replace(/\b0+(\d+)/g, "$1");

            // Replace π with Math.PI
            expression = expression.replace(/π/g, "Math.PI");

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