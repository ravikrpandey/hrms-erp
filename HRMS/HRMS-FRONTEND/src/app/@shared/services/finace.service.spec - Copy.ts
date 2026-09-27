import { TestBed } from '@angular/core/testing';

import { FinaceService } from './finace.service';

describe('FinaceService', () => {
  let service: FinaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
