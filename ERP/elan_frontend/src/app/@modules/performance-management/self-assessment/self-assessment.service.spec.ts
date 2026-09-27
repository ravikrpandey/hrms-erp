import { TestBed } from '@angular/core/testing';

import { SelfAssessmentService } from './self-assessment.service';

describe('SelfAssessmentService', () => {
  let service: SelfAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelfAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
