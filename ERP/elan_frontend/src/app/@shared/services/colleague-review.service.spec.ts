import { TestBed } from '@angular/core/testing';

import { ColleagueReviewService } from './colleague-review.service';

describe('ColleagueReviewService', () => {
  let service: ColleagueReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColleagueReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
