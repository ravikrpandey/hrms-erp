import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';
import { SalesService } from '../../service/sales.service';
import { ToastrService } from 'ngx-toastr';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';

@Component({
  selector: 'app-so-dialog',
  templateUrl: './so-dialog.component.html',
  styleUrls: ['./so-dialog.component.scss']
})
export class SoDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SoDialogComponent>,   
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sales:SalesService,
    private proposal : ProposalService,
    private tost : ToastrService
  ) {
    
    this.initForm();
    this.getAll_salesReason();
  }
emp_id:any
  private initForm(): void {
   this.emp_id = localStorage.getItem('EmpMainId');
    this.form = this.fb.group({
      reason_id:['',[Validators.required]],
      remark:['',[Validators.required]]
    });
    
  }
salesReasion:any
  getAll_salesReason(){
    this._sales.getAll_salesReason().subscribe({
      next:(res:any)=> {
        this.salesReasion = res.data;
      },error:(err)=> {
        this.tost.error(err.error.message);
      },
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit(){
    let formData = this.form.value;
    console.log('formDataformDataformDataformDataformData',formData);

    formData.proposal_id = this.data.data?.proposal_id;
    formData.version_id = this.data.data?.version_id;
    formData.emp_id = this.emp_id;
    if(this.data?.type==='Status'){

      this._sales.salesSoProgressStatus(formData).subscribe({
        next:(res:any)=> {
          this.tost.success(res.message);
          this.dialogRef.close(res);
        },error:(err)=> {
          this.tost.error(err.error.message);
        },
      })
    }else{

     let frmData= {
        emp_id : this.emp_id,

        booking_status: "REJECTED",
     ...formData,
        so_status: "REJECTED",
        pi_id: this.data.data?.pi_id
    }
    
      this._sales.proposalVersionRejected(this.data.data?.pi_id,frmData).subscribe({
        next:(res:any)=> {
          this.tost.success(res.message);
          this.dialogRef.close(res);
        },error:(err)=> {
          this.tost.error(err.error.message);
        },
      })
    }
  }
}
