import { TestBed } from '@angular/core/testing';

import { DashboardpageService } from './dashboardpage.service';

describe('DashboardpageService', () => {
  let service: DashboardpageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardpageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
