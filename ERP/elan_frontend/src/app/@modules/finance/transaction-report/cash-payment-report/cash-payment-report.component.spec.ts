import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashPaymentReportComponent } from './cash-payment-report.component';

describe('CashPaymentReportComponent', () => {
  let component: CashPaymentReportComponent;
  let fixture: ComponentFixture<CashPaymentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashPaymentReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashPaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
