import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpInvoicePdfComponent } from './cp-invoice-pdf.component';

describe('CpInvoicePdfComponent', () => {
  let component: CpInvoicePdfComponent;
  let fixture: ComponentFixture<CpInvoicePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpInvoicePdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpInvoicePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
