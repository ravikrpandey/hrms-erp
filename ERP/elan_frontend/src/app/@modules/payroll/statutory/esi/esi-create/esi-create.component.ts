import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-esi-create',
  templateUrl: './esi-create.component.html',
  styleUrls: ['./esi-create.component.scss']
})
export class EsiCreateComponent {
    esiForm: FormGroup;
    signIn: any = localStorage.getItem('signInUser');
    singInUser = JSON.parse(this.signIn);
    esiId: any;
    esiData:any;
    esiPattern = '^\\d{2}[–-]?\\d{2}[–-]?\\d{6}[–-]?\\d{3}[–-]?\\d{4}$';
  
    constructor(
      private fb: FormBuilder,
      private route: Router,
      private activeroute: ActivatedRoute,
      private toast: ToastrService,
      private payrollService:PayrollService
    ) {
      this.esiForm = this.fb.group({
        esi_number: ['', [Validators.required, Validators.pattern(this.esiPattern)]],
        deduction_cycle: ['monthly'],
        employee_contribution: ['0.75'],
        employer_contribution: ['3.25'],
        employee_contribution_in_ctc: [false],
      });
    }
  
    ngOnInit(): void {
      this.activeroute.queryParams.subscribe((params: any) => {
        this.esiId = params.esi_id;
      });
      if (this.esiId != undefined || null) {
        this.getEsiById(this.esiId)
      }
    }
  

  
    getEsiById(id:any){
      this.payrollService.getESIbyId(id).subscribe((res:any) => {
        if(res && res.data){
          this.esiData = res.data;
          this.esiForm.patchValue(this.esiData)
        }
      },err => {
        this.toast.error(err.error.message);
      })
    }
  
  

    back(){
      window.history.back()
    }
  
    submitForm(){
      console.log(this.esiForm.value);
      let payload = {
        ...this.esiForm.value,
        created_by:this.singInUser.employee_id
  
      }
      if(this.esiId != undefined || this.esiId != null ){
        this.updateESI(this.esiId,payload)
      }else{
        this.createESI(payload)
      }
  
      
    }
  
  
    createESI(payload:any){
      this.payrollService.createESI(payload).subscribe((res:any) => {
        if(res && res.data){
          console.log(res.data);
          this.toast.success('ESI Created successfully.');
          this.route.navigateByUrl('master/payroll/statutory-components/ESI')
        }
      }, err=>{
        this.toast.error(err.error.message);
      })
    }
  
    updateESI(id:any,payload:any){
      this.payrollService.updateESI(id,payload).subscribe((res:any) => {
        if(res && res.data){
          console.log(res.data);
          this.toast.success('ESI Updated successfully.');
          this.route.navigateByUrl('master/payroll/statutory-components/ESI')
        }
      }, err=>{
        this.toast.error(err.error.message);
      })
    }
  
}
