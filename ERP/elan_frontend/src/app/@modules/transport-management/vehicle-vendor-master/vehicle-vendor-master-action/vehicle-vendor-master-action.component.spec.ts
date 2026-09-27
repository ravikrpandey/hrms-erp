import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleVendorMasterActionComponent } from './vehicle-vendor-master-action.component';

describe('VehicleVendorMasterActionComponent', () => {
  let component: VehicleVendorMasterActionComponent;
  let fixture: ComponentFixture<VehicleVendorMasterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleVendorMasterActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleVendorMasterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
