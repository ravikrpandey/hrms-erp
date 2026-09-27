import { TestBed } from '@angular/core/testing';

import { RbacMasterService } from './rbac-master.service';

describe('RbacMasterService', () => {
  let service: RbacMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RbacMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
