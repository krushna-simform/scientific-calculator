class Expression {
    evaluateExpression (expression) {
        try {
            // Remove 0 value exp: 03 => 3
            expression = expression.replace(/\b0+(\d+)/g, "$1");

            // Replace π with Math.PI
            expression = expression.replace(/π/g, "Math.PI");

            // Replace "e" (Euler's number) with Math.E
            expression = expression.replace(/\be\b/g, "Math.E");

            // x^y → Math.pow(x, y)
            expression = expression.replace(/(\d+(\.\d+)?|\([^()]+\))\^(\d+(\.\d+)?|\([^()]+\))/g, "Math.pow($1,$3)");

            // Handle other math functions
            expression = expression.replace(/\babs\(/g, "Math.abs(");

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