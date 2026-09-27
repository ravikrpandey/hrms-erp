import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationAmortizationComponent } from './depreciation-amortization.component';

describe('DepreciationAmortizationComponent', () => {
  let component: DepreciationAmortizationComponent;
  let fixture: ComponentFixture<DepreciationAmortizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepreciationAmortizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepreciationAmortizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
