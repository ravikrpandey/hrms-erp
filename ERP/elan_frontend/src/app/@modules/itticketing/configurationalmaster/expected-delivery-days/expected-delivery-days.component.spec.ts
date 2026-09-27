import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedDeliveryDaysComponent } from './expected-delivery-days.component';

describe('ExpectedDeliveryDaysComponent', () => {
  let component: ExpectedDeliveryDaysComponent;
  let fixture: ComponentFixture<ExpectedDeliveryDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpectedDeliveryDaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpectedDeliveryDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
