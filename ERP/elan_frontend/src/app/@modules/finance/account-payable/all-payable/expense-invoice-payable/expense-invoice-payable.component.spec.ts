import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseInvoicePayableComponent } from './expense-invoice-payable.component';

describe('ExpenseInvoicePayableComponent', () => {
  let component: ExpenseInvoicePayableComponent;
  let fixture: ComponentFixture<ExpenseInvoicePayableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseInvoicePayableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseInvoicePayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
