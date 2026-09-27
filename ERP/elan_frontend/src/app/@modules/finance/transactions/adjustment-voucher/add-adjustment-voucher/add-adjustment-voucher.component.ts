import { format } from 'date-fns';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SalesManagementService } from 'src/app/@modules/sales-management/sales-management-service/sales-management.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { environment } from 'src/app/environments/environment';
import { AddChartAccountComponent } from '../../../add-chart-account/add-chart-account.component';
import { LedgerPreviewService } from 'src/app/@shared/ledgerPreview/services/ledger-preview.service';

@Component({
  selector: 'app-add-adjustment-voucher',
  templateUrl: './add-adjustment-voucher.component.html',
  styleUrls: ['./add-adjustment-voucher.component.scss']
})
export class AddAdjustmentVoucherComponent {
  createJournalEntryForm: FormGroup;
  loading: boolean = false;
  maxDate: string;
  minDate: string;
  createJournalEntryItemForm: FormGroup;
  createJournalreferanceForm: FormGroup;
  totalDebit: any = 0;
  totalCredit: any = 0;
  Different: any = 0;
  journalParty: any;
  JournalAccount: any;
  redColor: boolean = false;
  employeee: boolean = false;
  journalEmployeeParty: any;
  employeeParty: any = [];
  customerParty: any = [];
  vendorParty: any = [];
  chartedAccount: any = [];
  journal_id: any;
  singleGeneral: any = [];
  partyList2: any[] = [];
  partyList1: any[] = [];
  partyNameList: any[] = [];
  accountDetailList: any;
  randomJournalNumber: any;
  paramsType: any;
  tabType: any;
  reversal: boolean = false;
  entity_id: any;
  parent_journal_no: any;
  imagePath: any;
  singleItem: any;
  isView: boolean = false;
  imageToUpload: any;
  imageUrl: any;
  handleViewImg: boolean = true;
  rowData: any;

  currencyData: any = [];
  currencyCode: string = 'INR';
  currencySymbol: string = '₹';
  currencyRate: number = 1;

  private isUpdatingCurrency: boolean = false;
  private isCalculating: boolean = false;
  originalCurrencyValues = new Map<number, any>();

  constructor(
    private fb: FormBuilder,
    public $common: CommonService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private $crm: CrmService,
    public dialog: MatDialog,
    private toast: ToastrService,
    private router: Router,
    private _finaceService: FinaceService,
    private activeroute: ActivatedRoute,
    private ledgerPreviewService: LedgerPreviewService
  ) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    this.maxDate = moment({ year: year + 100, month, date }).format('YYYY-MM-DD');
    this.minDate = moment({ year, month, date }).format('YYYY-MM-DD');

    this.createJournalEntryForm = this.fb.group({
      posting_date: [moment(new Date()).format('YYYY/MM/DD')],
      voucher_id: [null],
      financial_posting: [null],
      entity_id: [null],
      bill_number: [null],
      general_number: [null, Validators.required],
      transaction_date: [null],
      currency_id: [null],
      notes: [null],
      journalDocument: this.fb.array([this.addDoc])
    });

    this.createJournalEntryItemForm = this.fb.group({
      Account_details: this.fb.array([this.createAccountDetailGroup()])
    });

