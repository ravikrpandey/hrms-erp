import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseServiceVoucherComponent } from './purchase-service-voucher.component';

describe('PurchaseServiceVoucherComponent', () => {
  let component: PurchaseServiceVoucherComponent;
  let fixture: ComponentFixture<PurchaseServiceVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseServiceVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseServiceVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
