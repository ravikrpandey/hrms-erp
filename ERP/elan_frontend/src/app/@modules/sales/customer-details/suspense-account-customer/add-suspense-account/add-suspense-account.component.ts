import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { SalesService } from '../../../service/sales.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-add-suspense-account',
  templateUrl: './add-suspense-account.component.html',
  styleUrls: ['./add-suspense-account.component.scss']
})
export class AddSuspenseAccountComponent implements OnInit {

  docForm: any;
  customer_id: any;
  action_type: any;
  editData: any;
  entity_id: any;
  financial_id: any;
  bankList: any[] = [];
  
  currencyCode: string = 'INR';
  currencySymbol: string = '₹';
  currencyRate: number = 1;
  private isUpdatingCurrency: boolean = false;
  private baseAdvanceAmount: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private toast: ToastrService,
    private salesService: SalesService,
    private commonService: CommonService,
    private _finaceservice: FinaceService,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {

    this.docForm = this.fb.group({
      name: [''],
      advance_amount: ['', Validators.required],
      payment_mode: [''],
      bank: [''],
      chart_account_id: [''],
      account_name: [''],
      cheque_number: [''],
      terms_conditions: ['']
    });
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private multiplyWithPrecision(value: number, multiplier: number): number {
    return this.roundToTwoDecimals(value * multiplier);
  }

  private divideWithPrecision(value: number, divisor: number): number {
    if (divisor === 0) return 0;
    return this.roundToTwoDecimals(value / divisor);
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");
    
    this.activeRoute.queryParams.subscribe(params => {
      this.customer_id = params['id'];
      this.action_type = params['action_type'];
    });

    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        if (!currency || this.isUpdatingCurrency) return;

        this.isUpdatingCurrency = true;
        const oldRate = this.currencyRate;
        this.currencyCode = currency.Currency_Type || currency.symbols || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';

        this.updateAmountsWithCurrencyRate(oldRate);

        setTimeout(() => {
          this.isUpdatingCurrency = false;
        }, 100);
      });

    this.getBankList();
    this.getCustomerDetails();

    this.docForm.get('payment_mode')?.valueChanges.subscribe((mode: any) => {
      if (mode === 'bank') {
        this.getBankList();
        this.docForm.get('bank')?.setValidators([Validators.required]);
        this.docForm.get('account_name')?.setValidators([Validators.required]);
        this.docForm.get('cheque_number')?.setValidators([Validators.required]);
      } else {
        this.docForm.get('bank')?.clearValidators();
        this.docForm.get('account_name')?.clearValidators();
        this.docForm.get('cheque_number')?.clearValidators();
        this.docForm.patchValue({
          bank: '',
          account_name: '',
          cheque_number: ''
        });
      }
      this.docForm.get('bank')?.updateValueAndValidity();
      this.docForm.get('account_name')?.updateValueAndValidity();
      this.docForm.get('cheque_number')?.updateValueAndValidity();
    });
  }

  updateAmountsWithCurrencyRate(oldRate: number = 1) {
    if (oldRate === this.currencyRate) return;

    // Update advance amount if there is a value
    const currentAdvanceAmount = this.docForm.get('advance_amount')?.value;
    if (currentAdvanceAmount && currentAdvanceAmount > 0) {
      const baseAmount = this.divideWithPrecision(currentAdvanceAmount, oldRate);
      const newDisplayAmount = this.multiplyWithPrecision(baseAmount, this.currencyRate);
      this.docForm.patchValue({
        advance_amount: newDisplayAmount
      }, { emitEvent: false });
    }
  }

  getCustomerDetails() {
    this.salesService
      .suspenseCustomerAccountById(this.customer_id)
      .subscribe((res: any) => {
        this.editData = res.data;
        this.baseAdvanceAmount = this.editData?.advance_amount || 0;
        const advanceAmount = this.multiplyWithPrecision(this.baseAdvanceAmount, this.currencyRate);
        
        this.docForm.patchValue({
          name: this.editData?.name,
          advance_amount: advanceAmount,
          payment_mode: this.editData?.payment_mode,
          bank: this.editData?.bank_account_id,
          chart_account_id: this.editData?.chart_account_id,
          account_name: this.editData?.account_name,
          cheque_number: this.editData?.cheque_number,
          terms_conditions: this.editData?.terms_conditions
        });
        
        if (this.action_type === 'view') {
          this.docForm.disable();
        }
      });
  }

  getBankList() {
    this._finaceservice.getBankAccount(this.entity_id).subscribe((res: any) => {
      this.bankList = res.data;
    });
  }

  onBankChange(bankId: number) {
    const selectedBank = this.bankList.find(x => x.id == bankId);
    if (selectedBank) {
      this.docForm.patchValue({
        account_name: selectedBank.account_name || '',
        chart_account_id: selectedBank.chart_account_id
      });
    }
  }

  onSubmit() {
    if (this.docForm.invalid) {
      this.docForm.markAllAsTouched();
      return;
    }

    const advanceAmount = this.docForm.value.advance_amount;
    const actualAdvanceAmount = this.divideWithPrecision(advanceAmount, this.currencyRate);

    const payload = {
      id: this.customer_id,
      advance_amount: actualAdvanceAmount,
      name: this.docForm.value.name,
      payment_mode: this.docForm.value.payment_mode,
      entity_id: this.entity_id,
      financial_id: this.financial_id,
      bank_account_id: this.docForm.value.bank,
      chart_account_id: this.docForm.value.chart_account_id,
      cheque_number: this.docForm.value.cheque_number,
      terms_conditions: this.docForm.value.terms_conditions,
      tab_type: 'advance-receipt',
      currency_code: this.currencyCode,
      currency_rate: this.currencyRate
    };

    console.log('Submitting payload:', {
      currencyCode: this.currencyCode,
      currencyRate: this.currencyRate,
      advanceAmount: advanceAmount,
      actualAdvanceAmount: actualAdvanceAmount,
      payload: payload
    });

    this.commonService.showLoader();

    this.salesService.suspenseCustomerAccount(payload).subscribe({
      next: (res: any) => {
        this.commonService.hideLoader();
        if (res.code === 200) {
          this.toast.success(res.message);
          this.route.navigate(
            ['master/sales/customer-list/suspense-account-customer'],
          );
        } else {
          this.toast.error(res.message);
        }
      },
      error: (err) => {
        this.commonService.hideLoader();
        this.toast.error(
          err?.error?.message || 'Something went wrong'
        );
      }
    });
  }

  cancels() {
    this.route.navigate([
      'master/sales/customer-list/suspense-account-customer'
    ]);
  }
}