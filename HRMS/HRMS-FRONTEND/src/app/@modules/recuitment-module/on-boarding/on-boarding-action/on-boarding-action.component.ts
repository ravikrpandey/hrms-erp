import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { MailDialogComponent } from '../mail-dialog/mail-dialog.component';
import { OfferFormComponent } from '../offer-form/offer-form.component';
import { EmailSendeComponent } from 'src/app/@shared/components/email-sende/email-sende.component';
import { PrintDialogComponent } from '../print-dialog/print-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { A } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-on-boarding-action',
  templateUrl: './on-boarding-action.component.html',
  styleUrls: ['./on-boarding-action.component.scss']
})
export class OnBoardingActionComponent implements OnInit {
  // data: string | null;
  cellValue: any;
  joId:any;
  assignAction:any;

  constructor(private route: Router,   private _rbackService:RbacMasterService, private recruitService: RecruitService, private toast: ToastrService,
    public dialog: MatDialog) {
      // this.data = localStorage.getItem("jobId");
      // 
      
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  console.log(this.assignAction);
  
  
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    console.log('is', params.data);
    
    
    return params.data;
  }
  jobIdNew:any
  view(e:any){
    console.log(this.cellValue);
    
    this.jobIdNew = this.cellValue.candidate_id;
    localStorage.setItem("jobId", this.jobIdNew);

       const dialogRef = this.dialog.open(AppListDialogComponent, { width: '500px', data: { onBoardingId: this.jobIdNew } });
    dialogRef.afterClosed().subscribe((result: any) => {
      
    })
  }
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    return true;

  }

  print(){
    // e.stopPropagation();
    // console.log(this.cellValue);
    
    // // window.open(this.cellValue.data.upload_resume, )
    const pdfWindow:any =  window.open(this.cellValue.upload_resume, '_blank'); // Open the PDF in a new tab or window

    // window.print(); // Trigger the b

    pdfWindow.onload = () => {
      pdfWindow.print(); // Trigger the print action after the PDF is loaded
    };
  }

  mail(e:any) {
    console.log(this.cellValue,"cellValue");
    
    e.stopPropagation();
    const dialogRef
      = this.dialog.open(MailDialogComponent, {
        width: '40%',
        height:'100%',
        panelClass: 'full-screen-modal',
        data: { id: this.cellValue.candidate_id }
      });
      
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  // email(e:any){
  //   e.stopPropagation();

  //   const dialogRef = this.dialog.open(EmailSendeComponent, {
  //     width: '40%',
  //     // maxWidth: '100vw',
  //     // maxHeight: '100vh',
  //     height: '70%',
  //     position: {bottom: '10px', right:'10px'} ,
  //     panelClass: 'full-screen-modal',
  //     data: { id: this.cellValue },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
      
  //   });
  // }

  deletes(e: any) {
    e.stopPropagation();

    Swal.fire({
      title: 'Are you sure to delete this Candidate ?',
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
        // this.employService.deleteSingleEmployee(this.cellValue, data).subscribe(
        //   (res: any) => {
            
        //     this.toster.success('Deleted Successfully')
        //     this.reloadCurrentRoute();
        //   }, (err) => {
            
        //     this.toster.success('Something went wrong please try again', 'Error Message')
        //   }
        // )
      };
    });
  }
}
