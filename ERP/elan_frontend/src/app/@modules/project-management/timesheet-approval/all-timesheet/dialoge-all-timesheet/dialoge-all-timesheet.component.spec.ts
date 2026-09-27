import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogeAllTimesheetComponent } from './dialoge-all-timesheet.component';

describe('DialogeAllTimesheetComponent', () => {
  let component: DialogeAllTimesheetComponent;
  let fixture: ComponentFixture<DialogeAllTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogeAllTimesheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogeAllTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
