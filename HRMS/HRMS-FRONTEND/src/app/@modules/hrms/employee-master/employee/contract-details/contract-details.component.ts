import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Location } from '@angular/common';
import { HeadService } from 'src/app/@shared/services/head.service';
import Swal from 'sweetalert2';
import moment from 'moment';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../format-datepicker';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.scss'],
   providers: [
      {provide: DateAdapter, useClass: AppDateAdapter},
      {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
    ]
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
  // documentForm: any;
  // contract_detail: any = [];
  contractName: any;
  contract_detail_get: any;

  constructor(
    private fb: FormBuilder,
    private _empoloyeeService: EmpRegistrationService,
    private head: HeadService,
    private route: Router,
    private toastr: ToastrService,
    private _activeRoute: ActivatedRoute,
    private locatin: Location,
  ) {
    this.contractForm = this.fb.group({
      contract_types_id: new FormControl(null),
      start_working_date: new FormControl(null),
      end_date_probation: new FormControl(null),
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
  get SL(): any { return this.contractForm.controls }


  salaryGetBy(id: any) {
    this._empoloyeeService.getByUserId(id).subscribe((res: any) => {
      this.salaryGetData = res.data;
      this.contract_detail_get = res.data?.contractDetails
      // this.salaryPatch(this.salaryGetData)
      this.contract_detail = this.contract_detail_get;
    })
  }


  salaryPatch(salaryGetData: any) {
    this.contractForm.patchValue({
      contract_types_id: salaryGetData?.contract_types_id,
      start_working_date: salaryGetData?.start_working_date,
      end_date_probation: salaryGetData?.end_date_probation,
    })
  }

  startDate(e: any) {
    this.contractForm.controls['end_date_probation'].setValue(null)
  }

  calculateMinToDate = () => {
    let temp = moment(this.contractForm?.get('start_working_date')?.value)?.format('YYYY-MM-DD');
    temp = moment(temp)?.add(1, 'day')?.format('YYYY-MM-DD');
    return temp;
  }
  contract_detail: any[] = [];
  docIndex: null | number = null;
  addDocument() {
    this.contractForm.markAllAsTouched();

    let value = this.contractForm?.value;

    this.contractList?.forEach((item: any) => {
      if (value?.contract_types_id === item?.id) {
        this.contractName = item?.contract_type

      }
    })
    const dataArray: any = {
      contract_types_id: value?.contract_types_id,
      contract_types: this.contractName,

      start_working_date: moment(value?.start_working_date).format("YYYY-MM-DD"),
      end_date_probation: moment(value?.end_date_probation).format("YYYY-MM-DD"),
    }
    if (this.docIndex != null) {
      this.contract_detail[this.docIndex] = dataArray;
      this.toastr.success('Contract updated successfully!');
    }
    else {
      if (this.isContractTypeAdded()) {
        this.toastr.success('Contract type already exists.');
        return;
      }
      this.contract_detail.push(dataArray);
      this.toastr.success('Contract added successfully!');
    }

    this.contractForm.get('contract_types_id')?.reset();
    this.contractForm.get('start_working_date')?.reset();
    this.contractForm.get('end_date_probation')?.reset();
    this.docIndex = null;
  }

  editRecord(index: any, data: any) {

    this.docIndex = index;
    this.contractForm.patchValue({
      contract_types_id: data?.contract_types_id,
      start_working_date: data?.start_working_date,
      end_date_probation: data?.end_date_probation
    })
  }

  deleteRecord(index: any) {
    this.contract_detail?.splice(index, 1)
  }
  onSubmitForm() {

    let val: any = this.contractForm.value;
    let req = {
      ...val,
      tab_type: "Contract",
      contract_data: this.contract_detail
    }

    if (this.id.employee_id) {
      req.employee_id = this.id.employee_id;
    }

    this._empoloyeeService.basicSignUp(req).subscribe(
      (res: any) => {
        this.toastr.success('Employee Details Updated Successfully..');
        this.route.navigate(["master/hrms/employee-master/employ"]);
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

  isContractTypeAdded(): boolean {
    const selectedTypeId = this.contractForm.get('contract_types_id')?.value;
    return this.contract_detail.some(
      (doc: any, index: number) =>
        doc.contract_types_id === selectedTypeId && index !== this.docIndex
    );
  }

  prevTab = () => {
    console.log("this function called")
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/document-details'],
      { queryParams: { employee_id: this.id.employee_id } }
    );
  }

  // contract list get start
  contractList: any = [];
  getContractList() {
    this._empoloyeeService.get_Active_ContractTypes().subscribe(
      (res) => {
        this.contractList = res.data || [];
      },
      (err) => {

      }
    );
  }
}
