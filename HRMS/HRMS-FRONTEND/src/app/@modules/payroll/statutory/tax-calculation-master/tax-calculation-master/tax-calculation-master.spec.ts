import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCalculationMaster } from './tax-calculation-master';

describe('TaxCalculationMaster', () => {
  let component: TaxCalculationMaster;
  let fixture: ComponentFixture<TaxCalculationMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxCalculationMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxCalculationMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
