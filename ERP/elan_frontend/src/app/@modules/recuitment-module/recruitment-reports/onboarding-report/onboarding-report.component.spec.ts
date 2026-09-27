import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingReportComponent } from './onboarding-report.component';

describe('OnboardingReportComponent', () => {
  let component: OnboardingReportComponent;
  let fixture: ComponentFixture<OnboardingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
