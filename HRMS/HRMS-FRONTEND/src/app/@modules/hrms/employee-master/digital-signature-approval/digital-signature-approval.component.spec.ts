import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSignatureApprovalComponent } from './digital-signature-approval.component';

describe('DigitalSignatureApprovalComponent', () => {
  let component: DigitalSignatureApprovalComponent;
  let fixture: ComponentFixture<DigitalSignatureApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalSignatureApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalSignatureApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
