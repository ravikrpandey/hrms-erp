import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorQuotationApprovalDialogComponent } from './vendor-quotation-approval-dialog.component';

describe('VendorQuotationApprovalDialogComponent', () => {
  let component: VendorQuotationApprovalDialogComponent;
  let fixture: ComponentFixture<VendorQuotationApprovalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorQuotationApprovalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorQuotationApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
