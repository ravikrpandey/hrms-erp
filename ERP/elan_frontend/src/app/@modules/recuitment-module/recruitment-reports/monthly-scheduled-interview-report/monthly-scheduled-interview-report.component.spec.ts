import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyScheduledInterviewReportComponent } from './monthly-scheduled-interview-report.component';

describe('MonthlyScheduledInterviewReportComponent', () => {
  let component: MonthlyScheduledInterviewReportComponent;
  let fixture: ComponentFixture<MonthlyScheduledInterviewReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyScheduledInterviewReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyScheduledInterviewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
