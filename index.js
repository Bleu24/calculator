document.addEventListener('DOMContentLoaded', () => {

    //declare nodes
    const keypad = document.querySelector('.calculator__keypad');
    const mainDisplay = document.querySelector('.calculator__screen-current');
    const miniDisplay = document.querySelector('.calculator__screen-mini');
    const modeButton = document.querySelector('.mode-button');
    const modeIcon = document.querySelector('.mode-button__icon');
    const modeText = document.querySelector('.mode-button__text');

    //mode state (default state)
    let isRegularMode = modeButton.dataset.mode;
    

    //input-related logic
    let expressionStack = [];
    let input = {type: 'number', value: []};
    let operator = {type: 'operator', value: null};  

    miniDisplay.textContent = '';

    const solve = (expression) => {

        if(!isRegularMode) {
            let result;

            let evaluatedExpression = expression.join('');
            console.log(evaluatedExpression);
            miniDisplay.textContent = evaluatedExpression;
            result = new Function(`return ${evaluatedExpression}`);
            let answer = result();

            //flushes the stack and push the result onto a fresh stack
            expressionStack = [];
            expressionStack.push({type: 'number', value: answer});
            console.log(expressionStack);

            return answer;
        }

        if(isRegularMode) {

            
            
            // check if there is one element left, it means it's the result of the whole expression
            if (expression.length === 1) {
                let answer = parseFloat(expression[0]);
                return answer;
            }

            //extract operands and operators
            let operand1 = parseFloat(expression[0]); //used parseFloat for flexibility
            let operator = expression[1];
            let operand2 = parseFloat(expression[2]);

            //operate expression via switch
            let answer;
            switch (operator) {
                case '+':
                    answer = operand1 + operand2;
                    break;
                case '-':
                    answer = operand1 - operand2;
                    break;
                case '*':
                    answer = operand1 * operand2;
                    break;
                case '/':
                    answer = operand1 / operand2;
                    break;
                default:
                    //nothing here yet
                    break;
            }

            let remainingExpression = expression.slice(3);
            let nextExpression = [answer, ...remainingExpression]; //set new expression with result and the remaining tokens

            return solve(nextExpression);

        }
        
        
       
    }

    const sanitize = (rawExp) => {

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
    
        
        //check if any trailing operators, skips if none
        if (sanitizedExp[sanitizedExp.length - 1].type === 'operator') {
            let arrValues = sanitizedExp.slice(0,-1);
            return arrValues.map(obj => obj.value);
        }
    
        //assign to a transformed array to only values
        sanitizedExp = sanitizedExp.map(exp => exp.value);
        
    
        return sanitizedExp;
    }

    let setExpression = (input , expArr, operator) => {
        let value = input.value.join('');
        if (
            input.type === 'number' &&
            value === '' &&
            operator.type === 'operator' &&
            expArr.length === 0
          ) {
            value = ['+', '-'].includes(operator.value) ? 0 : 1;
          }

        
        
        if (value !== '') expArr.push({ type: input.type, value: value });

        if (operator.type === 'operator') {
            expArr.push(operator);
        }

        //reset buffer
        input.value = [];


        // to fix any unwanted inputs
        let sanitizedExpression = sanitize(expArr);
        console.log("Im sanitize bruh     " + sanitizedExpression);

       
        if (operator.type === 'control' && operator.value === '=') {
            let result = solve(sanitizedExpression);
            mainDisplay.textContent = result;  
          }
        
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
                    setExpression(input, expressionStack, operator);
                    console.log(expressionStack);
                    break;
                case '-':
                    operator = {type: 'operator', value: '-'}
                    setExpression(input, expressionStack, operator);
                    console.log(expressionStack);
                    break;
                case '×':
                    operator = {type: 'operator', value: '*'}
                    setExpression(input, expressionStack, operator);
                    console.log(expressionStack);
                    break;
                case '÷':
                    operator = {type: 'operator', value: '/'}
                    setExpression(input, expressionStack, operator);
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
                    operator = {type: 'control', value: '='};
                    setExpression(input, expressionStack, operator);
                    break;
                default:
                    break;
            }
        }
    })

    










});