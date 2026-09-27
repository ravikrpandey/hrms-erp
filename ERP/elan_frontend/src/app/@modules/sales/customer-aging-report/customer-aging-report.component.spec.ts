import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAgingReportComponent } from './customer-aging-report.component';

describe('CustomerAgingReportComponent', () => {
  let component: CustomerAgingReportComponent;
  let fixture: ComponentFixture<CustomerAgingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerAgingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerAgingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
