import { TestBed } from '@angular/core/testing';

import { EmployeeTransferService } from './employee-transfer.service';

describe('EmployeeTransferService', () => {
  let service: EmployeeTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
