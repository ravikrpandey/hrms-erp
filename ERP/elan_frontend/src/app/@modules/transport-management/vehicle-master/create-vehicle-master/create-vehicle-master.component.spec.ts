import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVehicleMasterComponent } from './create-vehicle-master.component';

describe('CreateVehicleMasterComponent', () => {
  let component: CreateVehicleMasterComponent;
  let fixture: ComponentFixture<CreateVehicleMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVehicleMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVehicleMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
