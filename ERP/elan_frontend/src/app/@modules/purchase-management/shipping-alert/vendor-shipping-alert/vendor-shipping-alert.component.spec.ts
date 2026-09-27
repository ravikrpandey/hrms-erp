import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorShippingAlertComponent } from './vendor-shipping-alert.component';

describe('VendorShippingAlertComponent', () => {
  let component: VendorShippingAlertComponent;
  let fixture: ComponentFixture<VendorShippingAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorShippingAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorShippingAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
