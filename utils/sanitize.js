const rawExpressionArray = [
    { type: 'number', value: 1 },
    { type: 'operator', value: '+' },
    { type: 'operator', value: '*' },
    { type: 'number', value: 3 }
];


export const sanitize = (rawExp) => {

    //filtering any chaining operators
    let sanitizedExp = [];
    
    for (let i = 0; i < rawExp.length; i++ ) {
        if (rawExp[i].type === 'number') {
            sanitizedExp.push(rawExp[i]);
        }

        if (rawExp[i+1] !== undefined) {
            if (rawExp[i+1].type === 'number' && rawExp[i].type === 'operator') {
                sanitizedExp.push(rawExp[i]);
            }
        }
    }

    console.log(sanitizedExp);
    //check if any trailing operators, skips if none
    if (rawExp[rawExp.length - 1].type === 'operator') {
        let arrValues = rawExp.slice(0,-1);
        return arrValues.map(obj => obj.value);
    }

    //assign to a transformed array to only values
    sanitizedExp = sanitizedExp.map(exp => exp.value);
    console.log(sanitizedExp);

    return sanitizedExp;
}

sanitize(rawExpressionArray);

// module.exports = sanitize;