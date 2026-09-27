import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelfAssessmentService } from 'src/app/@shared/services/performance-management/self-assessment.service';
import { YearlyAssessmentService } from 'src/app/@shared/services/performance-management/yearly-assessment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-range-assessment',
  templateUrl: './range-assessment.component.html',
  styleUrls: ['./range-assessment.component.scss']
})
export class RangeAssessmentComponent {
  rowData: any;
  entity_id: string | null;
  financial_id: string | null;

  constructor( private fb:FormBuilder,  private assessmentService: YearlyAssessmentService, private route: Router){
  }

  ngOnInit(){
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    this.getAllAssessment()
  }

  getAllAssessment = () => {
    this.assessmentService.getAllAssessment(this.entity_id,this.financial_id).subscribe((res: any) => {
      this.rowData = res.data;
      this.rowData.map((value:any) => {
        let current_date = new Date();
        const startDate = this.parseDate(value.start_date);
        const endDate = this.parseDate(value.end_date);
        // if ( startDate <= current_date && endDate >= current_date) {
        //   value.active = true;
        // }else {
        //   value.active = false;
        // }
        value.active = true;
        return value;
      })
      console.log("assessmentFinanceYear List",this.rowData);
      },(err:any) => {
      this.rowData = []
    })
  }

  redirect = (yr:any) => {
    if(yr.active){
      this.route.navigate(['/master/performance-assessment/all-assessment/department'], { queryParams: { id: yr.id }});
    }
  }

  
  parseDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    // JavaScript months are 0-indexed (0 for January, 1 for February, etc.)
    return new Date(year, month - 1, day);
  }
}
