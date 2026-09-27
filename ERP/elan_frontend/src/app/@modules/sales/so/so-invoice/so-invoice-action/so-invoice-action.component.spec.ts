import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoInvoiceActionComponent } from './so-invoice-action.component';

describe('SoInvoiceActionComponent', () => {
  let component: SoInvoiceActionComponent;
  let fixture: ComponentFixture<SoInvoiceActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoInvoiceActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoInvoiceActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
