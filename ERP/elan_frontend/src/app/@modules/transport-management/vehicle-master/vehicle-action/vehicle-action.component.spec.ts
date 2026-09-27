import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleActionComponent } from './vehicle-action.component';

describe('VehicleActionComponent', () => {
  let component: VehicleActionComponent;
  let fixture: ComponentFixture<VehicleActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
