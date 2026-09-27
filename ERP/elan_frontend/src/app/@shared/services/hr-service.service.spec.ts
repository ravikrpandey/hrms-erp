import { TestBed } from '@angular/core/testing';

import { HrServiceService } from './hr-service.service';

describe('HrServiceService', () => {
  let service: HrServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
