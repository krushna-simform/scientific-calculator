class Expression {
    evaluateExpression (expression) {
        function factorial (n) {
            if (n === 0 || n === 1) return 1;
            return n * factorial(n - 1);
        }

        try {
            // Remove 0 value exp: 03 => 3
            expression = expression.replace(/\b0+(\d+)/g, "$1");

            // Replace π with Math.PI
            expression = expression.replace(/π/g, "Math.PI");

            // Replace "e" (Euler's number) with Math.E
            expression = expression.replace(/\be\b/g, "Math.E");

            // x^y → Math.pow(x, y)
            expression = expression.replace(/(\d+(\.\d+)?|\([^()]+\))\^(\d+(\.\d+)?|\([^()]+\))/g, "Math.pow($1,$3)");

            // Replace factorial notation
            expression = expression.replace(/(\d+)!/g, "factorial($1)");

            // Trigonometric functions conversion
            expression = expression.replace(/\bsin\(/g, "Math.sin(");
            expression = expression.replace(/\bcos\(/g, "Math.cos(");
            expression = expression.replace(/\btan\(/g, "Math.tan(")

            // Handle other math functions
            expression = expression.replace(/\babs\(/g, "Math.abs(");
            expression = expression.replace(/\bexp\(/g, "Math.exp(");
            expression = expression.replace(/\bsqrt\(/g, "Math.sqrt(");
            expression = expression.replace(/\blog\(/g, "Math.log10(");
            expression = expression.replace(/\bln\b/g, "Math.log");

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