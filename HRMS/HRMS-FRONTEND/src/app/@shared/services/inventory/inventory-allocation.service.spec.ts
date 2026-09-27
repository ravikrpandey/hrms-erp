import { TestBed } from '@angular/core/testing';

import { InventoryAllocationService } from './inventory-allocation.service';

describe('InventoryAllocationService', () => {
  let service: InventoryAllocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryAllocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
