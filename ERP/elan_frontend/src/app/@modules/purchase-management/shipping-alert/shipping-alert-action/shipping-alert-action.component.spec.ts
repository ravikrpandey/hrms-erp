import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAlertActionComponent } from './shipping-alert-action.component';

describe('ShippingAlertActionComponent', () => {
  let component: ShippingAlertActionComponent;
  let fixture: ComponentFixture<ShippingAlertActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingAlertActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingAlertActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
