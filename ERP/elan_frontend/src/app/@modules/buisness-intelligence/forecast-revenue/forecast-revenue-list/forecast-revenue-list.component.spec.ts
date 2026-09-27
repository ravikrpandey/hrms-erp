import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastRevenueListComponent } from './forecast-revenue-list.component';

describe('ForecastRevenueListComponent', () => {
  let component: ForecastRevenueListComponent;
  let fixture: ComponentFixture<ForecastRevenueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForecastRevenueListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForecastRevenueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
