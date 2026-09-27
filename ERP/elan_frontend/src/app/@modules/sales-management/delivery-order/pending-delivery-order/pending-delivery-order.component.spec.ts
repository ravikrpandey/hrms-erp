import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDeliveryOrderComponent } from './pending-delivery-order.component';

describe('PendingDeliveryOrderComponent', () => {
  let component: PendingDeliveryOrderComponent;
  let fixture: ComponentFixture<PendingDeliveryOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingDeliveryOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingDeliveryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
