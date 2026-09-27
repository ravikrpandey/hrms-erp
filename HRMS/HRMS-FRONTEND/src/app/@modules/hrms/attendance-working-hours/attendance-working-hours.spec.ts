import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceWorkingHours } from './attendance-working-hours';

describe('AttendanceWorkingHours', () => {
  let component: AttendanceWorkingHours;
  let fixture: ComponentFixture<AttendanceWorkingHours>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceWorkingHours]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceWorkingHours);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
