import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';

@Component({
  selector: 'app-create-payment-category',
  templateUrl: './create-payment-category.component.html',
  styleUrls: ['./create-payment-category.component.scss']
})
export class CreatePaymentCategoryComponent implements OnInit {
  form: FormGroup;
  id: string;
  mode: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ProposalService,
    private toast: ToastrService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      payment_name: [null],
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
    this.service.getPaymentMainById(this.id).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.form.patchValue({
            payment_name: res.data.payment_name,
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
      if (this.mode === 'edit') {
        this.form.value.id = this.id;
        this.service.updatePaymentMain(this.form.value).subscribe(
          (res: any) => {
            this.router.navigate([
              'master/configurational-master/tcq-master/paymentcategory',
            ]);
            this.toast.success(res.message);

            this.form.reset();
          },
          (error) => {
            this.form.reset();
            console.error(error.error.message);
          }
        );
      }
      else {
        this.service.createPaymentMain(this.form.value).subscribe(
          (res: any) => {
            this.router.navigate([
              'master/configurational-master/tcq-master/paymentcategory',
            ]);
            this.toast.success(res.message);

            this.form.reset();
          },
          (error) => {
            this.form.reset();
            console.error(error.error.message);
          }
        );
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
