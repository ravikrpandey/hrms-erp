import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSelfAssesmentSurveyComponent } from './create-self-assesment-survey.component';

describe('CreateSelfAssesmentSurveyComponent', () => {
  let component: CreateSelfAssesmentSurveyComponent;
  let fixture: ComponentFixture<CreateSelfAssesmentSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSelfAssesmentSurveyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSelfAssesmentSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
