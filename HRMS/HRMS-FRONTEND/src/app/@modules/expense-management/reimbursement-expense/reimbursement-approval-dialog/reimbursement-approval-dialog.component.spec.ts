import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementApprovalDialogComponent } from './reimbursement-approval-dialog.component';

describe('ReimbursementApprovalDialogComponent', () => {
  let component: ReimbursementApprovalDialogComponent;
  let fixture: ComponentFixture<ReimbursementApprovalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementApprovalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
