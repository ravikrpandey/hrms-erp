import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCategoryCreateComponent } from './customer-category-create.component';

describe('CustomerCategoryCreateComponent', () => {
  let component: CustomerCategoryCreateComponent;
  let fixture: ComponentFixture<CustomerCategoryCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCategoryCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerCategoryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
