import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedDeliveryOrderComponent } from './rejected-delivery-order.component';

describe('RejectedDeliveryOrderComponent', () => {
  let component: RejectedDeliveryOrderComponent;
  let fixture: ComponentFixture<RejectedDeliveryOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedDeliveryOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedDeliveryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
