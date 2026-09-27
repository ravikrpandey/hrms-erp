import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetActionComponent } from './timesheet-action.component';

describe('TimesheetActionComponent', () => {
  let component: TimesheetActionComponent;
  let fixture: ComponentFixture<TimesheetActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimesheetActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimesheetActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
