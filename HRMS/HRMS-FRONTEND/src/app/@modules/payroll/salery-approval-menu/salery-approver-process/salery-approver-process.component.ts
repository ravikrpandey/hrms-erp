import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { SalaryProcessService } from 'src/app/@shared/services/payroll/salary-process.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-salery-approver-process',
  templateUrl: './salery-approver-process.component.html',
  styleUrls: ['./salery-approver-process.component.scss']
})
export class SaleryApproverProcessComponent {

    cell_id: any;
    getData: any=[];
    remarksForm: FormGroup;
    idEmp:any;
    alldataPr: any;
    entity_id: any;
    finacial_id: any;
    workflow_type: any;
    allData:any;
    checkCond:any;
    statusPayslip:any;
  statusShow: string;
    constructor(private  _saleryService:SalaryProcessService, public dialog: MatDialogRef<SaleryApproverProcessComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any, private prService: PurchaseRequestService, private toast: ToastrService,private route: Router,private fb: FormBuilder, private _commonService : CommonService, ) {
      this.cell_id = this.data?.procurement_id;
     console.log(data,'data<<<');
     this.allData=data;
  this.checkCond=data.statu;
      this.remarksForm= this.fb.group({
        remarks: new FormControl(null, [Validators.required]),
      })

      
    }
  
    ngOnInit(): void{
      debugger
      this.idEmp=localStorage.getItem('EmpMainId');
      this.entity_id = localStorage.getItem('selectedEntityId');
      let finacial_id = localStorage.getItem('financial_id');
      this.finacial_id = Number(finacial_id)
    
    }
  
    updateRemarkApprove(e: any){  
      debugger
      let val =this.remarksForm.value;
      if(this.remarksForm.invalid){
        return this.toast.error("Remark Is required");
       }
      e.stopPropagation();
      Swal.fire({
        title: 'Do You Want to Approve This?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          const data = {
            
        approval_data:this.allData?.approval_data,
        remarks : val.remarks,
        login_id:this.idEmp,
        status:"APPROVED"
          };
          this._commonService?.showLoader()
          this._saleryService.payrolApprover(data).subscribe((res: any) => {
            this._commonService?.hideLoader()
            this.getData = res.data;
            this.dialog.close()
            if(res.code ==200){
              this.toast.success(res.message);
                  
            }
            window.location.reload();
            
          },(err:any) => {
            this._commonService?.hideLoader()
          })
        }
      });
 
    }
    updatePrRemarkReject(e: any){  
      let val =this.remarksForm.value;
      if(this.remarksForm.invalid){
        this.toast.error("Remark Is required");
        return
      }
      e.stopPropagation();
      Swal.fire({
        title: 'Do You Want to Reject This?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          const data = {
            approval_data:this.allData?.approval_data,
            remarks : val.remarks,
            login_id:this.idEmp,
    
           status:"REJECTED"
           };
          
          this._commonService?.showLoader()
          this._saleryService.payrolApprover(data).subscribe((res: any) => {
            this.getData = res.data;
            this.dialog.close()
            window.location.reload();
  
            this._commonService?.hideLoader()
            if(res.code ==200){
              this.toast.success(res.message)
            
            }
            
          },(err:any) => {
            this._commonService?.hideLoader()
          })
        }
      });
    }

    updateRemarkOK(e:any){
      let val =this.remarksForm.value;
      if(this.remarksForm.invalid){
        this.toast.error("Remark Is required");
        return
      }
      if(this.checkCond == 'reRunning'){
        this.statusPayslip="REJECTED"
        this.statusShow="Payslip Rejected Successfully.."
      }else{
        this.statusPayslip="CLOSED"
        this.statusShow="Payslip Close Successfully.."

      }
      e.stopPropagation();
      Swal.fire({
        title: 'Do You Want To This?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          const data = {
            approval_data:this.allData?.body,
            remarks : val.remarks,
            login_id:this.idEmp,
           status:this.statusPayslip
           };
          
          this._commonService?.showLoader()
          this._saleryService.payrolApprover(data).subscribe((res: any) => {
            this.getData = res.data;
            this.dialog.close()
            // window.location.reload();
  
            this._commonService?.hideLoader()
            if(res.code ==200){
              this.toast.success(this.statusShow)
            
            }
            
          },(err:any) => {
            this._commonService?.hideLoader()
          })
        }
      });
    }

    updateRemarkClosePayslip(e:any){
      let val =this.remarksForm.value;
      if(this.remarksForm.invalid){
        this.toast.error("Remark Is required");
        return
      }
   
        this.statusPayslip="CLOSED";
        this.statusShow="Payslip Close Successfully.."

      e.stopPropagation();
      Swal.fire({
        title: 'Do You Want To This?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          const data = {
            approval_data:this.allData?.body,
            remarks : val.remarks,
            login_id:this.idEmp,
           status:this.statusPayslip
           };
          
          this._commonService?.showLoader()
          this._saleryService.payrolApproverClosePaySlip(data).subscribe((res: any) => {
            this.getData = res.data;
            this.dialog.close()
  
            this._commonService?.hideLoader()
            if(res.code ==200){
              this.toast.success(this.statusShow)
            
            }
            window.location.reload();

            
          },(err:any) => {
            this._commonService?.hideLoader()
          })
        }
      });
    }
    closeDialog(): void {
      this.dialog.close();
    }
  }
