import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-on-action',
  templateUrl: './on-action.component.html',
  styleUrls: ['./on-action.component.scss']
})
export class OnActionComponent {
 // data: string | null;
 cellValue: any;
 joId:any;
 assignAction:any;
  employee_id: any;

 constructor(private route: Router,   private _rbackService:RbacMasterService, private recruitService: RecruitService, private toast: ToastrService,
  private employService: EmpRegistrationService,
  public dialog: MatDialog) {
     // this.data = localStorage.getItem("jobId");
     // 
     
 }

 ngOnInit(): void {
   this.assignAction = this._rbackService.accessAssignAction();
   let lg: any = localStorage.getItem('signInUser');
    let loginUser = JSON.parse(lg);
    this.employee_id = loginUser.employee_id;
 }

 agInit(params: ICellRendererParams): void {
   this.cellValue = this.getValueToDisplay(params);
   
 }
 getValueToDisplay(params: ICellRendererParams) {
   return params.data.employee_id;
 }

 refresh(params: ICellRendererParams): boolean {
   // set value into cell again
   
   this.cellValue = this.getValueToDisplay(params);
   return true;
 }

 reloadCurrentRoute() {
  let currentUrl = this.route.url;
  this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.route.navigate([currentUrl]);
  });
}


 deletes(e: any) {
   e.stopPropagation();

   Swal.fire({
     title: 'Are you sure to Approve this Candidate ?',
     text: "You won't be able to revert this!",
     icon: 'question',
     showCancelButton: true,
     cancelButtonColor: "#f44336",
     confirmButtonColor: "#3f51b5",
     confirmButtonText: 'Yes',
     cancelButtonText: 'No'
   }).then((result) => {
     if (result.isConfirmed) {
      console.log(this.cellValue);
      
      const data = localStorage.getItem('signInUser');
          let user=   data ? JSON.parse(data) : null;
    if (user.role == 'Hr_Admin' || user.role =='HR_Team' ) {
      this.toast.success('Employee Approved')
      this.route.navigate(['master/hrms/employee-master/employ/employee-create/basic-details'],{queryParams: { employee_id: this.cellValue}})
      this.employService.setEmpId(Number(this.cellValue))
    }else{
      
      this.toast.error('Your role is not Hr_Admin')
    }
 
     };
   });
 }
}
