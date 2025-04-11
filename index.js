import { dynamicSolve, solveFlatInPEMDAS } from './utils/solve.js';

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

    miniDisplay.textContent = '';

    const solve = (tokens) => {

        //in pemdas mode
        if(!isRegularMode) {
            return solveFlatInPEMDAS(sanitize(tokens));
        }

        if(isRegularMode) {
            return dynamicSolve(tokens, result => {
                mainDisplay.textContent = result;
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
        } else {
            isRegularMode = true;
            modeButton.dataset.mode = true;
            modeText.textContent = "Regular Calculator";
        }
    });
    

    keypad.addEventListener('click', (e) => {
        
        let operator;

        if (e.target.classList.contains('calculator__button--number')) {
            input.type = 'number';
            input.value.push(e.target.textContent);
            let displayedVal = input.value.join('');
            mainDisplay.textContent = displayedVal;
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
                default:
                    break;
            }
        }

        if (e.target.classList.contains('calculator__button--control')) {
            switch (e.target.textContent) {
                case 'CE':
                   
                    break;
                case 'C':
                    
                    break;
                case '⌫':
                    
                    break;
                case '=':
                    control = {type: 'control', value: '='};
                    
                    break;
                default:
                    break;
            }
        }
    })

    










});