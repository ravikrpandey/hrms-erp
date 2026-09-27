import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollSalerySlipComponent } from './payroll-salery-slip.component';

describe('PayrollSalerySlipComponent', () => {
  let component: PayrollSalerySlipComponent;
  let fixture: ComponentFixture<PayrollSalerySlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollSalerySlipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollSalerySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
