import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectManualInvoiceComponent } from './reject-manual-invoice.component';

describe('RejectManualInvoiceComponent', () => {
  let component: RejectManualInvoiceComponent;
  let fixture: ComponentFixture<RejectManualInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectManualInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectManualInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
