import { AbstractControl } from '@angular/forms';

const allowedHtmlTags = new Set([
    'a',
    'b',
    'blockquote',
    'code',
    'del',
    'dd',
    'dl',
    'dt',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'i',
    'img',
    'kbd',
    'li',
    'ol',
    'p',
    'pre',
    's',
    'sup',
    'sub',
    'strong',
    'strike',
    'ul',
    'br',
    'hr',
]);

export function htmlValidator(
    control: AbstractControl,
): { [key: string]: any } | null {
    const { value } = control;
    if (!value) return null;
    const htmlTags = value.match(/<[a-z\d]+/gi);
    if (!htmlTags) return null;
    for (let tag of htmlTags) {
        tag = tag.slice(1);
        if (!allowedHtmlTags.has(tag))
            return { HTML: { value: control.value } };
    }
    return null;
}
