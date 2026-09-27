import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePaymentCreate } from './advance-payment-create';

describe('AdvancePaymentCreate', () => {
  let component: AdvancePaymentCreate;
  let fixture: ComponentFixture<AdvancePaymentCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancePaymentCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancePaymentCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
