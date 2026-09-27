import { ComponentFixture, TestBed } from '@angular/core/testing';

import { customerDeliveryComponent } from './customerDelivery.component';

describe('customerDeliveryComponent', () => {
  let component: customerDeliveryComponent;
  let fixture: ComponentFixture<customerDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ customerDeliveryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(customerDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
