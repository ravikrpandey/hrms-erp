import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterProductivityReportComponent } from './recruiter-productivity-report.component';

describe('RecruiterProductivityReportComponent', () => {
  let component: RecruiterProductivityReportComponent;
  let fixture: ComponentFixture<RecruiterProductivityReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterProductivityReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterProductivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
