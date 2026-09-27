import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPaymentListComponent } from './vendor-payment-list.component';

describe('VendorPaymentListComponent', () => {
  let component: VendorPaymentListComponent;
  let fixture: ComponentFixture<VendorPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorPaymentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
