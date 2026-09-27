import { TestBed } from '@angular/core/testing';

import { YearlyAssessmentService } from './yearly-assessment.service';

describe('YearlyAssessmentService', () => {
  let service: YearlyAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YearlyAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
