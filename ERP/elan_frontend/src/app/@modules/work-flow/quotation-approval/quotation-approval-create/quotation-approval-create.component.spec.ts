import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationApprovalCreateComponent } from './quotation-approval-create.component';

describe('QuotationApprovalCreateComponent', () => {
  let component: QuotationApprovalCreateComponent;
  let fixture: ComponentFixture<QuotationApprovalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationApprovalCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationApprovalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
