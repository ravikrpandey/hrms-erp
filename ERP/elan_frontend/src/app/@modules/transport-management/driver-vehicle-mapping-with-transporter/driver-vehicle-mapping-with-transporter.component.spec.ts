import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverVehicleMappingWithTransporterComponent } from './driver-vehicle-mapping-with-transporter.component';

describe('DriverVehicleMappingWithTransporterComponent', () => {
  let component: DriverVehicleMappingWithTransporterComponent;
  let fixture: ComponentFixture<DriverVehicleMappingWithTransporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverVehicleMappingWithTransporterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverVehicleMappingWithTransporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
