import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedRecordPaymentComponent } from './rejected-record-payment.component';

describe('RejectedRecordPaymentComponent', () => {
  let component: RejectedRecordPaymentComponent;
  let fixture: ComponentFixture<RejectedRecordPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedRecordPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedRecordPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
