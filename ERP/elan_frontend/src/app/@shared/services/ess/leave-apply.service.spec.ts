import { TestBed } from '@angular/core/testing';

import { LeaveApplyService } from './leave-apply.service';

describe('LeaveApplyService', () => {
  let service: LeaveApplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveApplyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
