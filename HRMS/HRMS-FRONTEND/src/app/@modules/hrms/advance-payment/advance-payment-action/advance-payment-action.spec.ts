import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePaymentAction } from './advance-payment-action';

describe('AdvancePaymentAction', () => {
  let component: AdvancePaymentAction;
  let fixture: ComponentFixture<AdvancePaymentAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancePaymentAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancePaymentAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
