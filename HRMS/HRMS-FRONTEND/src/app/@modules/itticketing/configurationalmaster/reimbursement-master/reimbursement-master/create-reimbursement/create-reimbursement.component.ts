import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-create-reimbursement',
  templateUrl: './create-reimbursement.component.html',
  styleUrls: ['./create-reimbursement.component.scss']
})
export class CreateReimbursementComponent implements OnInit {
  form: FormGroup;
  id: string;
  mode: string;
  type: string;
  rowData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ConfigurationalmasterService,
    private toast: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: [null],
      parentId: [null],
    });

    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.type = 'reimbursement';
      if (this.type) {
        this.form.patchValue({ type: this.type });
      }
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
    this.service.getAllTravelType('reimbursement').subscribe((data: any) => {
      this.rowData = data.data;
    });
  }

  loadData(): void {
    this.service.getTravelTypeById(this.id).subscribe(
      (data: any) => {
        if (data) {
          this.form.patchValue({
            name: data.name,
            type: data.type,
            parentId: data.parentId,
          });
          if (data.parentId) {
            this.type = 'reimbursement';
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching Reimbursement Type:', error);
        this.toast.error('Failed to load Reimbursement details');
      }
    );
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.mode === 'edit') {
      this.form.value.id = this.id;
    }

    this.service.addTravelType(this.form.value).subscribe(
      (response) => {
        // ✅ Success case
        this.router.navigate(['/master/configurational-master/reimbursement-master/reimbursement']);
        if (this.mode === 'edit') {
          this.toast.success('Reimbursement Type updated successfully');
        } else {
          this.toast.success('Reimbursement Type added successfully');
        }
        this.form.reset();
      },
      (error) => {
        console.error('Error saving Reimbursement Type:', error);

        // ✅ Duplicate name validation (from backend)
        if (error.status === 400 && error.error?.message === 'Travel type name already exists') {
          this.toast.warning('Reimbursement Type name already exists. Please choose a different name.');
        }
        // ✅ Name required validation (from backend)
        else if (error.status === 400 && error.error?.message === 'Name is required') {
          this.toast.error('Name is required.');
        }
        // ✅ Generic error
        else {
          this.toast.error('Reimbursement Type name already exists. Please choose a different name.');
        }
      }
    );
  }

  close() {
    this.router.navigate(['/master/configurational-master/reimbursement-master/reimbursement'])
  }
}
