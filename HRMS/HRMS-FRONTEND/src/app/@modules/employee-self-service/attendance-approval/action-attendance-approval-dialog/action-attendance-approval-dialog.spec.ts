import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionAttendanceApprovalDialog } from './action-attendance-approval-dialog';

describe('ActionAttendanceApprovalDialog', () => {
  let component: ActionAttendanceApprovalDialog;
  let fixture: ComponentFixture<ActionAttendanceApprovalDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionAttendanceApprovalDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionAttendanceApprovalDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
