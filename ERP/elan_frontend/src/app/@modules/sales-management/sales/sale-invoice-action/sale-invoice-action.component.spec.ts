import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleInvoiceActionComponent } from './sale-invoice-action.component';

describe('SaleInvoiceActionComponent', () => {
  let component: SaleInvoiceActionComponent;
  let fixture: ComponentFixture<SaleInvoiceActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleInvoiceActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleInvoiceActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
