import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReviewStatusComponent } from './customer-review-status.component';

describe('CustomerReviewStatusComponent', () => {
  let component: CustomerReviewStatusComponent;
  let fixture: ComponentFixture<CustomerReviewStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerReviewStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerReviewStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
