import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceApprovalStatus } from './attendance-approval-status';

describe('AttendanceApprovalStatus', () => {
  let component: AttendanceApprovalStatus;
  let fixture: ComponentFixture<AttendanceApprovalStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceApprovalStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceApprovalStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
