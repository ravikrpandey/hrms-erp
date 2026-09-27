import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityCheckChartComponent } from './quantity-check-chart.component';

describe('QuantityCheckChartComponent', () => {
  let component: QuantityCheckChartComponent;
  let fixture: ComponentFixture<QuantityCheckChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuantityCheckChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuantityCheckChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
