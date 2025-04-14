import { dynamicSolve, solveFlatInPEMDAS } from './utils/solve.js';
import { resetCalculatorAfterError } from './utils/recoverFromError.js';
import { formatNumber } from './utils/roundToTwo.js';

document.addEventListener('DOMContentLoaded', () => {

    //declare nodes
    const keypad = document.querySelector('.calculator__keypad');
    const mainDisplay = document.querySelector('.calculator__screen-current');
    const miniDisplay = document.querySelector('.calculator__screen-mini');
    const modeButton = document.querySelector('.mode-button');
    const modeIcon = document.querySelector('.mode-button__icon');
    const modeText = document.querySelector('.mode-button__text');

    //modes state (default state)
    let isRegularMode = modeButton.dataset.mode;
    

    //input-related logic
    let expressionStack = [];
    let input = {type: 'number', value: []};
    let lastValidResult = {value: 0};

    miniDisplay.textContent = '';

    const overwrite = () => {
        const last = expressionStack.at(-1);

        const shouldFlush =
        last &&
        last.type === 'number' &&
        input.value.length === 0 &&
        expressionStack.length === 1 &&
        lastValidResult.value !== undefined;

        //works if user wants to overwrite a result
        if(shouldFlush){
            expressionStack.length = 0;
            input.value = [];
       }
    }


    const processEquals = () => {
        if (input.value.length > 0) {
            expressionStack.push({
                type: 'number',
                value: input.value.join('')
            });

            input.value = [];
        }

        //removes trailing operator
        if (expressionStack.at(-1)?.type === 'operator') {
            expressionStack.pop();
        }

        let result = isRegularMode ? 
                    dynamicSolve(expressionStack, lastValidResult, result => {
                        mainDisplay.textContent = formatNumber(result);
                    }) :
                    solveFlatInPEMDAS(sanitize(expressionStack));
        
        
        if (result === null) return;

        mainDisplay.textContent = formatNumber(result);
        miniDisplay.textContent = formatNumber(result);


    }

    const solve = (tokens) => {

        //in pemdas mode
        if(!isRegularMode) {
            return solveFlatInPEMDAS(sanitize(tokens));
        }

        if(isRegularMode) {
            return dynamicSolve(tokens, lastValidResult, result => {
                mainDisplay.textContent = formatNumber(result);
            });
        }
    }

    //this is purely for flat expressions and not dynamic solving
    const sanitize = (stack) => {

        //filtering any chaining operators
        let sanitizedStack = [];
        
        for (let i = 0; i < stack.length; i++ ) {
            if (stack[i].type === 'number') {
                sanitizedStack.push(stack[i]);
            }
    
            if (stack[i+1] !== undefined) {
                if (stack[i+1].type === 'number' && stack[i].type === 'operator') {
                    sanitizedStack.push(stack[i]);
                }
            }
        }
    
        
        //check if any trailing operators, skips if none
        if (sanitizedStack[sanitizedStack.length - 1].type === 'operator') {
            let arrValues = sanitizedStack.slice(0,-1);
            return arrValues.map(obj => obj.value);
        }
    
        //assign to a transformed array to only values
        sanitizedStack = sanitizedStack.map(exp => exp.value);
        
    
        return sanitizedStack;
    }

    let setExpression = (input , token) => {
        if (input.value.at(-1) === '.') {
            input.value.pop();
        }

        let value = input.value.join('');
        if (
            input.type === 'number' &&
            value === '' &&
            token.type === 'operator' &&
            expressionStack.length === 0
          ) {
            value = ['+', '-'].includes(token.value) ? 0 : 1;
          }
        


        if (value !== '') expressionStack.push({ type: input.type, value: value });

        //replaces the current token with new token
        if (token && token.type === 'operator') {
            const last = expressionStack[expressionStack.length - 1];
    
            if (last && last.type === 'operator') {
                expressionStack[expressionStack.length - 1] = token;
                input.value = []; 
                return; // exit early, no solve yet
            }
    
            // Otherwise, push new operator
            expressionStack.push(token);
            solve(expressionStack);
        }
        
        //reset calculator input buffer
        input.value = [];
           
    }

    // Create keypad buttons

    const keys = [
        { label: '%', type: 'calculator__button--operator' },
        { label: 'CE', type: 'calculator__button--control' },
        { label: 'C', type: 'calculator__button--control' },
        { label: '⌫', type: 'calculator__button--control' },
        { label: '1/x', type: 'calculator__button--operator' },
        { label: 'x²', type: 'calculator__button--operator' },
        { label: '√x', type: 'calculator__button--operator' },
        { label: '÷', type: 'calculator__button--operator' },
        { label: '7', type: 'calculator__button--number' },
        { label: '8', type: 'calculator__button--number' },
        { label: '9', type: 'calculator__button--number' },
        { label: '×', type: 'calculator__button--operator' },
        { label: '4', type: 'calculator__button--number' },
        { label: '5', type: 'calculator__button--number' },
        { label: '6', type: 'calculator__button--number' },
        { label: '-', type: 'calculator__button--operator' },
        { label: '1', type: 'calculator__button--number' },
        { label: '2', type: 'calculator__button--number' },
        { label: '3', type: 'calculator__button--number' },
        { label: '+', type: 'calculator__button--operator' },
        { label: '±', type: 'calculator__button--operator' },
        { label: '0', type: 'calculator__button--number' },
        { label: '.', type: 'calculator__button--operator' },
        { label: '=', type: 'calculator__button--control' },
    ];

    keys.forEach( key => {
        let button = document.createElement('div');
        button.textContent = key.label;
        let classes = ['calculator__button', key.type];
        button.classList.add(...classes);
        keypad.appendChild(button);
    });

    //darken on hover
    keypad.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('calculator__button')) {
          e.target.style.filter = 'brightness(150%)';
        }
      });
      
    keypad.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('calculator__button')) {
          e.target.style.filter = '';
        }
      });

    modeButton.addEventListener('click', () => {
        expressionStack = [];
        input.value = [];
        mainDisplay.textContent = '';
        if(isRegularMode) {
            isRegularMode = false;
            modeButton.dataset.mode = false;
            modeText.textContent = "PEMDAS";
            modeIcon.textContent = "📊";
        } else {
            isRegularMode = true;
            modeButton.dataset.mode = true;
            modeText.textContent = "Regular Calculator";
            modeIcon.textContent = "🔢";
        }
    });
    

    keypad.addEventListener('click', (e) => {
        
        let operator;

        if (e.target.classList.contains('calculator__button--number')) {

            overwrite();

            input.type = 'number';
            input.value.push(e.target.textContent);
            let displayedVal = input.value.join('');
            mainDisplay.textContent = formatNumber(displayedVal);
            console.log(input);
        }

        if (e.target.classList.contains('calculator__button--operator')) {
            switch (e.target.textContent) {
                case '+':
                    operator = {type: 'operator', value: '+'}
                    setExpression(input, operator);
                    
                    break;
                case '-':
                    operator = {type: 'operator', value: '-'}
                    setExpression(input, operator);
                    
                    break;
                case '×':
                    operator = {type: 'operator', value: '*'}
                    setExpression(input, operator);
                    
                    break;
                case '÷':
                    operator = {type: 'operator', value: '/'}
                    setExpression(input, operator);
                    break;
                case '.':
                    overwrite();
                    if (!input.value.includes('.')) {
                        if(input.value.length === 0) {
                            input.value.push('0');
                        }
                        input.type = 'number';
                        input.value.push('.');
                        mainDisplay.textContent = formatNumber(input.value.join(''));
                    }
                    break;
                case '±':
                    if (expressionStack.at(-1)?.type === 'number') {
                        let lastResult = lastValidResult.value.toString();
                        let tempBuffer = lastResult.split('');
                        if(!lastResult.at(0).includes('-')) {
                            tempBuffer.unshift('-');
                            mainDisplay.textContent = formatNumber(tempBuffer.join(''));
                        } else {
                            tempBuffer.shift();
                            mainDisplay.textContent = formatNumber(tempBuffer.join(''));
                        }
                        // After updating the display:
                        lastValidResult.value = parseFloat(tempBuffer.join(''));
                        expressionStack[expressionStack.length - 1].value = lastValidResult.value;
                    } else {
                        if (input.value.length === 0) {
                            // Add negative sign to empty input
                            input.type = 'number';
                            input.value.push('-');
                            } else if (input.value[0] === '-') {
                            // Remove negative sign from negative number
                            input.value.shift();
                        } else {
                            // Add negative sign to positive number
                            input.value.unshift('-');
                        }
                            mainDisplay.textContent = formatNumber(input.value.join(''));  
                    }
                    break;
                case '1/x':
                    if (expressionStack.at(-1)?.type === 'number' && input.value.length === 0) {
                        let lastResult = expressionStack.at(-1).value;
                        if (lastResult === 0 || isNaN(lastResult)) {
                            mainDisplay.textContent = 'Undefined';
                            resetCalculatorAfterError();
                        } else {
                            let reciprocal = 1 / lastResult;
                            let shifted = expressionStack.shift();
                            expressionStack.unshift({type: shifted.type, value: reciprocal})
                            mainDisplay.textContent = formatNumber(reciprocal);
                        }
                    } else {
                        if(input.value.length >= 0) {
                            let value = parseFloat(input.value.join(''));
                            if(value === 0 || isNaN(value)){
                                mainDisplay.textContent = "Undefined";
                                resetCalculatorAfterError();
                            } else {
                                let reciprocal = 1 / value;
                                expressionStack.push({type: 'number', value: reciprocal});
                                input.value = [];
                                mainDisplay.textContent = formatNumber(reciprocal);
                            }
                        }
                    }
                    break;
                case 'x²':
                    if (expressionStack.at(-1)?.type === 'number' && input.value.length === 0) {
                        let lastResult = expressionStack.at(-1).value;
                        if (isNaN(lastResult)) {
                            mainDisplay.textContent = 'NaN';
                            resetCalculatorAfterError();
                        } else {
                            let squared = Math.pow(lastResult,2);
                            let shifted = expressionStack.shift();
                            expressionStack.unshift({type: shifted.type, value: squared});
                            mainDisplay.textContent = formatNumber(squared);
                        }
                    } else {
                        if (input.value.length >= 0) {
                            let value = parseFloat(input.value.join(''));
                            let squared = Math.pow(value, 2);
                            expressionStack.push({type: 'number', value: squared});
                            input.value = [];
                            mainDisplay.textContent = formatNumber(squared);
                        }
                    }
                    break;
                case '%':
                    if (expressionStack.length >= 2 && 
                        expressionStack.at(-1)?.type === 'operator' && 
                        expressionStack.at(-2)?.type === 'number' && 
                        input.value.length > 0) {
                        // Context: num1 op num2%
                        let num1 = parseFloat(expressionStack.at(-2).value); // First number
                        let operator = expressionStack.at(-1).value;         // Operator
                        let num2 = parseFloat(input.value.join(''));         // Current input
                        let result;
                        
                        // Calculate based on operation context
                        if (operator === '+' || operator === '-') {
                            // For +/-, calculate percentage of first number
                            result = (num2 / 100) * num1;
                        } else {
                            // For ×/÷, just convert to decimal
                            result = num2 / 100;
                        }
                        
                        input.value = result.toString().split('');
                        mainDisplay.textContent = formatNumber(result);
                    } else if (input.value.length > 0) {
                        // Simple percentage (convert to decimal)
                        let value = parseFloat(input.value.join(''));
                        let percentage = value / 100;
                        input.value = percentage.toString().split('');
                        mainDisplay.textContent = formatNumber(percentage);
                    } else if (expressionStack.at(-1)?.type === 'number') {
                        // Percentage of result in expression stack
                        let value = parseFloat(expressionStack.at(-1).value);
                        let percentage = value / 100;
                        expressionStack[expressionStack.length - 1].value = percentage;
                        mainDisplay.textContent = formatNumber(percentage);
                    }
                    break;
                case '√x':
                    if (expressionStack.at(-1)?.type === 'number' && input.value.length === 0) {
                        let lastResult = expressionStack.at(-1).value;
                        if (lastResult < 0 || isNaN(lastResult)) {
                            mainDisplay.textContent = 'NaN';
                            resetCalculatorAfterError();
                        } else {
                            let sqrt = Math.sqrt(lastResult);
                            let shifted = expressionStack.shift();
                            expressionStack.unshift({type: shifted.type, value: sqrt});
                            mainDisplay.textContent = formatNumber(sqrt);
                        }
                    } else {
                        if (input.value.length >= 0) {
                            let value = parseFloat(input.value.join(''));
                            if (value < 0 || isNaN(value)) {
                                mainDisplay.textContent = "NaN";
                                resetCalculatorAfterError();
                            } else {
                                let sqrt = Math.sqrt(value);
                                expressionStack.push({type: 'number', value: sqrt});
                                input.value = [];
                                mainDisplay.textContent = formatNumber(sqrt);
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        if (e.target.classList.contains('calculator__button--control')) {
            switch (e.target.textContent) {
                case 'CE':
                    if(input.value.length > 0) {
                        input.value = [];
                        mainDisplay.textContent = '';
                    }
                    break;
                case 'C':
                    expressionStack = [];
                    input.value = [];
                    lastValidResult.value = 0;
                    mainDisplay.textContent = '';
                    miniDisplay.textContent = '';
                    break;
                case '⌫':
                    if(input.value.length > 0) {
                        input.value.pop();
                        mainDisplay.textContent = formatNumber(input.value.join(''));
                    }
                    break;
                case '=':
                    processEquals();
                    break;
                default:
                    break;
            }
        }
    })


});