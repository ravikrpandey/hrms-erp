import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceCalenderTableComponent } from './attendance-calender-table.component';

describe('AttendanceCalenderTableComponent', () => {
  let component: AttendanceCalenderTableComponent;
  let fixture: ComponentFixture<AttendanceCalenderTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceCalenderTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceCalenderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
