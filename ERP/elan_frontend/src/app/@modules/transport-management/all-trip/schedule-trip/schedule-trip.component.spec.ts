import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleTripComponent } from './schedule-trip.component';

describe('ScheduleTripComponent', () => {
  let component: ScheduleTripComponent;
  let fixture: ComponentFixture<ScheduleTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleTripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