    this.createJournalreferanceForm = this.fb.group({
      reference: [null],
      reference_date: [null],
    });
  }

  customerParty1: any[] = [];
  customerParty2: any[] = [];
  financial_id: any;
  journalDocs: any;

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

  ngOnInit() {
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        if (!currency || this.isUpdatingCurrency) return;

        this.isUpdatingCurrency = true;
        const oldRate = this.currencyRate;
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || currency.symbols || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';
        this.createJournalEntryForm.get('currency_id')?.setValue(this.currencyData.Currency_Convert_id);

        this.updateDisplayAmountsWithCurrencyRate(oldRate);

        setTimeout(() => {
          this.isUpdatingCurrency = false;
        }, 100);
      });

    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");
    this.getAllVoucherData();
    this.getChartAccountList();
    this.getAllCostCenter();
    this.getAllProfitCenter();
    this.getAllVouchers();

    this._finaceService.getgeneralNumber().subscribe((res: any) => {
      this.randomJournalNumber = res.data;
      this.createJournalEntryForm.patchValue({
        general_number: this.randomJournalNumber,
      });
    });

    this.activeroute.queryParams.subscribe((params: any) => {
      this.journal_id = params.journalid;
      this.paramsType = params.actionType;
      this.isView = params.actionType === 'view' ? true : false;
      this.tabType = params.tabType;
      this.randomJournalNumber = "";

      if (this.journal_id) {
        this._finaceService.getAdjustmentJournalBYId(this.journal_id).subscribe(
          (res: any) => {
            if (res.code == 200) {
              this.singleGeneral = res.data;
              this.journalDocs = res.data?.document || [];
              this.accountDetailList = res.data?.account_detail || [];

              this.createJournalEntryForm.patchValue({
                posting_date: this.singleGeneral.posting_date,
                general_number: this.singleGeneral.document_number,
                transaction_date: this.singleGeneral.transaction_date,
                entity_id: this.entity_id,
                voucher_id: this.singleGeneral.voucher_id,
                notes: this.singleGeneral.notes,
                bill_number: this.singleGeneral.bill_number,
              });

              this.createJournalreferanceForm.patchValue({
                reference: this.singleGeneral.bill_number,
                reference_date: this.singleGeneral.transaction_date
              });

              this.vendorParty = [];
              this.employeeParty = [];
              this.customerParty = [];

              while (this.Account_details.length != 0) {
                this.Account_details.removeAt(0);
              }

              this.accountDetailList.forEach((element: any, index: any) => {
                this.AddRow();

                if (element.party_type == 'EMPLOYEE') {
                  this._finaceService.getGParty(element.party_type).subscribe((res: any) => {
                    this.employeeParty[index] = res.data;
                  });
                } else if (element.party_type == 'VENDOR') {
                  this._finaceService.getGParty(element.party_type).subscribe((res: any) => {
                    this.vendorParty[index] = res.data;
                    this.vendor2[index] = res.data.map((x: any) => x.vendor_name);
                    this.vendor3[index] = res.data;
                  });
                } else if (element.party_type == 'CUSTOMER') {
                  this._finaceService.getGParty(element.party_type).subscribe((res: any) => {
                    this.customerParty[index] = res.data;
                  });
                }

                const baseDebit = element.debit_amount || 0;
                const baseCredit = element.credit_amount || 0;

                this.originalCurrencyValues.set(index, {
                  debit_amount: baseDebit,
                  credit_amount: baseCredit
                });

                this.Account_details.controls[index]?.patchValue({
                  chart_account_id: element.chart_account_id,
                  party_type: element.party_type,
                  employee_id: element.employee_id,
                  customer_id: element.customer_id,
                  vendor_id: element.vendor_id,
                  debit_amount: this.multiplyWithPrecision(baseDebit, this.currencyRate),
                  credit_amount: this.multiplyWithPrecision(baseCredit, this.currencyRate),
                  cost_center_id: element.cost_center_id,
                  profit_center_id: element.profit_center_id,
                  id: element.id,
                  remarks: element.remarks,
                  journal_id: element.adjustment_id
                });
              });

              this.journalDocuments.clear();
              this.journalDocs.forEach((doc: any) => {
                this.addDoc();
                const index = this.journalDocuments.length - 1;
                this.journalDocuments.at(index)?.patchValue({
                  file: doc.file,
                  title: doc.title
                });
              });

              if (this.paramsType === 'edit' && this.journalDocuments.length === 0) {
                this.addDoc();
              }

              this.calculateTotals();
            } else {
              this.toast.error("Something went wrong!");
            }
          },
          (err: any) => {
            this.toast.error("Something went wrong in db!");
          }
        );
      }
    });
  }

  updateDisplayAmountsWithCurrencyRate(oldRate: number = 1) {
    if (oldRate === this.currencyRate) return;

    this.Account_details.controls.forEach((control: any, index: number) => {
      const baseValue = this.originalCurrencyValues.get(index);
      if (baseValue) {
        control.patchValue({
          debit_amount: this.multiplyWithPrecision(baseValue.debit_amount, this.currencyRate),
          credit_amount: this.multiplyWithPrecision(baseValue.credit_amount, this.currencyRate)
        }, { emitEvent: false });
      }
    });

    this.calculateTotals();
  }

  dataPass(data: any, i: any) {
    if (data.status_type == "cost_center") {
      let controls = this.Account_details.at(i) as FormArray;
      controls.get('cost_center_id')?.setValidators([Validators.required]);
      controls.get('cost_center_id')?.updateValueAndValidity();
      controls.markAllAsTouched();
      controls.get('profit_center_id')?.reset();
      controls.get('profit_center_id')?.clearValidators();
    }
    if (data.status_type == "profit_center") {
      let controls = this.Account_details.at(i) as FormArray;
      controls.get('profit_center_id')?.setValidators([Validators.required]);
      controls.get('profit_center_id')?.updateValueAndValidity();
      controls.markAllAsTouched();
      controls.get('cost_center_id')?.reset();
      controls.get('cost_center_id')?.clearValidators();
    }
  }

  getAllVoucherData = () => {
    this._configurationalMasterService.getAllVoucherData(this.entity_id).subscribe((res: any) => {
      this.rowData = res.data;
    }, (err: any) => {
      this.rowData = [];
    });
  }

  voucherData: any = [];

  getAllVouchers() {
    this._configurationalMasterService.getVouchersByID(9, this.entity_id).subscribe((res: any) => {
      this.voucherData = res.data;
    });
  }

  getAllProfitCenterData: any = [];

  getAllProfitCenter() {
    let entity_id = localStorage.getItem('selectedEntityId');
    this._finaceService.getAllProfitCenter(entity_id).subscribe((res: any) => {
      this.getAllProfitCenterData = res.data;
    });
  }

  costCenter: any = [];

  getAllCostCenter() {
    this._finaceService.getAllCostCenter(this.entity_id).subscribe((res: any) => {
      this.costCenter = res.data;
    }, ((err: any) => {
      this.costCenter = [];
    }));
  }

  vendorDetails(data: any, index: any) {
    this._finaceService.getVendorDetails(data.id).subscribe((res: any) => {
      if (res.data.length) {
        this.getCategoryData[index] = res.data;
      } else {
        this.toast.error('Category not fount on this vendor');
      }
    });
  }

  chartedAccount1: any[] = [];
  chartedAccount2: any[] = [];

  getChartAccountList() {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {
      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
      this.chartedAccount1 = this.chartedAccount.map((res: any) => res.account_name);
      this.chartedAccount2 = this.chartedAccount;
    });
  }

  openChartAccDialog() {
    const dialogRef = this.dialog.open(AddChartAccountComponent, {
      width: '700px',
      data: { isOpenDialog: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getChartAccountList();
      }
    });
  }

  accountFilter(e: any) {
    const aa = e;
    let filteredVariable = this.chartedAccount2.filter((item: any) => aa.includes(item.account_name));
    this.chartedAccount = filteredVariable;
  }

  vendor2: any[] = [];
  vendor3: any[] = [];

  vendorFilter(e: any, i: number) {
    const aa = e;
    let filteredVariable = this.vendor3[i].filter((item: any) => aa.includes(item.vendor_name));
    this.vendorParty[i] = filteredVariable;
  }

  employee2: any[] = [];
  employee3: any[] = [];

  employeeFilter(e: any) {
    const aa = e;
    let filteredVariable = this.chartedAccount2.filter((item: any) => aa.includes(item.account_name));
    this.chartedAccount = filteredVariable;
  }

  get Account_details(): FormArray {
    return this.createJournalEntryItemForm.get('Account_details') as FormArray;
  }

  createAccountDetailGroup(): any {
    const journal = this.createJournalEntryForm.get('general_number')?.value;
    return this.fb.group({
      chart_account_id: [null, Validators.required],
      party_type: [null],
      employee_id: [null],
      customer_id: [null],
      product_id: [null],
      vendor_id: [null],
      debit_amount: [null],
      credit_amount: [null],
      profit_center_id: [null],
      cost_center_id: [null],
      remarks: [null],
      journal_id: journal,
      id: null
    });
  }

  onAccountChange(): void {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {
      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
      this.chartedAccount1 = this.chartedAccount.map((res: any) => res.account_name);
      this.chartedAccount2 = this.chartedAccount;

      this.chartedAccount.forEach((element1: any) => {
        element1['hidden'] = false;
      });
      this.chartedAccount.forEach((element1: any) => {
        this.Account_details.controls.forEach((element: any, index: any) => {
          const value = this.Account_details.controls[index]?.get('chart_account_id')?.value;
          if (value == element1.id) {
            element1['hidden'] = true;
          }
        });
      });
    });
  }

  AddRow(): void {
    const newRow = this.createAccountDetailGroup();
    const index = this.Account_details.length;

    this.originalCurrencyValues.set(index, {
      debit_amount: 0,
      credit_amount: 0
    });

    this.Account_details.push(newRow);
  }

  removeRow(index: number): void {
    if (this.Account_details.length > 1) {
      this.chartedAccount.forEach((element1: any) => {
        const value = this.Account_details.controls[index]?.get('chart_account_id')?.value;
        if (value == element1.id) {
          element1['hidden'] = false;
        }
      });

      this.Account_details.removeAt(index);
      this.originalCurrencyValues.delete(index);
      this.reindexOriginalValues();
      this.calculateTotals();
    }
  }

  reindexOriginalValues() {
    const newMap = new Map();
    let newIndex = 0;
    this.originalCurrencyValues.forEach((value) => {
      newMap.set(newIndex, value);
      newIndex++;
    });
    this.originalCurrencyValues = newMap;
  }

  getCategoryData: any = [];

  getCustomerDetail(data: any, index: number) {
    this._finaceService.getCustomerCategory(data.id).subscribe((res: any) => {
      if (res.data.length) {
        this.getCategoryData[index] = res.data;
      } else {
        this.toast.error('Category Not Found On This Customer');
      }
    }, (err: any) => {});
  }

  clearDate(control: any) {
    this.createJournalEntryForm.get(control)?.reset(null);
  }

  clearDropdown(control: any, index: any) {
    this.Account_details.controls[index].get(control)?.setValue(null);
    if (control == 'chart_account_id') {
      this.onAccountChange();
    }
  }

  clearPartyDropdown(control: any, index: any) {
    this.Account_details.controls[index].get(control)?.setValue(null);
    this.Account_details.controls[index].get('employee_id')?.setValue(null);
    this.Account_details.controls[index].get('vendor_id')?.setValue(null);
  }

  clearreferenceDate(control: any) {
    this.createJournalreferanceForm.get(control)?.reset();
  }

  redirect2() {
    if (this.journal_id) {
      this.router.navigate(["/master/finance/journal-ledger/quick-entry"], { queryParams: { journalid: this.journal_id, actionType: this.paramsType } });
    } else {
      this.router.navigate(["/master/finance/journal-ledger/quick-entry"]);
    }
  }

  redirect1() {
    if (this.journal_id) {
      this.router.navigate(["/master/finance/journal-ledger/journal-entry"], { queryParams: { journalid: this.journal_id, actionType: this.paramsType } });
    } else {
      this.router.navigate(["/master/finance/journal-ledger/journal-entry"]);
    }
  }

  partyCustomer: boolean = false;
  customerType: any = [];

  onPartyTypeChange(event: any, index: any): any {
    let party: any = "";
    party = event.value;
    if (party == 'EMPLOYEE') {
      if (!Array.isArray(this.employeeParty)) {
        this.employeeParty = [];
      }
      if (!Array.isArray(this.employeeParty[index])) {
        this.employeeParty[index] = [];
      }
      this.employeeParty[index] = [];
      this._finaceService.getGParty(party).subscribe((res: any) => {
        this.journalEmployeeParty = res.data;
        this.employeeParty[index] = this.journalEmployeeParty;
      });
      this.partyCustomer = false;
    } else if (party == 'CUSTOMER') {
      if (!Array.isArray(this.customerParty)) {
        this.customerParty = [];
      }
      if (!Array.isArray(this.customerParty[index])) {
        this.customerParty[index] = [];
      }
      this.customerParty[index] = [];
      this._finaceService.getGParty(party).subscribe((res: any) => {
        let partyTypeCustomer = res.data;
        this.customerParty[index] = partyTypeCustomer;
      });
      this.partyCustomer = true;
    } else {
      if (!Array.isArray(this.vendorParty)) {
        this.vendorParty = [];
      }
      if (!Array.isArray(this.vendorParty[index])) {
        this.vendorParty[index] = [];
      }
      this.vendorParty[index] = [];
      this._finaceService.getGParty(party).subscribe((res: any) => {
        this.journalParty = res.data;
        this.vendorParty[index] = this.journalParty;
      });
    }
    this.partyCustomer = false;
  }

  get hasCustomerPartyType(): boolean {
    return this.Account_details.controls.some(control => control.get('party_type')?.value === 'CUSTOMER' || control.get('party_type')?.value === 'VENDOR');
  }

  customer2: any = [];

  employeeFilter1(e: any) {
    const aa = e;
    let filteredVariable = this.customerType.filter((item: any) => aa.includes(item.business_name));
    this.customerParty = filteredVariable;
  }

  calculateTotals(): void {
    if (this.isCalculating) return;
    this.isCalculating = true;

    let baseTotalDebit = 0;
    let baseTotalCredit = 0;

    this.Account_details.controls.forEach((element: any, index: number) => {
      const baseValues = this.originalCurrencyValues.get(index);
      if (baseValues) {
        baseTotalDebit += baseValues.debit_amount || 0;
        baseTotalCredit += baseValues.credit_amount || 0;
      }
    });

    baseTotalDebit = this.roundToTwoDecimals(baseTotalDebit);
    baseTotalCredit = this.roundToTwoDecimals(baseTotalCredit);

    this.totalDebit = this.multiplyWithPrecision(baseTotalDebit, this.currencyRate);
    this.totalCredit = this.multiplyWithPrecision(baseTotalCredit, this.currencyRate);
    this.Different = this.roundToTwoDecimals(this.totalDebit - this.totalCredit);

    this.redColor = this.Different !== 0;

    this.isCalculating = false;
  }

  calculation(event: any, control: any, index: any) {
    const key = event.key;
    if (key == 'Tab') {
      return;
    }

    const row: any = this.Account_details.at(index);
    let debitValue = Number(row.get('debit_amount')?.value || 0);
    let creditValue = Number(row.get('credit_amount')?.value || 0);

    if (control === 'debit_amount') {
      creditValue = 0;
    } else if (control === 'credit_amount') {
      debitValue = 0;
    }

    const baseDebit = this.divideWithPrecision(debitValue, this.currencyRate);
    const baseCredit = this.divideWithPrecision(creditValue, this.currencyRate);

    this.originalCurrencyValues.set(index, {
      debit_amount: baseDebit,
      credit_amount: baseCredit
    });

    this.calculateTotals();
  }

  onInputChange(event: any, control: any, index: any) {
    const row: any = this.Account_details.at(index);
    let debitValue = Number(row.get('debit_amount')?.value || 0);
    let creditValue = Number(row.get('credit_amount')?.value || 0);

    if (control === 'debit_amount') {
      creditValue = 0;
    } else if (control === 'credit_amount') {
      debitValue = 0;
    }

    const baseDebit = this.divideWithPrecision(debitValue, this.currencyRate);
    const baseCredit = this.divideWithPrecision(creditValue, this.currencyRate);

    this.originalCurrencyValues.set(index, {
      debit_amount: baseDebit,
      credit_amount: baseCredit
    });

    this.calculateTotals();
  }

  openEditMode() {
    this.reversal = true;
    this.paramsType = "edit";
    this.parent_journal_no = this.singleGeneral.journal_no;

    this.accountDetailList.forEach((element: any, index: any) => {
      if (element.debit_amount > 0) {
        element.credit_amount = element.debit_amount;
        this.Account_details.controls[index]?.get('credit_amount')?.setValue(element.debit_amount);
        this.Account_details.controls[index]?.get('debit_amount')?.setValue(0);
      } else {
        element.debit_amount = element.credit_amount;
        this.Account_details.controls[index]?.get('debit_amount')?.setValue(element.credit_amount);
        this.Account_details.controls[index]?.get('credit_amount')?.setValue(0);
      }

      let date = new Date();
      let outDate = moment(date).format("YYYY-MM-DD");
      this._finaceService.getgeneralNumber().subscribe((res: any) => {
        this.randomJournalNumber = res.data;
        this.createJournalEntryForm.patchValue({
          general_number: this.randomJournalNumber,
          posting_date: outDate
        });
      });
    });
  }

  default_currency_id: any;
  bankAccountIds: any[] = [];

  submitPublic(key: any): void {
    if (this.createJournalEntryForm.valid && this.createJournalEntryItemForm.valid) {
      this._finaceService.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_id).subscribe({
        next: (res: any) => {
          let totalDebitInINR = 0;
          let totalCreditInINR = 0;

          const accountDetails = this.Account_details.value;
          const accountDetailsInINR = accountDetails.map((item: any, index: number) => {
            const baseValues = this.originalCurrencyValues.get(index);

            let inrDebit = 0;
            let inrCredit = 0;

            if (baseValues) {
              inrDebit = baseValues.debit_amount || 0;
              inrCredit = baseValues.credit_amount || 0;
            } else {
              inrDebit = this.divideWithPrecision(item.debit_amount || 0, this.currencyRate);
              inrCredit = this.divideWithPrecision(item.credit_amount || 0, this.currencyRate);
            }

            totalDebitInINR += inrDebit;
            totalCreditInINR += inrCredit;

            return {
              ...item,
              debit_amount: this.roundToTwoDecimals(inrDebit),
              credit_amount: this.roundToTwoDecimals(inrCredit)
            };
          });

          totalDebitInINR = this.roundToTwoDecimals(totalDebitInINR);
          totalCreditInINR = this.roundToTwoDecimals(totalCreditInINR);

          let payload: any = {
            ...this.createJournalEntryForm.value,
            ...this.createJournalreferanceForm.value,
            financial_id: this.financial_id,
            entity_id: this.entity_id,
            currency_code: this.currencyCode,
            currency_rate: this.currencyRate,
            total_debit: totalDebitInINR,
            total_credit: totalCreditInINR,
            Account_details: accountDetailsInINR,
            currency_id: this.currencyData?.Currency_Convert_id || null
          };

          if (payload.Account_details) {
            payload.Account_details = payload.Account_details.map((item: any) => ({
              ...item,
              debit_amount: Number(item.debit_amount),
              credit_amount: Number(item.credit_amount)
            }));
          }

          payload.reference_date = payload.reference_date ?
            moment(payload.reference_date).format('YYYY-MM-DD') : null;
          payload.transaction_date = payload.transaction_date ?
            moment(payload.transaction_date).format('YYYY-MM-DD') : null;
          payload.posting_date = moment(new Date()).format('YYYY-MM-DD');

          Object.keys(payload).forEach(key => {
            if (payload[key] === undefined || payload[key] === null) {
              delete payload[key];
            }
          });

          this._finaceService.createAdjustmentVoucher(payload).subscribe({
            next: (res: any) => {
              if (res.data) {
                this.toast.success('Adjustment Voucher Created Successfully');
                this.router.navigate(['master/finance/transactions/adjustment-voucher']);
              }
            },
            error: (err: any) => {
              this.toast.error(err.error?.message || 'Something went wrong');
            }
          });
        },
        error: (err: any) => {
          if (err.error.code === 404) {
            this.toast.warning('This month is not active');
          } else {
            this.toast.error(err.error?.message || 'Something went wrong');
          }
        }
      });
    } else {
      this.Account_details.controls.forEach(control => {
        control.markAllAsTouched();
      });
      this.toast.error('Please fill in the required fields');
      return;
    }
  }

  viewImg(imageUrl: any) {
    window.open(environment.servralUrl + '/uploaded_files/' + imageUrl, '_blank');
  }

  uploadDoc(event: any, index: number) {
    let isValidExtension = this.$common.checkForValidFile(event);
    if (!isValidExtension) {
      return;
    }

    let data = '';
    if (event.target.files && event.target.files[0]) {
      data = event.target.files[0];
    }

    const formData = new FormData();
    formData.append('file', data);

    this.$crm.uploadDoc(formData).subscribe(
      (res: any) => {
        if (res?.url) {
          this.journalDocuments.at(index).patchValue({
            file: res.url,
            title: event.target.files[0].name,
          });
          this.handleViewImg = true;
        }
      },
      (err) => {
        if (err) {
          this.toast.error('Something went wrong');
        }
      }
    );
  }

  get journalDocuments() {
    return this.createJournalEntryForm.controls['journalDocument'] as FormArray;
  }

  addDoc() {
    const docForm = this.fb.group({
      title: [''],
      file: [''],
    });

    let index = this.journalDocuments.length - 1;
    let file = this.journalDocuments.at(index)?.value;
    if (file && !file.file) {
      this.toast.warning('Please upload file ');
      return;
    }
    this.journalDocuments.push(docForm);
  }

  onPartyTypeNameSelect() {
    this.getAllVoucherData();
  }

  remove(i: number) {
    this.journalDocuments.removeAt(i);
  }



