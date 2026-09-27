import { TestBed } from '@angular/core/testing';

import { StoreManagementService } from './store-management.service';

describe('StoreManagementService', () => {
  let service: StoreManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
