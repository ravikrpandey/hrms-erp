import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentAdviceVoucherComponent } from './add-payment-advice-voucher.component';

describe('AddPaymentAdviceVoucherComponent', () => {
  let component: AddPaymentAdviceVoucherComponent;
  let fixture: ComponentFixture<AddPaymentAdviceVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPaymentAdviceVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPaymentAdviceVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
