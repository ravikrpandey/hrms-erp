import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterMonthReportComponent } from './recruiter-month-report.component';

describe('RecruiterMonthReportComponent', () => {
  let component: RecruiterMonthReportComponent;
  let fixture: ComponentFixture<RecruiterMonthReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterMonthReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterMonthReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
