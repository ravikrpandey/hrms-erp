import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseInvoiceComponent } from './expense-invoice.component';

describe('ExpenseInvoiceComponent', () => {
  let component: ExpenseInvoiceComponent;
  let fixture: ComponentFixture<ExpenseInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
