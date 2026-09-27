import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVendorPaymentComponent } from './create-vendor-payment.component';

describe('CreateVendorPaymentComponent', () => {
  let component: CreateVendorPaymentComponent;
  let fixture: ComponentFixture<CreateVendorPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVendorPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVendorPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
