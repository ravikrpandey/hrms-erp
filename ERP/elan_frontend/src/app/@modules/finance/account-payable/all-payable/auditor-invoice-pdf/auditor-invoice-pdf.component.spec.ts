import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorInvoicePdfComponent } from './auditor-invoice-pdf.component';

describe('AuditorInvoicePdfComponent', () => {
  let component: AuditorInvoicePdfComponent;
  let fixture: ComponentFixture<AuditorInvoicePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditorInvoicePdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditorInvoicePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
