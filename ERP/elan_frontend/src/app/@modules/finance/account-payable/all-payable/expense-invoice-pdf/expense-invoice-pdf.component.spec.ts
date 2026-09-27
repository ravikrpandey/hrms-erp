import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseInvoicePdfComponent } from './expense-invoice-pdf.component';

describe('ExpenseInvoicePdfComponent', () => {
  let component: ExpenseInvoicePdfComponent;
  let fixture: ComponentFixture<ExpenseInvoicePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseInvoicePdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseInvoicePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
