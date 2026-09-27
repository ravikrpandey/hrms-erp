import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorShippingTrackingDetailsComponent } from './vendor-shipping-tracking-details.component';

describe('VendorShippingTrackingDetailsComponent', () => {
  let component: VendorShippingTrackingDetailsComponent;
  let fixture: ComponentFixture<VendorShippingTrackingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorShippingTrackingDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorShippingTrackingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
