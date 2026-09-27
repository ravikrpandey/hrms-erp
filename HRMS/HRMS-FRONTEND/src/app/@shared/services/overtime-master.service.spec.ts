import { TestBed } from '@angular/core/testing';

import { OvertimeMasterService } from './overtime-master.service';

describe('OvertimeMasterService', () => {
  let service: OvertimeMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OvertimeMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
