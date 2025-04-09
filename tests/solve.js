const solve = (expression) => {
    let evaluatedExpression = expression.join('');
    console.log(evaluatedExpression);
    let result = new Function(`return ${evaluatedExpression}`);
    console.log(result());
}

module.exports = [solve, sanitize];