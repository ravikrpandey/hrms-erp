import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfAssesmentSurveyComponent } from './self-assesment-survey.component';

describe('SelfAssesmentSurveyComponent', () => {
  let component: SelfAssesmentSurveyComponent;
  let fixture: ComponentFixture<SelfAssesmentSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfAssesmentSurveyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfAssesmentSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
