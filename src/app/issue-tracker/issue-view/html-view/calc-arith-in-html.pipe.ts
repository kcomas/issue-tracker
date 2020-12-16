import { Pipe, PipeTransform } from '@angular/core';

const exprRegex = /(?:\d+[\+-]\d+|[\+-]\d+)+/g;

export function generateHtmlExpr(expr: string, result: number) {
    return `<span class="arith" title=${expr}>${result}</span>`;
}

@Pipe({
    name: 'calcArithInHtml',
})
export class CalcArithInHtmlPipe implements PipeTransform {
    transform(html: string, canCalc: boolean): string {
        if (!html || !canCalc) return html;
        const matches = html.match(exprRegex);
        if (!matches) return html;
        for (const expr of matches) {
            const stack = expr.match(/([\+-]|\d+)/g);
            if (!stack || stack.length < 3) continue;
            stack.reverse();
            let result = parseInt(stack.pop() as string);
            while (stack.length > 0) {
                const op = stack.pop() as '+' | '-';
                const next = parseInt(stack.pop() as string);
                switch (op) {
                    case '+':
                        result += next;
                        break;
                    case '-':
                        result -= next;
                        break;
                }
            }
            html = html.replace(expr, generateHtmlExpr(expr, result));
        }
        return html;
    }
}
