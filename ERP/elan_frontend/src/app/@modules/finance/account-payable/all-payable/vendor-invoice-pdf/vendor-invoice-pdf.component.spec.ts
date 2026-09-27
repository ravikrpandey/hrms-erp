import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorInvoicePdfComponent } from './vendor-invoice-pdf.component';

describe('VendorInvoicePdfComponent', () => {
  let component: VendorInvoicePdfComponent;
  let fixture: ComponentFixture<VendorInvoicePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorInvoicePdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorInvoicePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
