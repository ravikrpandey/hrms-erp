import { TestBed } from '@angular/core/testing';

import { DocManagSystemServices } from './doc-manag-system-services';

describe('DocManagSystemServices', () => {
  let service: DocManagSystemServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocManagSystemServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
