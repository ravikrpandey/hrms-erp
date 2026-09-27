import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentCategoryComponent } from './create-payment-category.component';

describe('CreatePaymentCategoryComponent', () => {
  let component: CreatePaymentCategoryComponent;
  let fixture: ComponentFixture<CreatePaymentCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePaymentCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePaymentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
