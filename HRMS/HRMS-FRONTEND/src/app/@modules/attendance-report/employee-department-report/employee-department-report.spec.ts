import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDepartmentReport } from './employee-department-report';

describe('EmployeeDepartmentReport', () => {
  let component: EmployeeDepartmentReport;
  let fixture: ComponentFixture<EmployeeDepartmentReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDepartmentReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDepartmentReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
