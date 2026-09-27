import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedSalesInvoiceListComponent } from './approved-sales-invoice-list.component';

describe('ApprovedSalesInvoiceListComponent', () => {
  let component: ApprovedSalesInvoiceListComponent;
  let fixture: ComponentFixture<ApprovedSalesInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedSalesInvoiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedSalesInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
