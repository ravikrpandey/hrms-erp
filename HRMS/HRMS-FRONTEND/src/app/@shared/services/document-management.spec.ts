import { TestBed } from '@angular/core/testing';

import { DocumentManagement } from './document-management';

describe('DocumentManagement', () => {
  let service: DocumentManagement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentManagement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
