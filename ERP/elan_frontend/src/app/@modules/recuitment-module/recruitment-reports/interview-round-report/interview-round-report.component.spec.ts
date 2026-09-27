import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewRoundReportComponent } from './interview-round-report.component';

describe('InterviewRoundReportComponent', () => {
  let component: InterviewRoundReportComponent;
  let fixture: ComponentFixture<InterviewRoundReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewRoundReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewRoundReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
