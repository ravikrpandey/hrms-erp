import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAlertStatusDialogComponent } from './shipping-alert-status-dialog.component';

describe('ShippingAlertStatusDialogComponent', () => {
  let component: ShippingAlertStatusDialogComponent;
  let fixture: ComponentFixture<ShippingAlertStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingAlertStatusDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingAlertStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
