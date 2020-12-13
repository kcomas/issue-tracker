import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    IssueTrackerService,
    Issue,
    TagFilterMethod,
} from './issue-tracker.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-issue-tracker',
    templateUrl: './issue-tracker.component.html',
    styleUrls: ['./issue-tracker.component.sass'],
})
export class IssueTrackerComponent implements OnInit, OnDestroy {
    issues: Issue[] = [];

    allTags: Set<string> = new Set();

    selectedTags: Set<string> = new Set();

    tagFilterMethod = TagFilterMethod.Any;

    calcArith = true;

    editorLock = false; // prevent mutiple editors and settings being changed

    get tagFilterMethodTypes() {
        return TagFilterMethod;
    }

    private issueSubscriber: Subscription | undefined;

    constructor(private issueTrackerService: IssueTrackerService) {}

    ngOnInit() {
        this.issueSubscriber = this.issueTrackerService
            .getIssues()
            .subscribe(({ issues, tags, selectedTags, tagFilterMethod }) => {
                this.issues = issues;
                this.allTags = tags;
                this.selectedTags = selectedTags;
                this.tagFilterMethod = tagFilterMethod;
            });
    }

    ngOnDestroy() {
        if (this.issueSubscriber) this.issueSubscriber.unsubscribe();
        this.issueSubscriber = undefined;
    }

    filterByTag(tag: string) {
        if (this.editorLock) return;
        this.issueTrackerService.filterByTag(tag);
    }

    isTagSelected(tag: string) {
        return this.selectedTags.has(tag);
    }

    toggleCalcArith() {
        this.calcArith = !this.calcArith;
    }

    setTagFilterMethod(method: TagFilterMethod) {
        this.issueTrackerService.setTagFilterMethod(method);
    }

    setEditorLock(lockValue: boolean) {
        this.editorLock = lockValue;
    }
}
