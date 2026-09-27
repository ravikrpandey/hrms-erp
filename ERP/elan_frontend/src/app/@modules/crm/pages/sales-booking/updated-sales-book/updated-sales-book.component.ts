import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-booking-approved',
  templateUrl: './updated-sales-book.component.html',
  styleUrls: ['./updated-sales-book.component.scss']
})
export class UpdatedSalesBookComponent {
  form:any;
  procurement_product_id:any;
  allReasone:any;
  userLoginId:any;
constructor( 
  private fb:FormBuilder,
  private toast: ToastrService,
  private prService: PurchaseRequestService,
  private $proposal: ProposalService,
  private route: Router,

  public dialog: MatDialogRef<UpdatedSalesBookComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
  ){
this.form = this.fb.group({
  update_status: new FormControl(null),
  remarks:new FormControl(null)
});

console.log(data,"data<<<<<<")
}

ngOnInit(): void {
  this.userLoginId = localStorage.getItem('EmpMainId')
  
  this.$proposal.getAllSalesReason().subscribe((res:any)=>{
    this.allReasone = res.data;
  })
}

updateDate(){
  
  if(this.form.invalid) {
    this.toast.error('Required fields should not be empty', 'Fields Error');
    return;
  }
  let val = this.form.value;
  if(this.data?.status === 'customerReject'){
    let customerReject={
      // email_status:status,
     customer_status:"REJECTED",
     pi_id:this.data?.cellData?.ppi_id,
     version_id:this.data?.cellData?.version_id,
     proposal_id:this.data?.cellData?.proposal_id,
    //  booking_status:booking_status,
    sales_reason_id:val?.update_status,
     reason_rejectedBy:this.userLoginId,
      so_status: "REJECTED",
     reason_remarks:val?.remarks,
     }
    this.$proposal.updateAcceptPI(customerReject).subscribe((res:any)=>{
    console.log(res)
    this.toast.success(`${res?.message}`)
    // this.emailCheckBtn=true;
    this.reloadCurrentRoute();
    
    },
    ((err:any)=>{
    this.toast.error("Something Went To Wrong")
    })
    )
  }else{

let val2 = this.form.value;

    let dataCopy={
      // email_status:status,
        booking_status: "REJECTED",
        version_id:this.data?.cellData?.version_id,
        proposal_id:this.data?.cellData?.proposal_id,
        so_status: "REJECTED",
        pi_id:this.data?.cellData?.pi_id,
        login_id:this.userLoginId,
        reason_remarks:val2?.remarks,
     }
   
     this.$proposal.updateBookingStatus(dataCopy).subscribe({
        next:(res:any) =>{
          this.toast.success(res.message);
        //   this.dialog.close();
        this.route.navigate(['/master/sales/sales-booking/approved-list']);

        },error:(err) =>{
          console.log(err)
          this.toast.error(err.error.message);
        //   this.dialog.close();
        },
      })
  }


  

}

reloadCurrentRoute() {
  let currentUrl = this.route.url;
  this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.route.navigate([currentUrl]);
  });
}
  
  }
