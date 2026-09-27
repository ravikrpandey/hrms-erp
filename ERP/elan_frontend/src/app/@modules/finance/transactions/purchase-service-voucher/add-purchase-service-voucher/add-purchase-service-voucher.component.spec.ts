import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurchaseServiceVoucherComponent } from './add-purchase-service-voucher.component';

describe('AddPurchaseServiceVoucherComponent', () => {
  let component: AddPurchaseServiceVoucherComponent;
  let fixture: ComponentFixture<AddPurchaseServiceVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPurchaseServiceVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPurchaseServiceVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
