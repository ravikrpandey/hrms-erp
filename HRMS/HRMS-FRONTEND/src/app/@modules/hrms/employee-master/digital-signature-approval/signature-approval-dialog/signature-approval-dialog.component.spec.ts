import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureApprovalDialogComponent } from './signature-approval-dialog.component';

describe('SignatureApprovalDialogComponent', () => {
  let component: SignatureApprovalDialogComponent;
  let fixture: ComponentFixture<SignatureApprovalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureApprovalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignatureApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
