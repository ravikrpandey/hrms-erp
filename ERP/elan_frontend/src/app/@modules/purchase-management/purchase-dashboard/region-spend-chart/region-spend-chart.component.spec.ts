import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionSpendChartComponent } from './region-spend-chart.component';

describe('RegionSpendChartComponent', () => {
  let component: RegionSpendChartComponent;
  let fixture: ComponentFixture<RegionSpendChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionSpendChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionSpendChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
