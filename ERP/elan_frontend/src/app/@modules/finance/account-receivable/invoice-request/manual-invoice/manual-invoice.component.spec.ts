import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualInvoiceComponent } from './manual-invoice.component';

describe('ManualInvoiceComponent', () => {
  let component: ManualInvoiceComponent;
  let fixture: ComponentFixture<ManualInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
