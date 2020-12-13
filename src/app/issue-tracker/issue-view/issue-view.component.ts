import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IssueTrackerService, Issue } from '../issue-tracker.service';

@Component({
    selector: 'app-issue-view',
    templateUrl: './issue-view.component.html',
    styleUrls: ['./issue-view.component.sass'],
})
export class IssueViewComponent {
    @Input() issue: Issue = { id: -1, title: '', text: '', tags: [] };

    @Input() allTags: Set<string> = new Set();

    @Input() calcArith = false;

    @Input() editorLock = false;

    editing = false;

    @Output() setEditorLock = new EventEmitter<boolean>();

    constructor(private issueTrackerService: IssueTrackerService) {}

    unlockEditor() {
        this.editing = false;
        this.setEditorLock.emit(false);
    }

    lockEditor() {
        this.editing = true;
        this.setEditorLock.emit(true);
    }

    deleteIssue(issueId: number) {
        this.issueTrackerService.deleteIssue(issueId);
    }
}
