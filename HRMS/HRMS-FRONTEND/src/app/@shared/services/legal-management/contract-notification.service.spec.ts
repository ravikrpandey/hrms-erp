import { TestBed } from '@angular/core/testing';

import { ContractNotificationService } from './contract-notification.service';

describe('ContractNotificationService', () => {
  let service: ContractNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
