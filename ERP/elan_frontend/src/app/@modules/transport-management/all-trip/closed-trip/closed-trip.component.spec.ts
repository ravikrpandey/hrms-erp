import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedTripComponent } from './closed-trip.component';

describe('ClosedTripComponent', () => {
  let component: ClosedTripComponent;
  let fixture: ComponentFixture<ClosedTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedTripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosedTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
