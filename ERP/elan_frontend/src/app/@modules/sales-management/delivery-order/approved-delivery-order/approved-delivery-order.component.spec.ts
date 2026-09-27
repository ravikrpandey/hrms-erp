import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedDeliveryOrderComponent } from './approved-delivery-order.component';

describe('ApprovedDeliveryOrderComponent', () => {
  let component: ApprovedDeliveryOrderComponent;
  let fixture: ComponentFixture<ApprovedDeliveryOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedDeliveryOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedDeliveryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
