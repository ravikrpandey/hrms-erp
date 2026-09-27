import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueTrendChartComponent } from './revenue-trend-chart.component';

describe('RevenueTrendChartComponent', () => {
  let component: RevenueTrendChartComponent;
  let fixture: ComponentFixture<RevenueTrendChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenueTrendChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueTrendChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
