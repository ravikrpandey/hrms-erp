import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approval-level-dialog',
  templateUrl: './approval-level-dialog.component.html',
  styleUrls: ['./approval-level-dialog.component.scss']
})
export class ApprovalLevelDialogComponent {
    cellData: any;
    getData: any = [];
    serviceType: string;
    getdataCopy: any;
    notCreatedFlow: boolean=false;
    remarkshow: any;
    constructor(public dialog: MatDialogRef<ApprovalLevelDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any, private _PayrollService:PayrollService, private toast: ToastrService,
      private _commonService : CommonService, 
      private route: Router,) {
      this.cellData = this.data;
      console.log(data,'dataa');
      
    }
  
    ngOnInit(): void {
      // this.getAllApproverList();
      this.approveLeavel();
    }
  
    getAllApproverList() {
      let data = {
        department: this.cellData?.department,
        PR_category: this.cellData?.PR_category=="Service PR"?"service":"item"
      }
      this._commonService?.showLoader()
      // this.prService.getAllApproverList(data).subscribe((res: any) => {
      //   this.getData = res.data[0].workFlowmaps;
      //   this._commonService?.hideLoader()
      // },(err:any) => {
      //   this._commonService?.hideLoader()
      // })
    }
  
    approveLeavel() {
      // this._commonService?.showLoader()
  this._PayrollService.getLevelAproval(this.cellData?.id).subscribe((res:any)=>{
    this.getdataCopy=res.data
    this._commonService?.hideLoader()
  },
  ((err:any)=>{
    this._commonService?.hideLoader()
  
  })
  )
    }
  
    reloadCurrentRoute() {
      let currentUrl = this.route.url;
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([currentUrl]);
      });
    }
  
  
    view(e:any){
      console.log(e,'eeeee');
      this.remarkshow=e.remarks || "No Remark Available";
    }
    // updatePrStatus(e: any) {
  
  
    //   e.stopPropagation();
    //   Swal.fire({
    //     title: 'Do You Want to Approve This Pr ?',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     cancelButtonColor: "#f44336",
    //     confirmButtonColor: "#3f51b5",
    //     confirmButtonText: 'Yes',
    //     cancelButtonText: 'No'
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       const data = {
    //         approvel_status: "APPROVED"
    //       };
    //       let id = this.cellData?.procurement_id;
    //       this._commonService?.showLoader()
    //       this.prService.updatePrStatus(id, data).subscribe((res: any) => {
    //         this._commonService?.hideLoader()
    //         this.getData = res.data;
    //         if (res.code == 200) {
    //           this.toast.success('Approved PR Successfully')
    //           this.reloadCurrentRoute();
  
    //         }
  
    //       },(err:any) => {
    //         this._commonService?.hideLoader()
    //       })
    //     }
    //   });
    // }
  
    // updatePrStatusLv2(e: any) {
  
  
    //   e.stopPropagation();
    //   Swal.fire({
    //     title: 'Do You Want to Approve This Pr ?',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     cancelButtonColor: "#f44336",
    //     confirmButtonColor: "#3f51b5",
    //     confirmButtonText: 'Yes',
    //     cancelButtonText: 'No'
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       const data = {
    //         approvel_status: "APPROVED"
    //       };
    //       let id = this.cellData?.procurement_product_id;
    //       this.prService.updatePrStatus(id, data).subscribe((res: any) => {
    //         this.getData = res.data;
    //         if (res.code == 200) {
    //           this.toast.success('Approved PR Successfully')
    //           this.reloadCurrentRoute();
  
    //         }
  
    //       })
    //     }
    //   });
    // }
  }
  
