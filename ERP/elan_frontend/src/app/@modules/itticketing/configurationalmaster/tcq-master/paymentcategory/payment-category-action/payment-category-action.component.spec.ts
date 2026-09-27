import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCategoryActionComponent } from './payment-category-action.component';

describe('PaymentCategoryActionComponent', () => {
  let component: PaymentCategoryActionComponent;
  let fixture: ComponentFixture<PaymentCategoryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentCategoryActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentCategoryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
