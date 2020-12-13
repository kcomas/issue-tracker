import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface Issue {
    id: number;
    title: string;
    text: string;
    tags: string[];
}

export enum TagFilterMethod {
    Any, // issue can have any of the tags
    All, // issue must have all of the tags
}

export interface IssueData {
    issues: Issue[];
    tags: Set<string>;
    selectedTags: Set<string>;
    tagFilterMethod: TagFilterMethod;
}

@Injectable({
    providedIn: 'root',
})
export class IssueTrackerService {
    private readonly issueUrl = 'assets/issues.json';

    private readonly localStorageKey = 'issues';

    private allIssues: Issue[] | undefined;

    private selectedTags: Set<string> = new Set();

    private tagFilterMethod = TagFilterMethod.Any;

    private tagMap: { [key: string]: Set<Issue> } = {};

    private idTracker = 1; // track highest id for new issues

    private issueSender: BehaviorSubject<IssueData> = new BehaviorSubject({
        issues: [] as Issue[],
        tags: new Set(Object.keys(this.tagMap)),
        selectedTags: this.selectedTags,
        tagFilterMethod: this.tagFilterMethod,
    });

    constructor(private http: HttpClient) {}

    getIssues() {
        if (!this.allIssues) this.fetchIssues();
        return this.issueSender.asObservable();
    }

    filterByTag(tag: string) {
        if (this.selectedTags.has(tag)) this.selectedTags.delete(tag);
        else this.selectedTags.add(tag);
        this.sendIssues();
    }

    setTagFilterMethod(method: TagFilterMethod) {
        this.tagFilterMethod = method;
        this.sendIssues();
    }

    deleteIssue(deleteId: number) {
        if (!this.allIssues || deleteId === -1) return;
        this.allIssues = this.allIssues.filter(({ id }) => id !== deleteId);
        this.persistIssues();
        this.sendIssues();
    }

    saveIssue(
        newId: number,
        newTitle: string,
        newText: string,
        newTags: string[],
    ) {
        if (!this.allIssues) return;
        const issueUpdate = {
            title: newTitle,
            text: newText,
            tags: newTags,
        };
        if (newId === -1) {
            this.allIssues.push({
                id: this.idTracker,
                ...issueUpdate,
            });
        } else {
            const issue = this.allIssues.find(({ id }) => id === newId);
            if (issue) Object.assign(issue, issueUpdate);
        }
        this.persistIssues();
        this.sendIssues();
    }

    private fetchIssues() {
        try {
            const issueJSONStr = localStorage.getItem(this.localStorageKey);
            if (!issueJSONStr) throw new Error();
            this.allIssues = JSON.parse(issueJSONStr) as Issue[];
            this.sendIssues();
        } catch (_) {
            this.http.get<Issue[]>(this.issueUrl).subscribe((issues) => {
                this.allIssues = issues;
                this.sendIssues();
            });
        }
    }

    private persistIssues() {
        if (this.allIssues)
            localStorage.setItem(
                this.localStorageKey,
                JSON.stringify(this.allIssues),
            );
    }

    private sendIssues() {
        this.buildTagMap();
        let issues = this.allIssues || [];
        if (issues.length > 0 && this.selectedTags.size > 0) {
            const filteredIssues = new Set<Issue>();
            const issueSets = this.getIssueSets();
            switch (this.tagFilterMethod) {
                case TagFilterMethod.Any:
                    issueSets.forEach((issues) =>
                        issues.forEach((issue) => filteredIssues.add(issue)),
                    );
                    break;
                case TagFilterMethod.All:
                    const issueCounterMap = new Map<Issue, number>();
                    issueSets.forEach((issues) =>
                        issues.forEach((issue) => {
                            if (!issueCounterMap.has(issue))
                                issueCounterMap.set(issue, 1);
                            else
                                issueCounterMap.set(
                                    issue,
                                    (issueCounterMap.get(issue) as number) + 1,
                                );
                        }),
                    );
                    for (const [key, value] of issueCounterMap) {
                        if (value === issueSets.length) filteredIssues.add(key);
                    }
                    break;
            }
            issues = Array.from(filteredIssues).sort((a, b) => a.id - b.id); // keep in id order
        }
        this.issueSender.next({
            issues,
            tags: new Set(Object.keys(this.tagMap)),
            selectedTags: this.selectedTags,
            tagFilterMethod: this.tagFilterMethod,
        });
    }

    private getIssueSets() {
        return Object.entries(this.tagMap)
            .filter(([key]) => this.selectedTags.has(key))
            .map(([_, value]) => value);
    }

    private buildTagMap() {
        if (!this.allIssues) return;
        this.tagMap = {};
        for (const issue of this.allIssues) {
            for (const tag of issue.tags) {
                if (!this.tagMap[tag]) {
                    this.tagMap[tag] = new Set();
                }
                this.tagMap[tag].add(issue);
            }
            this.idTracker =
                issue.id > this.idTracker ? issue.id : this.idTracker;
            this.idTracker++; // create a new id for insert
        }
    }
}
