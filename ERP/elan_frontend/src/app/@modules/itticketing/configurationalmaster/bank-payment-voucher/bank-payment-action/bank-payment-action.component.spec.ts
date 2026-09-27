import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankPaymentActionComponent } from './bank-payment-action.component';

describe('BankPaymentActionComponent', () => {
  let component: BankPaymentActionComponent;
  let fixture: ComponentFixture<BankPaymentActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankPaymentActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankPaymentActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
