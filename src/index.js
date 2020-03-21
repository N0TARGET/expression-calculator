function eval() {
    // Do not use eval!!!
    return;
}

const regMultiply = /[-]*[\d.]+[*\/][-]*[\d.]+/;

function expressionCalculator(expr) {
    expr = expr.replace(/\s/g, "");

    var splitExpression = expr.split('');

    var openedCount = (expr.match(/\(/g) || []).length;
    var closedCount = (expr.match(/\)/g) || []).length;
    if (openedCount !== closedCount) throw new Error('ExpressionError: Brackets must be paired');

    return calculateExpression(splitExpression);
}

function calculateExpression(splitExpression) {

    var stack = [];
    var frame = '';

    for (var i = 0; i < splitExpression.length; i++) {
        const symbol = splitExpression[i];
        if (symbol === "(") {
            stack.push(frame);
            frame = '';
            continue;
        }
        if (symbol === ")") {
            if (frame === '') frame = stack.pop();

            var calculatedFrame = String(calculateFrame(String(frame)));
            var pop1 = stack.pop();
            var prevFrame = String(pop1) + String(calculatedFrame);
            stack.push(prevFrame);
            frame = '';

            continue;
        }
        if (splitExpression[i - 1] === ")") {
            frame = stack.pop();
        }
        frame = frame + String(symbol);
    }

    if (stack.length === 0) {
        stack.push(frame);
    } else {
        stack.push(String(stack.pop()) + String(frame));
    }
    
    return calculateFrame(stack.pop());
}

function clearSigns(readyFrame) {
    return readyFrame.split("+-").join("-")
        .split("-+").join("-")
        .split("++").join("+")
        .split("--").join("+");
}

function calculateFrame(readyFrame) {
    readyFrame = clearSigns(readyFrame);
    readyFrame = findAndCalculate(readyFrame, regMultiply, /[*\/]+/);

    var res = 0;
    var sign = "+";
    var value = "";

    for (var i = 0; i < readyFrame.length; i++) {
        if (isSign(readyFrame[i])) {
            res = calculate(Number(res), sign, Number(value));
            sign = readyFrame[i];
            value = "";
        } else {
            value = readyFrame[i] === 'e' ? value : value + readyFrame[i];
        }
    }
    res = calculate(Number(res), sign, Number(value));
    return res;
}

function findAndCalculate(readyFrame, regexp, delimiter) {
    readyFrame = String(readyFrame);
    while (true) {
        var match = readyFrame.match(regexp);
        if (match === null) break;
        var matchedString = match[0];
        var operators = matchedString.split(delimiter);
        var sign = matchedString.replace(operators[0], "").replace(operators[1], "");
        var calculated = String(calculate(operators[0], sign, operators[1]));
        if (operators[0][0] === '-' && operators[1][0] === '-') calculated = '+' + calculated;
        if (calculated === '0') calculated = '+' + calculated;
        readyFrame = readyFrame.replace(matchedString, calculated)
    }
    return readyFrame;
}
function calculate(res, sign, currentSymbol) {
    switch (sign) {
        case '+':
            return Number(res) + Number(currentSymbol);
        case '-':
            return Number(res) - Number(currentSymbol);
        case '*':
            return Number(res) * Number(currentSymbol);
        case '/': {
            if (Number(currentSymbol) === 0) throw new Error('TypeError: Division by zero.');
            return Number(res) / Number(currentSymbol);
        }
    }
}

function isSign(symbol) {
    return symbol === '+' || symbol === '-' || symbol === '*' || symbol === '/';
}

module.exports = {
    expressionCalculator
};