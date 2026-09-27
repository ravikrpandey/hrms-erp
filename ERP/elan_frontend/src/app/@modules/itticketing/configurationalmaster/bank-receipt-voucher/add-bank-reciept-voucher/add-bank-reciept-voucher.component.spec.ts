import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankRecieptVoucherComponent } from './add-bank-reciept-voucher.component';

describe('AddBankRecieptVoucherComponent', () => {
  let component: AddBankRecieptVoucherComponent;
  let fixture: ComponentFixture<AddBankRecieptVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBankRecieptVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBankRecieptVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
