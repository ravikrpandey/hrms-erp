import { TestBed } from '@angular/core/testing';

import { HrmServiceService } from './hrm-service.service';

describe('HrmServiceService', () => {
  let service: HrmServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrmServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
