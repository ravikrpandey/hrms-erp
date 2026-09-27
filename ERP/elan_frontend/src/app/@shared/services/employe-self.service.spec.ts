import { TestBed } from '@angular/core/testing';

import { EmployeSelfService } from './employe-self.service';

describe('EmployeSelfService', () => {
  let service: EmployeSelfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeSelfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
