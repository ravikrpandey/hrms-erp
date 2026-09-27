import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCategoryDilogComponent } from './customer-category-dilog.component';

describe('CustomerCategoryDilogComponent', () => {
  let component: CustomerCategoryDilogComponent;
  let fixture: ComponentFixture<CustomerCategoryDilogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCategoryDilogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerCategoryDilogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
