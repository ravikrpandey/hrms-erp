import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTimesheetComponent } from './action-timesheet.component';

describe('ActionTimesheetComponent', () => {
  let component: ActionTimesheetComponent;
  let fixture: ComponentFixture<ActionTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionTimesheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
