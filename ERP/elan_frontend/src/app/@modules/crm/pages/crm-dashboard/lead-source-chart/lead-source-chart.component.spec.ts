import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSourceChartComponent } from './lead-source-chart.component';

describe('LeadSourceChartComponent', () => {
  let component: LeadSourceChartComponent;
  let fixture: ComponentFixture<LeadSourceChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadSourceChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadSourceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
