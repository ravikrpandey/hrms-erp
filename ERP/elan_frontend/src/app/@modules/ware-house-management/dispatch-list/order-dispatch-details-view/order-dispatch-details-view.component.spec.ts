import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDispatchDetailsViewComponent } from './order-dispatch-details-view.component';

describe('OrderDispatchDetailsViewComponent', () => {
  let component: OrderDispatchDetailsViewComponent;
  let fixture: ComponentFixture<OrderDispatchDetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDispatchDetailsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDispatchDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
