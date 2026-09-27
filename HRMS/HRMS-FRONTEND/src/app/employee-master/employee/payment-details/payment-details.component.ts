import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MustMatch } from 'src/app/@shared/validators/must-match.validator';
import { Location } from '@angular/common';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { OnboardingService } from 'src/app/@shared/services/service/recruitment/onboarding.service';
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

  constructor(
    private fb: FormBuilder,
    private activetedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private route: Router,
    private employService: EmpRegistrationService,
    private locatin: Location,
    private $onboarding: OnboardingService,
  ) { }

  paymentForm = this.fb.group(
    {
      bank_id: new FormControl(null, [Validators.required]),
      employee_name_in_bank: new FormControl(null, [Validators.required]),
      bank_address: new FormControl(null, [Validators.required]),
      account_number: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]/)]),
      re_enter_account_no: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]/)]),
      ifsc_code: new FormControl(null, ),
      swift_code: new FormControl(null,),
      iban_number: new FormControl(null,),
      // nuit_number: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]/)]),
      // bank_district_name: new FormControl(null, [Validators.required]),
      // inss_number: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]/)]),
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
      ['create-employee-module/employ/employee-create/salary-details'],
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
    
    this.$onboarding.register_onboarded_employee(req).subscribe(
      (res: any) => {
        this.employeData = res;
        this.toastr.success('Created Successfully..');
        this.route.navigate(
          ['create-employee-module/employ/employee-create/document-details',],
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
    this.employService.getAll_Active_BANK().subscribe(
      (res) => {
        this.allBanks = res.data;
      },
      (err) => {

      }
    );
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
      ifsc_code: data?.ifsc_code,
      swift_code: data?.swift_code,
      iban_number: data?.iban_number,
      // nuit_number: data?.nuit_number,
      // bank_district_name: data?.bank_district_name,
      // inss_number: data?.inss_number,
    });
  }
  Skip() {
    this.route.navigate(
      ['create-employee-module/employ/employee-create/document-details'],
      { queryParams: { employee_id: this.empId } }
    );
  }

}
