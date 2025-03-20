class Expression {
    evaluateExpression (expression, degreeMode = false) {
        function factorial (n) {
            if (n === 0 || n === 1) return 1;
            return n * factorial(n - 1);
        }

        // Define trigonometric functions in degrees
        Math.sindeg = (x) => Math.sin((Math.PI / 180) * x);
        Math.cosdeg = (x) => Math.cos((Math.PI / 180) * x);
        Math.tandeg = (x) => Math.tan((Math.PI / 180) * x);

        Math.asindeg = (x) => (180 / Math.PI) * Math.asin(x);
        Math.acosdeg = (x) => (180 / Math.PI) * Math.acos(x);
        Math.atandeg = (x) => (180 / Math.PI) * Math.atan(x);

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
            if (!degreeMode) {
                expression = expression.replace(/\bsin\(/g, "Math.sindeg(");
                expression = expression.replace(/\bcos\(/g, "Math.cosdeg(");
                expression = expression.replace(/\btan\(/g, "Math.tandeg(");
                expression = expression.replace(/\basin\(/g, "Math.asindeg(");
                expression = expression.replace(/\bacos\(/g, "Math.acosdeg(");
                expression = expression.replace(/\batan\(/g, "Math.atandeg(");
            } else {
                expression = expression.replace(/\bsin\(/g, "Math.sin(");
                expression = expression.replace(/\bcos\(/g, "Math.cos(");
                expression = expression.replace(/\btan\(/g, "Math.tan(");
                expression = expression.replace(/\basin\(/g, "Math.asin(");
                expression = expression.replace(/\bacos\(/g, "Math.acos(");
                expression = expression.replace(/\batan\(/g, "Math.atan("); 
            }

            // Handle other math functions
            expression = expression.replace(/\babs\(/g, "Math.abs(");
            expression = expression.replace(/\bexp\(/g, "Math.exp(");
            expression = expression.replace(/\bsqrt\(/g, "Math.sqrt(");
            expression = expression.replace(/\blog\(/g, "Math.log10(");
            expression = expression.replace(/\bln\b/g, "Math.log");
            expression = expression.replace(/\bfloor\(/g, "Math.floor(");   
            expression = expression.replace(/\bceil\(/g, "Math.ceil(");
            expression = expression.replace(/\bround\(/g, "Math.round(");

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