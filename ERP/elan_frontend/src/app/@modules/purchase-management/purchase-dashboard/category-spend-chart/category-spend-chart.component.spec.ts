import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySpendChartComponent } from './category-spend-chart.component';

describe('CategorySpendChartComponent', () => {
  let component: CategorySpendChartComponent;
  let fixture: ComponentFixture<CategorySpendChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorySpendChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySpendChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
