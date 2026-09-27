import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordPaymentListComponent } from './record-payment-list.component';

describe('RecordPaymentListComponent', () => {
  let component: RecordPaymentListComponent;
  let fixture: ComponentFixture<RecordPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordPaymentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
