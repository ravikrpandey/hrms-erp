import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCategoryViewComponent } from './customer-category-view.component';

describe('CustomerCategoryViewComponent', () => {
  let component: CustomerCategoryViewComponent;
  let fixture: ComponentFixture<CustomerCategoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCategoryViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerCategoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
