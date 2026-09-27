import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FnfserviceServiceTsService } from 'src/app/@shared/services/fnfservice.service.ts.service';


@Component({
  selector: 'app-deduction',
  templateUrl: './deduction.component.html',
  styleUrls: ['./deduction.component.scss']
})
export class DeductionComponent implements OnInit {
  deductionForm: FormGroup;
  employee_id: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fnfservice: FnfserviceServiceTsService
  ) { }

  ngOnInit(): void {
    this.employee_id = this.route.snapshot.queryParamMap.get('employee_id') || '';
    console.log('Employee ID:', this.employee_id);

    this.deductionForm = this.fb.group({
      lop_days: ['', [Validators.required, Validators.min(0)]],
      lop_deduction_amount: ['', [Validators.required, Validators.min(0)]],
      loan_recovery_amount: [''],
      assets_recovery_amount: [''],
      notice_pay_recovery: [''],
      employee_id: [this.employee_id]
    });

    if (this.employee_id) {
      this.loadDeductionDetails(this.employee_id);
    }
  }

  loadDeductionDetails(employee_id: any) {
    this.fnfservice.getFnfFullDataById(employee_id).subscribe({
      next: (res: any) => {
        if (res?.data?.deduction_details) {
          const details = res?.data?.deduction_details;

          this.deductionForm.patchValue({
            lop_days: details.lop_days ?? '',
            lop_deduction_amount: details.lop_deduction_amount ?? '',
            loan_recovery_amount: details.loan_recovery_amount ?? '',
            assets_recovery_amount: details.assets_recovery_amount ?? '',
            notice_pay_recovery: details.notice_pay_recovery ?? ''
          });

        } else {
          this.toastr.info('No deduction details found.');
        }
      },
      error: (err) => {
        console.error('Error loading deduction details:', err);
        this.toastr.error('Failed to load deduction details.');
      }
    });
  }


  handleSubmit() {
    if (this.deductionForm.valid) {
      const data = {
        employee_details: {
          employee_id: parseInt(this.employee_id)
        },
        deduction_details: this.deductionForm.value
      };

      console.log('Submitting payload:', data);

      this.fnfservice.updateFnfFullData(this.employee_id, data).subscribe({
        next: (res: any) => {
          this.toastr.success('Deduction details saved successfully');
          this.router.navigate(['/master/ess/fnf-settlement/common/summary-approval'], {
            queryParams: { employee_id: this.employee_id }
          });
        },
        error: (err) => {
          console.error('Error saving deduction details:', err);
          this.toastr.error(err?.error?.message || 'Failed to save deduction details');
        }
      });
    } else {
      this.toastr.warning('Please fill all required fields correctly.');
    }
  }

  cancel() {
    this.router.navigate(['/master/ess/fnf-settlement']);
  }
}
