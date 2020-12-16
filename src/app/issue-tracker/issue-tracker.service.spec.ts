import { TestBed } from '@angular/core/testing';

import { IssueTrackerService } from './issue-tracker.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('IssueTrackerService', () => {
    let service: IssueTrackerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(IssueTrackerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
