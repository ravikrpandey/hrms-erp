import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-add-travel-type',
  templateUrl: './add-travel-type.component.html',
  styleUrls: ['./add-travel-type.component.scss'],
})
export class AddTravelTypeComponent implements OnInit {
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
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: [null],
      parentId: [null],
    });

    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.type = params['type'];
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
    this.service.getAllTravelType('travel').subscribe((data: any) => {
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
            this.type = 'conveyance';
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching Travel Type:', error);
        this.toast.error('Failed to load Travel Type details');
      }
    );
  }
back(): void {
  this.router.navigate(
    [
      'master/configurational-master/reimbursement-master/travel-type',
    ]
  );
}
  onSubmit(): void {
  if (this.form.valid) {
    if (this.mode === 'edit') {
      this.form.value.id = this.id;
    }

    this.service.addTravelType(this.form.value).subscribe(
      (response) => {
        if (this.type === 'grade') {
          this.router.navigate([
            'master/configurational-master/travel-master/grade',
          ]);
        } else {
          this.router.navigate([
            'master/configurational-master/reimbursement-master/travel-type',
          ]);
        }
        this.toast.success('Travel Type saved successfully');
        this.form.reset();
      },
      (error) => {
        console.error('Error adding Travel Type:', error);

        //  Show error message from backend
        if (error.error && error.error.message) {
          this.toast.error(error.error.message);
        } else {
          this.toast.error('Something went wrong. Please try again.');
        }

        this.form.reset();
      }
    );
  } else {
    this.form.markAllAsTouched();
  }
}

}
