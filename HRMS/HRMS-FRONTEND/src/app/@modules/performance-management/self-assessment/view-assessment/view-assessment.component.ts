import { Component, Inject } from '@angular/core';
import { CreateSelfAssessmentComponent } from '../create-self-assessment/create-self-assessment.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-assessment',
  templateUrl: './view-assessment.component.html',
  styleUrls: ['./view-assessment.component.scss']
})
export class ViewAssessmentComponent {
  kpaform:FormGroup;
  public Editor = ClassicEditor;
  constructor( private dialog: MatDialogRef<CreateSelfAssessmentComponent>,
    @Inject(MAT_DIALOG_DATA) public KpiData: any, private fb:FormBuilder){
  }

  ngOnInit(){
    this.kpaform = this.fb.group({
      KpiData: [this.KpiData.data]
    });

    this.kpaform.get('KpiData')?.disable();
  }
}
