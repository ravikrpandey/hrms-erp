import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclePlanActionComponent } from './vehicle-plan-action.component';

describe('VehiclePlanActionComponent', () => {
  let component: VehiclePlanActionComponent;
  let fixture: ComponentFixture<VehiclePlanActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiclePlanActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclePlanActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
