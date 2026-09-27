import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-variable-earnings-create',
  templateUrl: './variable-earnings-create.component.html',
  styleUrls: ['./variable-earnings-create.component.scss']
})
export class VariableEarningsCreateComponent {
  earningForm: FormGroup;
  signIn: any = localStorage.getItem('signInUser');
  singInUser = JSON.parse(this.signIn);
  selectedEnitity = localStorage.getItem('selectedEntityId')
  earningId: any;
  earningData: any;
  compList: any = [];
  earningCompList: any = []
  typeCheck: any;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private activeroute: ActivatedRoute,
    private toast: ToastrService,
    private payrollService: PayrollService
  ) {
    this.earningForm = this.fb.group({
      variable_earning_name: ['', Validators.required],
      name_in_payslip: ['', Validators.required],
      calculation_amount: [null],
      is_taxable: [0],
      deduct_when_credited: [0],
      deduct_monthly: [0],
    });

  }

  onTaxableChange(event: any) {
    if (event.checked) {
      this.earningForm.patchValue({
        is_taxable: 1
      });
    } else {
      // reset dependent checkboxes
      this.earningForm.patchValue({
        is_taxable: 0,
        deduct_when_credited: 0,
        deduct_monthly: 0
      });
    }
  }

  onDeductChange(type: 'credited' | 'monthly', event: any) {
    if (type === 'credited' && event.checked) {
      this.earningForm.patchValue({
        deduct_when_credited: 1,
        deduct_monthly: 0
      });
    } else if (type === 'monthly' && event.checked) {
      this.earningForm.patchValue({
        deduct_when_credited: 0,
        deduct_monthly: 1
      });
    } else {
      // uncheck both if user unselects
      this.earningForm.patchValue({
        deduct_when_credited: 0,
        deduct_monthly: 0
      });
    }
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.earningId = params.earning_id;
      this.typeCheck = params?.type;
    });
    if (this.earningId != undefined || null) {
      this.getEearningById(this.earningId)
    }

    // listen for calculation_type changes
    this.earningForm.get('calculation_type')?.valueChanges.subscribe(value => {
      if (value === 'Percentage of') {
        this.earningForm.get('earning_type')?.setValidators([Validators.required]);
        this.earningForm.get('calculation_percentage')?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(99)
        ]);
      } else {
        this.earningForm.get('earning_type')?.clearValidators();
        this.earningForm.get('calculation_percentage')?.clearValidators();
      }
      this.earningForm.get('earning_type')?.updateValueAndValidity();
      this.earningForm.get('calculation_percentage')?.updateValueAndValidity();
    });
  }


  getEearningById(id: any) {
    this.payrollService.getVariableEarningComponentById(id).subscribe((res: any) => {
      if (res && res.data) {
        this.earningData = res.data;
        this.earningTypeChange({ value: this.earningData?.earning_type_code }, 'onload')
        this.earningForm.patchValue(this.earningData)
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }

  back() {
    window.history.back();
  }

  submitForm() {
    if (this.earningForm.invalid) {

      console.log("inside submit funcvtiomn");
      this.earningForm.markAllAsTouched();   // 🔹 force validation messages
      return; // 🔹 stop submission
    }
    let data = this.earningForm.value;
    if (this.earningForm.invalid) {
      return this.toast.error('Required fields should not be empty', 'Fields Error');
    }
     if (data.is_taxable == 1 && data.deduct_when_credited == 0 && data.deduct_monthly == 0) {
    this.toast.error('Please select at least one option: Deduct tax when credited or Deduct tax monthly');
    return; // stop submission
  }
    let calc = data?.calculation_type == 'Percentage of' ? `${data?.calculation_type} ${data?.earning_type}` : data?.calculation_type;
    let calculation = this.compList.find((res: any) => res.earning_name == data.earning_type)
    const payload = {
      ...data,
      calculation_type: calc,
      created_by: this.singInUser?.employee_id,
      calculation_type_code: calculation?.earning_type_code
    }
    console.log(payload);
    console.log(calc);


    if (this.earningId != undefined || this.earningId != null) {
      this.updateVariableEarningComponent(this.earningId, payload)
    } else {
      this.createVariableEarningComponent(payload)
    }
  }

  createVariableEarningComponent(payload: any) {
    this.payrollService.createVariableEarningComponent(payload).subscribe((res: any) => {
      if (res && res.data) {
        console.log(res.data);
        this.toast.success('New variable earning created successfully!.');
        this.route.navigateByUrl('master/payroll/salary-components/variable-earnings')
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }

  updateVariableEarningComponent(id: any, payload: any) {
    this.payrollService.updateVariableEarningComponent(id, payload).subscribe((res: any) => {
      if (res && res.data) {
        console.log(res.data);
        this.toast.success('Earning Updated successfully.');
        this.route.navigateByUrl('master/payroll/salary-components/variable-earnings')
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }

  earningObj: any;
  earningTypeChange(evnet: any, acitonType: any) {
    let value = evnet?.value;
    this.earningObj = this.earningCompList?.find((elem: any) => elem?.earning_type_code == value);
    if (value == 'BASIC1') {
      console.log(this.compList)
      this.earningForm?.patchValue({ earning_type: 'CTC' })
    }
    if (acitonType == 'change') {
      this.earningForm?.patchValue({ calculation_type: 'Percentage of' })
    }
  }

}
