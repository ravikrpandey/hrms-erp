import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentProgramDialogComponent } from './payment-program-dialog.component';

describe('PaymentProgramDialogComponent', () => {
  let component: PaymentProgramDialogComponent;
  let fixture: ComponentFixture<PaymentProgramDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentProgramDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentProgramDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
