import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';

@Component({
  selector: 'app-create-payment-subcategory',
  templateUrl: './create-payment-subcategory.component.html',
  styleUrls: ['./create-payment-subcategory.component.scss']
})
export class CreatePaymentSubcategoryComponent implements OnInit {
  form: FormGroup;
  id: string;
  mode: string;
  paymentMainCategory: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ProposalService,
    private toast: ToastrService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      sub_payment_name: [null],
      payment_main_id: [null],
      status: ['ACTIVE']
    });
  }

  ngOnInit(): void {
    this.getData();
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

  getData() {
    this.service.paymentMainList().subscribe((data: any) => {
      this.paymentMainCategory = data.data;
    });
  }

  loadData(): void {
    this.service.getSubPaymentMainById(this.id).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.form.patchValue({
            sub_payment_name: res.data.sub_payment_name,
            payment_main_id: res.data.payment_main_id,
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
        this.service.updateSubPaymentMain(this.form.value).subscribe(
          (res: any) => {
            this.router.navigate([
              'master/configurational-master/tcq-master/paymentsubcategory',
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
        this.service.createSubPaymentMain(this.form.value).subscribe(
          (res: any) => {
            this.router.navigate([
              'master/configurational-master/tcq-master/paymentsubcategory',
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
