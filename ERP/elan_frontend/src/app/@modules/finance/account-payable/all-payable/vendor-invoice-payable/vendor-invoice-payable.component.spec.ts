import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorInvoicePayableComponent } from './vendor-invoice-payable.component';

describe('VendorInvoicePayableComponent', () => {
  let component: VendorInvoicePayableComponent;
  let fixture: ComponentFixture<VendorInvoicePayableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorInvoicePayableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorInvoicePayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
