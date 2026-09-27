import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprvedManualInvoiceComponent } from './apprved-manual-invoice.component';

describe('ApprvedManualInvoiceComponent', () => {
  let component: ApprvedManualInvoiceComponent;
  let fixture: ComponentFixture<ApprvedManualInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprvedManualInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprvedManualInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
