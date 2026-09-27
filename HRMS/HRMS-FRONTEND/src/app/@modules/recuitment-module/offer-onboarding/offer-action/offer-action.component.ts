import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { MailDialogComponent } from '../../on-boarding/mail-dialog/mail-dialog.component';
import Swal from 'sweetalert2';
import moment from 'moment';

@Component({
  selector: 'app-offer-action',
  templateUrl: './offer-action.component.html',
  styleUrls: ['./offer-action.component.scss']
})
export class OfferActionComponent {
 // data: string | null;
 cellValue: any;
 joId:any;
 assignAction:any;
  employee_id: any;

 constructor(private route: Router,   private _rbackService:RbacMasterService, private recruitService: RecruitService, private toast: ToastrService,
   public dialog: MatDialog) {
 }

 ngOnInit(): void {
  let lg: any = localStorage.getItem('signInUser');
  let loginUser = JSON.parse(lg);
  console.log('loginUser', loginUser);
  this.employee_id = loginUser.employee_id;
   this.assignAction = this._rbackService.accessAssignAction();
 }

 agInit(params: ICellRendererParams): void {
   this.cellValue = this.getValueToDisplay(params);
   
 }
 getValueToDisplay(params: ICellRendererParams) {
   console.log('is', params.data);
   
   
   return params.data.candidate_id;
 }

 refresh(params: ICellRendererParams): boolean {
   // set value into cell again
   
   this.cellValue = this.getValueToDisplay(params);
   return true;
 }



 mail(e:any) {
   e.stopPropagation();
   const dialogRef
     = this.dialog.open(MailDialogComponent, {
       width: '40%',
       height:'100%',
       panelClass: 'full-screen-modal',
       data: { id: this.cellValue }
     });
     
   dialogRef.afterClosed().subscribe(result => {
     
   });
 }
 timerValue: number = 24; // This could be your timer value in hours
 private queryParamString(params: any): string {
  return Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`) .join('&');
}
 sendFormWithLink(e: any) {
  console.log(this.cellValue);
  
  e.stopPropagation();

  Swal.fire({
    title: 'Are you sure to Send form link this Candidate ?',
    text: "You won't be able to revert this!",
    icon: 'question',
    showCancelButton: true,
    cancelButtonColor: "#f44336",
    confirmButtonColor: "#3f51b5",
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      const currentDate = new Date();
      console.log(currentDate);
      
      const currentDateTime = currentDate.toISOString(); // Convert date to string
  console.log(currentDateTime);

  
      const encodedDateTime = btoa(currentDateTime);
      const route = window.location.origin + '/new-employee-form/employee-details-form'
    
      // console.log(ParamsDate);
      
      const params = {datetime: encodedDateTime, condidateId:this.cellValue};
      const routeWithParams = `${route}?${this.queryParamString(params)}`;
      const data = {
        employee_id:this.employee_id,
        condidateId:this.cellValue,
        web_url:routeWithParams, 
      }
   
   
console.log(this.cellValue, data);

      this.recruitService.sendForm(this.cellValue, data).subscribe(
        (res: any) => {
          this.toast.success(res.message)
        }, (err:any) => {
          
          this.toast.success('Something went wrong please try again', 'Error Message')
        }
      )
    };
  });
}



}
