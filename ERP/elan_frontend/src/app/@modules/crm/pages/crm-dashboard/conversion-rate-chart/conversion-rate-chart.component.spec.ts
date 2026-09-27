import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionRateChartComponent } from './conversion-rate-chart.component';

describe('ConversionRateChartComponent', () => {
  let component: ConversionRateChartComponent;
  let fixture: ComponentFixture<ConversionRateChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversionRateChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversionRateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
