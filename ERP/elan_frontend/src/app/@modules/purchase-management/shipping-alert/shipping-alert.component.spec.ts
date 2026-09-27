import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAlertComponent } from './shipping-alert.component';

describe('ShippingAlertComponent', () => {
  let component: ShippingAlertComponent;
  let fixture: ComponentFixture<ShippingAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
