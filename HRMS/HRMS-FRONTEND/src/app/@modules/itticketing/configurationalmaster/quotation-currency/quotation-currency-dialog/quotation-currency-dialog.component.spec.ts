import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationCurrencyDialogComponent } from './quotation-currency-dialog.component';

describe('QuotationCurrencyDialogComponent', () => {
  let component: QuotationCurrencyDialogComponent;
  let fixture: ComponentFixture<QuotationCurrencyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationCurrencyDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationCurrencyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
