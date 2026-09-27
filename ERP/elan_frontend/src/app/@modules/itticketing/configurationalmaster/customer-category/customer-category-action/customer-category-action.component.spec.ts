import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCategoryActionComponent } from './customerCategoryAction.component;

describe('CustomerCategoryActionComponent', () => {
  let component: CustomerCategoryActionComponent;
  let fixture: ComponentFixture<CustomerCategoryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCategoryActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerCategoryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
