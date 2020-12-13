import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IssueTrackerService } from './issue-tracker.service';
import { IssueTrackerComponent } from './issue-tracker.component';
import { IssueViewComponent } from './issue-view/issue-view.component';
import { IssueEditorComponent } from './issue-editor/issue-editor.component';
import { HtmlViewComponent } from './issue-view/html-view/html-view.component';
import { CalcArithInHtmlPipe } from './issue-view/html-view/calc-arith-in-html.pipe';

@NgModule({
    declarations: [
        IssueTrackerComponent,
        IssueViewComponent,
        IssueEditorComponent,
        HtmlViewComponent,
        CalcArithInHtmlPipe,
    ],
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, NgbModule],
    providers: [IssueTrackerService],
    exports: [IssueTrackerComponent],
})
export class IssueTrackerModule {}
