import { TestBed } from '@angular/core/testing';

import { EmpRegistrationService } from './emp-registration.service';

describe('EmpRegistrationService', () => {
  let service: EmpRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
