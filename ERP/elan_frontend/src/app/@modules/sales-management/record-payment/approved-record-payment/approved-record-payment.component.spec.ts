import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedRecordPaymentComponent } from './approved-record-payment.component';

describe('ApprovedRecordPaymentComponent', () => {
  let component: ApprovedRecordPaymentComponent;
  let fixture: ComponentFixture<ApprovedRecordPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedRecordPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedRecordPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
