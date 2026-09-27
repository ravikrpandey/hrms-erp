import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleVendorMasterDialogComponent } from './vehicle-vendor-master-dialog.component';

describe('VehicleVendorMasterDialogComponent', () => {
  let component: VehicleVendorMasterDialogComponent;
  let fixture: ComponentFixture<VehicleVendorMasterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleVendorMasterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleVendorMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
