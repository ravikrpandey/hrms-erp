import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashPaymentActionComponent } from './cash-payment-action.component';

describe('CashPaymentActionComponent', () => {
  let component: CashPaymentActionComponent;
  let fixture: ComponentFixture<CashPaymentActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashPaymentActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashPaymentActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
