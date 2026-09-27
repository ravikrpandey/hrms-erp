import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-payment-terms-form',
  templateUrl: './payment-terms-form.component.html',
  styleUrls: ['./payment-terms-form.component.scss']
})
export class PaymentTermsFormComponent implements OnInit {
  form: FormGroup;
  id: string;
  mode: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ConfigurationalmasterService,
    private toast: ToastrService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      term_name: [null, [Validators.required]],
      credit_days: [null, [Validators.required]],
      status: ['ACTIVE']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.mode = params['mode'];
      if (this.mode === 'view') {
        this.form.disable();
      } else {
        this.form.enable();
      }
      if (this.id) {
        this.loadData();
      }
    });
  }

  loadData(): void {
    this.service.getPaymentTermMasterById(this.id).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.form.patchValue({
            term_name: res.data.term_name,
            credit_days: res.data.credit_days,
            status: res.data.status
          });
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.message);
      }
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      const rawVal = this.form.getRawValue();
      if (this.mode === 'edit') {
        this.service.updatePaymentTermMaster(this.id, rawVal).subscribe(
          (res: any) => {
            this.router.navigate([
              'master/configurational-master/tcq-master/payment',
            ]);
            this.toast.success(res.message);
            this.form.reset();
          },
          (error) => {
            console.error(error);
            this.toast.error(error.error.message);
          }
        );
      } else {
        this.service.createPaymentTermMaster(rawVal).subscribe(
          (res: any) => {
            this.router.navigate([
              'master/configurational-master/tcq-master/payment',
            ]);
            this.toast.success(res.message);
            this.form.reset();
          },
          (error) => {
            console.error(error);
            this.toast.error(error.error.message);
          }
        );
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
