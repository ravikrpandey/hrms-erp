import { TestBed } from '@angular/core/testing';

import { BreakdownManagementService } from './breakdown-management.service';

describe('BreakdownManagementService', () => {
  let service: BreakdownManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreakdownManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
