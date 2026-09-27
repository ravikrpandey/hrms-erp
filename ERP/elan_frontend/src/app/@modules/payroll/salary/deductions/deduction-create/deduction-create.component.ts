import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-deduction-create',
  templateUrl: './deduction-create.component.html',
  styleUrls: ['./deduction-create.component.scss']
})
export class DeductionCreateComponent {
  deductionForm: FormGroup
  signIn: any = localStorage.getItem('signInUser');
  singInUser = JSON.parse(this.signIn);
  deductionId: undefined;
  deductionData: any;
  compList: any = [];
  typeCheck: any;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private activeroute: ActivatedRoute,
    private toast: ToastrService,
    private payrollService: PayrollService
  ) {
    this.deductionForm = this.fb.group({
      deduction_plan: ['', Validators.required],
      name_in_payslip: ['', Validators.required],
      calculation_type: ['Flat Amount', Validators.required],
      calculation_amount: [null],
      calculation_percentage: [null],
      mark_as_active: [null],
      deduction_frequency: ['one_time_deduction', Validators.required],
      deduction_type: [null]

    });
    this.deductionForm.get('calculation_amount')?.setValidators([Validators.required]);
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.deductionId = params.deduction_id;
      this.typeCheck=params?.type;
    });
    if (this.deductionId != undefined || null) {
      this.getDeductionComponentById(this.deductionId)
    }
    this.getAllCreatedErningComp();
  }

  getAllCreatedErningComp() {
    this.payrollService.getAllCreatedErningComp().subscribe((res: any) => {
      if (res && res.data) {
        this.compList = res.data;
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }

  getDeductionComponentById(id: any) {
    this.payrollService.getDeductionComponentById(id).subscribe((res: any) => {
      if (res && res.data) {
        this.deductionData = res.data;
        this.deductionForm.patchValue(this.deductionData);
        if(this.deductionData.calculation_type.includes('Percentage of')){
          this.deductionForm.patchValue({
            calculation_type:'Percentage of'
          });
          this.deductionForm.get('calculation_amount')?.clearValidators();
          this.deductionForm.get('calculation_amount')?.setValue(null); 
          this.deductionForm.get('calculation_amount')?.updateValueAndValidity();
          this.deductionForm.get('calculation_percentage')?.setValidators([Validators.required]);
          this.deductionForm.get('calculation_percentage')?.updateValueAndValidity();
        };
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }

  onCalculationTypeChange(event: any) {
    const calculationType = event.value;

    if (calculationType === 'Flat Amount') {
      this.deductionForm.get('calculation_percentage')?.clearValidators();
      this.deductionForm.get('calculation_percentage')?.setValue(null);
      this.deductionForm.get('calculation_percentage')?.updateValueAndValidity();
      this.deductionForm.get('calculation_amount')?.setValidators([Validators.required]);
      this.deductionForm.get('calculation_amount')?.updateValueAndValidity();
    } else if (calculationType === 'Percentage of') {
      this.deductionForm.get('calculation_amount')?.clearValidators();
      this.deductionForm.get('calculation_amount')?.setValue(null);
      this.deductionForm.get('calculation_amount')?.updateValueAndValidity();

      this.deductionForm.get('calculation_percentage')?.setValidators([Validators.required]);
      this.deductionForm.get('calculation_percentage')?.updateValueAndValidity();
    }
  }

  back() {
    window.history.back();
  }

  submitForm() {
    console.log(this.deductionForm.value);
    let data = this.deductionForm.value;
    let calc = data.calculation_type == 'Percentage of' ? `${data.calculation_type} ${data.deduction_type}` : data.calculation_type;
    let calculation = this.compList.find((res: any) => res.earning_name == data.deduction_type)

    const payload = {
      ...data,
      calculation_type: calc,
      calculation_type_code: calculation?.earning_type_code,
      created_by: this.singInUser.employee_id,
    }

    if (this.deductionId != undefined || this.deductionId != null) {
      this.updateDeductionComponent(this.deductionId, payload)
    } else {
      this.createDeductionComponent(payload)
    }
  }

  createDeductionComponent(payload: any) {
    this.payrollService.createDeductionComponent(payload).subscribe((res: any) => {
      if (res && res.data) {
        console.log(res.data);
        this.toast.success('New Deduction Created successfully.');
        this.route.navigateByUrl('master/payroll/salary-components/deductions')
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }

  updateDeductionComponent(id: any, payload: any) {
    this.payrollService.updateDeductionComponent(id, payload).subscribe((res: any) => {
      if (res && res.data) {
        console.log(res.data);
        this.toast.success('Deduction Updated successfully.');
        this.route.navigateByUrl('master/payroll/salary-components/deductions')
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }

}
