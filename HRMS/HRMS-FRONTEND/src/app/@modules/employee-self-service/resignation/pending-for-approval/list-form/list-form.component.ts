import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import  moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';

import { CommonService } from 'src/app/@shared/services/common.service';
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      // Return an error object to indicate validation failure
      return { leadingSpaces: true };
    }
    // Return null if validation passes
    return null;
  };
}

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent {

  dataObj: any = {}; 
    isCheckboxChecked: boolean = false;


  requestNewPositionForm: any;
  public designationList: any;
  public locations: any;
  public departments: any;
  public jdToUpload: any;
  public areaList: any;
  getContractData: any;
  getAllSuperviserData: any;
  selectJob: boolean = true;
  getAllReasonData: any;
  // $common: any;
  createPrForm: any;
  imageToUpload: any;
  imagePath: any;
  employee_id: any;
  branchAllData: any;
  typeData: { type: string; id: number; }[];
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  date = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minDate = moment({ year: this.year - 0, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minEndDate: any;
  cost_center_idData: any;
  newAreaList: any;
  newCostList: any;
  rowDataCheck: any;
  entity_id: any;
  jobData: any;
  jobId: any;
  fileBind: any;
  budgetCheck: boolean;
  paramsData: any;
  fileUpload: any;
  loginUser: any;
  finacial_id: any;
  costCenterData: any;
  departments2: any;
  departmentList: any;
  newAreaList2: any;
  designationList2: any;
  designations: any;
  supervisers: any;
  locations2: any;
  locationValues: any;
  newCostList2: any;
  costCenters: any;
  disable: boolean = true;
  todayDate: string;
  id: any;
  data:any

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private recruitService: RecruitService,
    private toaster: ToastrService,
   
    private _commonService: CommonService,
    private _empRegistration: EmpRegistrationService,
    
  )  {
    this.requestNewPositionForm = this.fb.group({
      employee_name: new FormControl(null),
      employee_code: new FormControl(null),
      leaderPosition: new FormControl(null),
      joining_date: new FormControl(null),
      job_location: new FormControl(null),
      department: new FormControl(null),
      manager: new FormControl(null),
      // end_date: new FormControl(null, Validators.required),
      notice_period: new FormControl(null),
      last_working_day: new FormControl(null),
      // paid_leaves: new FormControl(null),
      reason: new FormControl(null),
      remarks: new FormControl(null),
      
      remarks_manager: new FormControl(null, Validators.required),
      resign_date:new FormControl(),
      // gratuity:new FormControl(),
     
     
    
     
    });
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];

  }
  ngOnInit(): void {
    let idEntity = localStorage.getItem('selectedEntityId')
    this.entity_id = Number(idEntity);
    console.log(this.entity_id, 'this.entity_id');
    let finacial_id = localStorage.getItem('financial_id');
    this.finacial_id = Number(finacial_id)
    var empData: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(empData);
    const singleEmpData = JSON.parse(empData);
    this.employee_id = singleEmpData?.employee_id;
    console.log("sssss",this.employee_id);
    this.requestNewPositionForm?.get('jobSpecification')?.setValue("YES");
    this.requestNewPositionForm?.get('budget')?.setValue("YES");
   
    this.activeroute.queryParams.subscribe((params: any) => {
      this.jobId = params?.id;
      this.paramsData = params?.type;
    });
   
    // this.getByIdUse();

    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params['id'];  
      if (this.id) {

        this.getIdResignation(this.id);
      }
    });

  }

  updatePrRemarkApprove(e: any){  
    let val =this.requestNewPositionForm.value;
    if (this.requestNewPositionForm.invalid) {
      this.toast.error("Form is invalid. Please fill out all required fields.")
      return;
    }
    e.stopPropagation();
    Swal.fire({
      title: 'Do You Want to Approve This Resignation Request?',
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
          status: "APPROVED",
          remark:val?.remarks_manager
          }
        
        this.recruitService.updateMyResignationRequest(this.jobId,data).subscribe((res:any)=>{
          console.log(res,'resssss');
          this.toaster.success('Mail Sent successfully');
          this._commonService?.hideLoader()
          this.route.navigate(['/master/ess/resignation/approval'])
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
    let val =this.requestNewPositionForm.value;

    if (this.requestNewPositionForm.invalid) {
      this.toast.error("Form is invalid. Please fill out all required fields.")
      return;
    }
// if (this.alldataPr?.approvel_status === "APPROVED") {
//   this.alldataPr.approvel_status = "REJECTED";
//   this.alldataPr.Approvel_status = "REJECTED";

// }

    
    e.stopPropagation();
    Swal.fire({
      title: 'Do You Want to Reject This Resignation Request?',
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
      status: "REJECTED",
      remark:val?.remarks_manager

      }
        
      this.recruitService.updateMyResignationRequest(this.jobId,data).subscribe((res:any)=>{
        console.log(res,'resssss');
        this.toaster.success('Mail Sent successfully');
        this._commonService?.showLoader()
        this.route.navigate(['/master/ess/resignation/reject'])
        },
        ((err:any)=>{
          this._commonService?.hideLoader()
          this.toast.error(`${err.error.message}`)
        })
        )
      }
    });
  }

  getIdResignation(id: any): void {
    this.recruitService.getIdResignation(id).subscribe((res:any) => {
 
      // let val = res.data; 
      // console.log("gfdsagd",val);
      this.data = res.data; 
      console.log("gfdsagd",this.data?.[0].employee_id

      );
      this.getByIdUse(this.data?.[0].employee_id)
     this.isCheckboxChecked = this.data?.[0]?.is_notice_adjust == 1 ? true : false;

      this.requestNewPositionForm.patchValue({     
        reason: this.data?.[0].reason,
        notice_period: this.data?.[0].notice_period,
        resign_date: this.data?.[0].resign_date,
        // gratuity: this.data?.[0].gratuity||"0.00",
        // last_working_day: val.last_working_day,
        last_working_day: moment(this.data?.[0].last_working_day, "DD-MM-YYYY").toDate(),
        // paid_leaves: this.data?.[0].paid_leaves,
        remarks: this.data?.[0].remarks,
        remarks_manager:this.data?.[0].ESS_RESIGNATION_APPROVEL_LEVELs?.[0].remark,

      });
    });
  }

  


  getByIdUse(employee_id:any) {
    this._empRegistration.getByUserId(employee_id).subscribe((res: any) => {
      this.dataObj = res.data;
      console.log("sss",this.dataObj);
      
    });
  }

  ngSubmit(value: any) {
    let val = this.requestNewPositionForm.value;
    
    const data = {
      employee_name:this.dataObj?.first_name + ' ' + this.dataObj?.last_name,
      employee_code:this.dataObj?.employee_code,
      joining_date:this.dataObj?.start_working_date,
      job_location:this.dataObj?.prev_employer_details?.[0]?.location,
      department:this.dataObj?.department_name,
      manager:this.dataObj?.reporting_manager,
      reason:val?.reason,
      notice_period:val?.notice_period,
      last_working_day:moment(val.last_working_day).format("DD-MM-YYYY"),
      // paid_leaves:val?.paid_leaves,
      remarks:val?.remarks,
      employee_id:this.employee_id,
      reporting_manager_id:this.dataObj?.reporting_manager_id,
      reporting_manager_name:this.dataObj?.reporting_manager,
      resign_date:this.todayDate,
    };
    console.log("sharukh",data);
      this.recruitService.createResignation(data).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.route.navigate(['/master/ess/resignation/my-request-resignation']);
        },
        (err) => {
          if (err.status == 400) {
            this.toast.error('Something went wrong!');
          } else {
            this.toast.error('Error in submission!');
          }
        }
      );
    
  }
  cancel() {
    this.route.navigate(['master/ess/manpower-request/my-request-manpower'])
  }

  // ngSubmit() {
   
  // }

    onCheckboxChange(event: any): void {
    this.isCheckboxChecked = event.checked;
    console.log('Checkbox state:', this.isCheckboxChecked);
  }

}
