import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollReports } from './payroll-reports';

describe('PayrollReports', () => {
  let component: PayrollReports;
  let fixture: ComponentFixture<PayrollReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
