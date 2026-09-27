import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScheduleTripComponent } from './create-schedule-trip.component';

describe('CreateScheduleTripComponent', () => {
  let component: CreateScheduleTripComponent;
  let fixture: ComponentFixture<CreateScheduleTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateScheduleTripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateScheduleTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
