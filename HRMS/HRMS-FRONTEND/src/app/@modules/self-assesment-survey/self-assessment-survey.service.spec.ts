import { TestBed } from '@angular/core/testing';

import { SelfAssessmentSurveyService } from './self-assessment-survey.service';

describe('SelfAssessmentSurveyService', () => {
  let service: SelfAssessmentSurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelfAssessmentSurveyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
