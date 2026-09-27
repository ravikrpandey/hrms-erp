import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAssessmentDialogComponent } from './assign-assessment-dialog.component';

describe('AssignAssessmentDialogComponent', () => {
  let component: AssignAssessmentDialogComponent;
  let fixture: ComponentFixture<AssignAssessmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignAssessmentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignAssessmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
