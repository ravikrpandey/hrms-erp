import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewerReportComponent } from './interviewer-report.component';

describe('InterviewerReportComponent', () => {
  let component: InterviewerReportComponent;
  let fixture: ComponentFixture<InterviewerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewerReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
