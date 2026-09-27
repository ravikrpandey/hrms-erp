import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCategoryStatusComponent } from './customer-category-status.component';

describe('CustomerCategoryStatusComponent', () => {
  let component: CustomerCategoryStatusComponent;
  let fixture: ComponentFixture<CustomerCategoryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCategoryStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerCategoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
