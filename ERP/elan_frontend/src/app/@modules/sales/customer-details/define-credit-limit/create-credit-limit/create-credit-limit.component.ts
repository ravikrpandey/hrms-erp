import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { SalesService } from '../../../service/sales.service';

@Component({
  selector: 'app-create-credit-limit',
  templateUrl: './create-credit-limit.component.html',
  styleUrls: ['./create-credit-limit.component.scss']
})
export class CreateCreditLimitComponent {
  customerProfileForm: FormGroup;
  entity_id: Number | null;
  financial_year_id: Number | null;
  customer_id: any;
  paymentTerm: any = [];
  isAdvancePayment = false;
  cname: string ="";
  dataList: any = [];

  constructor(
    private fb: FormBuilder,
    private accessData: AccessControlService,
    private location: Location,
    private toast: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private configService: ConfigurationalmasterService,
    private salesService: SalesService
  ) {
    this.customerProfileForm = this.fb.group({
      payment_term_id: new FormControl(null, [Validators.required]),
      sanctioned_credit_limit: new FormControl(null, [Validators.required]),
      sanctioned_credit_days: new FormControl(null, [Validators.required]),
      grace_period_days: new FormControl(0),
      effective_from: new FormControl(null, [Validators.required]),
      change_reason: new FormControl(null),
      utilized_credit_limit: new FormControl(0),
      available_credit_limit: new FormControl(0),
      consumed_credit_days: new FormControl(0),
      remainig_credit_days: new FormControl(0)
    });
  }

  ngOnInit() {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();

    this.activeroute.queryParams.subscribe((params: any) => {
      const [id, ...rest] = params.id.split('&');

      const obj:any = {
        id,
        ...Object.fromEntries(rest.map((x: string) => x.split('=')))
      };

      this.customer_id = parseInt(obj.id);
      this.cname = `${obj.name} - ${obj.code}`;
      if (this.customer_id) {
        this.getPaymentTermMasterList();
        this.getData();
      }
    });
  }

  getPaymentTermMasterList(){
    this.configService.getPaymentTermMasterList(this.entity_id,'ACTIVE').subscribe((res: any) => {
      this.paymentTerm = res.data;
    }, err => {
      this.paymentTerm = [];
    })
  }

  onPaymentTermChange(termId: number) {

    const selectedTerm = this.paymentTerm.find((t: { id: number; }) => t.id === termId);

    if (!selectedTerm) return;

    const creditDays = selectedTerm.credit_days || 0;

    const form = this.customerProfileForm;

    // credit period auto set
    form.patchValue({
      sanctioned_credit_days: creditDays
    });

    // ===== ADVANCE PAYMENT (0 days) =====
    if (creditDays <= 0) {
      this.isAdvancePayment = true;

      form.patchValue({
        sanctioned_credit_limit: 0,
        grace_period_days: 0,
        utilized_credit_limit: 0,
        available_credit_limit: 0,
        consumed_credit_days: 0,
        remainig_credit_days: 0
      });

    } else {
      this.isAdvancePayment = false;
    }
  }

  getData(){
    this.configService.getCreditLimitListByCustomerId(this.entity_id,this.customer_id).subscribe((res: any) => {
      this.dataList = res.data;
      let formData = res.data[0];
      if (formData) {
        this.customerProfileForm.patchValue({
          payment_term_id: formData.payment_term_id,
          sanctioned_credit_limit: formData.sanctioned_credit_limit,
          // utilized_credit_limit: formData.utilized_credit_limit,
          // available_credit_limit: formData.available_credit_limit,
          sanctioned_credit_days: formData.sanctioned_credit_days,
          grace_period_days: formData.grace_period_days,
          // consumed_credit_days: formData.consumed_credit_days,
          // remainig_credit_days: formData.remainig_credit_days,
          effective_from: formData.effective_from,
          change_reason: formData.change_reason
        });
      }
    }, err => {
      this.dataList = [];
    })
  }

  onSubmitForm() {
    if (this.customerProfileForm.invalid) {
      this.toast.error('Required fields should not be empty!', 'Fields error!');
      return;
    }

    let payload = {
      ...this.customerProfileForm.value,
      customer_id: this.customer_id,
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
    }

    this.configService.createUpdate_customerCreditLimit(payload).subscribe((res: any) => {
      if (res) {
        this.toast.success(res.message);
        this.location.back();
      }
    }, err => {
      this.toast.error(err.error.message)
    })

  }

  goBack() {
    this.location.back();
  }

}