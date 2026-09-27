import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationApprovalComponent } from './quotation-approval.component';

describe('QuotationApprovalComponent', () => {
  let component: QuotationApprovalComponent;
  let fixture: ComponentFixture<QuotationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
