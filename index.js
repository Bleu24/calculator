document.addEventListener('DOMContentLoaded', () => {
    
    //imports
    // const solve = require('./tests/solve');

    //declare nodes
    const keypad = document.querySelector('.calculator__keypad');
    const mainDisplay = document.querySelector('.calculator__screen-current');
    

    //input-related logic
    let expressionStack = [];
    let input = {type: null, value: []};
    let mathExp = []

    let setExpression = (input , expArr) => {
        let value = input.value.join('');

        if(value === '' && input.type === 'number') {
            if(input.value === '+' || input.value === '-') {
                value = '0';
            }

            if(input.value === '÷' || input.value === '×') {
                value = '1';
            }
            
        }

        expArr.push({ type: input.type, value: value });
        input.value = [];
        console.log(expArr);
        mainDisplay.textContent = '';
    }

    let finalizeExpression = (stack) => {
        let filtered = stack.filter((expression) => {

        });
    }

    //solving expressions
    // solve(mathExp);
    

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

    keypad.addEventListener('click', e => {
       
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
                    setExpression(input, expressionStack);
                    expressionStack.push({type: 'operator', value: '+'});
                    console.log(expressionStack);
                    break;
                case '-':
                    setExpression(input, expressionStack);
                    expressionStack.push({type: 'operator', value: '-'});
                    console.log(expressionStack);
                    break;
                case '×':
                    setExpression(input, expressionStack);
                    expressionStack.push({type: 'operator', value: '×'});
                    console.log(expressionStack);
                    break;
                case '÷':
                    setExpression(input, expressionStack);
                    expressionStack.push({type: 'operator', value: '÷'});
                    console.log(expressionStack);
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
                    
                    break;
                default:
                    break;
            }
        }
    })

    










});