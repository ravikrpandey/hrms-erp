import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationApprovalActionComponent } from './quotation-approval-action.component';

describe('QuotationApprovalActionComponent', () => {
  let component: QuotationApprovalActionComponent;
  let fixture: ComponentFixture<QuotationApprovalActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationApprovalActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationApprovalActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
