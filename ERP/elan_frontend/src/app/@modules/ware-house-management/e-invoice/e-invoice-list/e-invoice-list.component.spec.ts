import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EInvoiceListComponent } from './e-invoice-list.component';

describe('EInvoiceListComponent', () => {
  let component: EInvoiceListComponent;
  let fixture: ComponentFixture<EInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EInvoiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
