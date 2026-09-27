import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAdviceVoucherListComponent } from './payment-advice-voucher-list.component';

describe('PaymentAdviceVoucherListComponent', () => {
  let component: PaymentAdviceVoucherListComponent;
  let fixture: ComponentFixture<PaymentAdviceVoucherListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentAdviceVoucherListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentAdviceVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
