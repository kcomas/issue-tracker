import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-issue-html-view',
    templateUrl: './html-view.component.html',
    styleUrls: ['./html-view.component.sass'],
    encapsulation: ViewEncapsulation.None,
})
export class HtmlViewComponent {
    @Input() html = '';

    @Input() calcArith = false;
}
