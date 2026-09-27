import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import * as moment from 'moment';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.scss'],
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
  contractList2: any;
  contracts: any;
  constructor(
    private fb: FormBuilder,
    private _empoloyeeService: EmpRegistrationService,
    private route: Router,
    private toastr: ToastrService,
    private _activeRoute: ActivatedRoute
  ) {
    this.contractForm = this.fb.group({
      contract_types_id: new FormControl(null, [Validators.required]),
      start_working_date: new FormControl(null, [Validators.required]),
      end_date_probation: new FormControl(null, [Validators.required]),
    });
  }
  ngOnInit(): void {
    this._activeRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.salaryId = this.id.employee_id;
      this.action_type = this.id.action_type;

      if (params.employee_id) {
        this.salaryGetBy(params.employee_id);
      }
    });
    this._empoloyeeService.setEmpTitle('SALARY DETAILS');
    this.getContractList();
  }
  get SL(): any {
    return this.contractForm.controls;
  }

  salaryGetBy(id: any) {
    this._empoloyeeService.getByUserId(id).subscribe((res: any) => {
      this.salaryGetData = res.data;
      this.salaryPatch(this.salaryGetData);
    });
  }

  salaryPatch(salaryGetData: any) {
    this.contractForm.patchValue({
      contract_types_id: salaryGetData?.contract_types_id,
      start_working_date: salaryGetData?.start_working_date,
      end_date_probation: salaryGetData?.end_date_probation,
    });
  }

  startDate(e: any) {
    this.contractForm.controls['end_date_probation'].setValue(null);
  }

  calculateMinToDate = () => {
    let temp = moment(
      this.contractForm.get('start_working_date')?.value
    ).format('YYYY-MM-DD');
    temp = moment(temp).add(1, 'day').format('YYYY-MM-DD');
    return temp;
  };

  contractSearch(e: any) {
    const aa = e;
    let filteredVariable = this.contractList2.filter((item: any) =>
      aa.includes(item.contract_type)
    );
    this.contractList = filteredVariable;
  }

  onSubmitForm() {
    if (this.contractForm.invalid) {
      return this.toastr.error(
        'Required fields should not be empty',
        'Fields Error'
      );
    }
    let val: any = this.contractForm.value;

    let req = {
      ...val,
      tab_type: 'Contract',
    };

    if (this.id.employee_id) {
      req.employee_id = this.id.employee_id;
    }

    this._empoloyeeService.basicSignUp(req).subscribe(
      (res: any) => {
        this.toastr.success('Updated Successfully..');
        this.route.navigate(['master/hrms/employee-master/employ']);
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
    console.log('this function called');
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/document-details'],
      { queryParams: { employee_id: this.id.employee_id } }
    );
  };

  // contract list get start
  contractList: any = [];
  getContractList() {
    this._empoloyeeService.get_Active_ContractTypes().subscribe(
      (res) => {
        this.contractList = res.data;
        this.contractList2 = res.data;
        this.contracts = this.contractList.map((res: any) => res.contract_type);
      },
      (err) => {}
    );
  }
  // contract list get end
}
