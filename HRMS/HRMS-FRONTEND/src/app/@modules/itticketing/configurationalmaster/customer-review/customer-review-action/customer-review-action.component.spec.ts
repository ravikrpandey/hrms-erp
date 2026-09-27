import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReviewActionComponent } from './customer-review-action.component';

describe('CustomerReviewActionComponent', () => {
  let component: CustomerReviewActionComponent;
  let fixture: ComponentFixture<CustomerReviewActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerReviewActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerReviewActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
