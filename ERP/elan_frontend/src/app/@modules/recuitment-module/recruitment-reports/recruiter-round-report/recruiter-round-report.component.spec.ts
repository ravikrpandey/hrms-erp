import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterRoundReportComponent } from './recruiter-round-report.component';

describe('RecruiterRoundReportComponent', () => {
  let component: RecruiterRoundReportComponent;
  let fixture: ComponentFixture<RecruiterRoundReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterRoundReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterRoundReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
