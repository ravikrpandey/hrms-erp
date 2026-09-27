import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogeMyTimesheetComponent } from './dialoge-my-timesheet.component';

describe('DialogeMyTimesheetComponent', () => {
  let component: DialogeMyTimesheetComponent;
  let fixture: ComponentFixture<DialogeMyTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogeMyTimesheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogeMyTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
