import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentcategoryComponent } from './paymentcategory.component';

describe('PaymentcategoryComponent', () => {
  let component: PaymentcategoryComponent;
  let fixture: ComponentFixture<PaymentcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentcategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
