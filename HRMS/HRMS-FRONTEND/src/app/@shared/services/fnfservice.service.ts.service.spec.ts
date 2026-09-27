import { TestBed } from '@angular/core/testing';

import { FnfserviceServiceTsService } from './fnfservice.service.ts.service';

describe('FnfserviceServiceTsService', () => {
  let service: FnfserviceServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FnfserviceServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
