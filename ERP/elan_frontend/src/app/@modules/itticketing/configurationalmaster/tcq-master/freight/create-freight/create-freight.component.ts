import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-create-freight',
  templateUrl: './create-freight.component.html',
  styleUrls: ['./create-freight.component.scss']
})
export class CreateFreightComponent implements OnInit {
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
      freight_name: [null],
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
    this.service.getFreightById(this.id).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.form.patchValue({
            freight_name: res.data.freight_name,
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
        this.service.updateFreight(this.form.value).subscribe(
          (res: any) => {
            this.router.navigate([
              'master/configurational-master/tcq-master/freight',
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
        this.service.createFreight(this.form.value).subscribe(
          (res: any) => {
            this.router.navigate([
              'master/configurational-master/tcq-master/freight',
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
