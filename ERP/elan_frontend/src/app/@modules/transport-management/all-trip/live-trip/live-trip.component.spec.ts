import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTripComponent } from './live-trip.component';

describe('LiveTripComponent', () => {
  let component: LiveTripComponent;
  let fixture: ComponentFixture<LiveTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveTripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
