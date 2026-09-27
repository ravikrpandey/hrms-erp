import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSubcategoryActionComponent } from './payment-subcategory-action.component';

describe('PaymentSubcategoryActionComponent', () => {
  let component: PaymentSubcategoryActionComponent;
  let fixture: ComponentFixture<PaymentSubcategoryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentSubcategoryActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentSubcategoryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
