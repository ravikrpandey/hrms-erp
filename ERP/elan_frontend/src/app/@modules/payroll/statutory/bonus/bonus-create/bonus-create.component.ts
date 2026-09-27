import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-bonus-create',
  templateUrl: './bonus-create.component.html',
  styleUrls: ['./bonus-create.component.scss']
})
export class BonusCreateComponent {
  bonusForm: FormGroup;
  signIn: any = localStorage.getItem('signInUser');
  singInUser = JSON.parse(this.signIn);
  bonusId: any;
  bonusData:any;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private activeroute: ActivatedRoute,
    private toast: ToastrService,
    private payrollService:PayrollService
  ) {
    this.bonusForm = this.fb.group({
      payment_frequency: ['monthly', Validators.required],  // Default value is 'monthly'
      monthly_bonus_percent: ['', [Validators.required, Validators.min(8.33), Validators.max(20)]]
    });
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.bonusId = params.bonus_id;
    });
    if (this.bonusId != undefined || null) {
      this.getStatutoryBonusById(this.bonusId)
    }
  }



  getStatutoryBonusById(id:any){
    this.payrollService.getStatutoryBonusById(id).subscribe((res:any) => {
      if(res && res.data){
        this.bonusData = res.data;
        this.bonusForm.patchValue(this.bonusData)
      }
    },err => {
      this.toast.error(err.error.message);
    })
  }



  back(){
    window.history.back()
  }

  submitForm(){
    console.log(this.bonusForm.value);
    let payload = {
      ...this.bonusForm.value,
      created_by:this.singInUser.employee_id

    }
    if(this.bonusId != undefined || this.bonusId != null ){
      this.updateStatutoryBonus(this.bonusId,payload)
    }else{
      this.createStatutoryBonus(payload)
    }

    
  }


  createStatutoryBonus(payload:any){
    this.payrollService.createStatutoryBonus(payload).subscribe((res:any) => {
      if(res && res.data){
        console.log(res.data);
        this.toast.success('Statutory Bonus Created successfully.');
        this.route.navigateByUrl('master/payroll/statutory-components/bonus')
      }
    }, err=>{
      this.toast.error(err.error.message);
    })
  }

  updateStatutoryBonus(id:any,payload:any){
    this.payrollService.updateStatutoryBonus(id,payload).subscribe((res:any) => {
      if(res && res.data){
        console.log(res.data);
        this.toast.success('Statutory Bonus Updated successfully.');
        this.route.navigateByUrl('master/payroll/statutory-components/bonus')
      }
    }, err=>{
      this.toast.error(err.error.message);
    })
  }
}
