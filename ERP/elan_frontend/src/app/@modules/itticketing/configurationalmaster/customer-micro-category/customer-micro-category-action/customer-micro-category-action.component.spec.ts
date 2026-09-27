import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMicroCategoryActionComponent } from './customer-micro-category-action.component';

describe('CustomerMicroCategoryActionComponent', () => {
  let component: CustomerMicroCategoryActionComponent;
  let fixture: ComponentFixture<CustomerMicroCategoryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerMicroCategoryActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerMicroCategoryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
