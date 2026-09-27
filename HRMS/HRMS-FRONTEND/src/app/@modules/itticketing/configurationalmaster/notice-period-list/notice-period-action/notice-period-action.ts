import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { NoticePeriodDialog } from '../notice-period-dialog/notice-period-dialog';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';


@Component({
  selector: 'app-notice-period-action',
  templateUrl: './notice-period-action.html',
  styleUrls: ['./notice-period-action.scss'],
})
export class NoticePeriodAction {
   paramsVal: any;
   mainId: any
   assignAction: any;
   constructor(
     private route: Router,
     public dialog: MatDialog,
     private router: Router,
     private _configurationalmasterService: ConfigurationalmasterService,
     private _rbackService: RbacMasterService,
     private toaster: ToastrService
   ) {
 
   }
   ngOnInit(): void {
     this.mainId = localStorage.getItem('EmpMainId');
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
     this.paramsVal = params.data.notice_period_id;
     this.cellValue = this.getValueToDisplay(params);
 
   }
   getValueToDisplay(params: ICellRendererParams) {
 
 
     return params.valueFormatted
       ? params.valueFormatted
       : params.data.notice_period_id;
   }
   refresh(params: ICellRendererParams): boolean {
 
     // write code to modify cell
 
     //EDIT DATA FROM API
     if (params) {
       const data: any = {
         confirm_notice_days: params.data.confirm_notice_days,
         status: params.data.status,
       };
       if (params.data.color === null && params.data.color !== '') {
         this.noticePeriodCreate(data);
       } else {
         const notice_period_id: number = Number(params.data.notice_period_id);
         // this.updateGrade(notice_period_id, data);
       }
     } else {
       this.toaster.error(
         "confirm_notice_days is All Ready Exits!",
         'Error Message'
       );
     }
 
     this.cellValue = this.getValueToDisplay(params);
     return true;
   }
 
   noticePeriodCreate(data: any) {
     this._configurationalmasterService.noticePeriodCreate(data).subscribe(
       (res: any) => {
 
         this.toaster.success('Confirm Notice Days Created Successfully!');
         this.reloadCurrentRoute();
       },
       (err: any) => {
 
         this.toaster.error(
           "confirm_notice_days is All Ready Exits!",
           'Error Message'
         );
       }
     );
   }
   openDialog() {
     const dialogRef = this.dialog.open(NoticePeriodDialog, {
       data: { visible: 'visible', id: this.paramsVal },
       width: '30%',
     })
     dialogRef.afterClosed().subscribe((result) => {
     });
   }
 
   editData() {
     const dialogRef = this.dialog.open(NoticePeriodDialog, {
       data: { noticeperiod: 'edit', id: this.paramsVal },
       width: '30%',
     })
     dialogRef.afterClosed().subscribe((result) => {
     });
   }
   deleteData(event: any) {
     event.stopPropagation();
     Swal.fire({
       title: 'Are you sure want to remove?',
       icon: 'warning',
       showCancelButton: true,
       cancelButtonColor: "#f44336",
       confirmButtonColor: "#3f51b5",
       confirmButtonText: 'Yes',
       cancelButtonText: 'No'
     }).then((result) => {
       if (result.isConfirmed) {
         this._configurationalmasterService.deleteNoticePeriodById(this.cellValue).subscribe(
           (res) => {
 
             this.toaster.success('Deleted successfully!');
             this.reloadCurrentRoute();
           },
           (err) => {
             this.toaster.error("Somthing went wrong, Please try again!", "Error Message!")
 
           }
         )
       }
     });
   }
 }