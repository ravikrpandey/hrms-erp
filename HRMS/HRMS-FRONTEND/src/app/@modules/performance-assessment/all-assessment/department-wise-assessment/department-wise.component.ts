import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { environment } from 'src/app/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SelfAssessmentService } from 'src/app/@shared/services/performance-management/self-assessment.service';
import { saveAs } from 'file-saver';
import { AllAssessmentService } from 'src/app/@shared/services/performance-assessment/all-assessment.service';
@Component({
  selector: 'app-department-wise',
  templateUrl: './department-wise.component.html',
  styleUrls: ['./department-wise.component.scss']
})
export class DepartmentWiseComponent {
  id: any;
  rowData:any = [];
  entity_id: string | null;
  financial_id: string | null;
  constructor(private fb: FormBuilder, private allAssessmentService:AllAssessmentService, private toaster: ToastrService, private route: Router, private activeroute:ActivatedRoute, public dialog: MatDialog,){
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
    });
  }

  ngOnInit(){
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    let a: any = localStorage.getItem('signInUser');
    this.getAllData()
  }

  getAllData(){
    this.allAssessmentService.getAllAssessmentDeptWise(this.entity_id,this.financial_id,this.id).subscribe((res:any)=>{
      this.rowData = res.data;
      console.log("+++++++++",this.rowData)
      },(err:any) => {
      this.rowData = []
    })
  }

  redirect = (dep:any) => {
    this.route.navigate(['/master/performance-assessment/all-assessment/list'], { queryParams: { assess_id: this.id,id: dep.department_id }});
  }

}
