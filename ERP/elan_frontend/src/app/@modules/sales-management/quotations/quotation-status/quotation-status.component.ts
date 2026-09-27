import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { SalesManagementService } from '../../sales-management-service/sales-management.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-quotation-status',
  templateUrl: './quotation-status.component.html',
  styleUrls: ['./quotation-status.component.scss']
})
export class QuotationStatusComponent {
  notCreatedFlow:boolean=false;
  getdataCopy:any=[]
  isViewStatus :boolean = false;
  remarksForm:FormGroup;
  constructor(
    public dialogRef: MatDialogRef<QuotationStatusComponent>,
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
      let id = this.data?.id;
      this.viewQuotationLevel(id)
    }
  }

  updatePrRemarkApprove(){
    let empid = localStorage.getItem('EmpMainId');
    let formdata = this.remarksForm.value;
    formdata['progress_status']='CLOSE';
    formdata['emp_id']=empid;

    this.saleManagement.updateQuotationByDepId(this.data.cellData.id, formdata).subscribe((res: any) => {
      this.toast.success('Status updated sucessfully');
      this.dialogRef.close({ success: true, message: 'Status updated successfully' });
      this.route.navigate(['master/sales-management/quotation'])
     },(error)=>{
      console.log('Error updating status:', error);
        this.toast.error('Failed to update status');
      this.dialogRef.close({ success: false, message: 'Failed to update status' })
      this.route.navigate(['master/sales-management/quotation'])
     });
  }
  remarkshow:any;
  employee:any;
  view2(e:any){
    this.remarkshow=e?.remarks || "No Remark Available";
    this.employee=e?.name +' :- ';
  }
  viewQuotationLevel(id:any){
    this.saleManagement.viewQuotationLevel(id).subscribe({
      next:(res:any)=> {
        this.getdataCopy=res.data
        console.log(res);
      },error(err) {
        console.log(err);
      },
    })
  }
}
