import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSignatureApprovalActionComponent } from './digital-signature-approval-action.component';

describe('DigitalSignatureApprovalActionComponent', () => {
  let component: DigitalSignatureApprovalActionComponent;
  let fixture: ComponentFixture<DigitalSignatureApprovalActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalSignatureApprovalActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalSignatureApprovalActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
