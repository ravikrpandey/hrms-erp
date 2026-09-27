

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { SalesManagementService } from 'src/app/@modules/sales-management/sales-management-service/sales-management.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-fund-transfer-status',
  templateUrl: './fund-transfer-status.component.html',
  styleUrls: ['./fund-transfer-status.component.scss']
})
export class FundTransferStatusComponent {
  notCreatedFlow:boolean=false;
  getdataCopy:any=[]
  isViewStatus :boolean = false;
  remarksForm:FormGroup;
  constructor(
    public dialogRef: MatDialogRef<FundTransferStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private saleManagement : SalesManagementService,
    private fb:FormBuilder
  ) { }
  view(e:any){}
  ngOnInit(){

    this.remarksForm= this.fb.group({
      remarks: [''],
      approval_status:['']
    })
    if(this.data.status==='View'){
      this.isViewStatus=true;
      let id = this.data?.cellData?.id;
      this.viewProformaLevel(id)
    }
  }

  updateRemarkApprove(){

    console.log(this.remarksForm.value);
    let empid = localStorage.getItem('EmpMainId');
    let formdata = this.remarksForm.value;
    formdata['progress_status']='CLOSE';
    formdata['emp_id']=empid;

    this.saleManagement.updateProformaStatus(this.data.cellData.id, formdata).subscribe((res: any) => {
      console.log(res, "Updated Status");
      this.toast.success('Status updated sucessfully');
      this.dialogRef.close({ success: true, message: 'Status updated successfully' });
      this.route.navigate(['master/sales-management/proforma'])
     },(error)=>{
      console.log('Error updating status:', error);
        this.toast.error('Failed to update status');
      this.dialogRef.close({ success: false, message: 'Failed to update status' })
      this.route.navigate(['master/sales-management/proforma'])
     });
  }
  remarkshow:any;
  employee:any;
  view2(e:any){
    console.log(e,'eeeee');
    this.remarkshow=e?.remarks || "No Remark Available";
    this.employee=e?.name +' :- ';
  }
  viewProformaLevel(id:any){
    this.saleManagement.getAllFundTransferApprovalLevel(id).subscribe({
      next:(res:any)=> {
        this.getdataCopy=res.data
        console.log(res);
      },error(err) {
        console.log(err);
      },
    })
  }
}
