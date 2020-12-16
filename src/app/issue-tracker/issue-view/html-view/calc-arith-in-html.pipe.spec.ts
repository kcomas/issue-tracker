import {
    CalcArithInHtmlPipe,
    generateHtmlExpr,
} from './calc-arith-in-html.pipe';

describe('CalcArithInHtmlPipe', () => {
    const pipe = new CalcArithInHtmlPipe();
    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });
    it('should evaluate', () => {
        [
            { expr: '4+5-6', result: 3 },
            { expr: '1+2', result: 3 },
            { expr: '1+2+3+4', result: 10 },
            { expr: '10-5-3', result: 2 },
        ].forEach(({ expr, result }) =>
            expect(pipe.transform(expr, true)).toEqual(
                generateHtmlExpr(expr, result),
            ),
        );
    });
    it('should not evalutate', () => {
        ['+1', '-1', '1test+1', '1-test', '1 - test', '4 + 6 - 6'].forEach(
            (expr) => expect(pipe.transform(expr, true)).toEqual(expr),
        );
    });
    it('should ignore evaluation', () => {
        expect(pipe.transform('1 + 2', false)).toEqual('1 + 2');
    });
});
