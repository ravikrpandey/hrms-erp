import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedTimesheetComponent } from './rejected-timesheet.component';

describe('RejectedTimesheetComponent', () => {
  let component: RejectedTimesheetComponent;
  let fixture: ComponentFixture<RejectedTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedTimesheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
