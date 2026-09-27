import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Location } from '@angular/common';
import { HeadService } from 'src/app/@shared/services/head.service';
import Swal from 'sweetalert2';
import { OnboardingService } from 'src/app/@shared/services/service/recruitment/onboarding.service';


@Component({
  selector: 'app-salary-details',
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.scss']
})
export class SalaryDetailsComponent implements OnInit {
  salaryForm: any;
  id: any;
  salaryData: any;
  salaryGetData: any;
  // employee_id: any = 2
  empId: any;

  salaryId: any;
  employee_id: any;
  index: any;
  action_type: any;

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
    this.salaryForm = this.fb.group({
      basic_salary: new FormControl(null),
      salary_per_day: new FormControl(null),
      salary_per_hr: new FormControl(null),
      total_monthly_hr: new FormControl(null),
      weekly_hour: new FormControl(null),

      //family Details
      // allowanace_details: new FormArray([
      //   new FormGroup({
      //     allowance_name: new FormControl(null),
      //     allowance_amount: new FormControl(null),
      //   }),
      // ]),

      // PRIVIUS EMPOYER DETAILS
      history_salary: new FormArray([
        new FormGroup({
          salary_Year: new FormControl(null),
          salary_month: new FormControl(null),
          new_salary: new FormControl(null),
          old_salary: new FormControl(null),
          percent_increment: new FormControl(null),
          remarks: new FormControl(null),
        }),
      ]),

    })
    // ,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.maxLength(10)]
  }
  ngOnInit(): void {
    this._activeRoute.queryParams.subscribe((params: any) => {
      this.id = params;

      this.salaryId = this.id.employee_id;
      this.employee_id = this.id.employee_id;
      this.action_type = this.id.action_type;
      if (params.employee_id) {
        this.salaryGetBy(params.employee_id)
      }
    })
    this._empoloyeeService.setEmpTitle('SALARY DETAILS');
  }

  monthly_salary: any;
  getCandidate_detailsByID() {
    
    let candidate_id = localStorage.getItem("candidate_id");
    this.$onboarding.getCandidate_detailsByID(candidate_id).subscribe((res: any) => {
      if (res) {
        console.log(res);
        let allowanceList = res?.data[0]?.allowance_details;

        // if (allowanceList?.length) {
        //   allowanceList?.forEach((item: any, index: number) => {
        //     const formGroup = this.allowanaceFormArray?.at(index) as FormGroup;
        //     if (formGroup) {
        //       formGroup.patchValue({
        //         allowance_name: item.allowance_name,
        //         allowance_amount: item.allowance_amount
        //       });
        //     }
        //     else {
        //       this.allowanaceFormArray.push(
        //         this.fb.group({
        //           allowance_name: item.allowance_name,
        //           allowance_amount: item.allowance_amount
        //         })
        //       );
        //     }
        //   })
        // }

        this.monthly_salary = res?.data[0]?.monthly_salary;
      }
    });
  }

  get historySalaryFormArray() {
    return this.salaryForm.get('history_salary') as FormArray;
  }
  // get allowanaceFormArray() {
  //   return this.salaryForm.get('allowanace_details') as FormArray;
  // }
  get SL(): any { return this.salaryForm.controls }
  salaryGetBy(id: any) {
    this._empoloyeeService.getByUserId(id).subscribe((res: any) => {
      this.salaryGetData = res.data;
      this.salaryPatch(this.salaryGetData);
    })
  }

  prevTab = () => {
    this.route.navigate(
      ['create-employee-module/employ/employee-create/personal-details'],
      { queryParams: { employee_id: this.salaryId } }
    );
  }

  salaryPatch(salaryGetData: any) {
    this.salaryForm.patchValue({
      basic_salary: salaryGetData?.basic_salary,
      salary_per_day: salaryGetData?.salary_per_day,
      salary_per_hr: salaryGetData?.salary_per_hr,
      total_monthly_hr: salaryGetData?.total_monthly_hr,
      weekly_hour: salaryGetData?.weekly_hour,
    })

    // if (salaryGetData?.allowance_details?.length) {
    //   salaryGetData?.allowance_details?.forEach((item: any, index: number) => {
    //     const formGroup = this.allowanaceFormArray?.at(index) as FormGroup;
    //     if (formGroup) {
    //       formGroup.patchValue({
    //         allowance_name: item.allowance_name,
    //         allowance_amount: item.allowance_amount
    //       });
    //     }
    //     else {
    //       this.allowanaceFormArray.push(
    //         this.fb.group({
    //           allowance_name: item.allowance_name,
    //           allowance_amount: item.allowance_amount
    //         })
    //       );
    //     }
    //   })
    // }
    if (salaryGetData?.history_salary?.length) {
      salaryGetData?.history_salary?.forEach((item: any, index: number) => {
        const formGroup = this.historySalaryFormArray?.at(index) as FormGroup;
        if (formGroup) {
          formGroup.patchValue({
            salary_Year: item.salary_Year,
            salary_month: item.salary_month,
            new_salary: item.new_salary,
            old_salary: item.old_salary,
            percent_increment: item.percent_increment,
            remarks: item.remarks
          });
        }
        else {
          this.historySalaryFormArray.push(
            this.fb.group({
              salary_Year: item.salary_Year,
              salary_month: item.salary_month,
              new_salary: item.new_salary,
              old_salary: item.old_salary,
              percent_increment: item.percent_increment,
              remarks: item.remarks
            })
          );
        }
      })
    }
    this.getCandidate_detailsByID();
    console.log(this.salaryForm);
  }

  // patchData(e: any): FormArray {
  //   return new FormArray(
  //     e.map((x: any) => {
  //       const obj = new FormGroup({});
  //       Object.keys(x).forEach((k) => {
  //         //console.log(k, 'kkkkkkk');

  //         obj.addControl(k, new FormControl(x[k]));
  //       });
  //       return obj;
  //     })
  //   );
  // };


  calculatePercentIncrement(index: number) {
    const history_salary = this.CF_1.history_salary;
    const row = history_salary.at(index) as FormGroup;

    const newSalary = row.controls['new_salary'].value;
    const oldSalary = row.controls['old_salary'].value;

    if (newSalary && oldSalary) {
      const increment = ((newSalary - oldSalary) / oldSalary) * 100;
      row.patchValue({ 'percent_increment': increment.toFixed(2) });
    } else {
      row.patchValue({ 'percent_increment': null });
    }
  }


  onSubmitForm() {
    let val = this.salaryForm.value;
    if (this.salaryForm.invalid) {
      // Display error message using toastr or any other method
      this.toastr.error("Required fields should not be empty");
      // Return or perform further actions if needed
      return;
    }

    let req = {
      ...val,
      tab_type: "Salary",
      basic_salary: this.monthly_salary
    }
    if (this.employee_id) {
      req.employee_id = this.employee_id;
    }
    // if (this.salaryForm?.controls?.['history_salary']?.['value']?.length) {
    //   req.history_salary = this.salaryForm?.controls?.['history_salary']?.['value'];
    // }
    this.$onboarding.register_onboarded_employee(req).subscribe((res: any) => {
      if (res) {
        this.salaryData = res;
        this.route.navigate(['create-employee-module/employ/employee-create/payment-details'], { queryParams: { employee_id: this.salaryId } });
        this.toastr.success("Salary Details Submitted successfully..")
      }
    }, (err => {
      this.toastr.error("Someting went wron please try again", "Error Message");
    }))
  }

  Skip() {
    this.route.navigate(['create-employee-module/employ/employee-create/payment-details'], { queryParams: { employee_id: this.salaryId } });
  }


  // table start
  addFamilyDisable: boolean = false;
  allFamilyData: any;
  allEmployeerData: any;
  deletedFamilyData: any = [];

  get CF_1(): any {
    return this.salaryForm.controls;
  };

  // Family
  addRow() {
    const allowanace_details = this.salaryForm.get('allowanace_details') as FormArray;
    if (allowanace_details.value && allowanace_details?.value.length > 0) {
      let canAddNewRow = true;
      console.log("+++++++++", allowanace_details?.value)
      for (const obj of allowanace_details?.value) {
        if (!obj.allowance_name) {
          canAddNewRow = false;
          break;
        }
      }
      if (canAddNewRow) {
        console.log("function reacherd here")
        // Logic to add a new row

        const allowanace_details = this.salaryForm.get('allowanace_details') as FormArray;
        this.CF_1.allowanace_details.push(
          new FormGroup({
            allowance_name: new FormControl(null),
            allowance_amount: new FormControl(null),
          })
        )
        // ... Add new row logic here
      } else {
        // Show error because some existing rows have empty document files
        this.toastr.error('Please add Family Details first');
        // Display an error message for the user
      }
    } else {

    }

  }

  deleteallowanace_details(i: number, d: any) {
    if (this.CF_1.allowanace_details.length > 1) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You want be delete !",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#be0000',
        cancelButtonColor: '#5d6c7c',
        confirmButtonText: 'Delete'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.CF_1.allowanace_details.length >= 1) {
            this.CF_1.allowanace_details.removeAt(i);
          } else {
            this.toastr.error('must be one', "Can't Deleted!");
          }
        };
      })
    } else {
      this.toastr.error("Can't Deleted", 'must be one');
    }
  }

  // Employee
  addRowEmploy() {
    const history_salary = this.salaryForm.get('history_salary') as FormArray;
    if (history_salary.value && history_salary?.value.length > 0) {
      let canAddNewRow = true;
      for (const obj of history_salary?.value) {
        if (!obj.salary_Year) {
          canAddNewRow = false;
          break;
        }
      }
      if (canAddNewRow) {
        // Logic to add a new row
        const history_salary = this.salaryForm.get('history_salary') as FormArray;
        this.CF_1.history_salary.push(
          new FormGroup({
            salary_Year: new FormControl(null),
            salary_month: new FormControl(null),
            new_salary: new FormControl(null),
            old_salary: new FormControl(null),
            percent_increment: new FormControl(null),
            remarks: new FormControl(null),
          })
        )
        // ... Add new row logic here
      } else {
        // Show error because some existing rows have empty document files
        this.toastr.error('Please Previous employer details first');
        // Display an error message for the user
      }
    } else {

    }

  }

  deleteEmployerRow(i: number, d: any) {
    if (this.CF_1.history_salary.length > 1) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#be0000',
        cancelButtonColor: '#5d6c7c',
        confirmButtonText: 'Delete'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.CF_1.history_salary.length >= 1) {
            this.CF_1.history_salary.removeAt(i);
          } else {
            this.toastr.error('must be one', "Can't Deleted!");
          }
        };
      })
    } else {
      this.toastr.error("Can't Deleted", 'must be one');
    }
  }

}
