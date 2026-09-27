import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorInvoiceCreateComponent } from './vendor-invoice-create.component';

describe('VendorInvoiceCreateComponent', () => {
  let component: VendorInvoiceCreateComponent;
  let fixture: ComponentFixture<VendorInvoiceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorInvoiceCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorInvoiceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
