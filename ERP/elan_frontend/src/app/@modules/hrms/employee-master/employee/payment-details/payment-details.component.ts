import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MustMatch } from 'src/app/@shared/validators/must-match.validator';
import { Location } from '@angular/common';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      // Return an error object to indicate validation failure
      return { leadingSpaces: true };
    }
    // Return null if validation passes
    return null;
  };
}
@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
})
export class PaymentDetailsComponent {
  submitted: boolean = false;
  employeData: any;
  id: any;
  empId: any;
  singlePaymentData: any;
  allBanks: any;
  action_type: any;
  entity_id: any;
  allBanks2: any;
  bankList: any;

  constructor(
    private fb: FormBuilder,
    private activetedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private route: Router,
    private employService: EmpRegistrationService,
    private locatin: Location
  ) { }

  paymentForm = this.fb.group(
    {
      bank_id: new FormControl(null, [Validators.required]),
      employee_name_in_bank: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      bank_address: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      account_number: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]/)]),
      re_enter_account_no: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]/)]),
      nuit_number: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]/)]),
      // bank_district_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      // inss_number: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]/)]),
      // bank_nib_number: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]/)]),
    },
    {
      validator: MustMatch('account_number', 're_enter_account_no'),
    }
  );
  ngOnInit(): void {
    this.entity_id = Number(localStorage.getItem('selectedEntityId'));
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.empId = params.employee_id;
      this.action_type = params.action_type;
      if (params.employee_id) {
        this.getSinglePaymentDetails(params.employee_id);
      }
    });
    this.getAllBanks();
    this.employService.setEmpTitle('PAYMENT DETAILS');
  }

  prevTab = () => {
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/salary-details'],
      { queryParams: { employee_id: this.empId } }
    );
  }


  onCreate() {

    if (this.paymentForm.invalid) {
      return this.toastr.error('Required fields should not be empty', 'Fields Error');
    }

    let val: any = this.paymentForm.value;

    let req = {
      ...val,
      tab_type: "Payment",
    }
    if (this.empId) {
      req.employee_id = this.empId;
    }

    this.employService.basicSignUp(req).subscribe(
      (res: any) => {
        this.employeData = res;
        this.toastr.success('Created Successfully..');
        this.route.navigate(
          ['master/hrms/employee-master/employ/employee-create/document-details',],
          { queryParams: { employee_id: this.empId } }
        );
      },
      (err) => {
        if (err.status === 400) {
          this.toastr.error('Failed! Email is already in use!');
        } else if (err.status == 500) {
          this.toastr.error('bad request ');
        } else if (err.status == 404) {
          this.toastr.error(
            'Somthing went wrong.. Please try agin',
            'Error Massage'
          );
        } else {
          this.toastr.error('Login failed');
        }
      }
    );
  }

  getAllBanks() {
    this.employService.getAll_Active_BANK(this.entity_id).subscribe(
      (res) => {
        this.allBanks = res.data;
        this.allBanks2 = res.data;
        this.bankList = this.allBanks.map((value:any) => value.bank_name)
      },
      (err) => {

      }
    );
  }

  bankSearch(e: any) {
    const aa = e
    let filteredVariable = this.allBanks2.filter((item: any) => aa.includes(item.bank_name));
    this.allBanks = filteredVariable
  }

  getSinglePaymentDetails(id: any) {

    this.employService.getByUserId(id).subscribe(
      (res: any) => {
        this.singlePaymentData = res.data;
        this.patchValueInPaymentForm(res.data);
      },
      (err) => {

      }
    );
  }
  patchValueInPaymentForm(data: any) {
    this.paymentForm.patchValue({
      bank_id: data?.bank_id,
      employee_name_in_bank: data?.employee_name_in_bank,
      bank_address: data?.bank_address,
      account_number: data?.account_number,
      re_enter_account_no: data?.re_enter_account_no,
      nuit_number: data?.nuit_number,
      // bank_district_name: data?.bank_district_name,
      // inss_number: data?.inss_number,
      // bank_nib_number: data?.bank_nib_number,
    });
  }
  Skip() {
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/document-details'],
      { queryParams: { employee_id: this.empId } }
    );
  }

}
