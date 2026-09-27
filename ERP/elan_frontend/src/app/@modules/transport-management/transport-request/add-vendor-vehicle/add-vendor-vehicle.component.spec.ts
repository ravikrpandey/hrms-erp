import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorVehicleComponent } from './add-vendor-vehicle.component';

describe('AddVendorVehicleComponent', () => {
  let component: AddVendorVehicleComponent;
  let fixture: ComponentFixture<AddVendorVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVendorVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVendorVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