hasAccounts(): boolean {
    return this.Account_details?.controls?.some((control: any) =>
        control.get('chart_account_id')?.value
    ) || false;
}

/**
 * Get party name from vendor/customer/employee
 */
getPartyName(index: number): string {
    const row = this.Account_details.at(index);
    const partyType = row.get('party_type')?.value;

    if (partyType === 'VENDOR') {
        const vendorId = row.get('vendor_id')?.value;
        const vendor = this.vendorParty[index]?.find((v: any) => v.id === vendorId);
        return vendor ? vendor.vendor_name : '';
    } else if (partyType === 'CUSTOMER') {
        const customerId = row.get('customer_id')?.value;
        const customer = this.customerParty[index]?.find((c: any) => c.id === customerId);
        return customer ? customer.company_name : '';
    } else if (partyType === 'EMPLOYEE') {
        const employeeId = row.get('employee_id')?.value;
        const employee = this.employeeParty[index]?.find((e: any) => e.employee_id === employeeId);
        return employee ? employee.first_name + ' ' + employee.last_name : '';
    }
    return '';
}

/**
 * Show Ledger Preview
 */
showLedgerPreview(): void {
    // Build preview data
    const previewData = this.ledgerPreviewService.buildPreviewData(
        this.createJournalEntryForm,
        this.Account_details,
        this.chartedAccount,
        this.currencySymbol,
        this.currencyCode,
        {
            title: 'Adjustment Voucher Preview',
            partyName: this.getPartyName(0),  // Show first row party
            showSubmitButton: this.paramsType !== 'view',
            isViewMode: this.paramsType === 'view'
        }
    );

    // Open dialog
    this.ledgerPreviewService.openPreview(previewData)
        .subscribe((result: any) => {
            if (result?.action === 'submit') {
                this.submitPublic('APPROVED');
            }
        });
}


}
