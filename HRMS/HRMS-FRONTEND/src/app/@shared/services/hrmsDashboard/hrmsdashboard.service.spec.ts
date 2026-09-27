import { TestBed } from '@angular/core/testing';

import { HrmsdashboardService } from './hrmsdashboard.service';

describe('HrmsdashboardService', () => {
  let service: HrmsdashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrmsdashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
