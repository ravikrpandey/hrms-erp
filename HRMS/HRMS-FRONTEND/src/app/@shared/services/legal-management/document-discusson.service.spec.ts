import { TestBed } from '@angular/core/testing';

import { DocumentDiscussonService } from './document-discusson.service';

describe('DocumentDiscussonService', () => {
  let service: DocumentDiscussonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentDiscussonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
