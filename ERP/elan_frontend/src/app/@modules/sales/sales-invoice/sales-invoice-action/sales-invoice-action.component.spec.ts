import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesInvoiceAction } from './sales-invoice-action.component';

describe('SalesInvoiceAction', () => {
  let component: SalesInvoiceAction;
  let fixture: ComponentFixture<SalesInvoiceAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesInvoiceAction ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesInvoiceAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
