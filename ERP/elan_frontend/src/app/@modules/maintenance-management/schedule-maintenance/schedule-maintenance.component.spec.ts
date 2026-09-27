import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMaintenanceComponent } from './schedule-maintenance.component';

describe('ScheduleMaintenanceComponent', () => {
  let component: ScheduleMaintenanceComponent;
  let fixture: ComponentFixture<ScheduleMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleMaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
