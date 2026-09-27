import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRecordPaymentComponent } from './create-record-payment.component';

describe('CreateRecordPaymentComponent', () => {
  let component: CreateRecordPaymentComponent;
  let fixture: ComponentFixture<CreateRecordPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRecordPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRecordPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
