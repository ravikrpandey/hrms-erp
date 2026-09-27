import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseReimbursementReportComponent } from './expense-reimbursement-report.component';

describe('ExpenseReimbursementReportComponent', () => {
  let component: ExpenseReimbursementReportComponent;
  let fixture: ComponentFixture<ExpenseReimbursementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseReimbursementReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseReimbursementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
