import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approval-dialog',
  templateUrl: './approval-dialog.component.html',
  styleUrls: ['./approval-dialog.component.scss']
})
export class ApprovalDialogComponent {
  cellData: any;
  getData: any = [];
  serviceType: string;
  getdataCopy: any;
  notCreatedFlow: boolean=false;
  remarkshow: any;
  constructor(public dialog: MatDialogRef<ApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private prService: PurchaseRequestService, private toast: ToastrService,
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
    this.prService.getAllApproverList(data).subscribe((res: any) => {
      this.getData = res.data[0].workFlowmaps;
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  approveLeavel() {
    if(this.cellData?.pr_category=="Service"){
   this.serviceType="Service"
    }else if(this.cellData?.pr_category=="Item"){
      this.serviceType="Item"
    }
    
    let data={
      // approvel_status:"APPROVED",
      // progressStatus: "CLOSE",
      // final_status: "APPROVED",
      // // department_id:this.cellData?.department_id,
      // workflow_type:this.serviceType,
      // employee_id:this.cellData?.employee_id
      dep_id:this.cellData?.department_id,
      // employeeId:this.cellData?.employee_id,
      workflow_type:this.serviceType
    }
    this._commonService?.showLoader()
// this.prService.levelsShowPR(this.cellData?.id,data).subscribe((res:any)=>{
//   this.getdataCopy=res.data
//   this._commonService?.hideLoader()
// },
// ((err:any)=>{
//   this._commonService?.hideLoader()
//   if(err.status==400){
// this.notCreatedFlow=true;
//   }
// })
// )
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }


  view(e:any){
    console.log(e,'eeeee');
    this.remarkshow=e.remark || "No Remark Available";
  }
  updatePrStatus(e: any) {


    e.stopPropagation();
    Swal.fire({
      title: 'Do You Want to Approve This Pr ?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          approvel_status: "APPROVED"
        };
        let id = this.cellData?.procurement_id;
        this._commonService?.showLoader()
        this.prService.updatePrStatus(id, data).subscribe((res: any) => {
          this._commonService?.hideLoader()
          this.getData = res.data;
          if (res.code == 200) {
            this.toast.success('Approved PR Successfully')
            this.reloadCurrentRoute();

          }

        },(err:any) => {
          this._commonService?.hideLoader()
        })
      }
    });
  }
}
