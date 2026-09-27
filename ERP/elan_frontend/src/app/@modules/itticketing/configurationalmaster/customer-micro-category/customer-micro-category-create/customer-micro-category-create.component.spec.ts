import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMicroCategoryCreateComponent } from './customer-micro-category-create.component';

describe('CustomerMicroCategoryCreateComponent', () => {
  let component: CustomerMicroCategoryCreateComponent;
  let fixture: ComponentFixture<CustomerMicroCategoryCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerMicroCategoryCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerMicroCategoryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
