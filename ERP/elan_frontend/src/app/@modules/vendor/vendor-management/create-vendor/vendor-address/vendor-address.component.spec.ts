import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAddressComponent } from './vendor-address.component';

describe('VendorAddressComponent', () => {
  let component: VendorAddressComponent;
  let fixture: ComponentFixture<VendorAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
