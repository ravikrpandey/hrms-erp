import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-nps',
  templateUrl: './nps.html',
  styleUrls: ['./nps.scss']
})
export class Nps {

  npsForm: FormGroup;
  craProviders: any[] = [];

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService,
     private toaster: ToastrService,
     private route : Router

  ) {
    this.npsForm = this.fb.group({
      schemeName: ['', Validators.required],
      description: [''],
      employeeContribution: [null, Validators.required],
      employerContribution: [null, Validators.required],
      craProvider: [null, Validators.required],
      IsMinimum: [false],
      minimumAmount: [null],   
      Iscapping: [false],
      cappingAmount: [null], 
      employerContributionInCtc: [false],
      status: ['ACTIVE', Validators.required],
    });
  }
  ngOnInit(): void {

   
    this.getCraProviders();
    this.getAllNps()

     this.npsForm.get('IsMinimum')?.valueChanges.subscribe((val: boolean) => {
    const minControl = this.npsForm.get('minimumAmount');
    if (val) {
      minControl?.setValidators([Validators.required]);
    } else {
      minControl?.clearValidators();
      minControl?.setValue(null); 
    }
    minControl?.updateValueAndValidity();
  });

  this.npsForm.get('Iscapping')?.valueChanges.subscribe((val: boolean) => {
    const capControl = this.npsForm.get('cappingAmount');
    if (val) {
      capControl?.setValidators([Validators.required]);
    } else {
      capControl?.clearValidators();
      capControl?.setValue(null);
    }
    capControl?.updateValueAndValidity();
  });
  }

  getCraProviders(): void {
    this.payrollService.GetCraProvider().subscribe({
      next: (res: any) => {
        this.craProviders = res.data;
      },
      error: (err: any) => {
        console.error('Error fetching CRA Providers', err);
      }
    });
  }
  getAllData:any
getAllNps(){
this.payrollService.getAllNps().subscribe({
    next: (res: any) => {
      const data = res.data;
      this.getAllData=res.data
      
      this.npsForm.patchValue({
        schemeName: this.getAllData[0]?.schemeName,
        description: this.getAllData[0]?.description,
        employeeContribution: this.getAllData[0]?.employeeContribution,
        employerContribution: this.getAllData[0]?.employerContribution,
        craProvider: this.getAllData[0]?.craProvider_id,
        IsMinimum: this.getAllData[0]?.IsMinimum,
        minimumAmount: this.getAllData[0]?.minimumAmount,
        Iscapping: this.getAllData[0]?.Iscapping,
        cappingAmount: this.getAllData[0]?.cappingAmount,
        employerContributionInCtc: this.getAllData[0]?.employerContributionInCtc,
        status: this.getAllData[0]?.status
      });
    },
    error: (err: any) => {
      console.error("Error fetching NPS Scheme", err);
    }
  });
}
 reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

onSubmit() {
  if (this.npsForm.valid) {
    if(this.getAllData.length){
      this.npsForm.value.id =this.getAllData[0]?.id
    }
    const data = this.npsForm.value;
    this.payrollService.createNpsScheme(data).subscribe({
      next: (res) => {
        console.log('NPS Scheme Created:', res);
        this.toaster.success('NPS Scheme created successfully!');
       this.reloadCurrentRoute()
      },
      error: (err) => {
        console.error('Error creating NPS Scheme', err);
        this.toaster.warning('Failed to create NPS Scheme!');
      }
    });
  }}

 


}
