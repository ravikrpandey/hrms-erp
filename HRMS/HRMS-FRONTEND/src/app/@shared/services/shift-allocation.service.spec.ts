import { TestBed } from '@angular/core/testing';

import { ShiftAllocationService } from './shift-allocation.service';

describe('ShiftAllocationService', () => {
  let service: ShiftAllocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftAllocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
