import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMicroCategoryStatusComponent } from './customer-micro-category-status.component';

describe('CustomerMicroCategoryStatusComponent', () => {
  let component: CustomerMicroCategoryStatusComponent;
  let fixture: ComponentFixture<CustomerMicroCategoryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerMicroCategoryStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerMicroCategoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
