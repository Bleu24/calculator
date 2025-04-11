export const solveFlatInPEMDAS = (expression) => {

        let evaluatedExpression = expression.join('');
        console.log(evaluatedExpression);
        let result = new Function(`return ${evaluatedExpression}`);
        let answer = result();
        return answer;

}

export const dynamicSolve = () => {
        
}

// module.exports = solve;