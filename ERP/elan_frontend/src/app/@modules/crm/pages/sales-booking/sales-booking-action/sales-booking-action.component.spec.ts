import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBookingActionComponent } from './sales-booking-action.component';

describe('SalesBookingActionComponent', () => {
  let component: SalesBookingActionComponent;
  let fixture: ComponentFixture<SalesBookingActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBookingActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBookingActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
