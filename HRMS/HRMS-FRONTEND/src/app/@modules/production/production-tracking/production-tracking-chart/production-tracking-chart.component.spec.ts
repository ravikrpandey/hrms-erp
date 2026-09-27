import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionTrackingChartComponent } from './production-tracking-chart.component';

describe('ProductionTrackingChartComponent', () => {
  let component: ProductionTrackingChartComponent;
  let fixture: ComponentFixture<ProductionTrackingChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionTrackingChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionTrackingChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
