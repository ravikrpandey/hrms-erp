import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingUpdateComponent } from './shipping-update.component';

describe('ShippingUpdateComponent', () => {
  let component: ShippingUpdateComponent;
  let fixture: ComponentFixture<ShippingUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
