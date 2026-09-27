import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorInvoicePayableComponent } from './auditor-invoice-payable.component';

describe('AuditorInvoicePayableComponent', () => {
  let component: AuditorInvoicePayableComponent;
  let fixture: ComponentFixture<AuditorInvoicePayableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditorInvoicePayableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditorInvoicePayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
