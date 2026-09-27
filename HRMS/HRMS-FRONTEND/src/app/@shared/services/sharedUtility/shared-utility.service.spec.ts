import { TestBed } from '@angular/core/testing';

import { SharedUtilityService } from './shared-utility.service';

describe('SharedUtilityService', () => {
  let service: SharedUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
