import { ComponentFixture, TestBed } from '@angular/core/testing';

import  { DepreciationForecastActionComponent  } from './depreciation-forecast-action.component';

describe('DepreciationForecastActionComponent', () => {
  let component: DepreciationForecastActionComponent;
  let fixture: ComponentFixture<DepreciationForecastActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepreciationForecastActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepreciationForecastActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
