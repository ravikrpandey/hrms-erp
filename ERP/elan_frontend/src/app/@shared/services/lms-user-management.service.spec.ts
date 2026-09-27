import { TestBed } from '@angular/core/testing';

import { LmsUserManagementService } from './lms-user-management.service';

describe('LmsUserManagementService', () => {
  let service: LmsUserManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LmsUserManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
