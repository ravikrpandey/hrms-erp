import { TestBed } from '@angular/core/testing';

import { PurchaseMasterService } from './purchase-master.service';

describe('PurchaseMasterService', () => {
  let service: PurchaseMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
