import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-item-question-dialog',
  templateUrl: './item-question-dialog.component.html',
  styleUrls: ['./item-question-dialog.component.scss']
})
export class ItemQuestionDialogComponent {

  form: FormGroup;
  editIndex: number | null = null; // track if editing an existing question

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ItemQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // data.item {item_id,item_name,questions[]}
  ) {
    this.form = this.fb.group({
      type: ['', Validators.required],
      question: ['', Validators.required],
      answer: [''],
      questions: this.fb.array(
        (data.item.questions || []).map((q: any) =>
          this.fb.group({
            type: [q.type, Validators.required],
            question: [q.question, Validators.required],
            item_id: [q.item_id]
          })
        )
      )
    });
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  /** Add or Update Question */
  saveQuestion() {
    const qValue = {
      type: this.form.value.type,
      question: this.form.value.question,
      item_id: this.editIndex !== null
        ? this.questions.at(this.editIndex).value.item_id
        : Date.now()
    };
    if (this.editIndex !== null) {
      this.questions.at(this.editIndex).patchValue(qValue);
      this.editIndex = null;
    } else {
      this.questions.push(
        this.fb.group({
          type: [qValue.type, Validators.required],
          question: [qValue.question, Validators.required],
          item_id: [qValue.item_id]
        })
      );
    }
    // reset top form inputs
    this.form.patchValue({ type: '', question: '' });
  }

  editQuestion(index: number) {
    const q = this.questions.at(index).value;
    this.editIndex = index;
    this.form.patchValue({
      type: q.type,
      question: q.question
    });
  }

  deleteQuestion(index: number) {
    this.questions.removeAt(index);
    if (this.editIndex === index) {
      this.editIndex = null;
      this.form.patchValue({ type: '', question: '' });
    }
  }

  close() {
    this.dialogRef.close(this.questions.value);
  }
}