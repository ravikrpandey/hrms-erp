import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDialogAnswerComponent } from './question-dialog-answer.component';

describe('QuestionDialogAnswerComponent', () => {
  let component: QuestionDialogAnswerComponent;
  let fixture: ComponentFixture<QuestionDialogAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionDialogAnswerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionDialogAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
