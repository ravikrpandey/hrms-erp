import { TestBed } from '@angular/core/testing';

import { ItticketingService } from './itticketing.service';

describe('ItticketingService', () => {
  let service: ItticketingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItticketingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
