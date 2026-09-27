import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTrendReportComponent } from './expense-trend-report.component';

describe('ExpenseTrendReportComponent', () => {
  let component: ExpenseTrendReportComponent;
  let fixture: ComponentFixture<ExpenseTrendReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseTrendReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseTrendReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
