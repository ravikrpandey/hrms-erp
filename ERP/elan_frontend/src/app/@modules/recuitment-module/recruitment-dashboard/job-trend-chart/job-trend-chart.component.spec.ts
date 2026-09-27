import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTrendChartComponent } from './job-trend-chart.component';

describe('JobTrendChartComponent', () => {
  let component: JobTrendChartComponent;
  let fixture: ComponentFixture<JobTrendChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobTrendChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobTrendChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
