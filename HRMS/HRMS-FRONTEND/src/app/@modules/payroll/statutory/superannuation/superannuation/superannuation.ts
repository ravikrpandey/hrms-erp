import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-superannuation',
  templateUrl: './superannuation.html',
  styleUrls: ['./superannuation.scss']
})
export class Superannuation {


  superannuationForm!: FormGroup;
  isEdit = false;

  providers: any[];

selectedVesting: any;
  existingRecord: any;
  record: any;

  constructor(
    private fb: FormBuilder,
    private payrollService:PayrollService,
    private toaster:ToastrService,
    private route:Router,
  ) { }

  ngOnInit(): void {
    this.superannuationForm = this.fb.group({
      schemeName: ['', Validators.required],
      provider: ['', Validators.required],
      accountNo: ['', Validators.required],
      employerContribution: ['', [Validators.required, Validators.min(0)]],
      employeeContribution: ['', [Validators.required, Validators.min(0)]],
      status:[''],
      vestingPeriod: ['', Validators.required],
      // This is Conditional fields
      cliffYears: [''],
      gradedPercent: [''],
      gradedYears: ['']
    });


    this.getSuperannuationProvider();
    this.getAllSuperannuationScheme();


    this.superannuationForm.get('vestingPeriod')?.valueChanges.subscribe(value => {
      this.selectedVesting = value;
      this.setVestingValidators(value);
    });
  }



  setVestingValidators(value: string) {
    const cliff = this.superannuationForm.get('cliffYears');
    const gradedPercent = this.superannuationForm.get('gradedPercent');
    const gradedYears = this.superannuationForm.get('gradedYears');

    // Reset validators first
    cliff?.clearValidators();
    gradedPercent?.clearValidators();
    gradedYears?.clearValidators();

    if (value === 'Cliff vesting') {
      cliff?.setValidators([Validators.required, Validators.min(1)]);
    } else if (value === 'Graded/linear vesting') {
      gradedPercent?.setValidators([Validators.required, Validators.min(1), Validators.max(100)]);
      gradedYears?.setValidators([Validators.required, Validators.min(1)]);
    }

    // Update validity after changing validators
    cliff?.updateValueAndValidity();
    gradedPercent?.updateValueAndValidity();
    gradedYears?.updateValueAndValidity();
  }




  getSuperannuationProvider(){
    this.payrollService.getAllSuperannuationProvider().subscribe({
      next: (res: any) => {
      if (res && res.data) {
        this.providers = res.data; 
        console.log('Superannuation data:', this.providers);
      }
    },
    error: (err) => {
      console.error('Error fetching superannuation:', err);
    }
  });
  
  }

superannuation :any=[]
getAllSuperannuationScheme() {
  this.payrollService.getAllSuperannuationScheme().subscribe({
    next: (res: any) => {
      if (res && res.data) {
        const record = res.data[0];
        this.superannuation =res.data

        this.superannuationForm.patchValue({
          schemeName: record.schemeName,
          provider: record.provider, 
          accountNo: record.accountNo,
          employerContribution: record.employerContribution,
          employeeContribution: record.employeeContribution,
          vestingPeriod: record.vestingPeriod,
          cliffYears: record.cliffYears,
          gradedPercent: record.gradedPercent,
          gradedYears: record.gradedYears,
          status: record.status
        });
        this.selectedVesting = record.vestingPeriod;
      }
    },
    error: (err: any) => {
      console.error('Error fetching superannuation:', err);
    }
  });
}




 onSubmitOrUpdate(): void {

  if (this.superannuationForm.invalid) {
    this.superannuationForm.markAllAsTouched();
    return;
  }
   if(this.superannuation?.length){
      this.superannuationForm.value.id =this.superannuation[0]?.id
    }

  const formValue = this.superannuationForm.value;

  const payload: any = {
    id:formValue.id,
    schemeName: formValue.schemeName,
    provider: formValue.provider, 
    accountNo: formValue.accountNo,
    employerContribution: formValue.employerContribution,
    employeeContribution: formValue.employeeContribution,
    status:formValue.status,
    vestingPeriod: formValue.vestingPeriod
  };

  if (formValue.vestingPeriod === 'Cliff vesting') {
    payload.cliffYears = formValue.cliffYears;
  } else if (formValue.vestingPeriod === 'Graded/linear vesting') {
    payload.gradedPercent = formValue.gradedPercent;
    payload.gradedYears = formValue.gradedYears;
  }

  

  this.payrollService.createOrupdateSuperannuation(payload).subscribe({
    next: (res: any) => {
      console.log('Saved record:', res.data);
      this.toaster.success(res.message); 
      // this.getSuperannuationProviders(); 
      this.isEdit = false;
      this.reloadCurrentRoute()
    },
    error: (err: any) => {
      console.error('Error saving record:', err);
      alert('Failed to save superannuation record');
    }
  });
}


reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }


}
