import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeManualInvoiceComponent } from './make-manual-invoice.component';

describe('MakeManualInvoiceComponent', () => {
  let component: MakeManualInvoiceComponent;
  let fixture: ComponentFixture<MakeManualInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeManualInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeManualInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
