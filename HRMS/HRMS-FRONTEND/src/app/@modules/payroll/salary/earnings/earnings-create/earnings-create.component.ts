import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-earnings-create',
  templateUrl: './earnings-create.component.html',
  styleUrls: ['./earnings-create.component.scss']
})
export class EarningsCreateComponent {
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
      earning_name: ['', Validators.required],
      name_in_payslip: ['', Validators.required],
      calculation_type: ['Flat Amount', Validators.required],
      calculation_amount: [null],
      calculation_percentage: [null],
      // mark_as_active: [null],
      // is_part_of_salary_structure: [null],
      is_taxable: [null],
      // is_pro_rata: [null],
      consider_for_epf: [null],
      // epf_condition: [null],
      consider_for_esi: [null],
      consider_for_nps: [null],
      consider_for_saf: [null],
      // show_in_payslip: [null],
      gratuity: [null],
      is_overtime: [null],
      earning_type: [null],
      earning_type_code: [null, Validators.required]

    });
    // this.earningForm.get('calculation_amount')?.setValidators([Validators.required]);
  }

  // onCalculationTypeChange(event: any) {
  //   const calculationType = event.value;

  //   if (calculationType === 'Flat Amount') {
  //     this.earningForm.get('calculation_percentage')?.clearValidators();
  //     this.earningForm.get('calculation_percentage')?.setValue(null);
  //     this.earningForm.get('calculation_percentage')?.updateValueAndValidity();
  //     this.earningForm.get('calculation_amount')?.setValidators([Validators.required]);
  //     this.earningForm.get('calculation_amount')?.updateValueAndValidity();
  //   } else if (calculationType === 'Percentage of') {
  //     this.earningForm.get('calculation_amount')?.clearValidators();
  //     this.earningForm.get('calculation_amount')?.setValue(null);
  //     this.earningForm.get('calculation_amount')?.updateValueAndValidity();

  //     this.earningForm.get('calculation_percentage')?.setValidators([Validators.required, Validators.max(99), Validators.min(0)]);
  //     this.earningForm.get('calculation_percentage')?.updateValueAndValidity();
  //   } else {
  //     this.earningForm.get('calculation_percentage')?.clearValidators();
  //     this.earningForm.get('calculation_percentage')?.setValue(null);
  //     this.earningForm.get('calculation_amount')?.clearValidators();
  //     this.earningForm.get('calculation_amount')?.setValue(null);
  //   }
  // }

  onCalculationTypeChange(event: any) {
    const calculationType = event.value;

    if (calculationType === 'Percentage of') {
      // 🔹 earning_type must be required
      this.earningForm.get('earning_type')?.setValidators([Validators.required]);
      this.earningForm.get('earning_type')?.updateValueAndValidity();

      // 🔹 percentage required, must be between 1–99
      this.earningForm.get('calculation_percentage')?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(99)
      ]);
      this.earningForm.get('calculation_percentage')?.updateValueAndValidity();

      // ❌ clear amount
      this.earningForm.get('calculation_amount')?.clearValidators();
      this.earningForm.get('calculation_amount')?.setValue(null);
      this.earningForm.get('calculation_amount')?.updateValueAndValidity();
    }
    else if (calculationType === 'Flat Amount') {
      // ❌ remove dropdown + percentage validation
      this.earningForm.get('earning_type')?.clearValidators();
      this.earningForm.get('earning_type')?.updateValueAndValidity();

      this.earningForm.get('calculation_percentage')?.clearValidators();
      this.earningForm.get('calculation_percentage')?.setValue(null);
      this.earningForm.get('calculation_percentage')?.updateValueAndValidity();

      // ✅ amount can be optional OR required (your choice)
      this.earningForm.get('calculation_amount')?.setValidators([Validators.required]);
      this.earningForm.get('calculation_amount')?.updateValueAndValidity();
    }
  }

  ngOnInit(): void {
    this.getErningCompType()
    this.getAllCreatedErningComp();
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
    this.payrollService.getEarningComponentById(id).subscribe((res: any) => {
      if (res && res.data) {
        this.earningData = res.data;
        this.earningTypeChange({ value: this.earningData?.earning_type_code }, 'onload')
        this.earningForm.patchValue(this.earningData)
        if (this.earningData.calculation_type.includes('Percentage of')) {
          this.earningForm.patchValue({
            calculation_type: 'Percentage of'
          });
          this.earningForm.get('calculation_amount')?.clearValidators();
          this.earningForm.get('calculation_amount')?.setValue(null);
          this.earningForm.get('calculation_amount')?.updateValueAndValidity();
          this.earningForm.get('calculation_percentage')?.setValidators([Validators.required, Validators.max(99), Validators.min(0)]);
          this.earningForm.get('calculation_percentage')?.updateValueAndValidity();
        };
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }
  getAllCreatedErningComp() {
    this.payrollService.getAllCreatedErningComp().subscribe((res: any) => {
      if (res && res.data) {
        this.compList = res.data;
        console.log(this.compList, 'this.compList<<<<<<<<<');

      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }

  getErningCompType() {
    this.payrollService.getAllEarningType().subscribe((res: any) => {
      if (res && res.data) {
        this.earningCompList = res.data;
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
      this.earningForm.markAllAsTouched();   // 🔹 force validation messages
      return; // 🔹 stop submission
    }
    console.log();
    let data = this.earningForm.value;
    if (this.earningForm.invalid) {
      return this.toast.error('Required fields should not be empty', 'Fields Error');
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
      this.updateEarningComponent(this.earningId, payload)
    } else {
      this.createEarningComponent(payload)
    }
  }

  createEarningComponent(payload: any) {
    this.payrollService.createEarningComponent(payload).subscribe((res: any) => {
      if (res && res.data) {
        console.log(res.data);
        this.toast.success('New Earning Created successfully.');
        this.route.navigateByUrl('master/payroll/salary-components/earnings')
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }

  updateEarningComponent(id: any, payload: any) {
    this.payrollService.updateEarningComponent(id, payload).subscribe((res: any) => {
      if (res && res.data) {
        console.log(res.data);
        this.toast.success('Earning Updated successfully.');
        this.route.navigateByUrl('master/payroll/salary-components/earnings')
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
