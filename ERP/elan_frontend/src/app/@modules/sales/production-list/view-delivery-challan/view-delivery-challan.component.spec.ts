import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeliveryChallanComponent } from './view-delivery-challan.component';

describe('ViewDeliveryChallanComponent', () => {
  let component: ViewDeliveryChallanComponent;
  let fixture: ComponentFixture<ViewDeliveryChallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDeliveryChallanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDeliveryChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
