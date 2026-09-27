import { ComponentFixture, TestBed } from '@angular/core/testing';

import { viewInvoiceIrn } from './view-invoice-irn.component';

describe('viewInvoiceIrn', () => {
  let component: viewInvoiceIrn;
  let fixture: ComponentFixture<viewInvoiceIrn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ viewInvoiceIrn ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(viewInvoiceIrn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
