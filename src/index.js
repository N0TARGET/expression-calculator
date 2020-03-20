// function eval() {
//     // Do not use eval!!!
//     return;
// }

const regMultiply = /[-]*[\d.]+[\*\/][-]*[\d.]+/;

function expressionCalculator(expr) {
    let splitExpression = expr.split('');

    var openedCount = (expr.match(/\(/g) || []).length;
    var closedCount = (expr.match(/\)/g) || []).length;
    if (openedCount !== closedCount) throw new Error('ExpressionError: Brackets must be paired');

    return calculateExpression(splitExpression);
}

console.log(expressionCalculator("2+2-(3+5+(-7.2/7.2*-2.45+7*-2+5))+7+(6-2)"));

function calculateExpression(splitExpression) {

    var stack = [];
    var frame = '';

    for (let i = 0; i < splitExpression.length; i++) {
        const symbol = splitExpression[i];
        if (symbol === "(") {
            stack.push(frame);
            frame = '';
            continue;
        }
        if (symbol === ")") {
            if (frame !== '') {
                let calculatedFrame = frame === '' ? '' : String(calculateFrame(frame));
                let prevFrame = stack.pop() + calculatedFrame;
                stack.push(prevFrame);
                frame = '';
            } else {
                frame = calculateFrame(stack.pop());
                stack.push(frame);
            }
            continue;
        }
        if (splitExpression[i - 1] === ")") {
            frame = stack.pop();
        }
        frame = frame + symbol;
    }

    if (stack.length === 0) {
        stack.push(frame);
    } else {
        stack.push(stack.pop() + frame);
    }

    console.log(stack);

    return calculateFrame(stack.pop());
}

function clearSigns(readyFrame) {
    return readyFrame.split("+-").join("-")
        .split("-+").join("-")
        .split("++").join("+")
        .split("--").join("+");
}

function calculateFrame(readyFrame) {

    console.log('ready frame   ' + readyFrame);
    readyFrame = findAndCalculate(readyFrame, regMultiply, /[*\/]+/);
    readyFrame = clearSigns(readyFrame);

    // let res = 0;
    // let sign = '';
    // let b = '';
    //
    // if (isNumber(readyFrame[0])) readyFrame = '+' + readyFrame;
    //
    // for (let i = 0; i < readyFrame.length; i++) {
    //     let currentSymbol = readyFrame[i];
    //
    //     if (isSign(currentSymbol)) {
    //         sign = currentSymbol;
    //     } else {
    //         if (b !== '') {
    //             res = calculate(res, sign, b);
    //         }
    //     }
    // }
    // res = calculate(res, sign, second);
    //
    // console.log(res);
    return eval(readyFrame);
}

function isNumber(symbol) {
   return symbol.match('\d') !== null;
}

function findAndCalculate(readyFrame, regexp, delimiter) {
    while (true) {
        var match = readyFrame.match(regexp);
        if (match === null) break;
        let matchedString = match[0];
        let operators = matchedString.split(delimiter);
        let sign = matchedString.replace(operators[0], "").replace(operators[1], "");
        readyFrame = readyFrame.replace(matchedString, calculate(operators[0], sign, operators[1]))
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