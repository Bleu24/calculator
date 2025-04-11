const solveFlatInPEMDAS = require('./solve');

describe('solveFlatInPEMDAS function with mixed operators', () => {
    let logSpy;

    beforeEach(() => {
        logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        logSpy.mockClear();
    });

    afterEach(() => {
        logSpy.mockRestore();
    });

    test('2 + 3 * 4 should evaluate to 14', () => {
        solveFlatInPEMDAS(['2', '+', '3', '*', '4']);
        expect(logSpy.mock.calls[0][0]).toBe('2+3*4');
        expect(logSpy.mock.calls[1][0]).toBe(14);
    });

    test('10 - 2 / 2 should evaluate to 9', () => {
        solveFlatInPEMDAS(['10', '-', '2', '/', '2']);
        expect(logSpy.mock.calls[0][0]).toBe('10-2/2');
        expect(logSpy.mock.calls[1][0]).toBe(9);
    });

    test('1 + 2 - 3 should evaluate to 0', () => {
        solveFlatInPEMDAS(['1', '+', '2', '-', '3']);
        expect(logSpy.mock.calls[0][0]).toBe('1+2-3');
        expect(logSpy.mock.calls[1][0]).toBe(0);
    });

    test('2 * 3 + 4 / 2 should evaluate to 8', () => {
        solveFlatInPEMDAS(['2', '*', '3', '+', '4', '/', '2']);
        expect(logSpy.mock.calls[0][0]).toBe('2*3+4/2');
        expect(logSpy.mock.calls[1][0]).toBe(8);
    });

    test('20 / 5 + 3 * 2 should evaluate to 10', () => {
        solveFlatInPEMDAS(['20', '/', '5', '+', '3', '*', '2']);
        expect(logSpy.mock.calls[0][0]).toBe('20/5+3*2');
        expect(logSpy.mock.calls[1][0]).toBe(10);
    });
});

// We recommend installing an extension to run jest tests.