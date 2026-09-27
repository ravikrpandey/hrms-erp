import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.html',
  styleUrls: ['./compliance.scss']
})
export class Compliance implements OnInit {
  limitForm!: FormGroup;
  recordId: any;

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService,
    private route: Router,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.limitForm = this.fb.group({
      epf_individual_limit: ['', Validators.required],
      epf_aggregate_cap: ['', Validators.required],
      epf_remarks: ['', Validators.required],

      nps_individual_limit: ['', Validators.required],
      nps_aggregate_cap: ['', Validators.required],
      nps_remarks: ['', Validators.required],

      saf_individual_limit: ['', Validators.required],
      saf_aggregate_cap: ['', Validators.required],
      saf_remarks: ['', Validators.required],

      status: ['ACTIVE', Validators.required]
    });

    this.getComplianceLimit();
  }

  getComplianceLimit() {
    this.payrollService.getComplianceLimit().subscribe({
      next: (res: any) => {
        if (res && res.data && res.data.length > 0) {
          const data = res.data[0];
          this.recordId = data.id; 

          this.limitForm.patchValue({
            epf_individual_limit: data.epf_individual_limit,
            epf_aggregate_cap: data.epf_aggregate_cap,
            epf_remarks: data.epf_remarks,

            nps_individual_limit: data.nps_individual_limit,
            nps_aggregate_cap: data.nps_aggregate_cap,
            nps_remarks: data.nps_remarks,

            saf_individual_limit: data.saf_individual_limit,
            saf_aggregate_cap: data.saf_aggregate_cap,
            saf_remarks: data.saf_remarks,

            status: data.status
          });
        }
      },
      error: (err: any) => {
        console.error('Error fetching compliance limits!', err);
        this.toaster.error('Failed to fetch compliance data!');
      }
    });
  }

  reloadCurrentRoute() {
    const currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onSubmit() {
    if (this.limitForm.valid) {
      const payload = { ...this.limitForm.value };

      if (this.recordId) {
        payload.id = this.recordId;
      }

      this.payrollService.createCompliance(payload).subscribe({
        next: (res: any) => {
          if (this.recordId) {
            this.toaster.success('Compliance updated successfully!');
          } else {
            this.toaster.success('Compliance created successfully!');
            if (res.data?.id) {
              this.recordId = res.data.id;
            }
          }

          this.reloadCurrentRoute();
        },
        error: (err: any) => {
          console.error('Error saving compliance:', err);
          this.toaster.error('Error saving compliance');
        }
      });
    } else {
      this.limitForm.markAllAsTouched();
      this.toaster.warning('Please fill all required fields');
    }
  }
}
