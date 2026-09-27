import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewStatusReportComponent } from './interview-status-report.component';

describe('InterviewStatusReportComponent', () => {
  let component: InterviewStatusReportComponent;
  let fixture: ComponentFixture<InterviewStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewStatusReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
