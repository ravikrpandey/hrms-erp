import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureApproverRemarkDialogComponent } from './signature-approver-remark-dialog.component';

describe('SignatureApproverRemarkDialogComponent', () => {
  let component: SignatureApproverRemarkDialogComponent;
  let fixture: ComponentFixture<SignatureApproverRemarkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureApproverRemarkDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignatureApproverRemarkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
