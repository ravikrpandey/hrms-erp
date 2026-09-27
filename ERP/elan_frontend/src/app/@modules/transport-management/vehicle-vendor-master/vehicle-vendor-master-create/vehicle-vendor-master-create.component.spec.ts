import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleVendorMasterCreateComponent } from './vehicle-vendor-master-create.component';

describe('VehicleVendorMasterCreateComponent', () => {
  let component: VehicleVendorMasterCreateComponent;
  let fixture: ComponentFixture<VehicleVendorMasterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleVendorMasterCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleVendorMasterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
