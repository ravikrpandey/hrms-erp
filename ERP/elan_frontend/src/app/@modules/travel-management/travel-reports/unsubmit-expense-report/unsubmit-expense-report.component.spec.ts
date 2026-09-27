import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubmitExpenseReportComponent } from './unsubmit-expense-report.component';

describe('UnsubmitExpenseReportComponent', () => {
  let component: UnsubmitExpenseReportComponent;
  let fixture: ComponentFixture<UnsubmitExpenseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsubmitExpenseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnsubmitExpenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
