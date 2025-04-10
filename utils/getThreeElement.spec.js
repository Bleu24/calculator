const getThreeElements = require('./getThreeElements');

describe('getThreeElements', () => {
    test('should return the first three elements when array length is >= 4', () => {
        const expressionStack = [
            { type: 'number', value: 1 },
            { type: 'operator', value: '+' },
            { type: 'number', value: 2 },
            { type: 'operator', value: '+' }
        ];
        const expected = [
            { type: 'number', value: 1 },
            { type: 'operator', value: '+' },
            { type: 'number', value: 2 }
        ];
        expect(getThreeElements(expressionStack)).toEqual(expected);
    });

    test('should return the array itself when array length is exactly 3', () => {
        const expressionStack = [
            { type: 'number', value: 1 },
            { type: 'operator', value: '+' },
            { type: 'number', value: 2 }
        ];
        const expected = [
            { type: 'number', value: 1 },
            { type: 'operator', value: '+' },
            { type: 'number', value: 2 }
        ];
        expect(getThreeElements(expressionStack)).toEqual(expected);
    });

    test('should throw ReferenceError when array length is less than 3', () => {
        const expressionStack = [
            { type: 'number', value: 1 },
            { type: 'operator', value: '+' }
        ];
        expect(() => getThreeElements(expressionStack)).toThrow(ReferenceError);
    });
});