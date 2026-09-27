import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryActionComponent } from './delivery-action.component';

describe('DeliveryActionComponent', () => {
  let component: DeliveryActionComponent;
  let fixture: ComponentFixture<DeliveryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
