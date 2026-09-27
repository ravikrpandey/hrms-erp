import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeSelfService } from 'src/app/@shared/services/employe-self.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resignation-request-dialog',
  templateUrl: './resignation-request-dialog.component.html',
  styleUrls: ['./resignation-request-dialog.component.scss']
})
export class ResignationRequestDialogComponent {

  cellData: any;
  getData: any = [];
  serviceType: string;
  getdataCopy: any;
  notCreatedFlow: boolean=false;
  remarkshow: any;
  constructor(private emp_self_service:EmployeSelfService,public dialog: MatDialogRef<ResignationRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private prService: PurchaseRequestService, private toast: ToastrService, private route: Router) {
    this.cellData = this.data;
    console.log(this.cellData,'this.cellData');
    
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
    this.prService.getAllApproverList(data).subscribe((res: any) => {
      this.getData = res.data[0].workFlowmaps;

    })
  }

  approveLeavel() {
  //   if(this.cellData?.PR_category=="Service PR"){
  //  this.serviceType="Service PR"
  //   }else if(this.cellData?.PR_category=="Item PR"){
  //     this.serviceType="Item PR"
  //   }else if(this.cellData?.PR_category=="BOM PR"){
  //     this.serviceType="BOM PR"
  //   }
    
    let data={
      dep_id:this.cellData?.allData?.department_id,
      // workflow_type:this.serviceType,
      employeeId:this.cellData?.empId
    }

this.emp_self_service.getApprovelLevelRequest(this.cellData?.allData?.id,data).subscribe((res:any)=>{
  this.getdataCopy=res.data
},
((err:any)=>{
  
  if(err.status==400){
this.notCreatedFlow=true;
  }
})
)
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
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
        this.prService.updatePrStatus(id, data).subscribe((res: any) => {
          this.getData = res.data;
          if (res.code == 200) {
            this.toast.success('Approved PR Successfully')
            this.reloadCurrentRoute();

          }

        })
      }
    });
  }
  view(e:any){
    console.log(e,'eeeee');
    this.remarkshow=e.remark || "Remark Unavailable";
  }
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
