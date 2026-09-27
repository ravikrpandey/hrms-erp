import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCashPaymentComponent } from './add-cash-payment.component';

describe('AddCashPaymentComponent', () => {
  let component: AddCashPaymentComponent;
  let fixture: ComponentFixture<AddCashPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCashPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCashPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
