import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankPaymentVoucherComponent } from './add-bank-payment-voucher.component';

describe('AddBankPaymentVoucherComponent', () => {
  let component: AddBankPaymentVoucherComponent;
  let fixture: ComponentFixture<AddBankPaymentVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBankPaymentVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBankPaymentVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
