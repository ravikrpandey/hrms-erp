import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRecordPaymentComponent } from './pending-record-payment.component';

describe('PendingRecordPaymentComponent', () => {
  let component: PendingRecordPaymentComponent;
  let fixture: ComponentFixture<PendingRecordPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingRecordPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingRecordPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
