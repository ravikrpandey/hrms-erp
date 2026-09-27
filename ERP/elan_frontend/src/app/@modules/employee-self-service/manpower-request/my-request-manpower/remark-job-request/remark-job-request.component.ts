import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { EmployeSelfService } from 'src/app/@shared/services/employe-self.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-remark-job-request',
  templateUrl: './remark-job-request.component.html',
  styleUrls: ['./remark-job-request.component.scss']
})
export class RemarkJobRequestComponent {

  cell_id: any;
  getData: any=[];
  remarksForm: FormGroup;
  idEmp: string | null;
  alldataPr: any;
  
  jobId: any;
  employee_id: any;
  constructor(private emp_self_service:EmployeSelfService,
    private _commonService : CommonService, 
    public dialog: MatDialogRef<RemarkJobRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private prService: PurchaseRequestService, private toast: ToastrService,private route: Router,private fb: FormBuilder ) {
    this.cell_id = this.data.cellData.procurement_id;
    this.alldataPr=data.cellData;
    console.log(data,'dataaa<<<<<<<<<');
    
  this.jobId=data?.id
    this.remarksForm= this.fb.group({
      remarks: new FormControl(null),
    })
  }

  ngOnInit(): void{
    this.idEmp=localStorage.getItem('EmpMainId')
    var empData: any = localStorage.getItem('signInUser');
    const singleEmpData = JSON.parse(empData);
    this.employee_id = singleEmpData?.employee_id;
  }

  updatePrRemarkApprove(e: any){  
    let val =this.remarksForm.value;
    e.stopPropagation();
    Swal.fire({
      title: 'Do You Want to Approve This Job Request?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._commonService?.showLoader()
         
let data={

  employee_id: this.employee_id,
  approvel_status: "APPROVED",
  progressStatus: "CLOSE",
  // "employee_id": 2,
  final_status: "APPROVED",
  remark:val?.remarks
  }
        
        this.emp_self_service.updateMyRequest(this.jobId,data).subscribe((res:any)=>{
          console.log(res,'resssss');
          this._commonService?.hideLoader()
          this.route.navigate(['master/ess/manpower-request/approval'])
          },
          ((err:any)=>{
            this.toast.error(`${err.error.message}`)
            this._commonService?.hideLoader()
          })
          )
      }
    });
  }

  updatePrRemarkReject(e: any){  
    let val =this.remarksForm.value;
// if (this.alldataPr?.approvel_status === "APPROVED") {
//   this.alldataPr.approvel_status = "REJECTED";
//   this.alldataPr.Approvel_status = "REJECTED";

// }

    
    e.stopPropagation();
    Swal.fire({
      title: 'Do You Want to Reject This Job Request?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._commonService?.showLoader()
    let data={
    
      employee_id: this.employee_id,
      approvel_status: "REJECTED",
      progressStatus: "CLOSE",
      // "employee_id": 2,
      final_status: "REJECTED",
      remark:val?.remarks

      }
        
      this.emp_self_service.updateMyRequest(this.jobId,data).subscribe((res:any)=>{
        console.log(res,'resssss');
        this._commonService?.showLoader()
        this.route.navigate(['master/ess/manpower-request/reject'])
        },
        ((err:any)=>{
          this._commonService?.hideLoader()
          this.toast.error(`${err.error.message}`)
        })
        )
      }
    });
  }
}

