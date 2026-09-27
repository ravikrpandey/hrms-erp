import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationCurrencyStatusComponent } from './quotation-currency-status.component';

describe('QuotationCurrencyStatusComponent', () => {
  let component: QuotationCurrencyStatusComponent;
  let fixture: ComponentFixture<QuotationCurrencyStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationCurrencyStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationCurrencyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
