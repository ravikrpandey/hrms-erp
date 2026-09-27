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

@Component({
  selector: 'app-all-resignation-create',
  templateUrl: './all-resignation-create.component.html',
  styleUrls: ['./all-resignation-create.component.scss']
})
export class AllResignationCreateComponent {

  
  dataObj: any = {}; 

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
  data:any;
  id: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private recruitService: RecruitService,
   
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
      paid_leaves: new FormControl(null),
      reason: new FormControl(null),
      remarks: new FormControl(null),
      
      remarks_manager: new FormControl(null, Validators.required),
      resign_date:new FormControl(),
      last_day: new FormControl(null, Validators.required),
      hr_remarks:new FormControl(null, Validators.required),
     
    
     
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

  updated(e: any) {
    this.route.navigate(['/master/hrms/all-resignation/all-resignation-review'])
  }

  // updatePrRemarkApprove(e: any){  
  //   let val =this.requestNewPositionForm.value;
  //   if (this.requestNewPositionForm.invalid) {
  //     this.toast.error("Form is invalid. Please fill out all required fields.")
  //     return;
  //   }
  //   e.stopPropagation();
  //   Swal.fire({
  //     title: 'Do You Want to Approve This Job Request?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     cancelButtonColor: "#f44336",
  //     confirmButtonColor: "#3f51b5",
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this._commonService?.showLoader()
                
  //       let data={

  //         employee_id: this.employee_id,
  //         approvel_status: "APPROVED",
  //         progressStatus: "CLOSE",
  //         // "employee_id": 2,
  //         status: "APPROVED",
  //         remark:val?.remarks_manager
  //         }
        
  //       this.recruitService.updateMyRequest(this.jobId,data).subscribe((res:any)=>{
  //         console.log(res,'resssss');
  //         this._commonService?.hideLoader()
  //         this.route.navigate(['/master/ess/resignation/approval'])
  //         },
  //         ((err:any)=>{
  //           this.toast.error(`${err.error.message}`)
  //           this._commonService?.hideLoader()
  //         })
  //         )
  //     }
  //   });
  // }

 

  getIdResignation(id: any): void {
    this.recruitService.getIdResignation(id).subscribe((res:any) => {
 
       this.data = res.data; 
      console.log("gfdsagd",this.data?.[0].employee_id

      );
      this.getByIdUse(this.data?.[0].employee_id)
     
      this.requestNewPositionForm.patchValue({     
        reason: this.data?.[0].reason,
        notice_period: this.data?.[0].notice_period,
        resign_date: this.data?.[0].resign_date,
        // last_working_day: val.last_working_day,
        last_working_day: moment(this.data?.[0].last_working_day, "DD-MM-YYYY").toDate(),
        paid_leaves: this.data?.[0].paid_leaves,
        remarks: this.data?.[0].remarks,
        remarks_manager:this.data?.[0].ESS_RESIGNATION_APPROVEL_LEVELs?.[0].remark,

      });
    });
  }

  


  getByIdUse(employee_id:any) {
    // const employee_id =  this.employee_id; 
    this._empRegistration.getByUserId(employee_id).subscribe((res: any) => {
      this.dataObj = res.data;
      console.log("sss",this.dataObj);
      
    });
  }

  ngSubmit(value: any) {
    let val = this.requestNewPositionForm.value;
    
    const data = {
      last_day:val?.last_day,
      hr_remarks:val?.hr_remarks,
      
    };
    console.log("sharukh",this.data[0]?.reporting_manager_id );
      this.recruitService.editResignation(this.id,data).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.route.navigate([`/master/hrms/all-resignation/all-resignation-review`], {
            queryParams: { id:this.id,reporting_id: this.data[0]?.reporting_manager_id,employee_id:this.data[0]?.employee_id },skipLocationChange: true
          });

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
  resignId(resignId: any, data: { last_day: any; hr_remarks: any; }) {
    throw new Error('Method not implemented.');
  }
  // cancel() {
  //   this.route.navigate(['master/ess/manpower-request/my-request-manpower'])
  // }

  // ngSubmit() {
   
  // }


}
