import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankReceiptVoucherListComponent } from './bank-receipt-voucher-list.component';

describe('BankReceiptVoucherListComponent', () => {
  let component: BankReceiptVoucherListComponent;
  let fixture: ComponentFixture<BankReceiptVoucherListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankReceiptVoucherListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankReceiptVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
