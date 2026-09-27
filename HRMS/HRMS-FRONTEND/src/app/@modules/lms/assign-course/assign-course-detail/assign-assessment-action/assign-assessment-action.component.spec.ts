import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAssessmentActionComponent } from './assign-assessment-action.component';

describe('AssignAssessmentActionComponent', () => {
  let component: AssignAssessmentActionComponent;
  let fixture: ComponentFixture<AssignAssessmentActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignAssessmentActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignAssessmentActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
