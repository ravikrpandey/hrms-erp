import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScheduleMaintenanceComponent } from './create-schedule-maintenance.component';

describe('CreateScheduleMaintenanceComponent', () => {
  let component: CreateScheduleMaintenanceComponent;
  let fixture: ComponentFixture<CreateScheduleMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateScheduleMaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateScheduleMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
