import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-epf-create',
  templateUrl: './epf-create.component.html',
  styleUrls: ['./epf-create.component.scss']
})
export class EpfCreateComponent {
  epfForm: FormGroup;
  employeeContibutationList:any;
  employerContibutationList:any;
  showContribution:boolean = false;
  signIn: any = localStorage.getItem('signInUser');
  singInUser = JSON.parse(this.signIn);
  epfId: any;
  epfData:any
  epfPattern = '^[A-Z]{2}[A-Z]{3}\\d{7}\\d{3}\\d{7}$';

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private activeroute: ActivatedRoute,
    private toast: ToastrService,
    private payrollService:PayrollService
  ) {
    this.epfForm = this.fb.group({
      epf_number: ['', [Validators.required, Validators.pattern(this.epfPattern)]],
      deduction_cycle: ['monthly'],
      employee_contribution_rate: new FormControl(null, [Validators.required]),
      employer_contribution_rate: new FormControl(null, [Validators.required]),
      is_employer_contribution_in_ctc: new FormControl(null, [Validators.required]),
      is_edli_contribution_in_ctc: new FormControl(null, [Validators.required]),
      // is_admin_charges_in_ctc: new FormControl(null, [Validators.required]),
      override_at_employee_level: new FormControl(null, [Validators.required]),
      is_pro_rate_restricted_pf_wage: new FormControl(null, [Validators.required]),
      consider_salary_components_if_low_pf: new FormControl(null, [Validators.required]),

    })
  }

  ngOnInit(): void {
    this.getEmployeeContibutationList();
    this.getEmployerContibutationList();
    this.activeroute.queryParams.subscribe((params: any) => {
      this.epfId = params.epf_id;
    });
    if (this.epfId != undefined || null) {
      this.getEpfById(this.epfId)
    }
  }

  getEmployeeContibutationList(){
    this.payrollService.getEmployeeContibutation().subscribe((res:any) => {
      if(res && res.data){
        this.employeeContibutationList = res.data;
        
      }
    },err => {
      this.toast.error(err.error.message);
    })
  };

  getEpfById(id:any){
    this.payrollService.getEPFbyId(id).subscribe((res:any) => {
      if(res && res.data){
        this.epfData = res.data;
        this.epfForm.patchValue(this.epfData)
      }
    },err => {
      this.toast.error(err.error.message);
    })
  }

  getEmployerContibutationList(){
    this.payrollService.getEmployerContibutation().subscribe((res:any) => {
      if(res && res.data){
        this.employerContibutationList = res.data;
        
      }
    },err => {
      this.toast.error(err.error.message);
    })
  }

  changeContribution(event:any){
    this.showContribution = event;
  }

  back(){
    window.history.back()
  }

  submitForm(){
    console.log(this.epfForm.value);
    let payload = {
      ...this.epfForm.value,
      created_by:this.singInUser.employee_id

    }
    if(this.epfId != undefined || this.epfId != null ){
      this.updateEPF(this.epfId,payload)
    }else{
      this.createEPF(payload)
    }

    
  }


  createEPF(payload:any){
    this.payrollService.createEPF(payload).subscribe((res:any) => {
      if(res && res.data){
        console.log(res.data);
        this.toast.success('EPF Created successfully.');
        this.route.navigateByUrl('master/payroll/statutory-components/EPF')
      }
    }, err=>{
      this.toast.error(err.error.message);
    })
  }

  updateEPF(id:any,payload:any){
    this.payrollService.updateEPF(id,payload).subscribe((res:any) => {
      if(res && res.data){
        console.log(res.data);
        this.toast.success('EPF Updated successfully.');
        this.route.navigateByUrl('master/payroll/statutory-components/EPF')
      }
    }, err=>{
      this.toast.error(err.error.message);
    })
  }

}
