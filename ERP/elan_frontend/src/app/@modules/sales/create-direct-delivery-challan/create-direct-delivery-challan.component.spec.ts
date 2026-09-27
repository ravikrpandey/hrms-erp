import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDirectDeliveryChallanComponent } from './create-direct-delivery-challan.component';

describe('CreateDirectDeliveryChallanComponent', () => {
  let component: CreateDirectDeliveryChallanComponent;
  let fixture: ComponentFixture<CreateDirectDeliveryChallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDirectDeliveryChallanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDirectDeliveryChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
