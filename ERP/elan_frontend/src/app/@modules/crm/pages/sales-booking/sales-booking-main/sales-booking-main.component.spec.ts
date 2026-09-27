import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBookingMainComponent } from './sales-booking-main.component';

describe('SalesBookingMainComponent', () => {
  let component: SalesBookingMainComponent;
  let fixture: ComponentFixture<SalesBookingMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBookingMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBookingMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
