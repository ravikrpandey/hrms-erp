import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedSalesInvoiceComponent } from './rejected-sales-invoice.component';

describe('RejectedSalesInvoiceComponent', () => {
  let component: RejectedSalesInvoiceComponent;
  let fixture: ComponentFixture<RejectedSalesInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedSalesInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedSalesInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
