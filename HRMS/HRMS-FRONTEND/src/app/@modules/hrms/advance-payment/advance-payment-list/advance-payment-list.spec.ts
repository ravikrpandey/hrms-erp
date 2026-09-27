import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePaymentList } from './advance-payment-list';

describe('AdvancePaymentList', () => {
  let component: AdvancePaymentList;
  let fixture: ComponentFixture<AdvancePaymentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancePaymentList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancePaymentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
