import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAdviceActionComponent } from './payment-advice-action.component';

describe('PaymentAdviceActionComponent', () => {
  let component: PaymentAdviceActionComponent;
  let fixture: ComponentFixture<PaymentAdviceActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentAdviceActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentAdviceActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
