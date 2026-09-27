import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclePlanningComponent } from './vehicle-planning.component';

describe('VehiclePlanningComponent', () => {
  let component: VehiclePlanningComponent;
  let fixture: ComponentFixture<VehiclePlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiclePlanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
