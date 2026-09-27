import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTreeMapChartComponent } from './category-tree-map-chart.component';

describe('CategoryTreeMapChartComponent', () => {
  let component: CategoryTreeMapChartComponent;
  let fixture: ComponentFixture<CategoryTreeMapChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryTreeMapChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryTreeMapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
