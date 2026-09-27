import { Component, Inject } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-question-answer-dialog',
  templateUrl: './show-question-answer-dialog.component.html',
  styleUrls: ['./show-question-answer-dialog.component.scss']
})
export class ShowQuestionAnswerDialogComponent {
  itemName: any;
  parentGroup: any;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ShowQuestionAnswerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: any; questionFormArray: any[] }
  ) {
    this.itemName = data.name;
    const formGroups = this.data.questionFormArray.map(q =>
      this.fb.group({
        id: [q.id],
        question: [q.question],
        answer: [q.answer],
        question_type: [q.question_type],
        purchase_item_id: [q.purchase_item_id],
        purchase_request_id: [q.purchase_request_id]
      })
    );

    this.parentGroup = this.fb.group({
      questions: this.fb.array(formGroups)
    });
  }

  get questions(): any {
    return this.parentGroup.get('questions') as FormArray;
  }

  close(): void {
    this.dialogRef.close();
  }
}
