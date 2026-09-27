import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDeliveryOrderComponent } from './create-delivery-order.component';

describe('CreateDeliveryOrderComponent', () => {
  let component: CreateDeliveryOrderComponent;
  let fixture: ComponentFixture<CreateDeliveryOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDeliveryOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDeliveryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
