const expStack = [
    { type: 'number', value: 1 },
    { type: 'operator', value: '+' },
    { type: 'number', value: 2 },
    { type: 'operator', value: '+' }
];

const getThreeElements = (expressionStack) => {

    let threeElementArray = expressionStack;

    if (expressionStack.length < 3) {
        throw new ReferenceError('Array length must be at least 3');
    }

    if(expressionStack.length >= 4) {
        threeElementArray = expressionStack.slice(0,3)
        return threeElementArray;
    } else {
        return threeElementArray;
    }

}

module.exports = getThreeElements;