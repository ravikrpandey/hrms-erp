import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleInvoiceStatusComponent } from './sale-invoice-status.component';

describe('SaleInvoiceStatusComponent', () => {
  let component: SaleInvoiceStatusComponent;
  let fixture: ComponentFixture<SaleInvoiceStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleInvoiceStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleInvoiceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
