import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoInvoiceComponent } from './so-invoice.component';

describe('SoInvoiceComponent', () => {
  let component: SoInvoiceComponent;
  let fixture: ComponentFixture<SoInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
