import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentProgramListComponent } from './payment-program-list.component';

describe('PaymentProgramListComponent', () => {
  let component: PaymentProgramListComponent;
  let fixture: ComponentFixture<PaymentProgramListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentProgramListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentProgramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
