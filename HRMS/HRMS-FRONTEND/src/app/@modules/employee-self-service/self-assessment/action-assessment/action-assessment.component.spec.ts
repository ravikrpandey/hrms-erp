import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionAssessmentComponent } from './action-assessment.component';

describe('ActionAssessmentComponent', () => {
  let component: ActionAssessmentComponent;
  let fixture: ComponentFixture<ActionAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionAssessmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
