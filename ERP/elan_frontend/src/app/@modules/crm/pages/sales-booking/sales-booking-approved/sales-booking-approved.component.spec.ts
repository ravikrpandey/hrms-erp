import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBookingApprovedComponent } from './sales-booking-approved.component';

describe('SalesBookingApprovedComponent', () => {
  let component: SalesBookingApprovedComponent;
  let fixture: ComponentFixture<SalesBookingApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBookingApprovedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBookingApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
