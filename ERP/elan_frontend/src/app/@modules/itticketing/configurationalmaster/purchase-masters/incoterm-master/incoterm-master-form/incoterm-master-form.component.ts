import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseMasterService } from '../../services/purchase-master.service';

@Component({
  selector: 'app-incoterm-master-form',
  templateUrl: './incoterm-master-form.component.html',
  styleUrls: ['./incoterm-master-form.component.scss']
})
export class IncotermMasterFormComponent implements OnInit {
  form: FormGroup;
  id: string;
  mode: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: PurchaseMasterService,
    private toast: ToastrService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
      incoterm_code: [null, [Validators.required]],
      incoterm_meaning: [null, [Validators.required]],
      incoterm_responsibility: [null, [Validators.required]],
      status: ["ACTIVE", [Validators.required]],
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
    this.service.getIncotermById(this.id).subscribe(
      (data: any) => {
        if (data) {
          this.form.patchValue({
            incoterm_code: data.incoterm_code,
            incoterm_meaning: data.incoterm_meaning,
            incoterm_responsibility: data.incoterm_responsibility,
            status: data.status,
            id: data.id,
          });
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching Incoterm:', error);
        this.toast.error('Failed to load Incoterm details');
      }
    );
  }

  onSubmit(): void {
    console.log('Form Value:', this.form.value);

    if (this.form.valid) {
      if (this.mode === 'edit') {
        this.form.value.id = this.id;

        this.service.updateIncoterm(this.id, this.form.value).subscribe(
          (response) => {
            this.router.navigate([
              'master/configurational-master/purchase-masters/incoterm',
            ]);
            this.toast.success('Incoterm updated successfully');

            this.form.reset();
          },
          (error) => {
            this.form.reset();
            console.error('Error adding Incoterm:', error);
          }
        );
      }
      else {
        this.service.createIncoterm(this.form.value).subscribe(
          (response) => {
            this.router.navigate([
              'master/configurational-master/purchase-masters/incoterm',
            ]);
            this.toast.success('Incoterm added successfully');

            this.form.reset();
          },
          (error) => {
            this.form.reset();
            console.error('Error adding Incoterm:', error);
          }
        );
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
