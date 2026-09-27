import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorInvoiceListComponent } from './vendor-invoice-list.component';

describe('VendorInvoiceListComponent', () => {
  let component: VendorInvoiceListComponent;
  let fixture: ComponentFixture<VendorInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorInvoiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
