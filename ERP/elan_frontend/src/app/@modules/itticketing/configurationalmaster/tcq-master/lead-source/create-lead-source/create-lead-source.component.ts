import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';

@Component({
  selector: 'app-create-lead-source',
  templateUrl: './create-lead-source.component.html',
  styleUrls: ['./create-lead-source.component.scss']
})
export class CreateLeadSourceComponent  implements OnInit {
  form: FormGroup;
  id: string;
  mode: string;
  financial_id: string = '';
  entity_id: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ProposalService,
    private toast: ToastrService,
    private route: ActivatedRoute
  ) {
    this.entity_id = localStorage.getItem('selectedEntityId')!;
    this.financial_id = localStorage.getItem('financial_id')!;
    this.form = this.fb.group({
      lead_source: [null],
      financial_year_id: [this.financial_id],
      entity_id: [this.entity_id],
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
    this.service.getLeadSourceById(this.id).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.form.patchValue({
            lead_source: res.data.lead_source,
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
        this.service.updateLeadSource(this.form.value).subscribe(
          (res: any) => {
            this.router.navigate([
              'master/configurational-master/tcq-master/lead-source',
            ]);
            this.toast.success(res.message);

            this.form.reset();
          },
          (error) => {
            this.form.reset();
            console.error(error.error.message);
            this.toast.error(error.error.message);
          }
        );
      }
      else {
        this.service.createLeadSource(this.form.value).subscribe(
          (res: any) => {
            this.router.navigate([
              'master/configurational-master/tcq-master/lead-source',
            ]);
            this.toast.success(res.message);

            this.form.reset();
          },
          (error) => {
            this.form.reset();
            console.error(error.error.message);
            this.toast.error(error.error.message);
          }
        );
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
