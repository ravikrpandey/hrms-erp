import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { DialogAllocateCourseComponent } from '../../dialog-allocate-course/dialog-allocate-course.component';
import { AssignAssessmentDialogComponent } from '../assign-assessment-dialog/assign-assessment-dialog.component';

@Component({
  selector: 'app-assign-assessment-action',
  templateUrl: './assign-assessment-action.component.html',
  styleUrls: ['./assign-assessment-action.component.scss']
})
export class AssignAssessmentActionComponent {
  singleId:any;
  cellValue1:any; 
  assignAction: any;
  entity_id: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 

  }

  ngOnInit(): void {
   
  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.cellValue1 = params.data;

  }

  getValueToDisplay(params: ICellRendererParams) {
    console.log(params.data,"shhsh")
    return params.valueFormatted ? params.valueFormatted : params?.data?.assign_id
  }

  refresh(params: ICellRendererParams): boolean {

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createDepartment(data: any) {
    this._configurationalMasterService.createDepartment(data, this.entity_id).subscribe(
      (res: any) => {

        this.toaster.success('Department Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {

        this.toaster.error("department_name is All Ready Exits!", 'Error Message');
      }
    )
  };

 
  view(e: any) {
  const dialogRef = this.dialog.open(AssignAssessmentDialogComponent, {
         width: '60%',
         data: { assign_id: this.cellValue,course_id : this.cellValue1.course_id,employee_id : this.cellValue1.employee_id, view: 'visible' }
       });
 
     dialogRef.afterClosed().subscribe(result => {
     });
   }
 
}
