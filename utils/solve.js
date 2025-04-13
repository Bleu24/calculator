export const solveFlatInPEMDAS = (expression) => {

        let evaluatedExpression = expression.join('');
        console.log(evaluatedExpression);
        let result = new Function(`return ${evaluatedExpression}`);
        let answer = result();
        return answer;

}

export const dynamicSolve = (expression, lastValidResult, renderResult) => {
        if (expression.length < 3) return null;

        if (
                expression[0].type !== 'number' || 
                expression[1].type !== 'operator' ||
                expression[2].type !== 'number'
        ) 
        { 
                if (typeof lastValidResult.value === 'number') {
                        expression.length = 0;
                        expression.push({type: 'number', value: lastValidResult.value});
                        renderResult(lastValidResult.value);
                }

                return null; 
        }

        let firstThree = expression.slice(0,3);

        let operand1 = parseFloat(firstThree[0].value);
        let operator = firstThree[1].value;
        let operand2 = parseFloat(firstThree[2].value);

        let result;
        switch (operator) {
            case '+': result = operand1 + operand2; break;
            case '-': result = operand1 - operand2; break;
            case '*': result = operand1 * operand2; break;
            case '/': result = operand1 / operand2;
            break;
            default: return;
        }

        lastValidResult.value = result;
        expression.splice(0, 3, {type: 'number', value: result});

        renderResult(result);

        return result;

}

// module.exports = solve;