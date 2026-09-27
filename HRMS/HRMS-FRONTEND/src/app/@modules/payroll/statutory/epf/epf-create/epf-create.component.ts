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
      // epf_number: ['', [Validators.required, Validators.pattern(this.epfPattern)]],
      deduction_cycle: ['monthly',Validators.required],
      employee_contribution_rate: new FormControl(null, [Validators.required]),
      employer_contribution_rate: new FormControl(null, [Validators.required]),
      edli_rate: new FormControl(null, [Validators.required]),
      admin_charges_rate: new FormControl(null, [Validators.required]),
      admin_charges_cap: new FormControl(null, [Validators.required]),
      is_employer_contribution_in_ctc: new FormControl(null),
      is_edli_contribution_in_ctc: new FormControl(null),
      is_admin_charges_in_ctc: new FormControl(null),
      // other controls...
    })
  }

  ngOnInit(): void {
    this.getEmployeeContibutationList();
    this.getEmployerContibutationList();

    this.activeroute.queryParams.subscribe((params: any) => {
      this.epfId = params.epf_id;

      // Fix condition: only call getEpfById if epfId exists
      if (this.epfId) {
        this.getEpfById(this.epfId);
      }
    });
  }

  getEmployeeContibutationList(){
    this.payrollService.getEmployeeContibutation().subscribe((res:any) => {
      if(res && res.data){
        this.employeeContibutationList = res.data;
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  };

  getEpfById(id:any){
    this.payrollService.getEPFbyId(id).subscribe((res:any) => {
      if(res && res.data){
        this.epfData = res.data;
        this.epfForm.patchValue(this.epfData);

        // Disable form to make all fields readonly
        // this.epfForm.disable();
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }

  getEmployerContibutationList(){
    this.payrollService.getEmployerContibutation().subscribe((res:any) => {
      if(res && res.data){
        this.employerContibutationList = res.data;
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }

  changeContribution(event:any){
    this.showContribution = event;
  }

  back(){
    window.history.back();
  }

  submitForm() {
    if (this.epfForm.invalid) {
      this.toast.error('Please fill all required fields!');
      this.epfForm.markAllAsTouched();
      return;
    }

    let payload = {
      ...this.epfForm.value,
      created_by: this.singInUser.employee_id
    };

    if (this.epfId) {
      this.updateEPF(this.epfId, payload);
    } else {
      this.createEPF(payload);
    }
  }

  createEPF(payload:any){
    this.payrollService.createEPF(payload).subscribe((res:any) => {
      if(res && res.data){
        this.toast.success('EPF created successfully!');
        this.route.navigateByUrl('master/payroll/statutory-components/EPF')
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }

  updateEPF(id:any,payload:any){
    this.payrollService.updateEPF(id,payload).subscribe((res:any) => {
      if(res && res.data){
        this.toast.success('EPF updated successfully!');
        this.route.navigateByUrl('master/payroll/statutory-components/EPF')
      }
    }, err => {
      this.toast.error(err.error.message);
    })
  }
}
