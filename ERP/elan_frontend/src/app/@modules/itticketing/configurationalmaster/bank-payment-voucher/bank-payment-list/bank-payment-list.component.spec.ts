import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankPaymentListComponent } from './bank-payment-list.component';

describe('BankPaymentListComponent', () => {
  let component: BankPaymentListComponent;
  let fixture: ComponentFixture<BankPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankPaymentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
