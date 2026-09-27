import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorShippingTrackingHistoryComponent } from './vendor-shipping-tracking-history.component';

describe('VendorShippingTrackingHistoryComponent', () => {
  let component: VendorShippingTrackingHistoryComponent;
  let fixture: ComponentFixture<VendorShippingTrackingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorShippingTrackingHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorShippingTrackingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
