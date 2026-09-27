import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent {
  questionForm: FormGroup;

  constructor(private fb: FormBuilder,
    public dialog: MatDialogRef<AddQuestionComponent>,
    private toaster :ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  
    if (this.data) {

      this.questionForm.patchValue({
        question_text: this.data.question_text,
 
      });
  

      const optionsFormArray = this.data.options.map((opt: any) =>
        this.fb.group({
          option_text: [opt.option_text, Validators.required], 
          isCorrect: [opt.isCorrect],
        })
      );

      this.questionForm.setControl('options', this.fb.array(optionsFormArray));
    }
  }
  

  initializeForm() {
    this.questionForm = this.fb.group({
      question_text: ['', Validators.required],
      question_type: ['MCQ'], 
      options: this.fb.array([]), 
      correct_answer :[],
      status: ['ACTIVE'],
    });

   
    this.addOption();
    this.addOption();
    this.addOption();
    this.addOption();

  }


  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }


  addOption() {
    if (this.options.length < 4) {
      this.options.push(
        this.fb.group({
          option_text: ['', Validators.required],
          isCorrect: [false],
        })
      );
    } else {
      alert('Maximum 4 options are allowed.');
    }
  }


  removeOption(index: number) {
    if (this.options.length > 2) {
      this.options.removeAt(index);
    } else {
      alert('At least 2 options are required.');
    }
  }

  onSubmit() {
    if (this.questionForm.valid) {
      const questionData = this.questionForm.value;
  
      
      if (questionData.question_type === 'MCQ') {
        const correctOptions = questionData.options.filter((option: any) => option.isCorrect);
        if (correctOptions.length > 1) {
          this.toaster.error('Select Only One Correct Option');
          return;
        }else if(correctOptions.length === 0){
          this.toaster.error('Select At Least One Correct Option');
          return;
        }

      }
      const correctAnswer = questionData.options
      .filter((opt: any) => opt.isCorrect)
      .map((opt: any) => opt.option_text)
      .join(', '); 
      const payload = {
        question_text: questionData.question_text,
        options: questionData.options.map((opt: any) => ({
          text: opt.option_text,
          isCorrect: opt.isCorrect,
        })),
        status: questionData.status,
        correct_answer : correctAnswer
      };
  
      console.log(payload, "Final Payload");
      this.dialog.close(payload); 
    } else {
      alert('Form is invalid. Please check all required fields.');
    }
  }
  
}
