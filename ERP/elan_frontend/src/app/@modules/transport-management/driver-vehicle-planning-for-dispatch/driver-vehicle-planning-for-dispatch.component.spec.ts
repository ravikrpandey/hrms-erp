import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverVehiclePlanningForDispatchComponent } from './driver-vehicle-planning-for-dispatch.component';

describe('DriverVehiclePlanningForDispatchComponent', () => {
  let component: DriverVehiclePlanningForDispatchComponent;
  let fixture: ComponentFixture<DriverVehiclePlanningForDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverVehiclePlanningForDispatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverVehiclePlanningForDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
