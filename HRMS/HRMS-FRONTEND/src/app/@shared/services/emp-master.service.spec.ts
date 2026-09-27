import { TestBed } from '@angular/core/testing';

import { EmpMasterService } from './emp-master.service';

describe('EmpMasterService', () => {
  let service: EmpMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
