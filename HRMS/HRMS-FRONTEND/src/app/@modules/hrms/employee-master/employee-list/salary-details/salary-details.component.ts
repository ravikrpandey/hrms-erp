import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Location } from '@angular/common';
import { HeadService } from 'src/app/@shared/services/head.service';
import Swal from 'sweetalert2';
import { ShortlistedCandidateService } from 'src/app/@shared/services/service/recruitment/shortlisted-candidate.service';
import { CommonService } from 'src/app/@shared/services/common.service';


@Component({
  selector: 'app-salary-details',
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.scss']
})
export class SalaryDetailsComponent implements OnInit {
  salaryForm: FormGroup;
  id: any;
  salaryData: any;
  salaryGetData: any;
  // employee_id: any = 2
  empId: any;
  years: string[] = [];
  percentIncrement: number = 0;
  salaryId: any;
  employee_id: any;
  index: any;
  action_type: any;
  months: any = [];
  getAllDesignation: any;
  get_all_grade: any;
  loginUser: any;
  entity_Id: any;
  entity_id: any;

  earningCompList: any = [];
  deductionCompList: any;
  riembursementCompList: any
  totalMonthlyCTC: any = 0;
  totalAnnualCTC: any = 0;
  basicComp: boolean = true;
  earningCompListReference: any;
  deductionCompListReference: any;
  riembursementCompListReference: any;
  negativeAlert: boolean = false;
  negativeMonthly: any = 0;
  negativeAnualy: any = 0;

