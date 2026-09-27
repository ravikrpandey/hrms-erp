import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterLocationReportComponent } from './recruiter-location-report.component';

describe('RecruiterLocationReportComponent', () => {
  let component: RecruiterLocationReportComponent;
  let fixture: ComponentFixture<RecruiterLocationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterLocationReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterLocationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
