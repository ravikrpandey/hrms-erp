import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDispatchedListComponent } from './order-dispatched-list.component';

describe('OrderDispatchedListComponent', () => {
  let component: OrderDispatchedListComponent;
  let fixture: ComponentFixture<OrderDispatchedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDispatchedListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDispatchedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
