class Expression {
    evaluateExpression (expression) {
        try {
            // for remove 0 value exp: 03 => 3
            expression = expression.replace(/\b0+(\d+)/g, "$1");
            return eval(expression);
        } catch (err) {
            throw new Error("Invalid Expression");
        }
    }
}

export { Expression };