import { TestBed } from '@angular/core/testing';

import { QuantityManagementService } from './quantity-management.service';

describe('QuantityManagementService', () => {
  let service: QuantityManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuantityManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
