import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelPlanComponent } from './travel-plan.component';

describe('TravelPlanComponent', () => {
  let component: TravelPlanComponent;
  let fixture: ComponentFixture<TravelPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
