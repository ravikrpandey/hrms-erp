import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MustMatch } from 'src/app/@shared/validators/must-match.validator';
import { Location } from '@angular/common';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { environment } from 'src/app/environments/environment';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
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
  bankArr: any = [];
  bankArr2: any = [];
  baseUrl: any;

  constructor(
    private fb: FormBuilder,
    private activetedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private route: Router,
    private employService: EmpRegistrationService,
    private locatin: Location,
    private $common: CommonService,
    private $miscellaneousService: MiscellaneousService
  ) {
    this.baseUrl = environment.serverUrl;
  }

  paymentForm = this.fb.group(
    {
      attached_with_payroll: new FormControl('MAIN', [Validators.required]),
      bank_id: new FormControl(null, [Validators.required]),
      employee_name_in_bank: new FormControl(null, [Validators.required]),
      bank_address: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
      account_number: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{5,19}$/),
      ]),
      re_enter_account_no: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{5,19}$/),
      ]),
      ifsc_code: new FormControl(null),
      swift_code: new FormControl(null),
      iban_number: new FormControl(null),
      // bank_document: new FormControl(null),
      alt_bank_id: new FormControl(null),
      alt_account_holdname: new FormControl(null),
      alt_bank_address: new FormControl(null),
      alt_account_number: new FormControl(null),
      alt_re_enter_number: new FormControl(null),
      alt_IFSC_code: new FormControl(null),
      // alt_bank_document: new FormControl(null),
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
    this.paymentForm
      .get('attached_with_payroll')
      ?.valueChanges.subscribe((value) => {
        if (value === 'ALTERNATE') {
          this.disableMainBankValidators();
        } else {
          this.enableMainBankValidators();
        }
      });
    const initialValue = this.paymentForm.get('attached_with_payroll')?.value;
    if (initialValue === 'ALTERNATE') {
      this.disableMainBankValidators();
    }
  }

  disableMainBankValidators() {
    const mainFields = [
      'bank_id',
      'employee_name_in_bank',
      'bank_address',
      'account_number',
      're_enter_account_no',
    ];
    mainFields.forEach((field) => {
      this.paymentForm.get(field)?.clearValidators();
      this.paymentForm.get(field)?.updateValueAndValidity();
    });
    this.paymentForm.setValidators(null);
    this.paymentForm.updateValueAndValidity();
  }

  enableMainBankValidators() {
    this.paymentForm.get('bank_id')?.setValidators([Validators.required]);
    this.paymentForm
      .get('employee_name_in_bank')
      ?.setValidators([Validators.required]);
    this.paymentForm
      .get('bank_address')
      ?.setValidators([Validators.required, noLeadingSpaces()]);
    this.paymentForm
      .get('account_number')
      ?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{5,19}$/),
      ]);
    this.paymentForm
      .get('re_enter_account_no')
      ?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{5,19}$/),
      ]);
    const fields = [
      'bank_id',
      'employee_name_in_bank',
      'bank_address',
      'account_number',
      're_enter_account_no',
    ];
    fields.forEach((field) => {
      this.paymentForm.get(field)?.updateValueAndValidity();
    });
    this.paymentForm.updateValueAndValidity();
  }

  prevTab = () => {
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/salary-details'],
      { queryParams: { employee_id: this.empId } }
    );
  };

  onCreate() {
    if (this.paymentForm.invalid) {
      return this.toastr.error(
        'Required fields should not be empty',
        'Fields Error'
      );
    }
    let val: any = this.paymentForm.value;
    if (val.alt_bank_id === '') {
      val.alt_bank_id = null;
    }

    let req = {
      ...val,

      tab_type: 'Payment',
      bank_document: this.bank_document ? this.bank_document : '',
      alt_bank_document: this.alt_bank_document ? this.alt_bank_document : '',
    };
    if (this.empId) {
      req.employee_id = this.empId;
    }

    this.employService.basicSignUp(req).subscribe(
      (res: any) => {
        this.employeData = res;
        this.toastr.success('Created Successfully..');
        this.route.navigate(
          [
            'master/hrms/employee-master/employ/employee-create/document-details',
          ],
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

  banknamefilter: any;
  alterNateBanknamefilter: any;
  getAllBanks() {
    this.employService.getAll_Active_BANK().subscribe(
      (res) => {
        this.allBanks = res.data;
        this.banknamefilter = this.allBanks.slice();
        this.alterNateBanknamefilter = [...this.allBanks];
        this.bankArr = this.allBanks.map((res: any) => res.bank_name);
        this.bankArr2 = this.allBanks;
      },
      (err) => {}
    );
  }

  bankFilter(e: any) {
    let filteredVariable = this.bankArr2.filter((item: any) =>
      e.includes(item.bank_name)
    );
    this.allBanks = filteredVariable;
  }

  getSinglePaymentDetails(id: any) {
    this.employService.getByUserId(id).subscribe(
      (res: any) => {
        this.singlePaymentData = res.data;
        this.patchValueInPaymentForm(res.data);
      },
      (err) => {}
    );
  }
  patchValueInPaymentForm(data: any) {
    debugger;
    this.bank_document = data?.bank_document;
    this.alt_bank_document = data?.alt_bank_document;
    this.paymentForm.patchValue({
      attached_with_payroll: data?.attached_with_payroll,
      bank_id: data?.bank_id,
      employee_name_in_bank: data?.employee_name_in_bank,
      bank_address: data?.bank_address,
      account_number: data?.account_number,
      re_enter_account_no: data?.re_enter_account_no,
      ifsc_code: data?.ifsc_code,
      swift_code: data?.swift_code,
      iban_number: data?.iban_number,

      alt_bank_id: data?.alt_bank_id,
      alt_account_holdname: data?.alt_account_holdname,
      alt_bank_address: data?.alt_bank_address,
      alt_account_number: data?.alt_account_number,
      alt_re_enter_number: data?.alt_account_number,
      alt_IFSC_code: data?.alt_IFSC_code,
    });
  }
  Skip() {
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/document-details'],
      { queryParams: { employee_id: this.empId } }
    );
  }

  // File upload start
  bank_document: any;
  alt_bank_document: any;
  uploadDoc(event: any, type: any) {
    try {
      let isValidExtension = this.$common.checkForValidFile(event);
      if (!isValidExtension) {
        if (type == 'payment') {
          // this.paymentForm.patchValue({ bank_document: null });
          return (this.bank_document = '');
        } else {
          // this.paymentForm.patchValue({ alt_bank_document: null });
          return (this.alt_bank_document = '');
        }
      }
      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe(
        (response: any) => {
          if (response) {
            if (type == 'payment') {
              this.bank_document = `uploaded_files/${response?.url}`;
              // this.paymentForm.patchValue({ bank_document: this.bank_document });
            } else {
              this.alt_bank_document = `uploaded_files/${response?.url}`;
              // this.paymentForm.patchValue({ alt_bank_document: this.alt_bank_document });
            }
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  viewImg(type: any) {
    if (type == 'payment') {
      window.open(this.baseUrl + '/' + this.bank_document, '_blank');
    } else {
      window.open(this.baseUrl + '/' + this.alt_bank_document, '_blank');
    }
  }
  // File upload end
}
