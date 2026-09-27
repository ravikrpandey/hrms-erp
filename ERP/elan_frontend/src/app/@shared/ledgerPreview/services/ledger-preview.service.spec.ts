import { TestBed } from '@angular/core/testing';

import { LedgerPreviewService } from './ledger-preview.service';

describe('LedgerPreviewService', () => {
  let service: LedgerPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LedgerPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
