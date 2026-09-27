import { TestBed } from '@angular/core/testing';

import { AssetallotmentService } from './assetallotment-service';

describe('AssetallotmentService', () => {
  let service: AssetallotmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetallotmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
