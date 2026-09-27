import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastRevenueCreateComponent } from './forecast-revenue-create.component';

describe('ForecastRevenueCreateComponent', () => {
  let component: ForecastRevenueCreateComponent;
  let fixture: ComponentFixture<ForecastRevenueCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForecastRevenueCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForecastRevenueCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
