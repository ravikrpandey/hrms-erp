import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedTripComponent } from './approved-trip.component';

describe('ApprovedTripComponent', () => {
  let component: ApprovedTripComponent;
  let fixture: ComponentFixture<ApprovedTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedTripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
