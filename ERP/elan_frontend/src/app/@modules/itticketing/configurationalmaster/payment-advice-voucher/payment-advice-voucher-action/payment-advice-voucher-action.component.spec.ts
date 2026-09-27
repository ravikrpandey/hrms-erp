import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAdviceVoucherActionComponent } from './payment-advice-voucher-action.component';

describe('PaymentAdviceVoucherActionComponent', () => {
  let component: PaymentAdviceVoucherActionComponent;
  let fixture: ComponentFixture<PaymentAdviceVoucherActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentAdviceVoucherActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentAdviceVoucherActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
