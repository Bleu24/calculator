export const solveFlatInPEMDAS = (expression) => {

        let evaluatedExpression = expression.join('');
        console.log(evaluatedExpression);
        let result = new Function(`return ${evaluatedExpression}`);
        let answer = result();
        return answer;

}

export const dynamicSolve = (expression, renderResult) => {
        if (expression.length < 3) return;

        if (
                expression[0].type !== 'number' && 
                expression[1].type !== 'operator' &&
                expression[2].type !== 'number'
        ) 
        { return; }

        let firstThree = expression.slice(0,3);

        let operand1 = parseFloat(firstThree[0].value);
        let operator = firstThree[1].value;
        let operand2 = parseFloat(firstThree[2].value);

        let result;
        switch (operator) {
            case '+': result = operand1 + operand2; break;
            case '-': result = operand1 - operand2; break;
            case '*': result = operand1 * operand2; break;
            case '/': result = operand1 / operand2; break;
            default: return;
        }

        expression.splice(0, 3, {type: 'number', value: result});

        renderResult(result);

}

// module.exports = solve;