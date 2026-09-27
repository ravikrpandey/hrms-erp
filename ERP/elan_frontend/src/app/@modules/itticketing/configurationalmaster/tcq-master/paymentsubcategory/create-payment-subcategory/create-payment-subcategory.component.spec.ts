import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentSubcategoryComponent } from './create-payment-subcategory.component';

describe('CreatePaymentSubcategoryComponent', () => {
  let component: CreatePaymentSubcategoryComponent;
  let fixture: ComponentFixture<CreatePaymentSubcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePaymentSubcategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePaymentSubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
