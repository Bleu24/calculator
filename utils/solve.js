export const solve = (expression) => {

    if(true){
        let evaluatedExpression = expression.join('');
        console.log(evaluatedExpression);
        let result = new Function(`return ${evaluatedExpression}`);
        let answer = result();
        return answer;
    }

    
   
}

// module.exports = solve;