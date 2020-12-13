import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IssueTrackerService } from '../issue-tracker.service';
import { htmlValidator } from './htmlValidator';

@Component({
    selector: 'app-issue-editor',
    templateUrl: './issue-editor.component.html',
    styleUrls: ['./issue-editor.component.sass'],
})
export class IssueEditorComponent implements OnInit {
    @Input() id = -1;

    @Input() title = '';

    @Input() text = '';

    @Input() tags: string[] = [];

    @Input() allTags: Set<string> = new Set();

    @Input() editorLock = false;

    @Input() calcArith = false;

    issueTagsClone: Set<string> = new Set();

    searchTags: string[] = [];

    textPreview = false;

    readonly titleMinLength = 3;

    readonly textMinLength = 3;

    readonly newTagMinLength = 1;

    issueForm = new FormGroup({
        title: new FormControl('', [
            Validators.required,
            Validators.minLength(this.titleMinLength),
            Validators.pattern(/^[\w\s]+$/), // only letters numbers and spaces
        ]),
        text: new FormControl('', [
            Validators.required,
            Validators.minLength(this.textMinLength),
            htmlValidator,
        ]),
        newTag: new FormControl('', [
            Validators.minLength(this.newTagMinLength),
            Validators.pattern(/^[a-z\d]+$/), // lowercase letters and numbers
        ]),
    });

    @Output() unlockEditor = new EventEmitter<void>();

    constructor(private issueTrackerService: IssueTrackerService) {}

    ngOnInit() {
        this.issueForm.setValue({
            title: this.title,
            text: this.text,
            newTag: '',
        });
        this.copyTags();
    }

    removeTagFromIssue(tag: string) {
        this.issueTagsClone.delete(tag);
    }

    addTagToIssue(tag: string) {
        this.issueTagsClone.add(tag);
        this.clearSearchTags();
        const control = this.issueForm.get('newTag');
        if (control) control.setValue('');
    }

    searchAndAddTags(event: KeyboardEvent) {
        const control = this.issueForm.get('newTag');
        if (!control) return;
        const { invalid, dirty, touched, value } = control;
        if ((invalid && (dirty || touched)) || value.length < 1) return;
        if (event.key === 'Enter') {
            this.issueTagsClone.add(value);
            control.setValue('');
            return;
        }
        this.clearSearchTags();
        const test = new RegExp(`^${value}`);
        for (const tag of this.allTags) {
            if (test.test(tag) && !this.issueTagsClone.has(tag))
                this.searchTags.push(tag);
        }
    }

    cancelEdit() {
        this.resetForm();
    }

    saveIssue() {
        if (this.editorLock || this.issueFormIsInvalid()) return;
        const { title, text, newTag } = this.issueForm.value;
        if (newTag !== '') this.issueTagsClone.add(newTag);
        this.issueTrackerService.saveIssue(
            this.id,
            title,
            text,
            Array.from(this.issueTagsClone),
        );
        this.resetForm();
    }

    toggleTextPreview(event: MouseEvent) {
        event.preventDefault();
        if (this.issueFormIsInvalid()) this.textPreview = false;
        else this.textPreview = !this.textPreview;
    }

    issueFormIsInvalid() {
        const { invalid, dirty, touched } = this.issueForm;
        return invalid && (dirty || touched);
    }

    getIssueFormText() {
        const control = this.issueForm.get('text');
        if (!control) return '';
        return control.value;
    }

    private resetForm() {
        this.copyTags();
        this.clearSearchTags();
        this.issueForm.reset();
        this.unlockEditor.emit();
    }

    private copyTags() {
        this.issueTagsClone = new Set(this.tags);
    }

    private clearSearchTags() {
        this.searchTags = [];
    }
}
