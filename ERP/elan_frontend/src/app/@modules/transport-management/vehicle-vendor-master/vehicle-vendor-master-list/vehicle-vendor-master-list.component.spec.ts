import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleVendorMasterListComponent } from './vehicle-vendor-master-list.component';

describe('VehicleVendorMasterListComponent', () => {
  let component: VehicleVendorMasterListComponent;
  let fixture: ComponentFixture<VehicleVendorMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleVendorMasterListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleVendorMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
