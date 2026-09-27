import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentTravelExpenseReportComponent } from './department-travel-expense-report.component';

describe('DepartmentTravelExpenseReportComponent', () => {
  let component: DepartmentTravelExpenseReportComponent;
  let fixture: ComponentFixture<DepartmentTravelExpenseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentTravelExpenseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentTravelExpenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
