const sanitize = require('./sanitize');

describe('sanitize function tests', () => {
    test('removes trailing operator', () => {
        const rawExp = [
            { type: 'number', value: '1' },
            { type: 'operator', value: '+' }
        ];
        // Expect the trailing operator to be removed
        expect(sanitize(rawExp)).toEqual(['1']);
    });

    test('filters out chained operators and returns only valid sequence', () => {
        const rawExp = [
            { type: 'number', value: '1' },
            { type: 'operator', value: '+' },
            { type: 'operator', value: '*' },
            { type: 'number', value: '3' }
        ];
        // The function should filter out the preceding '+' and only include '*' (since it's directly in front of a number)
        // However, note that trailing operator detection is done on the raw array.
        // Because last element is a number, sanitizedExp (from the loop) is used.
        expect(sanitize(rawExp)).toEqual(['1', '*', '3']);
    });

    test('returns only numbers when there are no operators', () => {
        const rawExp = [
            { type: 'number', value: '2' },
            { type: 'number', value: '5' }
        ];
        expect(sanitize(rawExp)).toEqual(['2', '5']);
    });

    test('keeps valid operator in between numbers', () => {
        const rawExp = [
            { type: 'number', value: '4' },
            { type: 'operator', value: '-' },
            { type: 'number', value: '2' }
        ];
        expect(sanitize(rawExp)).toEqual(['4', '-', '2']);
    });

    test('handles expression with multiple operators and no trailing operator correctly', () => {
        const rawExp = [
            { type: 'number', value: '10' },
            { type: 'operator', value: '/' },
            { type: 'number', value: '2' },
            { type: 'operator', value: '+' },
            { type: 'number', value: '3' }
        ];
        expect(sanitize(rawExp)).toEqual(['10', '/', '2', '+', '3']);
    });
});