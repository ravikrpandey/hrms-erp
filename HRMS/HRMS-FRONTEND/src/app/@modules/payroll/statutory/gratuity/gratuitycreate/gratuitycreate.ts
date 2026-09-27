import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-gratuitycreate',
  templateUrl: './gratuitycreate.html',
  styleUrls: ['./gratuitycreate.scss']
})

export class Gratuitycreate {
  gratuityForm!: FormGroup;
  editId: any;

  constructor(private fb: FormBuilder,
    private toast: ToastrService,
    private payrollService: PayrollService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.gratuityForm = this.fb.group({
      assumed_work_days: ['', Validators.required],
      assumed_total_days: ['', Validators.required],
      maximum_limit: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
    });


     this.getAllGratuity();
  }

  gratuityList: any[] = [];

getAllGratuity() {
 this.payrollService.getAllGratuity().subscribe((res: any) => {
    if (res.data && res.data.length > 0) {
     
      const latest = res.data[res.data.length - 1];

      
      this.gratuityForm.patchValue({
        assumed_work_days: latest.assumed_work_days,
        assumed_total_days: latest.assumed_total_days,
        maximum_limit: latest.maximum_limit,
        status: latest.status
      });

   
      this.editId = latest.id;
    }
  }, (err) => {
    this.toast.error('Failed to fetch Gratuity records');
  });
}

onSubmit(): void {
  if (this.gratuityForm.valid) {
    const payload = { ...this.gratuityForm.value };

    // Include ID if editing
    if (this.editId) {
      payload.id = this.editId;
    }

    this.payrollService.createOrUpdateGratuity(payload).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
       
          if (this.editId) {
            this.toast.success(res.message || 'Gratuity updated successfully!');
          } else {
            this.toast.success(res.message || 'Gratuity created successfully!');
          }

         
          this.gratuityForm.reset();
          this.editId = null;

        
          this.getAllGratuity();
        }
      },
      error: (err: any) => {
        this.toast.error(err.message || 'Failed to save Gratuity!');
      }
    });

  } else {
    this.gratuityForm.markAllAsTouched();
    this.toast.warning('Please fill all required fields!');
  }
}

}
