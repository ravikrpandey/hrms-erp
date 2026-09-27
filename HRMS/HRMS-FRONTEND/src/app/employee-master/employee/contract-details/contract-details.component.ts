import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Location } from '@angular/common';
import { HeadService } from 'src/app/@shared/services/head.service';
import Swal from 'sweetalert2';
import moment from 'moment';
import { OnboardingService } from 'src/app/@shared/services/service/recruitment/onboarding.service';


@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.scss']
})

export class ContractDetailsComponent implements OnInit {
  contractForm: any;
  id: any;
  salaryData: any;
  salaryGetData: any;
  // employee_id: any = 2
  empId: any;
  action_type: any;

  salaryId: any;
  constructor(
    private fb: FormBuilder,
    private _empoloyeeService: EmpRegistrationService,
    private head: HeadService,
    private route: Router,
    private toastr: ToastrService,
    private _activeRoute: ActivatedRoute,
    private locatin: Location,
    private $onboarding: OnboardingService,
  ) {
    this.contractForm = this.fb.group({
      contract_types_id: [{ value: '', disabled: true }],
      start_working_date: [{ value: '', disabled: true }],
      end_date_probation: [{ value: '', disabled: true }],
    })
  }
  ngOnInit(): void {
    this._activeRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.salaryId = this.id.employee_id;
      this.action_type = this.id.action_type;

      if (params.employee_id) {
        this.salaryGetBy(params.employee_id)
      }
    })
    this._empoloyeeService.setEmpTitle('SALARY DETAILS')
    this.getContractList();

  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date); // Copy the original date
    result.setDate(result.getDate() + days); // Add days
    return result;
  }

  contractData: any = {}
  getCandidate_detailsByID() {
    
    let candidate_id = localStorage.getItem("candidate_id");
    this.$onboarding.getCandidate_detailsByID(candidate_id).subscribe((res: any) => {
      if (res) {
        this.contractData = res?.data[0];
        const newDate = this.addDays(this.contractData?.exp_joining_date, this.contractData?.probation_period);
        this.contractForm.patchValue({
          contract_types_id: this.contractData?.contract_types_id,
          start_working_date: this.contractData?.exp_joining_date,
          end_date_probation: newDate,
        })
      }
    });
  }

  get SL(): any { return this.contractForm.controls }


  salaryGetBy(id: any) {
    
    this._empoloyeeService.getByUserId(id).subscribe((res: any) => {
      this.salaryGetData = res.data;
      this.salaryPatch(this.salaryGetData)
    })
  }

  salaryPatch(salaryGetData: any) {
    // this.contractForm.patchValue({
    //   contract_types_id: salaryGetData?.contract_types_id,
    //   start_working_date: salaryGetData?.start_working_date,
    //   end_date_probation: salaryGetData?.end_date_probation
    // })
    this.getCandidate_detailsByID();
  }

  startDate(e: any) {
    this.contractForm.controls['end_date_probation'].setValue(null)
  }

  calculateMinToDate = () => {
    let temp = moment(this.contractForm.get('start_working_date')?.value).format('YYYY-MM-DD');
    temp = moment(temp).add(1, 'day').format('YYYY-MM-DD');
    return temp;
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onSubmitForm() {
    if (this.contractForm.invalid) {
      return this.toastr.error('Required fields should not be empty', 'Fields Error');
    }
    let val: any = this.contractForm.value;
    let candidate_id = localStorage.getItem("candidate_id");
    let req = {
      ...val,
      tab_type: "Contract",
      candidate_id: candidate_id
    }

    if (this.id.employee_id) {
      req.employee_id = this.id.employee_id;
    }
    this.$onboarding.register_onboarded_employee(req).subscribe(
      (res: any) => {
        this.toastr.success('Updated Successfully..');
        // this.reloadCurrentRoute()     
        // this.route.navigate(["master/hrms/employee-master/employ"]);
      },
      (err) => {
        if (err.status === 400) {
          this.toastr.error('Failed! Email is already in use!');
        } else if (err.status == 500) {
          this.toastr.error('bad request ');
        } else if (err.status == 404) {
          this.toastr.error(
            'Somthing went wrong.. Please try agin',
            'Error Massage'
          );
        } else {
          this.toastr.error('Login failed');
        }
      }
    );
  }

  prevTab = () => {
    console.log("this function called")
    this.route.navigate(
      ['create-employee-module/employ/employee-create/document-details'],
      { queryParams: { employee_id: this.id.employee_id } }
    );
  }

  // contract list get start
  contractList: any = [];
  getContractList() {
    this._empoloyeeService.get_Active_ContractTypes().subscribe(
      (res) => {
        this.contractList = res.data;
      },
      (err) => {

      }
    );
  }
  // contract list get end

}
