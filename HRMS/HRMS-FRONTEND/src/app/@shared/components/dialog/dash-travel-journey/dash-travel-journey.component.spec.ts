import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashTravelJourneyComponent } from './dash-travel-journey.component';

describe('DashTravelJourneyComponent', () => {
  let component: DashTravelJourneyComponent;
  let fixture: ComponentFixture<DashTravelJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashTravelJourneyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashTravelJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
