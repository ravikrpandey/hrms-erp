import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowQuestionAnswerDialogComponent } from './show-question-answer-dialog.component';

describe('ShowQuestionAnswerDialogComponent', () => {
  let component: ShowQuestionAnswerDialogComponent;
  let fixture: ComponentFixture<ShowQuestionAnswerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowQuestionAnswerDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowQuestionAnswerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
