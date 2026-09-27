import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVehiclePlanningComponent } from './create-vehicle-planning.component';

describe('CreateVehiclePlanningComponent', () => {
  let component: CreateVehiclePlanningComponent;
  let fixture: ComponentFixture<CreateVehiclePlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVehiclePlanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVehiclePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
