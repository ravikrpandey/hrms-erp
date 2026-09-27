import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankPaymentReportComponent } from './bank-payment-report.component';

describe('BankPaymentReportComponent', () => {
  let component: BankPaymentReportComponent;
  let fixture: ComponentFixture<BankPaymentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankPaymentReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankPaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
