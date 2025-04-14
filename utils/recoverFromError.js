export const resetCalculatorAfterError = () => {
    setTimeout(() => {
        expressionStack = [];
        input.value = [];
        lastValidResult.value = 0;
        mainDisplay.textContent = '';
        miniDisplay.textContent = '';
    }, 1500);
};

