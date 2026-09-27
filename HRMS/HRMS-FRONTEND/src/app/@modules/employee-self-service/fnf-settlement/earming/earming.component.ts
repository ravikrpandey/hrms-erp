import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FnfActionComponent } from '../fnf-action/fnf-action.component';
import { FnfserviceServiceTsService } from 'src/app/@shared/services/fnfservice.service.ts.service';


@Component({
  selector: 'app-earming',
  templateUrl: './earming.component.html',
  styleUrls: ['./earming.component.scss']
})
export class EarmingComponent implements OnInit {

  earningForm: FormGroup;
  employee_id: string = '';

  constructor(
    private fb: FormBuilder,
    private fnfservice: FnfserviceServiceTsService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.earningForm = this.fb.group({
      final_salary: ['', [Validators.required, Validators.min(0)]],
      leave_encashment_days: ['', [Validators.required, Validators.min(0)]],
      leave_encashment_amount: ['', [Validators.required, Validators.min(0)]],
      bonus_amount: [''],
      gratuity_amount: ['']
    });


    this.employee_id = this.route.snapshot.queryParamMap.get('employee_id') || '';
    console.log('Employee ID from route:', this.employee_id);

    if (this.employee_id) {
      this.loadEarningDetails(this.employee_id);
    }
  }

  loadEarningDetails(employee_id: any) {
    const emid = parseInt(employee_id);
    this.fnfservice.getFnfFullDataById(emid).subscribe({
      next: (res: any) => {
        const earningDetails = res?.data?.earning_details;
        console.log('Fetched earning details:', earningDetails);

        if (earningDetails) {
          this.earningForm.patchValue({
            final_salary: earningDetails.final_salary ?? '',
            leave_encashment_days: earningDetails.leave_encashment_days ?? '',
            leave_encashment_amount: earningDetails.leave_encashment_amount ?? '',
            bonus_amount: earningDetails.bonus_amount ?? '',
            gratuity_amount: earningDetails.gratuity_amount ?? ''
          });
        } else {
          this.toastr.info('No earning details found.');
        }
      },
      error: (err) => {
        console.error('Error fetching earning details:', err);
        this.toastr.error('Failed to load earning details.');
      }
    });
  }

  submit() {
    if (this.earningForm.valid) {
      const payload = {
        employee_details: {
          employee_id: parseInt(this.employee_id)
        },
        earning_details: this.earningForm.value
      };

      console.log('Submitting payload:', payload);

      this.fnfservice.updateFnfFullData(this.employee_id, payload).subscribe({
        next: (res: any) => {
          this.toastr.success('Earning details saved successfully');
          this.router.navigate(['/master/ess/fnf-settlement/common/deduction'], {
            queryParams: { employee_id: this.employee_id }
          });
        },
        error: (err) => {
          console.error('Error saving earning details:', err);
          this.toastr.error(err?.error?.message || 'Failed to save earning details');
        }
      });
    } else {
      this.toastr.warning('Please fill all fields correctly.');
    }
  }

  cancel() {
    this.router.navigate(['/master/ess/fnf-settlement']);
  }
}
