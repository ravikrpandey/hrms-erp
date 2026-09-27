import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePaymentActionComponent } from './invoice-payment-action.component';

describe('InvoicePaymentActionComponent', () => {
  let component: InvoicePaymentActionComponent;
  let fixture: ComponentFixture<InvoicePaymentActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicePaymentActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicePaymentActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
