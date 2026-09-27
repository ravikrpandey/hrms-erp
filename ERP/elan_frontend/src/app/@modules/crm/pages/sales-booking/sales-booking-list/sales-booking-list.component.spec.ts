import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBookingListComponent } from './sales-booking-list.component';

describe('SalesBookingListComponent', () => {
  let component: SalesBookingListComponent;
  let fixture: ComponentFixture<SalesBookingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBookingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
