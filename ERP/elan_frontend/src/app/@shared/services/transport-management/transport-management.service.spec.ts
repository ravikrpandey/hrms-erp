import { TestBed } from '@angular/core/testing';

import { TransportManagementService } from './transport-management.service';

describe('TransportManagementService', () => {
  let service: TransportManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransportManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
