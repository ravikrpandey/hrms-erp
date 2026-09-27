import { TestBed } from '@angular/core/testing';

import { CompliancesService } from './compliances-service';

describe('CompliancesService', () => {
  let service: CompliancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompliancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
