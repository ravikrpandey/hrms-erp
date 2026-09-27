import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MustMatch } from 'src/app/@shared/validators/must-match.validator';

@Component({
  selector: 'app-payment-detail-form',
  templateUrl: './payment-detail-form.component.html',
  styleUrls: ['./payment-detail-form.component.scss']
})
export class PaymentDetailFormComponent {
  submitted: boolean = false;
  employeData: any;
  id: any;
  empId: any;
  singlePaymentData: any;
  allBanks: any;
  employee_ids:any
  constructor(
    private fb: FormBuilder,
    private activetedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private route: Router,
    private employService: EmpRegistrationService,
    private _empRegistration: EmpRegistrationService,
    // private locatin: Location
  ) {}

  paymentForm = this.fb.group(
    {
      bank_name: new FormControl(null ,Validators.required),
      emp_name_in_bank: new FormControl(null, Validators.required),
      branch_address: new FormControl(null, Validators.required),
      account_number: new FormControl(null, [Validators.required, Validators.maxLength(17), Validators.pattern('^[0-9]{1,17}$')]),
      reEnterName: new FormControl(null, [ Validators.required, Validators.maxLength(17), Validators.pattern('^[0-9]{1,17}$')]),
      ifsc_code: new FormControl(null, [Validators.maxLength(11), Validators.required]),
      pf_number: new FormControl(null,[Validators.pattern('([A-Z]){5}([0-9]){17}$')]),
      uan_number: new FormControl(null),
    },
    {
      validator: MustMatch('account_number', 'reEnterName'),
    }
  );
  ngOnInit(): void {
    this.empId = localStorage.getItem('employee_id');
    if (this.empId) {
      this.employee_ids = this.empId
      this.getOuterCondidateData(this.empId)
      // this.getSinglePaymentDetails(this.empId);
      
    }
    // this.activetedRoute.queryParams.subscribe((params: any) => {
    //   this.empId = params.employee_id;
    //   if (params.employee_id) {
        
    //   } else {
        
    //     // this.route.navigate(['/hrms/employee-master/employ'])
    //   }
    // });
    this.getAllBanks();
    this.employService.setEmpTitle('PAYMENT DETAILS');
  }

  onCreate() {
    console.log(this.paymentForm);
    
    if (this.paymentForm.invalid) {
      this.toastr.error("Required fields should not be empty",)
      return;
    }
    this.submitted = true;
    let val = this.paymentForm.value;
    const data: any = {
      bank_name: val.bank_name,
      empbank_id: val.bank_name,
      employee_name_in_bank: val.emp_name_in_bank,
      bank_address: val.branch_address,
      account_number: val.account_number,
      ifsc_code: val.ifsc_code,
      pf_number: val.pf_number,
      UAN_number: val.uan_number,
    };
    console.log(val);

      this.employService.updateemp_paymentAccount(this.empId, data).subscribe(
        (res: any) => {
          this.employeData = res;
          
          this.toastr.success('Updated Successfuly');
          this.route.navigate(
            [
              'new-employee-form/document-details-form',
            ],
            { queryParams: { employee_id: this.empId } }
          );
        },
        (err:any) => {
          
          this.toastr.error(err.error.message);
        }
      );
    
  }

  getAllBanks() {
    this.employService.getAllBanks().subscribe(
      (res:any) => {
        
        this.allBanks = res.data;
      },
      (err:any) => {
        
      }
    );
  }

  // getSinglePaymentDetails(id: any) {
  //   this.employService.getSinglePaymentDetails(id).subscribe(
  //     (res: any) => {
  //       this.singlePaymentData = res.data;
        
        

  //       this.patchValueInPaymentForm(res.data);
  //     },
  //     (err:any) => {
        
  //     }
  //   );
  // }
  singleData:any
  getOuterCondidateData(employee_id:any){

    this._empRegistration.getOuterEmployeeData(employee_id).subscribe((res:any)=>{
      console.log(res);
      
      this.singleData =res.data;
      console.log(this.singleData);
      
setTimeout(() => {
  this.basicFormPatch(res?.data)
}, 50);

  

    })
  

  }
  basicFormPatch(data: any) {
    this.paymentForm.patchValue({
      bank_name: +data?.bank_name,
      emp_name_in_bank: data?.employee_name_in_bank,
      branch_address: data?.bank_address,
      account_number: data?.account_number,
      reEnterName: data?.account_number,
      ifsc_code: data?.ifsc_code,
      pf_number: data?.pf_number,
      uan_number: data?.UAN_number,
    });
  }
  Skip() {
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/document-details'],
      { queryParams: { employee_id: this.empId } }
    );
  }
}
