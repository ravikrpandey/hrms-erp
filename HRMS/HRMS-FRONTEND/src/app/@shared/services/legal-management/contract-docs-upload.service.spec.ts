import { TestBed } from '@angular/core/testing';

import { ContractDocsUploadService } from './contract-docs-upload.service';

describe('ContractDocsUploadService', () => {
  let service: ContractDocsUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractDocsUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
