import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelPlanListComponent } from './travel-plan-list.component';

describe('TravelPlanListComponent', () => {
  let component: TravelPlanListComponent;
  let fixture: ComponentFixture<TravelPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelPlanListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
