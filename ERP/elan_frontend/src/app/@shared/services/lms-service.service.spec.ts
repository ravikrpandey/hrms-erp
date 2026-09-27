import { TestBed } from '@angular/core/testing';

import { LmsServiceService } from './lms-service.service';

describe('LmsServiceService', () => {
  let service: LmsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LmsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
