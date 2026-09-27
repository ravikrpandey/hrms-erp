import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBranchReport } from './employee-branch-report';

describe('EmployeeBranchReport', () => {
  let component: EmployeeBranchReport;
  let fixture: ComponentFixture<EmployeeBranchReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeBranchReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeBranchReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
