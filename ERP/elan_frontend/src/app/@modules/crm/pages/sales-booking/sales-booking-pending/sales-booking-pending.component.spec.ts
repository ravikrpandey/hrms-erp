import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBookingPendingComponent } from './sales-booking-pending.component';

describe('SalesBookingPendingComponent', () => {
  let component: SalesBookingPendingComponent;
  let fixture: ComponentFixture<SalesBookingPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBookingPendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBookingPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
