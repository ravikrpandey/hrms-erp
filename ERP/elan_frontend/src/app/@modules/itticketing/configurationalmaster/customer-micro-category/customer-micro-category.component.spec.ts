import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMicroCategoryComponent } from './customer-micro-category.component';

describe('CustomerMicroCategoryComponent', () => {
  let component: CustomerMicroCategoryComponent;
  let fixture: ComponentFixture<CustomerMicroCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerMicroCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerMicroCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
