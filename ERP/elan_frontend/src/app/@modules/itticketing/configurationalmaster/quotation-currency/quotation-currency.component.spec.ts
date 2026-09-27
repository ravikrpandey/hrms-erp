import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationCurrencyComponent } from './quotation-currency.component';

describe('QuotationCurrencyComponent', () => {
  let component: QuotationCurrencyComponent;
  let fixture: ComponentFixture<QuotationCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationCurrencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
