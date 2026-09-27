import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingSalesInvoiceComponent } from './pending-sales-invoice.component';

describe('PendingSalesInvoiceComponent', () => {
  let component: PendingSalesInvoiceComponent;
  let fixture: ComponentFixture<PendingSalesInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingSalesInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingSalesInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
