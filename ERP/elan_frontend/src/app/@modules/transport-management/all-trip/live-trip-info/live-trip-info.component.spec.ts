import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTripInfoComponent } from './live-trip-info.component';

describe('LiveTripInfoComponent', () => {
  let component: LiveTripInfoComponent;
  let fixture: ComponentFixture<LiveTripInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveTripInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveTripInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
