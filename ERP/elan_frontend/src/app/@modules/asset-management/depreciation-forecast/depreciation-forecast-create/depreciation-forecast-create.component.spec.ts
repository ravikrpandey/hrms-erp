import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationForecastCreateComponent } from './depreciation-forecast-create.component';

describe('DepreciationForecastCreateComponent', () => {
  let component: DepreciationForecastCreateComponent;
  let fixture: ComponentFixture<DepreciationForecastCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepreciationForecastCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepreciationForecastCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
