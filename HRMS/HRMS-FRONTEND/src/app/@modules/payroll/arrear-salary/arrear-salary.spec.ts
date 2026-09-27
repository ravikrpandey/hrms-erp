import { TestBed } from '@angular/core/testing';

import { ArrearSalary } from './arrear-salary';

describe('ArrearSalary', () => {
  let service: ArrearSalary;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArrearSalary);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
