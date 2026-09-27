import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelExpenseReportComponent } from './travel-expense-report.component';

describe('TravelExpenseReportComponent', () => {
  let component: TravelExpenseReportComponent;
  let fixture: ComponentFixture<TravelExpenseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelExpenseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelExpenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
