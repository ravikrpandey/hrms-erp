import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-question-dialog-answer',
  templateUrl: './question-dialog-answer.component.html',
  styleUrls: ['./question-dialog-answer.component.scss']
})
export class QuestionDialogAnswerComponent {
 parentGroup: FormGroup;  
 itemName: string;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<QuestionDialogAnswerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: any, questionFormArray: FormArray }
  ) {
    this.itemName = data.name;
    this.parentGroup = this.fb.group({
      questions: data.questionFormArray
    });
  }


  get questions(): any {
    return this.parentGroup?.get('questions') as FormArray;
  }

submit(): void {

if (this.parentGroup.status==='INVALID') {
  return
}
  this.dialogRef.close(this.questions.value);
}

close(): void {
  this.dialogRef.close(); 
}
}
