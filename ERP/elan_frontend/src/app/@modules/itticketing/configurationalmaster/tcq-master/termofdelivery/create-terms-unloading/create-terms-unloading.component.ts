import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { PaymentCategoryActionComponent } from '../../paymentcategory/payment-category-action/payment-category-action.component';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-terms-unloading',
  templateUrl: './create-terms-unloading.component.html',
  styleUrls: ['./create-terms-unloading.component.scss']
})
export class CreateTermsUnloadingComponent implements OnInit {
  form: FormGroup;
  id: string;
  mode: string;
  typeList = ["Transport", "Unloading", "Delivery Term"]

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ProposalService,
    private toast: ToastrService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      type: [null],
      delivery_term: [null],  
      unloading: [null],
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
    this.service.getdeliveryTermUnloadingById(this.id).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.form.patchValue({
            type: res.data.type,
            delivery_term: res.data.delivery_term,
            unloading: res.data.unloading,
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
        this.service.updatedeliveryTermUnloading(this.form.value).subscribe(
          (res: any) => {
            this.router.navigate([
              'master/configurational-master/tcq-master/termofdelivery',
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
        this.service.createdeliveryTermUnloading(this.form.value).subscribe(
          (res: any) => {
            this.router.navigate([
              'master/configurational-master/tcq-master/termofdelivery',
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
