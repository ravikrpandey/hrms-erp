import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseInvoiceCreateComponent } from './expense-invoice-create.component';

describe('ExpenseInvoiceCreateComponent', () => {
  let component: ExpenseInvoiceCreateComponent;
  let fixture: ComponentFixture<ExpenseInvoiceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseInvoiceCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseInvoiceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
