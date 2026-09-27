import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationCalculationComponent } from './quotation-calculation.component';

describe('QuotationCalculationComponent', () => {
  let component: QuotationCalculationComponent;
  let fixture: ComponentFixture<QuotationCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationCalculationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
