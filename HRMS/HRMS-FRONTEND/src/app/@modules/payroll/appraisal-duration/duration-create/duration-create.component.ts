import { Component , Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { SalaryProcessService } from 'src/app/@shared/services/payroll/salary-process.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';

@Component({
  selector: 'app-duration-create',
  templateUrl: './duration-create.component.html',
  styleUrls: ['./duration-create.component.scss']
})
export class DurationCreateComponent {
  remarksForm: any;

  allData: any;
  cell_id: any;
rowData :any;
labelName:any;
  constructor( private payrollService: PayrollService,private  _saleryService:SalaryProcessService, public dialog: MatDialogRef<DurationCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private prService: PurchaseRequestService, private toast: ToastrService,private route: Router,private fb: FormBuilder, private _commonService : CommonService, private _payrollService:PayrollService ) {
    this.cell_id = this.data?.procurement_id;
    
   console.log(data,'data<<<');
   this.allData=data;

    this.remarksForm= this.fb.group({
      effective_after: new FormControl(null),
      period: new FormControl(null),
    



    })
  }
  ngOnInit():void {
    if(this.allData?.status){
this.labelName="Update"
    }else{
this.labelName="Submit"

    }
    this.getByDuration()
  }
  getByDuration(){
    this._payrollService.getByAppraisalDuration(this.allData?.item?.id).subscribe((res:any)=>{
      console.log(res,'ressssss');
      this.remarksForm.patchValue({
        effective_after:res.data?.effective_after,
       period:res.data?.period
      })
    })
  }

  

  closeDialog(): void {
    this.dialog.close();
  }
  submitForm(){
    let val=this.remarksForm.value;
    console.log(val,'valll');

    if(this.allData?.status){
      this.payrollService.updateAppraisalDuration(this.allData?.item?.id,val).subscribe((response : any) => {
        console.log(response)
        this.toast.success(`${response.message}`)
        this.reloadCurrentRoute();
        this.dialog.close();
      },
      ((err:any)=>{
        
        if(err?.error?.code === 400 ){
          this.toast.error(`${err.error?.message}`)
          this.dialog.close();
  
        }else{
          this.toast.error("Something Went TO Wrong")
          this.dialog.close();
  
        }
  
      })
      )
    }else{
      this.payrollService.createAppraisalDuration(val).subscribe((response : any) => {
        console.log(response)
        this.toast.success(`${response.message}`)
        this.reloadCurrentRoute();
        this.dialog.close();
      },
      ((err:any)=>{
        
        if(err?.error?.code === 400 ){
          this.toast.error(`${err.error?.message}`)
          this.dialog.close();
  
        }else{
          this.toast.error("Something Went TO Wrong")
          this.dialog.close();
  
        }
  
      })
      )
    }
   
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
