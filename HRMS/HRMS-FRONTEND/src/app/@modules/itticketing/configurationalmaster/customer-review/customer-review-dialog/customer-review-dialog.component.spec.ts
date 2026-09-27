import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReviewDialogComponent } from './customer-review-dialog.component';

describe('CustomerReviewDialogComponent', () => {
  let component: CustomerReviewDialogComponent;
  let fixture: ComponentFixture<CustomerReviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerReviewDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerReviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
