import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAdviseReportComponent } from './payment-advise-report.component';

describe('PaymentAdviseReportComponent', () => {
  let component: PaymentAdviseReportComponent;
  let fixture: ComponentFixture<PaymentAdviseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentAdviseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentAdviseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
