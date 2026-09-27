import { TestBed } from '@angular/core/testing';

import { AssetManagementService } from './asset-management.service';

describe('AssetManagementService', () => {
  let service: AssetManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
