import { TestBed } from '@angular/core/testing';

import { WebinarSessionService } from './webinar-session.service';

describe('WebinarSessionService', () => {
  let service: WebinarSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebinarSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
