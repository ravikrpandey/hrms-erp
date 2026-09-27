import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBookingRejectComponent } from './sales-booking-reject.component';

describe('SalesBookingRejectComponent', () => {
  let component: SalesBookingRejectComponent;
  let fixture: ComponentFixture<SalesBookingRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBookingRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBookingRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
