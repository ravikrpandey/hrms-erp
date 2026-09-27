import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedSalesInvoiceComponent } from './approved-sales-invoice.component';

describe('ApprovedSalesInvoiceComponent', () => {
  let component: ApprovedSalesInvoiceComponent;
  let fixture: ComponentFixture<ApprovedSalesInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedSalesInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedSalesInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
