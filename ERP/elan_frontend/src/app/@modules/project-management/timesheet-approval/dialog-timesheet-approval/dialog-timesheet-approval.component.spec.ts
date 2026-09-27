import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTimesheetApprovalComponent } from './dialog-timesheet-approval.component';

describe('DialogTimesheetApprovalComponent', () => {
  let component: DialogTimesheetApprovalComponent;
  let fixture: ComponentFixture<DialogTimesheetApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTimesheetApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogTimesheetApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
