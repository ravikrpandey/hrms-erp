import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTermsFormComponent } from './payment-terms-form.component';

describe('PaymentTermsFormComponent', () => {
  let component: PaymentTermsFormComponent;
  let fixture: ComponentFixture<PaymentTermsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTermsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTermsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
