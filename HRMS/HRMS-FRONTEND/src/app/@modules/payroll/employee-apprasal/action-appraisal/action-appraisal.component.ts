import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
// import { EmpListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';import { AppraisalFormComponent } from '../appraisal-form/appraisal-form.component';
;

@Component({
  selector: 'app-action-appraisal',
  templateUrl: './action-appraisal.component.html',
  styleUrls: ['./action-appraisal.component.scss']
})
export class ActionAppraisalComponent {

    assignAction: any;
    dataGet:any;
    constructor(private route: Router,
      public dialog: MatDialog,
      private employService: EmpRegistrationService,
      private toster: ToastrService,
      private _rbackService: RbacMasterService,
    ) {
    }
  
    ngOnInit(): void {
      this.assignAction = this._rbackService.accessAssignAction();
    }
    public cellValue: any;
    reloadCurrentRoute() {
      let currentUrl = this.route.url;
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([currentUrl]);
      });
    }
    agInit(params: ICellRendererParams): void {
      console.log(params,'params');
      this.dataGet=params?.data;
      this.cellValue = this.getValueToDisplay(params);
  
    }
    getValueToDisplay(params: ICellRendererParams) {
  
      return params.valueFormatted ? params.valueFormatted : params.data.employee_id;
    }
  
    refresh(params: ICellRendererParams): boolean {
      // set value into cell again
  
      this.cellValue = this.getValueToDisplay(params);
      return true;
    }
  
    edit(e: any) {
      e.stopPropagation();
      // 
      this.route.navigate(['master/hrms/employee-master/employ/employee-create/basic-details'],
        { queryParams: { employee_id: this.cellValue,mode: 'editMode' } })
      this.employService.setEmpId(Number(this.cellValue))
      // edit(e: any) {
      //   e.stopPropagation();
      // }
    }
  
    delete(e: any) {
      e.stopPropagation();
  
      Swal.fire({
        title: 'Are you sure to delete this Employee ?',
        text: "You won't be able to revert this!",
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          const data = {
            status: "INACTIVE"
          }
          this.employService.deleteSingleEmployee(this.cellValue, data).subscribe(
            (res: any) => {
  
              this.toster.success('Deleted Successfully')
              this.reloadCurrentRoute();
            }, (err) => {
  
              this.toster.success('Something went wrong please try again', 'Error Message')
            }
          )
        };
      });
    }
    openDialog() {
      // const dialogRef
      //   = this.dialog.open(AppraisalFormComponent, {
      //     width: '700px',
      //     panelClass: 'full-screen-modal',
      //     data: { id:this.dataGet, action:"Update" }
      //   });
      // dialogRef.afterClosed().subscribe(result => {
  
      // });
      this.route.navigate(['master/payroll/employee-appraisal/update-apprisal-emp'], { queryParams: { id:this.dataGet?.payrollDetails_id,EmpId:this.dataGet?.employee_id, action:"Update"} })
    }
  
    view() {
      this.route.navigate(['master/hrms/employee-master/employ/employee-create/basic-details'], { queryParams: { employee_id: this.cellValue, action_type: 'view',mode: 'viewMode' } })
    }
  
  }