import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordPaymentActionComponent } from './record-payment-action.component';

describe('RecordPaymentActionComponent', () => {
  let component: RecordPaymentActionComponent;
  let fixture: ComponentFixture<RecordPaymentActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordPaymentActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordPaymentActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
