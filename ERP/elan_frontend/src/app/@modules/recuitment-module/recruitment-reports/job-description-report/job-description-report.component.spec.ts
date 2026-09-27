import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDescriptionReportComponent } from './job-description-report.component';

describe('JobDescriptionReportComponent', () => {
  let component: JobDescriptionReportComponent;
  let fixture: ComponentFixture<JobDescriptionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDescriptionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDescriptionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
