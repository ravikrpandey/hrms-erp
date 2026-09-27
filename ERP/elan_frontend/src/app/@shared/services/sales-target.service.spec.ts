import { TestBed } from '@angular/core/testing';

import { SalesTargetService } from './sales-target.service';

describe('SalesTargetService', () => {
  let service: SalesTargetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesTargetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
