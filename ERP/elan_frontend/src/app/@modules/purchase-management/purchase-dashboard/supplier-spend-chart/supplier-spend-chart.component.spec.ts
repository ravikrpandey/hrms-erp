import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSpendChartComponent } from './supplier-spend-chart.component';

describe('SupplierSpendChartComponent', () => {
  let component: SupplierSpendChartComponent;
  let fixture: ComponentFixture<SupplierSpendChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierSpendChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierSpendChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
