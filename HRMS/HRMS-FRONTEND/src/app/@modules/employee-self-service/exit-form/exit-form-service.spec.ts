import { TestBed } from '@angular/core/testing';

import { ExitFormService } from './exit-form-service';

describe('ExitFormService', () => {
  let service: ExitFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExitFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
