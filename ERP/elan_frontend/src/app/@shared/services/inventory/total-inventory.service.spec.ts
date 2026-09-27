import { TestBed } from '@angular/core/testing';

import { TotalInventoryService } from './total-inventory.service';

describe('TotalInventoryService', () => {
  let service: TotalInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TotalInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
