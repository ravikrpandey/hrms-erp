import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetDialogComponent } from './timesheet-dialog.component';

describe('TimesheetDialogComponent', () => {
  let component: TimesheetDialogComponent;
  let fixture: ComponentFixture<TimesheetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimesheetDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimesheetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
