import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDeliveryChallanComponent } from './create-delivery-challan.component';

describe('CreateDeliveryChallanComponent', () => {
  let component: CreateDeliveryChallanComponent;
  let fixture: ComponentFixture<CreateDeliveryChallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDeliveryChallanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDeliveryChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
