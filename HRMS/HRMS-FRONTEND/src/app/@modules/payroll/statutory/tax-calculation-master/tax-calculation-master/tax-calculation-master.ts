import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-tax-calculation-master',
  templateUrl: './tax-calculation-master.html',
  styleUrls: ['./tax-calculation-master.scss']
})
export class TaxCalculationMaster {

   form!: FormGroup;
  recordId: number | null = null; // if editing an existing record
  loading: boolean;
  taxMasters: any;

  constructor(private fb: FormBuilder,
    private payrollService:PayrollService,
    private toaster : ToastrService,
    private route :Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAllTaxMasters();
   
  }

  initForm() {
    this.form = this.fb.group({
      surchargeRows: this.fb.array([ this.createRow() ]),
      cess_rate: ['', [Validators.required, Validators.min(0)]],
      status: ['ACTIVE', Validators.required]
    });
  }

  createRow() {
    return this.fb.group({
      threshold: ['', Validators.required],
      rate: ['', Validators.required],
      remarks: ['']
    });
  }

  get surchargeRows(): FormArray {
    return this.form.get('surchargeRows') as FormArray;
  }

  addRow() {
    this.surchargeRows.push(this.createRow());
  }

  removeRow(index: number) {
    if (this.surchargeRows.length === 1) return; 
    this.surchargeRows.removeAt(index);
  }

  populateForm(payload: any) {
    if (!payload) return;
    this.recordId = payload.id || null;

    while (this.surchargeRows.length) {
      this.surchargeRows.removeAt(0);
    }

    if (payload.surchargeRows && Array.isArray(payload.surchargeRows) && payload.surchargeRows.length) {
      payload.surchargeRows.forEach((r: any) => {
        this.surchargeRows.push(this.fb.group({
          threshold: [r.threshold, Validators.required],
          rate: [r.rate, Validators.required],
          remarks: [r.remarks || '']
        }));
      });
    } else {
      this.surchargeRows.push(this.createRow());
    }

    this.form.patchValue({
      cess_rate: payload.cess_rate,
      status: payload.status || 'ACTIVE'
    });
  }

 getAllTaxMasters() {
  this.loading = true;
  this.payrollService.getAllTaxMasters().subscribe({
    next: (res: any) => {
      if (res.code === 200 && res.data && res.data.length) {
        this.taxMasters = res.data; 
        const firstRecord = res.data[0]; 
        this.populateForm({
          ...firstRecord,
          surchargeRows: firstRecord.TAX_CALCULATION_SURCHARGEs || []
        });
      }
      this.loading = false;
    },
    error: (err) => {
      console.error('Error fetching tax masters:', err);
      this.loading = false;
    }
  });
}



  reloadCurrentRoute() {
    const currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const payload = {
    ...this.form.value,
    id: this.recordId || undefined
  };

  this.payrollService.createTaxMaster(payload).subscribe({
    next: (res: any) => {
      if (res.code === 201 || res.code === 200) {
        if (!this.recordId && res.data?.id) {
          this.recordId = res.data.id;
        }
        const msg = this.recordId
          ? 'Data Updated successfully!'
          : 'Data Saved successfully!';
        this.toaster.success(msg);
        this.reloadCurrentRoute();
      } else {
        this.toaster.warning(res.message || 'Something went wrong');
      }
    },
    error: (err) => {
      const backendMsg = err?.error?.message || 'Error saving data!';
      this.toaster.error(backendMsg, 'Error');
    }
  });
}




}
