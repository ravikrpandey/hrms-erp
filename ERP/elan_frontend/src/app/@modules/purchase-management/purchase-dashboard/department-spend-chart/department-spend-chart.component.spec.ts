import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentSpendChartComponent } from './department-spend-chart.component';

describe('DepartmentSpendChartComponent', () => {
  let component: DepartmentSpendChartComponent;
  let fixture: ComponentFixture<DepartmentSpendChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentSpendChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentSpendChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