  constructor(
    private fb: FormBuilder,
    private _empoloyeeService: EmpRegistrationService,
    private _shortListedCandidate: ShortlistedCandidateService,
    private head: HeadService,
    private route: Router,
    private toastr: ToastrService,
    private _activeRoute: ActivatedRoute,
    private locatin: Location,
    public common: CommonService,
  ) {
    this.salaryForm = this.fb.group({
      basic_salary: new FormControl(null, [Validators.required]),
      salary_per_day: new FormControl(null, [Validators.required]),
      salary_per_hr: new FormControl(null, [Validators.required]),
      total_monthly_hr: new FormControl(null, [Validators.required]),
      weekly_hour: new FormControl(null, [Validators.required]),

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
          salary_Year: new FormControl([''], null),
          salary_month: new FormControl(null),
          new_salary: new FormControl(null),
          old_salary: new FormControl(null),
          from_designation_id: new FormControl(null),
          to_designation_id: new FormControl(null),
          from_grade_id: new FormControl(null),
          to_grade_id: new FormControl(null),
          percent_increment: new FormControl(null),
          remarks: new FormControl(null),
        }),
      ]),

      annualCTC: [0, Validators.required],
      monthlyCTC: new FormControl(),
      earningComponentList: this.fb.array([]),
      deductionComponentList: this.fb.array([]),
      reiembursementComponentList: this.fb.array([]),

    })
    // ,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.maxLength(10)]

    this.salaryForm.get('annualCTC')?.valueChanges.subscribe((value) => {
      this.updateCalculations(value);
    });
  }
  ngOnInit(): void {
    this.localStorage()
    this.getAllDesignation_dropDown()
    this.get_all_active_grade();
    this.getAllEarningComponentList();
    this.getAllRiembursementComponentList();
    this.getAllDeductionComponentList();

    this._activeRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.months = [{ name: 'January', id: 1 }, { name: 'February', id: 2 }, { name: 'March', id: 3 }, { name: 'April', id: 4 }, { name: 'May', id: 5 }, { name: 'June', id: 6 }, { name: 'July', id: 7 }, { name: 'August', id: 8 }, { name: 'September', id: 9 }, { name: 'October', id: 10 }, { name: 'November', id: 11 }, { name: 'December', id: 12 }]
      this.salaryId = this.id.employee_id;
      this.employee_id = this.id.employee_id;
      this.action_type = this.id.action_type;
      if (params.employee_id) {
        this.salaryGetBy(params.employee_id)
      }
    })
    this._empoloyeeService.setEmpTitle('SALARY DETAILS');
    this.getActive_Allowance();
    this.generateYears();
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
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
      console.log(this.salaryGetData, 'this.salaryGetData<<<<< get by user');

      this.salaryPatch(this.salaryGetData);


      if (this.salaryGetData?.gradeSalaryData?.length) {
        this.salaryForm?.patchValue({ annualCTC: this.salaryGetData?.gradeSalaryData[0]?.ctc, monthlyCTC: this.salaryGetData?.gradeSalaryData[0]?.ctc / 12 })
        let data = {
          earningComponentList: this.salaryGetData?.gradeSalaryData[0]?.earningComponentList,
          deductionComponentList: this.salaryGetData?.gradeSalaryData[0]?.deductionComponentList,
          reiembursementComponentList: this.salaryGetData?.gradeSalaryData[0]?.reiembursementComponentList,
        }
        this.setEarningComponentList(data);
      }
      else {
        this.getSalaryTemplateByGradeId();
      }
    })
  }

  allowanceList: any = [];
  getActive_Allowance() {
    let entity_id = localStorage.getItem("selectedEntityId");
    let financial_id = localStorage.getItem("financial_id");
    let req = {
      entity_id: entity_id,
      fy_id: financial_id,
    }

    this._shortListedCandidate.getActive_Allowancenw(req).subscribe((res: any) => {
      if (res) {
        this.allowanceList = res?.data;
      }
    })
  }

  prevTab = () => {
    this.route.navigate(
      ['master/hrms/employee-master/employee-list/employee-create/personal-details'],
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
    //         allowance_name: item?.allowance_name,
    //         allowance_amount: item?.allowance_amount,
    //       });
    //     }
    //     else {
    //       this.allowanaceFormArray.push(
    //         this.fb.group({
    //           allowance_name: item?.allowance_name,
    //           allowance_amount: item?.allowance_amount,
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
            from_designation_id: item.from_designation_id,
            to_designation_id: item.to_designation_id,
            from_grade_id: item.from_grade_id,
            to_grade_id: item.to_grade_id,
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
              from_designation_id: item.from_designation_id,
              to_designation_id: item.to_designation_id,
              from_grade_id: item.from_grade_id,
              to_grade_id: item.to_grade_id,
              percent_increment: item.percent_increment,
              remarks: item.remarks
            })
          );
        }
      })
    }


    console.log(this.salaryForm);
  }
  // patchData(allowanace_details: any): any {
  //   throw new Error('Method not implemented.');
  // }

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

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 20; i++) {
      this.years.push((currentYear - i).toString());  // Convert each year to a string
    }
  }

  calculatePercentIncrement(index: number): void {
    const history_salary = this.CF_1.history_salary;
    const row = history_salary.at(index) as FormGroup;

    const newSalary = row.controls['new_salary'].value;
    const oldSalary = row.controls['old_salary'].value;

    if (newSalary && oldSalary && oldSalary !== 0) {
      const increment = ((newSalary - oldSalary) / oldSalary) * 100;
      row.patchValue({ 'percent_increment': increment.toFixed(2) });
    } else {
      row.patchValue({ 'percent_increment': null });
    }
  }




  onSubmitForm() {
    let val = this.salaryForm.value;
    console.log(val,'valll');
    const totalDeductSalary = val?.deductionComponentList?.reduce((total:any, item:any) => {
      return total + parseFloat(item?.fixedAllowanceMonthly || item?.monthlyBasic || '0');
  }, 0);
  
  console.log("Total totalDeductSalary salary_amt: ", totalDeductSalary.toFixed(2)); 
  const totalDeduct=totalDeductSalary.toFixed(2);
    if (this.salaryForm.invalid) {
      // Display error message using toastr or any other method
      this.toastr.error("Required fields should not be empty");
      // Return or perform further actions if needed
      return;
    }
    let financial_id = localStorage.getItem("financial_id");
    let empMainId = localStorage.getItem("EmpMainId");
    let gradeSalaryData = this.salaryGetData?.gradeSalaryData[0];

    let req = {
      ...val,
      monthly_ctc:val?.monthlyCTC,
      deduction_amt:Number(totalDeduct),
      tab_type: "Salary",
      totalMonthlyCTC: this.totalMonthlyCTC,
      totalAnnualCTC: this.totalAnnualCTC,

      financial_year_id: financial_id,
      entity_id: this.entity_Id,

      company: this.gradIdDetail?.entity_name,
      branch: this.gradIdDetail?.branch_name,
      grade: this.gradIdDetail?.grade_name,
      description: this.gradIdDetail?.description,
      created_by: empMainId,
      template_name: this.gradIdDetail?.template_name,
    }
    if (this.employee_id) {
      req.employee_id = this.employee_id;
    }

    if (gradeSalaryData) {
      req.grade_template_id = gradeSalaryData?.id;
      req.grade_pay = false;
    }
    else {
      req.grade_pay = true;
    }
    req?.earningComponentList?.map((item: any) => {
      if (item?.calculation_type == "Flat Amount") item.componenet_type = 'flat'
      else item.componenet_type = 'percentage'
    })
    req?.deductionComponentList?.map((item: any) => {
      if (item?.calculation_type == "Flat Amount") item.componenet_type = 'flat'
      else item.componenet_type = 'percentage'
    })
    req?.reiembursementComponentList?.map((item: any) => {
      if (item?.calculation_type == "Flat Amount") item.componenet_type = 'flat'
      else item.componenet_type = 'percentage'
    })
    this._empoloyeeService.basicSignUp(req).subscribe((res: any) => {
      if (res) {
        this.salaryData = res;
        this.route.navigate(['master/hrms/employee-master/employee-list/employee-create/payment-details'], { queryParams: { employee_id: this.salaryId } });
        this.toastr.success("Salary Details Submitted successfully..")
      }
    }, (err => {
      this.toastr.error("Someting went wron please try again", "Error Message");
    }))
  }

  Skip() {
    this.route.navigate(['master/hrms/employee-master/employee-list/employee-create/payment-details'], { queryParams: { employee_id: this.salaryId } });
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
  // isOptionSelected(option: string): boolean {
  //   const allowanace_details = this.salaryForm.get('allowanace_details') as FormArray;
  //   return allowanace_details.controls.some(control => control.value.allowance_name === option);
  // }

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
        this.toastr.error('Please add Allowance Details first');
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
            from_designation_id: new FormControl(null),
            to_designation_id: new FormControl(null),
            from_grade_id: new FormControl(null),
            to_grade_id: new FormControl(null),
            percent_increment: new FormControl(null),
            remarks: new FormControl(null),
          })
        )
        // ... Add new row logic here
      } else {
        // Show error because some existing rows have empty document files
        this.toastr.error('Please History of Salary Revision details first');
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

  // table end

  // handleSalary(historyIndex: any) {

  //   let currentList = this.salaryForm?.controls?.['history_salary']?.value;
  //   let currentObj = this.salaryForm?.controls?.['history_salary']?.value[historyIndex];
  //   if (currentObj?.new_salary && currentObj?.old_salary) {
  //     currentObj.percent_increment = (currentObj?.new_salary * currentObj?.old_salary / 100) / 100;
  //   }
  //   currentList[historyIndex] = currentObj
  //   this.salaryForm?.patchValue({ history_salary: currentList })
  // }

  getAllDesignation_dropDown() {
    this._empoloyeeService.getAllDesignation_dropDown().subscribe(
      (res) => {
        this.getAllDesignation = res.data.filter((res: any) => res.status === "ACTIVE");

      }
    );
  };

  get_all_active_grade() {
    this._empoloyeeService.get_all_active_grade(this.entity_Id).subscribe(
      (res) => {
        this.get_all_grade = res.data;

      }
    );
  }


  onMonthlyAmountKeyup(index: number) {
    debugger
    const reimbursementArray = this.salaryForm.get('reiembursementComponentList') as FormArray;
    console.log(reimbursementArray,'reimbursementArray<<<<<');
    
    const reimbursementGroup = reimbursementArray.at(index) as FormGroup;

    const fixedAmountLimit = reimbursementGroup.get('fixedAmountLimit')?.value;
    let monthlyAmount = reimbursementGroup.get('fixedAllowanceMonthly')?.value;

    console.log(fixedAmountLimit,'fixedAmountLimit<<<<<<<<');
    console.log(monthlyAmount,'monthlyAmount<<<<<<<<');

    
    // Ensure the monthly amount does not exceed the fixed amount limit
    if (monthlyAmount > fixedAmountLimit) {
      monthlyAmount = fixedAmountLimit;
      reimbursementGroup.get('fixedAllowanceMonthly')?.setValue(fixedAmountLimit);
      this.toastr.warning('Amount Limit is fixed.');
    }
    else {
      this.totalCountCreate()
    }

    // Update the annual amount based on the monthly amount
    const annualAmount = monthlyAmount * 12;
    reimbursementGroup.get('fixedAllowanceAnnual')?.setValue(annualAmount.toFixed(2));

    this.updateFixedAllowancee()
  }


  updateFixedEarningAmount(index: number) {
    const earningArray = this.salaryForm.get('earningComponentList') as FormArray;
    const earningGroup = earningArray.at(index) as FormGroup;

    // Get the current monthly and annual values
    let monthlyAmount = earningGroup.get('fixedAllowanceMonthly')?.value || 0;
    let annualAmount = monthlyAmount * 12;
console.log(monthlyAmount,'monthlyAmount');

    // Update the monthly and annual values for the specific index
    earningGroup.get('fixedAllowanceAnnual')?.setValue(annualAmount);
    earningGroup.get('fixedAllowanceMonthly')?.setValue(monthlyAmount);

    this.updateFixedAllowancee();
  }


  updateFixedAllowancee() {

    const annualCTC = this.salaryForm.get('annualCTC')?.value;

    // Step 1: Calculate total reimbursement amount
    const reimbursementArray = this.salaryForm.get('reiembursementComponentList') as FormArray;
    let totalReimbursementAmount = 0;
    reimbursementArray.controls.forEach((reimbursement) => {
      const reimbursementAnnual = reimbursement.get('fixedAllowanceAnnual')?.value || 0;
      totalReimbursementAmount += parseFloat(reimbursementAnnual);
    });

    // Step 2: Calculate total earnings excluding Fixed Allowance
    const earningArray = this.salaryForm.get('earningComponentList') as FormArray;
    let totalEarningsExcludingFixedAllowance = 0;

    // First loop: calculate total earnings (excluding Fixed Allowance)
    earningArray.controls.forEach((control) => {
      const earningTypeCode = control.get('earningTypeCode')?.value;

      // Include HRA and all other earnings except Fixed Allowance
      if (earningTypeCode !== 'FIXE33') {
        let annualValue: any = 0
        if (control.get('annualBasic')?.value) {
          annualValue = control.get('annualBasic')?.value || 0;
        } else {
          annualValue = control.get('fixedAllowanceAnnual')?.value || 0;
        }
        totalEarningsExcludingFixedAllowance += parseFloat(annualValue);
      }
    });

    // Step 2: Calculate total deduction 
    const deductionArray = this.salaryForm.get('deductionComponentList') as FormArray;
    let totalDeductionAmount = 0;
    deductionArray.controls.forEach((control) => {

      let annualValue: any = 0
      if (control.get('annualBasic')?.value) {
        annualValue = control.get('annualBasic')?.value || 0;
      } else {
        annualValue = control.get('fixedAllowanceAnnual')?.value || 0;
      }
      totalDeductionAmount += parseFloat(annualValue);

    });

    // Step 3: Calculate remaining CTC for Fixed Allowance
    let totalUsedAmount = totalEarningsExcludingFixedAllowance + totalReimbursementAmount + totalDeductionAmount;
    let remainingCTCForFixedAllowance = annualCTC - totalUsedAmount;

    // Step 4: Update Fixed Allowance
    earningArray.controls.forEach((control) => {
      const earningTypeCode = control.get('earningTypeCode')?.value;

      if (earningTypeCode === 'FIXE33') {
        let monthlyAmount = remainingCTCForFixedAllowance / 12;
        let annualAmount = monthlyAmount * 12;

        // Update the Fixed Allowance amounts
        control.get('fixedAllowanceAnnual')?.setValue(annualAmount.toFixed(2));
        control.get('fixedAllowanceMonthly')?.setValue(monthlyAmount.toFixed(2));
        if (monthlyAmount < 0) {
          this.negativeAlert = true;
          this.negativeMonthly = monthlyAmount.toFixed(2);
          this.negativeAnualy = annualAmount.toFixed(2);
        } else {
          this.negativeAlert = false;
        }
      }
    });
    // this.totalCountCreate()
  }





  onMonthlyDeductionAmountKeyup(index: number) {
    const deductionArray = this.salaryForm.get('deductionComponentList') as FormArray;
    const deductionGroup = deductionArray.at(index) as FormGroup;

    const fixedAmountLimit = deductionGroup.get('fixedAmountLimit')?.value;
    let monthlyAmount = deductionGroup.get('fixedAllowanceMonthly')?.value;

    // Ensure the monthly amount does not exceed the fixed amount limit
    if (monthlyAmount > fixedAmountLimit) {
      monthlyAmount = fixedAmountLimit;
      deductionGroup.get('fixedAllowanceMonthly')?.setValue(fixedAmountLimit);
      this.toastr.warning('Amount Limit is fixed.')
    }

    // Update the annual amount based on the monthly amount
    const annualAmount = monthlyAmount * 12;
    deductionGroup.get('fixedAllowanceAnnual')?.setValue(annualAmount.toFixed(2));
    this.calculateTotalCTC();
    this.updateFixedAllowancee()
  }

  totalCountCreate() {

    const earningComponentList = this.salaryForm.get('earningComponentList') as FormArray;
    const deductionArray = this.salaryForm.get('deductionComponentList') as FormArray;
    const reiembursementComponentList = this.salaryForm.get('reiembursementComponentList') as FormArray;
    let obj = {
      earningComponentList: earningComponentList?.value,
      deductionArray: deductionArray?.value,
      reiembursementComponentList: reiembursementComponentList?.value,
    }
    this.setEarningComponentList(obj)
  }

  createEarningComponent(name: string, type: 'value-based' | 'fixed', data?: any): FormGroup {

    if (type === 'value-based') {
      return this.fb.group({
        componentName: [name, Validators.required],
        calculationType: [data?.earning_type],
        basicPercentage: [{ value: data?.calculation_percentage, disabled: true }, Validators.required],
        monthlyBasic: [{ value: 0, disabled: true }],
        earningTypeCode: [data?.earning_type_code],
        annualBasic: [{ value: 0, disabled: true }],
        calculationTypeCode: [data.calculation_type_code]
      });
    } else if (type === 'fixed') {
      return this.fb.group({
        componentName: [name, Validators.required],
        fixedAllowanceMonthly: [0, Validators.required],
        earningTypeCode: [data?.earning_type_code],
        fixedAllowanceAnnual: [{ value: 0, disabled: true }]
      });
    }
    throw new Error('Invalid component type specified');
  }


  createDeductionComponent(name: string, type: 'value-based' | 'fixed', data?: any): FormGroup {
    if (type === 'value-based') {
      let calculationType = name === 'EPF' ? 'PF Wages' : name === 'ESI' ? 'ESI Wages' : data?.deduction_type;
      let calculation_type_code = name === 'EPF' ? 'EPF' : name === 'ESI' ? 'ESI' : data?.calculation_type_code;
      let basicPercent
      if (data?.employer_contribution != undefined || data?.employer_contribution != null) {
        basicPercent = parseFloat(data?.employer_contribution)
      } else if (data?.calculation_percentage != undefined || data?.calculation_percentage != null) {
        basicPercent = parseFloat(data?.calculation_percentage)
      }
      const isOverrideAtEmployeeLevel = data?.override_at_employee_level == 1 ? false : data?.override_at_employee_level == 0 ? true : true;
      return this.fb.group({
        componentName: [name, Validators.required],
        calculationType: [calculationType],
        basicPercentage: [{ value: basicPercent || 0, disabled: isOverrideAtEmployeeLevel }, Validators.required],
        monthlyBasic: [{ value: 0, disabled: true }],
        annualBasic: [{ value: 0, disabled: true }],
        calculationTypeCode: [calculation_type_code]
      });
    } else if (type === 'fixed') {
      return this.fb.group({
        componentName: [name, Validators.required],
        fixedAllowanceMonthly: [0, Validators.required],
        fixedAllowanceAnnual: [{ value: 0, disabled: true }],
        fixedAmountLimit: [data?.calculation_amount || 0]
      });
    }
    // return this.fb.group({
    //   componentName: [name, Validators.required],
    //   fixedAllowanceMonthly: [0, Validators.required],
    //   fixedAllowanceAnnual: [{ value: 0, disabled: true }]
    // });
    throw new Error('Invalid component type specified');

  }



  get earningComponentList(): FormArray {
    return this.salaryForm.get('earningComponentList') as FormArray;
  }

  get deductionComponentList(): FormArray {
    return this.salaryForm.get('deductionComponentList') as FormArray;
  }

  get reiembursementComponentList(): FormArray {
    return this.salaryForm.get('reiembursementComponentList') as FormArray;
  }

  addEarningComponent(name: string, type: 'value-based' | 'fixed') {
    const earningComponent = this.createEarningComponent(name, type);
    this.earningComponentList.push(earningComponent);
  }

  removeEarningComponent(index: number) {

    const earningTypeCode = this.earningComponentList.at(index).get('earningTypeCode')?.value;
    if (earningTypeCode !== 'BASIC1') {
      this.earningComponentList.removeAt(index);
      const restoredComponent = this.earningCompListReference.find((item: any) => item.earning_type_code === earningTypeCode);
      if (restoredComponent) {
        this.earningCompList.push(restoredComponent);
      }
      this.updateFixedAllowancee();
    } else {
      console.error('Cannot remove Basic or Fixed Allowance components');
    }
    this.totalCountCreate()

  }




  addEarningComp(data: any) {
    console.log(data, "klklkl");
    let selecteddata = data;

    let type: any = (data.calculation_type === "Flat Amount" || data.calculation_type === "Not Applicable") ? 'fixed' : 'value-based';
    this.earningCompList = this.earningCompList.filter((item: any) => item !== selecteddata);
    this.earningComponentList.push(this.createEarningComponent(selecteddata.earning_name, type, selecteddata));
    this.updateEarnings();
    // this.totalCountCreate();
  }





  createReiembursementComponent(name: string, data?: any): FormGroup {
    return this.fb.group({
      componentName: [name, Validators.required],
      fixedAllowanceMonthly: [0, Validators.required],
      fixedAllowanceAnnual: [{ value: 0, disabled: true }],
      fixedAmountLimit: [data?.max_limit || 0]
    });
  }




  getAllEarningComponentList() {

    const entityType: any = localStorage.getItem("selectedEntityId");
    const financialYear: any = localStorage.getItem("financial_id");
    this._empoloyeeService.getAllEarningCompList(entityType, financialYear).subscribe((res: any) => {
      if (res && res.data) {




        this.earningCompList = res.data
        this.earningCompListReference = [...this.earningCompList];

        this.earningCompList.forEach((erData: any) => {
          if (erData.earning_type_code == 'BASIC1' || erData.earning_type_code == 'FIXE33') {
            // this.addEarningComp(erData);
          }
        })

      }
    }, err => {
      this.toastr.error(err.error.message);
    })

  }

  getAllDeductionComponentList() {
    const entityType: any = localStorage.getItem("selectedEntityId");
    const financialYear: any = localStorage.getItem("financial_id");
    this._empoloyeeService.getAllDeductionCompList(entityType, financialYear).subscribe((res: any) => {
      if (res && res.data) {
        this.deductionCompList = res.data;
        this.deductionCompListReference = [...this.deductionCompList];
      }
    }, err => {
      this.toastr.error(err.error.message);
    })
  }

  getAllRiembursementComponentList() {
    const entityType: any = localStorage.getItem("selectedEntityId");
    const financialYear: any = localStorage.getItem("financial_id");
    this._empoloyeeService.getAllRiembursementCompList(entityType, financialYear).subscribe((res: any) => {
      if (res && res.data) {
        this.riembursementCompList = res.data;
        this.riembursementCompListReference = [...this.riembursementCompList]
      }
    }, err => {
      this.toastr.error(err.error.message);
    })
  }



  addDeductionComp(data: any) {
    console.log(data, "klklkl");
    let selecteddata = data;
    let type: any = (data.calculation_type === "Flat Amount") ? 'fixed' : 'value-based';
    this.deductionCompList = this.deductionCompList.filter((item: any) => item !== selecteddata);
    this.deductionComponentList.push(this.createDeductionComponent(selecteddata.deduction_plan, type, data));
    this.updateDeduction();
  }


  removeDeductionComponent(index: number) {
    const componentName = this.deductionComponentList.at(index).get('componentName')?.value;
    this.deductionComponentList.removeAt(index);
    const restoredComponent = this.deductionCompListReference.find((item: any) => item.deduction_plan === componentName);
    if (restoredComponent) {
      this.deductionCompList.push(restoredComponent);
    }
    this.updateFixedAllowancee();
    this.calculateTotalCTC();
  }

  addRiembursementComp(data: any) {
    console.log(data, "klklkl");
    let selecteddata = data;
    this.riembursementCompList = this.riembursementCompList.filter((item: any) => item !== selecteddata);
    this.reiembursementComponentList.push(this.createReiembursementComponent(selecteddata.reimbursement_type, selecteddata));
  }

  removeRiembursementComponent(index: number) {
    const componentName = this.reiembursementComponentList.at(index).get('componentName')?.value;
    this.reiembursementComponentList.removeAt(index);
    const restoredComponent = this.riembursementCompListReference.find((item: any) => item.reimbursement_type === componentName);
    if (restoredComponent) {
      this.riembursementCompList.push(restoredComponent);
    }
    this.updateFixedAllowancee();
    this.totalCountCreate()
  };

  // formSubmit() {
  //   console.log(this.salaryForm.getRawValue(), 'klklklklkl');
  //   let data = this.salaryForm.getRawValue();
  //   let payload = { 
  //     ...data,
  //     created_by:this.singInUser.employee_id,
  //     totalMonthlyCTC: this.totalMonthlyCTC,
  //     totalAnnualCTC: this.totalAnnualCTC
  //   } 

  //   this._empoloyeeService.saveSalaryTemplate(payload).subscribe((res:any) => { 
  //     if(res && res.data){
  //       console.log(res.data);
  //       this.toastr.success('Salary Template Created successfully.');
  //       this.route.navigateByUrl('master/payroll/salary-templates')
  //     }
  //   }, err=>{
  //     this.toastr.error(err.error.message);
  //   })

  // }



  // Method to update all components based on the Annual CTC
  updateCalculations(annualCTC: number) {
    this.updateEarnings();
    this.calculateTotalCTC();
    this.updateDeduction();
  }

  // Method to handle earnings
  updateEarnings() {
    let annualCTC = this.salaryForm.get('annualCTC')?.value
    const earningArray = this.salaryForm.get('earningComponentList') as FormArray;
    earningArray.controls.forEach((earning: any) => {
      const calculationTypeCode = earning.get('calculationTypeCode')?.value; // Could be '% of CTC', '% of Basic Salary', or Fixed
      const percentage = earning.get('basicPercentage')?.value;
      const basicSalary = this.getAnnualBasic();

      let annualAmount = 0;
      let monthlyAmount = 0;

      if (calculationTypeCode === 'CTC') {
        annualAmount = (annualCTC * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      } else if (calculationTypeCode === 'BASIC1') {
        annualAmount = (basicSalary * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      }

      earning.get('annualBasic')?.setValue(annualAmount.toFixed(2));
      earning.get('monthlyBasic')?.setValue(monthlyAmount.toFixed(2));
    });
    this.updateFixedAllowancee();
  }

  updateDeduction() {
    let annualCTC = this.salaryForm.get('annualCTC')?.value
    const deductionArray = this.salaryForm.get('deductionComponentList') as FormArray;
    let grossMonthlySalary = annualCTC / 12;
    deductionArray.controls.forEach((deduction: any) => {
      const calculationType = deduction.get('calculationType')?.value; // Could be '% of CTC', '% of Basic Salary', or Fixed
      const percentage = deduction.get('basicPercentage')?.value;
      const calculationTypeCode = deduction.get('calculationTypeCode')?.value;
      const basicSalary = this.getAnnualBasic();
      let annualAmount = 0;
      let monthlyAmount = 0;

      if (calculationTypeCode === 'CTC') {
        annualAmount = (annualCTC * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      } else if (calculationTypeCode === 'EPF' || calculationTypeCode === 'ESI' || calculationTypeCode === 'BASIC1') {
        annualAmount = (basicSalary * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      }

      if (deduction.get('componentName')?.value === 'ESI' && grossMonthlySalary > 21000) {
        annualAmount = 0; // Set annual amount to 0 if ESI and gross monthly salary exceeds ₹21,000
        monthlyAmount = 0; // Set monthly amount to 0 if ESI and gross monthly salary exceeds ₹21,000
      }


      deduction.get('annualBasic')?.setValue(annualAmount.toFixed(2));
      deduction.get('monthlyBasic')?.setValue(monthlyAmount.toFixed(2));
    });
    this.updateFixedAllowancee();
  }



  // Get Basic Salary from dynamic earnings list
  getAnnualBasic(): number {
    const earningArray = this.salaryForm.get('earningComponentList') as FormArray;

    // Find Basic Salary component if it exists
    const basicSalaryComponent = earningArray.controls.find((control) =>
      control.get('earningTypeCode')?.value === 'BASIC1'
    );

    return basicSalaryComponent ? basicSalaryComponent.get('annualBasic')?.value : 0;
  }

  updateEarningsPercent(earning:any) {
    let annualCTC = this.salaryForm.get('annualCTC')?.value
    const earningArray = this.salaryForm.get('earningComponentList') as FormArray;
    let grossMonthlySalary = annualCTC / 12;
    earningArray.controls.forEach((earning: any) => {
      const calculationType = earning.get('calculationType')?.value; // Could be '% of CTC', '% of Basic Salary', or Fixed
      const percentage = earning.get('basicPercentage')?.value;
      const calculationTypeCode = earning.get('calculationTypeCode')?.value;
      const basicSalary = this.getAnnualBasic();
      let tempList = this.earningComponentList.value.find((elem:any) => elem.componentName == earning.value.calculationType)
      if ( !tempList ) {
        tempList = this.deductionComponentList.value.find((elem:any) => elem.componentName == earning.value.calculationType)
      }
      if ( !tempList ) {
        tempList = this.reiembursementComponentList.value.find((elem:any) => elem.componentName == earning.value.calculationType)
      }

      let annualAmount = 0;
      let monthlyAmount = 0;

      if ( tempList ){
        annualAmount = (tempList.annualBasic * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      }
      else{
        annualAmount = (annualCTC * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      }

      // if (calculationTypeCode === 'CTC') {
      //   annualAmount = (annualCTC * percentage) / 100;
      //   monthlyAmount = annualAmount / 12;
      // } else if (calculationTypeCode === 'EPF' || calculationTypeCode === 'ESI' || calculationTypeCode === 'BASIC1') {
      //   annualAmount = (basicSalary * percentage) / 100;
      //   monthlyAmount = annualAmount / 12;
      // }

      // if (deduction.get('componentName')?.value === 'ESI' && grossMonthlySalary > 21000) {
      //   annualAmount = 0; // Set annual amount to 0 if ESI and gross monthly salary exceeds ₹21,000
      //   monthlyAmount = 0; // Set monthly amount to 0 if ESI and gross monthly salary exceeds ₹21,000
      // }


      earning.get('annualBasic')?.setValue(annualAmount.toFixed(2));
      earning.get('monthlyBasic')?.setValue(monthlyAmount.toFixed(2));
    });
    this.updateFixedAllowancee();
    this.calculateTotalCTC()
  }

  calculateTotalCTC() {
    // Get raw values from form arrays to ensure all values are included, even if inputs are disabled
    const earningArray = this.salaryForm.get('earningComponentList') as FormArray;
    console.log(earningArray,'earningArray<<<<<<<');
    
    const deductionArray = this.salaryForm.get('deductionComponentList') as FormArray;
    const reimbursementArray = this.salaryForm.get('reiembursementComponentList') as FormArray;

    let totalMonthlyCTC = 0;
    let totalAnnualCTC = 0;

    // Add all earnings (both 'value-based' and 'fixed')
    earningArray.getRawValue().forEach((earning: any) => {
      if (earning.monthlyBasic) {
        // This is a 'value-based' earning
        totalMonthlyCTC += parseFloat(earning.monthlyBasic || '0');
        totalAnnualCTC += parseFloat(earning.annualBasic || '0');
      } else if (earning.fixedAllowanceMonthly) {
        // This is a 'fixed' earning
        totalMonthlyCTC += parseFloat(earning.fixedAllowanceMonthly || '0');
        totalAnnualCTC += parseFloat(earning.fixedAllowanceAnnual || '0');
      }
    });

    // Subtract deductions
    deductionArray.getRawValue().forEach((deduction: any) => {
      if (deduction.monthlyBasic) {
        // This is a 'value-based' earning
        totalMonthlyCTC -= parseFloat(deduction.monthlyBasic || '0');
        totalAnnualCTC -= parseFloat(deduction.annualBasic || '0');
      } else if (deduction.fixedAllowanceMonthly) {
        // This is a 'fixed' earning
        totalMonthlyCTC -= parseFloat(deduction.fixedAllowanceMonthly || '0');
        totalAnnualCTC -= parseFloat(deduction.fixedAllowanceAnnual || '0');
      }
    });

    // Add reimbursements
    reimbursementArray.getRawValue().forEach((reimbursement: any) => {
      totalMonthlyCTC += parseFloat(reimbursement.fixedAllowanceMonthly || '0');
      totalAnnualCTC += parseFloat(reimbursement.fixedAllowanceAnnual || '0');
    });

    // Update form controls or display total CTC wherever needed
    this.totalMonthlyCTC = totalMonthlyCTC.toFixed(2);
    this.totalAnnualCTC = totalAnnualCTC.toFixed(2);

  }

  // start
  gradIdDetail: any;
  getSalaryTemplateByGradeId() {
    let entity_id: any = localStorage.getItem("selectedEntityId");
    let financial_id: any = localStorage.getItem("financial_id");

    let req = {
      id: this.salaryGetData?.grade_id,
      entityType: entity_id,
      financialYear: financial_id,
    }

    this._empoloyeeService.salaryTemplateByGradeId(req).subscribe(
      (res) => {
        let data = res.data;
        console.log(res.data.earningComponentList, 'res.data<<<<<<<<<< slaery res');
        console.log(this.earningCompList, 'res.data<<<<<<<<<< slaery res2');
        const matchedIds = res.data.earningComponentList.map((item: any) => item.id);

        const unmatchedDataArray = this.earningCompList.filter((item: any) => !matchedIds.includes(item.id));

        this.earningCompList = unmatchedDataArray
        console.log(unmatchedDataArray, 'res.data<<<<<<<<<< slaery res3');
        this.salaryForm?.patchValue({ annualCTC: data?.ctc })
        this.gradIdDetail = data;

        this.setEarningComponentList(data)
        // this.setDeductionComponentList(data)
        // this.setReiembursementComponentList(data)
      }
    );
  }

  setEarningComponentList(data: any) {
    console.log(data, 'earning Data<<<<<<<<<<<');
    let temp = this.earningCompList;
    let temp2 = this.deductionCompList;
    let temp3 = this.riembursementCompList;

    let totalMonthlyCTC = 0;
    let totalAnnualCTC = 0;
    this.enterSalary('fromAnnualCtc')

    let totalDeductionMonthlyCTC = 0;
    let totalDeductionAnnualCTC = 0;
    if (data?.earningComponentList?.length) {
      data?.earningComponentList?.forEach((item: any, index: number) => {
        if (item?.calculation_type == 'Flat Amount') {
          if (item?.fixedAllowanceMonthly) totalMonthlyCTC = totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
          if (item?.fixedAllowanceAnnual) totalAnnualCTC = totalAnnualCTC + Number(item?.fixedAllowanceAnnual);
        }
        else {
          if (item?.monthlyBasic) totalMonthlyCTC = totalMonthlyCTC + Number(item?.monthlyBasic);
          if (item?.annualBasic) totalAnnualCTC = totalAnnualCTC + Number(item?.annualBasic);
        }
        this.earningCompList.forEach((value:any,i:any)=> {
          if ( value.earning_name == item?.componentName ) {
            temp.splice(i, 1);
          }
         } )

        const formGroup = this.earningComponentList?.at(index) as FormGroup;
        if (formGroup) {
          if (item?.calculation_type == 'Flat Amount') {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName,
              calculationType: item?.calculationType,
              calculationTypeCode: item?.calculationTypeCode,
              fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
              fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
              calculation_type: item?.calculation_type,
              id: item?.id
            });
          }
          else {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName,
              basicPercentage: item?.basicPercentage,
              annualBasic: item?.annualBasic,
              monthlyBasic: item?.monthlyBasic,
              // basicPercentage: [{ value: item?.basicPercentage || 0, disabled: true }, Validators.required],
              // annualBasic: [{ value: item?.annualBasic || 0, disabled: true }],
              // monthlyBasic: [{ value: item?.monthlyBasic || 0, disabled: true }],
              calculationType: item?.calculationType,
              calculationTypeCode: item?.calculationTypeCode,
              calculation_type: item?.calculation_type,
              id: item?.id

            });
          }

        }
        else {
          if (item?.calculation_type == 'Flat Amount') {
            this.earningComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName,
                calculationType: item?.calculationType,
                calculationTypeCode: item?.calculationTypeCode,
                fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
                fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
                calculation_type: item?.calculation_type,
                id: item?.id

              })
            );
          }
          else {
            this.earningComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName,
                basicPercentage: item?.basicPercentage,
                annualBasic: item?.annualBasic,
                monthlyBasic: item?.monthlyBasic,
                calculationType: item?.calculationType,
                calculationTypeCode: item?.calculationTypeCode,
                calculation_type: item?.calculation_type,
                id: item?.id

              })
            );
          }
        }
      })
    }

    // ****************
    if (data?.deductionComponentList?.length || data?.deductionArray?.length) {
      let deductData=data?.deductionComponentList || data?.deductionArray
      deductData?.forEach((item: any, index: number) => {
        this.deductionCompList.forEach((value:any,i:any)=> {
          if ( value.deduction_plan == item?.componentName ) {
            temp2.splice(i, 1);
          }
         } )

        if (item?.calculation_type == 'Flat Amount') {
          if (item?.fixedAllowanceMonthly) totalDeductionMonthlyCTC = totalDeductionMonthlyCTC + Number(item?.fixedAllowanceMonthly);
          if (item?.fixedAllowanceAnnual) totalDeductionAnnualCTC = totalDeductionAnnualCTC + Number(item?.fixedAllowanceAnnual);
        }
        else {
          if (item?.monthlyBasic) totalDeductionMonthlyCTC = totalDeductionMonthlyCTC + Number(item?.monthlyBasic);
          if (item?.annualBasic) totalDeductionAnnualCTC = totalDeductionAnnualCTC + Number(item?.annualBasic);
        }

        const formGroup = this.deductionComponentList?.at(index) as FormGroup;
        if (formGroup) {
          if (item?.calculation_type == 'Flat Amount') {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName,
              calculationType: item?.calculationType,
              calculationTypeCode: item?.calculationTypeCode,
              fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
              fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
              calculation_type: item?.calculation_type,
              id: item?.id

            });
          }
          else {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName,
              basicPercentage: item?.basicPercentage,
              annualBasic: item?.annualBasic,
              monthlyBasic: item?.monthlyBasic,
              calculationType: item?.calculationType,
              calculationTypeCode: item?.calculationTypeCode,
              calculation_type: item?.calculation_type,
              id: item?.id

            });
          }
        }
        else {
          if (item?.calculation_type == 'Flat Amount') {
            this.deductionComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName,
                // basicPercentage: item?.basicPercentage,
                calculationType: item?.calculationType,
                calculationTypeCode: item?.calculationTypeCode,
                fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
                fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
                calculation_type: item?.calculation_type,
                id: item?.id

              })
            );
          }
          else {
            this.deductionComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName,
                basicPercentage: item?.basicPercentage,
                annualBasic: item?.annualBasic,
                monthlyBasic: item?.monthlyBasic,
                calculationType: item?.calculationType,
                calculationTypeCode: item?.calculationTypeCode,
                calculation_type: item?.calculation_type,
                id: item?.id

              })
            );
          }
        }
      })
    }

    // ***********************
    if (data?.reiembursementComponentList?.length) {
      data?.reiembursementComponentList?.forEach((item: any, index: number) => {
        this.riembursementCompList.forEach((value:any,i:any)=> {
          if ( value.reimbursement_name == item?.componentName ) {
            temp3.splice(i, 1);
          }
         } ) 

        if (item?.fixedAllowanceMonthly) totalMonthlyCTC = totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
        if (item?.fixedAllowanceAnnual) totalAnnualCTC = totalAnnualCTC + Number(item?.fixedAllowanceAnnual);
        const formGroup = this.reiembursementComponentList?.at(index) as FormGroup;
        if (formGroup) {
          formGroup.patchValue({
            componentName: item?.componentName,
            fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
            fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
            fixedAmountLimit: item?.fixedAmountLimit,
          });
        }
        else {
          this.reiembursementComponentList.push(
            this.fb.group({
              componentName: item?.componentName,
              fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
              fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
              fixedAmountLimit: item?.fixedAmountLimit,
            })
          );
        }
      })
    }console.log(totalMonthlyCTC,'totalMonthlyCTC<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>');
    
    this.totalMonthlyCTC = totalMonthlyCTC - totalDeductionMonthlyCTC;
    console.log(this.totalMonthlyCTC,'this.totalMonthlyCTC<<<<<<<<<<<<');
    
    this.totalAnnualCTC = totalAnnualCTC - totalDeductionAnnualCTC;
    console.log(this.salaryForm)
    this.earningCompList = temp;
    this.deductionCompList = temp2;
    this.riembursementCompList = temp3;

  }

  enterSalary(actionType: any) {

    if (actionType == 'fromAnnualCtc') {
      let annualCTC = this.salaryForm?.value?.annualCTC;
      let annualCTCAll=annualCTC / 12

      let salary_per_day = annualCTCAll / 30;
      let salary_per_hr = salary_per_day / 8;
      this.salaryForm?.patchValue({
        salary_per_day: salary_per_day?.toFixed(2),
        salary_per_hr: salary_per_hr?.toFixed(2),
        basic_salary: annualCTCAll?.toFixed(2),
        monthlyCTC: annualCTC / 12
      })
    }
    else {
      let basic_salary = this.salaryForm?.value?.basic_salary;
      let salary_per_day = basic_salary / 30;
      let salary_per_hr = salary_per_day / 8;
      this.salaryForm?.patchValue({
        salary_per_day: salary_per_day?.toFixed(2),
        salary_per_hr: salary_per_hr?.toFixed(2),
        annualCTC: basic_salary,
      })
    }

  }

}
