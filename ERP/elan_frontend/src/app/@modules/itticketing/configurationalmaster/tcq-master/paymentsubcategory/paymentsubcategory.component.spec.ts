import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsubcategoryComponent } from './paymentsubcategory.component';

describe('PaymentsubcategoryComponent', () => {
  let component: PaymentsubcategoryComponent;
  let fixture: ComponentFixture<PaymentsubcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsubcategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
