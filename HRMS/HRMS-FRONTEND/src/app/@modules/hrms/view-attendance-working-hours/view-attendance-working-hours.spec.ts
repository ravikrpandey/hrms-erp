import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAttendanceWorkingHours } from './view-attendance-working-hours';

describe('ViewAttendanceWorkingHours', () => {
  let component: ViewAttendanceWorkingHours;
  let fixture: ComponentFixture<ViewAttendanceWorkingHours>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAttendanceWorkingHours]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAttendanceWorkingHours);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
