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
import { GridReadyEvent } from 'ag-grid-community';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { LedgerPreviewService } from 'src/app/@shared/ledgerPreview/services/ledger-preview.service';

@Component({
  selector: 'app-add-cash-payment',
  templateUrl: './add-cash-payment.component.html',
  styleUrls: ['./add-cash-payment.component.scss']
})
export class AddCashPaymentComponent {
  createJournalEntryForm: FormGroup;
  loading: boolean = false;
  maxDate: string;
  minDate: string;
  createJournalEntryItemForm: FormGroup;
  createJournalreferanceForm: FormGroup;
  totalDebit: any;
  totalCredit: any;
  Different: any;
  journalParty: any;
  JournalAccount: any;
  purchase_journal_id: any;
  redColor: boolean = false;
  employeee: boolean = false;
  journalEmployeeParty: any;
  employeeParty: any = [];
  customerParty: any = [];
  vendorParty: any = [];
  chartedAccount: any = [];
  journal_id: any;
  employeePartyData: any = [];
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any = [];
  rowClass: any;
  singleGeneral: any = [];
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
  cash_payment_id: any;
  handleViewImg: boolean = true;
  isDocumentActive: boolean = false;
  IsCustomerActive: boolean = false;
  isDocumentSelected: boolean = false;
  isReferenceDocumentDisabled: boolean = false;

  currencyData: any = [];
  currencyCode: string = 'INR';
  currencySymbol: string = '₹';
  currencyRate: number = 1;

  private isUpdatingCurrency: boolean = false;
  private isCalculating: boolean = false;

  originalCurrencyValues = new Map<number, any>();
  documentValueBase: number = 0;
  amountPaidBase: number = 0;
  amountDueBase: number = 0;

  private gridDataBase: any[] = [];
  private gridApi: any;

  constructor(
    private fb: FormBuilder,
    public $common: CommonService,
    private $crm: CrmService,
    public dialog: MatDialog,
    private toast: ToastrService,
    private router: Router,
    private _finaceService: FinaceService,
    private activeroute: ActivatedRoute,
    private salesManagementService: SalesManagementService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private transport_service: TransportManagementService,
    private ledgerPreviewService: LedgerPreviewService,

  ) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    this.maxDate = moment({ year: year + 100, month, date }).format('YYYY-MM-DD');
    this.minDate = moment({ year, month, date }).format('YYYY-MM-DD');

    this.createJournalEntryForm = this.fb.group({
      posting_date: [null, Validators.required],
      entity_id: [null],
      document_number: [null, Validators.required],
      transaction_date: [null],
      branch_id: [null],
      voucher_id: [null],
      reference_number: [null],
      manage_advance: [null],
      party_type: [null],
      vendor_id: [null],
      customer_id: [null],
      employee_id: [null],
      document_type: [null],
      others: [null],
      po_id: [null],
      grn_id: [null],
      invoice_id: [null],
      sales_order_id: [null],
      delivery_order_id: [null],
      transport_id: [null],
      sales_quotation_id: [null],
      sales_invoice_id: [null],
      document_value: [null],
      amount_paid_now: [null],
      amount_due: [null],
      notes: [null],
      payment_advice_ids: [null],
      sales_journal_id: [null],
      document_number_id: [null],
      currency_id: [null],
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
  journalDocs: any = [];
  bank_reciept_id: any;

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
        this.currencyRate = Number(currency.rate);
        this.currencySymbol = currency.symbols || '₹';
        this.createJournalEntryForm.get('currency_id')?.setValue(this.currencyData.Currency_Convert_id);

        this.updateAmountsWithCurrencyRate(oldRate);
        this.updateGridWithCurrencyRate();
        this.updateColumnHeaders();

        setTimeout(() => {
          this.isUpdatingCurrency = false;
        }, 100);
      });

    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");

    this.getChartAccountList();
    this.getAllBranch();
    this.getAllProfitCenter();
    this.getAllCostCenter();
    this.getCurrency();
    this.getAllBank();
    this.getAllVouchers();
    this.getALlTransporterData();

    this.activeroute.queryParams.subscribe((params: any) => {
      this.cash_payment_id = params.id;
      this.paramsType = params.actionType;
      this.isView = params.actionType === 'view' ? true : false;
      this.tabType = params.tabType;
      this.randomJournalNumber = "";

      if (!this.cash_payment_id) {
        this.Account_details.removeAt(0);
      }

      if (this.cash_payment_id) {
        this.loadCashPaymentData();
      } else {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const posting_date = date + '/' + month + '/' + year;
        this.createJournalEntryForm.patchValue({
          entity_id: this.entity_id,
          posting_date: posting_date
        });
        this.AddRow();
      }
    });
  }

  updateGridWithCurrencyRate() {
    if (!this.gridDataBase || this.gridDataBase.length === 0) {
      return;
    }

    const updatedGridData = this.gridDataBase.map((item: any) => {
      const convertedItem = { ...item };

      const fieldsToConvert = [
        'document_value', 'tds_rate_amount',
        'amount_due', 'record_amount', 'amount_paid_now',
        'credit_amount', 'debit_amount', 'tds_amount',
        'net_amount', 'total_amount', 'grand_total'
      ];

      fieldsToConvert.forEach(field => {
        if (convertedItem[field] !== undefined && convertedItem[field] !== null) {
          const baseValue = Number(convertedItem[field]);
          if (item._isBaseCurrency) {
            convertedItem[field] = this.multiplyWithPrecision(baseValue, this.currencyRate);
          } else {
            const baseValueField = field + '_base';
            if (item[baseValueField] !== undefined) {
              convertedItem[field] = this.multiplyWithPrecision(item[baseValueField], this.currencyRate);
            }
          }
        }
      });

      convertedItem.currencyCode = this.currencyCode;
      convertedItem.currencySymbol = this.currencySymbol;
      convertedItem.currencyRate = this.currencyRate;

      return convertedItem;
    });

    this.rowData = updatedGridData;

    if (this.gridApi) {
      this.gridApi.setRowData(this.rowData);
      this.gridApi.refreshCells();
    }
  }

  setGridData(data: any[]) {
    this.gridDataBase = data.map((item: any) => {
      const baseItem = { ...item };
      const fieldsToStore = [
        'document_value', 'tds_rate_amount',
        'amount_due', 'record_amount', 'amount_paid_now',
        'credit_amount', 'debit_amount', 'tds_amount',
        'net_amount', 'total_amount', 'grand_total'
      ];

      fieldsToStore.forEach(field => {
        if (baseItem[field] !== undefined && baseItem[field] !== null) {
          const baseValueField = field + '_base';
          baseItem[baseValueField] = Number(baseItem[field]);
          baseItem._isBaseCurrency = true;
        }
      });

      return baseItem;
    });

    this.updateGridWithCurrencyRate();
  }

  updateAmountsWithCurrencyRate(oldRate: number = 1) {
    if (oldRate === this.currencyRate) return;

    this.Account_details.controls.forEach((control: any, index: number) => {
      const baseValue = this.originalCurrencyValues.get(index);
      if (baseValue && baseValue.credit_amount_inr !== undefined) {
        const newCreditAmount = this.roundToTwoDecimals(baseValue.credit_amount_inr * this.currencyRate);
        control.patchValue({
          credit_amount: newCreditAmount
        }, { emitEvent: false });
      }
    });

    if (this.documentValueBase !== undefined && this.documentValueBase !== null) {
      this.createJournalEntryForm.patchValue({
        document_value: this.roundToTwoDecimals(this.documentValueBase * this.currencyRate)
      }, { emitEvent: false });
    }

    if (this.amountPaidBase !== undefined && this.amountPaidBase !== null) {
      this.createJournalEntryForm.patchValue({
        amount_paid_now: this.roundToTwoDecimals(this.amountPaidBase * this.currencyRate)
      }, { emitEvent: false });
    }

    if (this.amountDueBase !== undefined && this.amountDueBase !== null) {
      this.createJournalEntryForm.patchValue({
        amount_due: this.roundToTwoDecimals(this.amountDueBase * this.currencyRate)
      }, { emitEvent: false });
    }

    this.calculateTotals();
  }

  updateColumnHeaders() {
    this.columnDefs = this.columnDefs.map(col => {
      if (col.headerName && typeof col.headerName === 'string') {
        const currencyPattern = /\(([A-Z]{3})\)/;
        if (currencyPattern.test(col.headerName)) {
          col.headerName = col.headerName.replace(currencyPattern, `(${this.currencyCode})`);
        }
      }
      return col;
    });

    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }
  }

  storeCurrencyBaseValue(index: number) {
    const row: any = this.Account_details.at(index);
    const currentCreditAmount = Number(row.get('credit_amount')?.value || 0);

    if (this.currencyRate !== 0) {
      const inrCredit = currentCreditAmount / this.currencyRate;
      this.originalCurrencyValues.set(index, {
        credit_amount_inr: inrCredit
      });
    }
  }

  calculateTotals(): void {
    if (this.isCalculating) return;
    this.isCalculating = true;

    let totalCreditInINR = 0;

    this.Account_details.controls.forEach((element: any, index: number) => {
      const baseValues = this.originalCurrencyValues.get(index);
      if (baseValues) {
        totalCreditInINR += baseValues.credit_amount_inr || 0;
      }
    });

    totalCreditInINR = this.roundToTwoDecimals(totalCreditInINR);
    this.totalCredit = this.roundToTwoDecimals(totalCreditInINR * this.currencyRate);
    this.totalDebit = 0;
    this.Different = this.roundToTwoDecimals(this.totalCredit);

    if (this.Different < 0 || this.Different > 0) {
      this.redColor = true;
    } else {
      this.redColor = false;
    }

    this.isCalculating = false;
  }

  isPartyDisabled(): boolean {
    return this.isDocumentActive || this.isDocumentSelected || this.isReferenceDocumentDisabled;
  }

  loadCashPaymentData() {
    this._finaceService.getCashPaymentById(this.cash_payment_id).subscribe((res: any) => {
      if (res.code == 200) {
        this.singleGeneral = res.data;
        this.journalDocs = res.data.journalDocument || [];
        this.accountDetailList = res.data.Account_details || [];
        this.parent_journal_no = this.singleGeneral.parent_journal_no;

        if (this.singleGeneral.payment_advice_ids) {
          this.isDocumentActive = true;
          this.isDocumentSelected = true;
          this.isReferenceDocumentDisabled = true;
        }

        this.partyTypeCheck = this.singleGeneral.party_type || '';

        this.loadPartyData();

        this.documentValueBase = this.singleGeneral.document_value || 0;
        this.amountPaidBase = this.singleGeneral.amount_paid_now || 0;
        this.amountDueBase = this.singleGeneral.amount_due || 0;

        this.createJournalEntryForm.patchValue({
          posting_date: this.singleGeneral.posting_date,
          document_number: this.singleGeneral.document_number,
          transaction_date: this.singleGeneral.transaction_date,
          entity_id: this.entity_id,
          branch_id: this.singleGeneral.branch_id,
          transport_id: this.singleGeneral.transport_id,
          notes: this.singleGeneral.notes,
          voucher_id: this.singleGeneral.voucher_list_id,
          party_type: this.singleGeneral.party_type,
          customer_id: this.singleGeneral.customer_id,
          vendor_id: this.singleGeneral.vendor_id,
          employee_id: this.singleGeneral.employee_id,
          document_type: this.singleGeneral.document_type,
          reference_number: this.singleGeneral.reference_number,
          others: this.singleGeneral.others,
          po_id: this.singleGeneral.po_id,
          grn_id: this.singleGeneral.grn_id,
          invoice_id: this.singleGeneral.invoice_id,
          sales_order_id: this.singleGeneral.sales_order_id,
          delivery_order_id: this.singleGeneral.delivery_order_id,
          sales_invoice_id: this.singleGeneral.sales_invoice_id,
          payment_advice_ids: this.singleGeneral.payment_advice_ids,
          document_number_id: this.singleGeneral.document_number_id,
          document_value: this.roundToTwoDecimals(this.documentValueBase * this.currencyRate),
          amount_paid_now: this.roundToTwoDecimals(this.amountPaidBase * this.currencyRate),
          amount_due: this.roundToTwoDecimals(this.amountDueBase * this.currencyRate),
          manage_advance: this.singleGeneral.manage_advance == 1 ? true : false
        });

        this.createJournalreferanceForm.patchValue({
          reference: this.singleGeneral.cheque_ref_no,
          reference_date: this.singleGeneral.cheque_ref_date
        });

        this.totalDebit = this.singleGeneral.total_of_debit;
        this.totalCredit = this.singleGeneral.total_of_credit;
        this.Different = this.singleGeneral.different;
        this.redColor = (this.Different < 0 || this.Different > 0);

        this.loadAccountDetails();

        this.loadDocuments();

        if (this.singleGeneral.historyData) {
          this.setGridData(this.singleGeneral.historyData);
        }
      }
    }, (err) => {
      this.toast.error("Something went wrong in db!");
    });
  }

  loadPartyData() {
    if (this.partyTypeCheck === 'CUSTOMER') {
      this.IsCustomerActive = true;
      this._finaceService.getGParty('CUSTOMER').subscribe((res: any) => {
        this.customerPartyData = res.data;
      });
    } else if (this.partyTypeCheck === 'VENDOR') {
      this.IsCustomerActive = false;
      this._finaceService.getGParty('VENDOR').subscribe((res: any) => {
        this.vendorPartyData = res.data;
      });
    } else if (this.partyTypeCheck === 'EMPLOYEE') {
      this.IsCustomerActive = false;
      this._finaceService.getGParty('EMPLOYEE').subscribe((res: any) => {
        this.employeePartyData = res.data;
      });
    }
  }

  loadAccountDetails() {
    this.vendorParty = [];
    this.employeeParty = [];
    this.customerParty = [];

    this.accountDetailList.forEach((element: any, index: any) => {
      if (index < this.accountDetailList.length - 1) {
        this.AddRow();
      }

      const baseCreditAmount = element.credit_amount || 0;
      this.originalCurrencyValues.set(index, {
        credit_amount_inr: baseCreditAmount
      });

      const displayCredit = this.roundToTwoDecimals(baseCreditAmount * this.currencyRate);

      if (element.party_type == 'EMPLOYEE') {
        this._finaceService.getGParty(element.party_type).subscribe((res: any) => {
          this.journalEmployeeParty = res.data;
          this.employeeParty[index] = this.journalEmployeeParty;
          this.patchAccountRow(element, index, displayCredit);
        });
      } else if (element.party_type == 'VENDOR') {
        this._finaceService.getGParty(element.party_type).subscribe((res: any) => {
          this.journalParty = res.data;
          this.vendorParty[index] = this.journalParty;
          this.vendor2[index] = res.data.map((x: any) => x.vendor_name);
          this.vendor3[index] = this.vendorParty[index];
          this.patchAccountRow(element, index, displayCredit);
        });
      } else if (element.party_type == 'CUSTOMER') {
        this._finaceService.getGParty(element.party_type).subscribe((res: any) => {
          this.customerParty[index] = res.data;
          this.customerParty1[index] = res.data.map((x: any) => x.business_name);
          this.customerParty2[index] = res.data;
          this.patchAccountRow(element, index, displayCredit);
        });
      } else {
        this.patchAccountRow(element, index, displayCredit);
      }
    });
  }

  patchAccountRow(element: any, index: number, displayCredit: number) {
    this.Account_details.controls[index]?.patchValue({
      chart_account_id: element.chart_account_id,
      party_type: element.party_type,
      employee_id: element.employee_id,
      customer_id: element.customer_id,
      vendor_id: element.vendor_id,
      credit_amount: displayCredit,
      bank_id: element.bank_id,
      profit_center_id: element.profit_center_id,
      cost_center_id: element.cost_center_id,
      currency_id: element.currency_id,
      narration: element.narration,
      journal_id: this.journal_id,
      remarks: element.remarks,
      id: element.id
    });
  }

  loadDocuments() {
    this.journalDocuments.clear();
    for (let doc of this.journalDocs) {
      this.addDoc();
      let index = this.journalDocuments.length - 1;
      this.journalDocuments.at(index)?.patchValue({ file: doc.upload_doc });
    }
    if (this.paramsType === 'edit' && this.journalDocuments.length === 0) {
      this.addDoc();
    }
  }

  clearData(control: any) {
    this.createJournalEntryForm.get(control)?.setValue(null);

    if (control === 'payment_advice_ids') {
      this.isDocumentActive = false;
      this.isDocumentSelected = false;
      this.isActiveTransport = false;
      this.isReferenceDocumentDisabled = false;
      this.partyTypeCheck = '';
      this.IsCustomerActive = false;
      this.paymentAdviceData = [];
      this.createJournalEntryForm.patchValue({
        party_type: null,
        vendor_id: null,
        customer_id: null,
        employee_id: null,
        document_type: null,
        document_number_id: null,
        transport_id: null,
        document_value: null,
        amount_paid_now: null,
        amount_due: null
      });
      const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
      const row = accountDetailsArray.at(0) as FormGroup;
      if (row) {
        row.get('credit_amount')?.reset();
      }
      this.isChecked = false;
      this.historyData = [];
      this.toast.info('Reference document cleared. You can now select party manually.');
    } else if (control === 'party_type') {
      this.createJournalEntryForm.patchValue({
        vendor_id: null,
        customer_id: null,
        employee_id: null
      });
      this.partyTypeCheck = '';
    } else if (control === 'vendor_id') {
      this.vendor_id = null;
      this.isChecked = false;
      this.documentType = null;
    } else if (control === 'customer_id') {
      this.customer_id = null;
      this.isChecked = false;
      this.documentType = null;
    } else if (control === 'employee_id') {
      this.createJournalEntryForm.patchValue({
        employee_id: null
      });
    } else if (control === 'document_type') {
      this.documentType = null;
      this.getAllAdvanceData = [];
      this.isChecked = false;
    } else if (control === 'po_id' || control === 'grn_id' || control === 'invoice_id') {
      this.isChecked = false;
      this.historyData = [];
      this.createJournalEntryForm.patchValue({
        document_value: null,
        amount_paid_now: null,
        amount_due: null
      });
    }
  }

  partyTypeCheck: any = '';
  vendorPartyData: any = [];
  customerPartyData: any = [];

  onPartyTypeChangeAdvance(event: any): any {
    if (this.isPartyDisabled()) {
      this.toast.warning('Cannot change party when reference document is selected. Clear the reference document first.');
      this.createJournalEntryForm.get('party_type')?.setValue(this.partyTypeCheck);
      return;
    }

    this.partyTypeCheck = event.value;
    this.documentType = '';
    let party: any = event.value;

    if (party === 'CUSTOMER') {
      this.IsCustomerActive = true;
      this._finaceService.getGParty(party).subscribe((res: any) => {
        this.customerPartyData = res.data;
      });
      this.partyCustomer = true;
      this.createJournalEntryForm.patchValue({
        vendor_id: null,
        employee_id: null
      });
    } else if (party === 'VENDOR') {
      this.IsCustomerActive = false;
      this._finaceService.getGParty(party).subscribe((res: any) => {
        this.vendorPartyData = res.data;
      });
      this.partyCustomer = false;
      this.createJournalEntryForm.patchValue({
        customer_id: null,
        employee_id: null
      });
    } else if (party === 'EMPLOYEE') {
      this.IsCustomerActive = false;
      this._finaceService.getGParty(party).subscribe((res: any) => {
        this.employeePartyData = res.data;
      });
      this.partyCustomer = false;
      this.createJournalEntryForm.patchValue({
        vendor_id: null,
        customer_id: null
      });
    }
  }

  isActiveTransport:boolean = false

  getPaymentAdvice(item: any) {
    this.isDocumentActive = true;
    this.isDocumentSelected = true;
    this.isReferenceDocumentDisabled = true;
    this.isChecked = true;

    if(this.typeValue?.type=='Transport'){
      this.isActiveTransport=true
    }else{
      this.isActiveTransport=false
    }

    this.createJournalEntryForm.patchValue({
      reference_number: item.document_number,
      document_number_id: item.id
    });

    const expenseTypes = ['travel_expense', 'other_expense', 'Reimbursement_expense'];

    if (expenseTypes.includes(item.type)) {
      this.partyTypeCheck = 'EMPLOYEE';
      this.IsCustomerActive = false;
      this.isDocumentActive = true;

      this._finaceService.getGParty('EMPLOYEE').subscribe((res: any) => {
        this.employeePartyData = res.data;
      });

      this._finaceService.getPaymentAmountBYpaymentAdvoiceId(item.id, this.typeValue?.type).subscribe((res: any) => {
        if (!res?.data || (Array.isArray(res.data) && res.data.length === 0)) {
          this.partyTypeCheck = '';
          this.isDocumentActive = false;
          this.isReferenceDocumentDisabled = false;
          setTimeout(() => {
             this.createJournalEntryForm.patchValue({
           transport_id: res.data.transport_id || null,
           })
          }, 100);
          return this.toast.warning(res?.message || 'Amount Already Paid');
        }

        const data = Array.isArray(res.data) ? res.data[0] : res.data;

        const documentValue = Number(data.amount || item.amount || item.debit_amount || 0);
        const amountPaidNow = Number(data.amount_paid || 0);
        const amountDue = documentValue - amountPaidNow;

        this.documentValueBase = documentValue;
        this.amountPaidBase = amountPaidNow;
        this.amountDueBase = amountDue;

        this.createJournalEntryForm.patchValue({
          party_type: data.party_type || 'EMPLOYEE',
          employee_id: data.employee_id || null,
          vendor_id: data.vendor_id || null,
          customer_id: data.customer_id || null,
          transport_id: res.data.transport_id || null,
          document_value: this.roundToTwoDecimals(documentValue * this.currencyRate),
          amount_paid_now: this.roundToTwoDecimals(amountPaidNow * this.currencyRate),
          amount_due: this.roundToTwoDecimals(amountDue * this.currencyRate)
        });

        if (data.vendor_id) {
          this.partyTypeCheck = 'VENDOR';
        } else if (data.employee_id) {
          this.partyTypeCheck = 'EMPLOYEE';
        } else if (data.customer_id) {
          this.partyTypeCheck = 'CUSTOMER';
        }

        const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
        const row = accountDetailsArray.at(0) as FormGroup;
        if (row) {
          row.patchValue({
            credit_amount: this.roundToTwoDecimals(documentValue * this.currencyRate)
          });
        }
        this.calculateTotals();
      });
      return;
    }

    if (item.vendor_id) {
      this._finaceService.getVendorDataByTds(item.vendor_id).subscribe((res: any) => {
        if (!res.data?.length) {
          return this.toast.warning('TDS Not Mapped On This Vendor');
        } else {
          this.getAllTdsSection = res.data;
        }
      });
    }

    this.vendor_id = item.vendor_id;

    this._finaceService.getPaymentAmountBYpaymentAdvoiceId(item.id, this.typeValue?.type).subscribe((res: any) => {
      if (!res?.data || (Array.isArray(res.data) && res.data.length === 0)) {
        this.IsCustomerActive = false;
        this.partyTypeCheck = '';
        this.isDocumentActive = false;
        this.isReferenceDocumentDisabled = false;

        return this.toast.warning(res?.message || 'Amount Already Paid');
      }
      this.historyData = res?.historyData;
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      const documentValue = Number(data.document_value);
      const amountPaidNow = Number(data.amount_paid || 0);
      const amountDue = Number(data.amount_due || 0);

      this.documentValueBase = documentValue;
      this.amountPaidBase = amountPaidNow;
      this.amountDueBase = amountDue;

      this.createJournalEntryForm.patchValue({
        document_value: this.roundToTwoDecimals(documentValue * this.currencyRate),
        amount_paid_now: this.roundToTwoDecimals(amountPaidNow * this.currencyRate),
        amount_due: this.roundToTwoDecimals(amountDue * this.currencyRate)
      });

      setTimeout(() => {
             this.createJournalEntryForm.patchValue({
           transport_id: res.data?.transport_id || null,
           })
          }, 100);

      if (data.vendor_id) {
        this.partyTypeCheck = 'VENDOR';
        this.IsCustomerActive = false;
        this.isDocumentActive = true;
        this.createJournalEntryForm.patchValue({
          party_type: 'VENDOR',
          vendor_id: data.vendor_id,
          customer_id: null,
          employee_id: null
        });
        this._finaceService.getGParty('VENDOR').subscribe((res: any) => {
          this.vendorPartyData = res.data;
        });
      } else if (data.customer_id && data.party_type == 'CUSTOMER') {
        this.partyTypeCheck = 'CUSTOMER';
        this.IsCustomerActive = true;
        this.isDocumentActive = true;
        this.createJournalEntryForm.patchValue({
          party_type: 'CUSTOMER',
          customer_id: data.customer_id,
          vendor_id: null,
          employee_id: null
        });
        this._finaceService.getGParty('CUSTOMER').subscribe((res: any) => {
          this.customerPartyData = res.data;
        });
      } else if (data.employee_id) {
        this.partyTypeCheck = 'EMPLOYEE';
        this.IsCustomerActive = false;
        this.isDocumentActive = true;
        this.createJournalEntryForm.patchValue({
          party_type: 'EMPLOYEE',
          employee_id: data.employee_id,
          vendor_id: null,
          customer_id: null
        });
        this._finaceService.getGParty('EMPLOYEE').subscribe((res: any) => {
          this.employeePartyData = res.data;
        });
      }

      if (this.historyData && this.historyData.length > 0) {
        const gridDataWithBase = this.historyData.map((row: any) => {
          const baseRow = { ...row };
          ['document_value', 'tds_rate_amount', 'amount_due', 'record_amount'].forEach(field => {
            if (baseRow[field] !== undefined && baseRow[field] !== null) {
              baseRow[field + '_base'] = Number(baseRow[field]);
              baseRow._isBaseCurrency = true;
            }
          });
          return baseRow;
        });
        this.setGridData(gridDataWithBase);
      }

      const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
      const row = accountDetailsArray.at(0) as FormGroup;
      this.calculateTotals();
    });
  }

  recordData: any = [];
  paymentHistoryData: any = [];

  getDataBYId(event: any) {
    if (event.value) {
      let payload = {
        proforma_id: event.value,
        customer_id: this.customer_id,
        documentType: this.documentType,
        entity_id: this.entity_id
      };

      this._finaceService.customerRecordPayment(payload).subscribe((res: any) => {
        this.recordData = res.data;
        this.paymentHistoryData = res?.historyData;

        let amount_paid = this.paymentHistoryData.reduce((acc: number, res: any) => {
          return acc + parseFloat(res.record_amount) || 0;
        }, 0);

        this.documentValueBase = parseFloat(this.recordData?.grant_total) || 0;
        this.amountPaidBase = amount_paid;
        this.amountDueBase = this.paymentHistoryData[this.paymentHistoryData.length - 1]?.amount_due || res.data.amount_due;

        this.createJournalEntryForm.patchValue({
          document_value: this.roundToTwoDecimals(this.documentValueBase * this.currencyRate),
          amount_due: this.roundToTwoDecimals(this.amountDueBase * this.currencyRate),
          amount_paid_now: this.roundToTwoDecimals(this.amountPaidBase * this.currencyRate),
        });

        if (this.paymentHistoryData && this.paymentHistoryData.length > 0) {
          const gridDataWithBase = this.paymentHistoryData.map((row: any) => {
            const baseRow = { ...row };
            ['document_value', 'tds_rate_amount', 'amount_due', 'record_amount'].forEach(field => {
              if (baseRow[field] !== undefined && baseRow[field] !== null) {
                baseRow[field + '_base'] = Number(baseRow[field]);
                baseRow._isBaseCurrency = true;
              }
            });
            return baseRow;
          });
          this.setGridData(gridDataWithBase);
        }
      }, (err) => {
        return this.toast.error(err.error.message);
      });
    }
  }

  branch_id: any;
  isCustomerRefund: boolean = true;

  getBranchId(event: any) {
    this.branch_id = event.value;
    this.createJournalEntryForm.get('voucher_id')?.reset();
    this.createJournalEntryForm.get('document_number')?.reset();
  }

  getVoucherId(item: any) {
    let payload = {
      branch_id: this.branch_id,
      voucher_id: item.id
    };
    this._finaceService.generatecashPaymentNumber(payload).subscribe((res: any) => {
      if (res) {
        this.createJournalEntryForm.patchValue({
          document_number: res.data
        });
      }
    });

    if (item.voucher_name == 'Customer Refund') {
      this.partyTypeCheck = 'CUSTOMER';
      this.isCustomerRefund = false;
      this.IsCustomerActive = true;
      this._finaceService.getGParty('CUSTOMER').subscribe((res: any) => {
        this.customerPartyData = res.data;
      });
    } else if (item.voucher_name == 'Employee Payment') {
      this.partyTypeCheck = 'EMPLOYEE';
      this.isCustomerRefund = false;
      this.IsCustomerActive = false;
      this._finaceService.getGParty('EMPLOYEE').subscribe((res: any) => {
        this.employeePartyData = res.data;
      });
    } else {
      this.partyTypeCheck = '';
      this.isCustomerRefund = true;
      this.IsCustomerActive = false;
    }
  }

  voucherData: any = [];
  getAllVouchers() {
    this._configurationalMasterService.getVouchersByID(5, this.entity_id).subscribe((res: any) => {
      this.voucherData = res.data;
    });
  }

  getBank: any = [];
  getAllBank() {
    this._finaceService.getBankList(this.entity_id).subscribe((res: any) => {
      if (res) {
        this.getBank = res.data;
      }
    });
  }

  back() {
    this.router.navigate(['/master/finance/transactions/cash-payment']);
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

  getAllBranchData: any = [];
  getAllBranch() {
    this._configurationalMasterService.getListBranchSetup().subscribe((res: any) => {
      this.getAllBranchData = res.data;
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

  getCurrencyData: any = [];
  getCurrency() {
    this._configurationalMasterService.CurrencyList().subscribe((res: any) => {
      this.getCurrencyData = res.data;
    }, (err: any) => {
      this.getCurrencyData = [];
    });
  }

  chartedAccount1: any[] = [];
  chartedAccount2: any[] = [];

  getChartAccountList() {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {
      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no' && element.marks_cash_account == 'Cash');
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
    const journal = this.createJournalEntryForm.get('document_number')?.value;
    return this.fb.group({
      chart_account_id: [null, Validators.required],
      party_type: [null],
      employee_id: [null],
      customer_id: [null],
      product_id: [null],
      vendor_id: [null],
      credit_amount: [null],
      profit_center_id: [null],
      cost_center_id: [null],
      currency_id: [null],
      nature: [null],
      nature_id: [null],
      tds_id: [null],
      tds_rate: [null],
      tds_rate_amount: [null],
      remarks: [null],
      journal_id: journal,
      id: null
    });
  }

  onAccountChange(): void {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {
      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no' && element.marks_cash_account == 'Cash');
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
      credit_amount_inr: 0
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

  get hasCustomerPartyType(): boolean {
    return this.Account_details.controls.some(control => control.get('party_type')?.value === 'CUSTOMER' || control.get('party_type')?.value === 'VENDOR');
  }

  customer2: any = [];

  employeeFilter1(e: any) {
    const aa = e;
    let filteredVariable = this.customerType.filter((item: any) => aa.includes(item.business_name));
    this.customerParty = filteredVariable;
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

  calculation(event: any, control: any, index: any) {
    const key = event.key;
    if (key == 'Tab') {
      return;
    }
    const value = parseFloat('00:0');
    if (control == 'debit_amount') {
      this.Account_details.controls[index]?.get('credit_amount')?.setValue(value);
    }
    if (control == 'credit_amount') {
      this.Account_details.controls[index]?.get('debit_amount')?.setValue(value);
    }

    this.totalDebit = "";
    this.totalCredit = "";
    this.Different = "";
    this.Account_details.controls.forEach((element: any) => {
      this.totalDebit = Number(this.totalDebit) + Number(element.controls.debit_amount.value);
      this.totalCredit = Number(this.totalCredit) + Number(element.controls.credit_amount.value);
      this.Different = Number(this.totalDebit) - Number(this.totalCredit);
      if (this.totalCredit) {
        this.Account_details.controls[index]?.get('debit_amount')?.setValue(value);
      }
    });

    if (this.Different < 0 || this.Different > 0) {
      this.redColor = true;
    } else {
      this.redColor = false;
    }

    this.storeCurrencyBaseValue(index);
    this.calculateTotals();
  }

  calculations(event: any, field: string, index: number): void {
    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
    const row = accountDetailsArray.at(index) as FormGroup;

    const credit_amount = +row.get('credit_amount')?.value || 0;
    const tdsRate = +row.get('tds_rate')?.value || 0;

    const documentValueBase = this.documentValueBase || 0;
    const amountPaidBase = this.amountPaidBase || 0;

    let totalCreditEnteredCurrent = 0;
    this.Account_details.controls.forEach((ctrl: any) => {
      const credit = +ctrl.get('credit_amount')?.value || 0;
      totalCreditEnteredCurrent += credit;
    });

    const totalCreditEnteredBase = totalCreditEnteredCurrent / this.currencyRate;
    let newAmountDueBase = documentValueBase - amountPaidBase - totalCreditEnteredBase;

    if (newAmountDueBase < 0) {
      newAmountDueBase = 0;
    }

    this.amountDueBase = newAmountDueBase;

    this.createJournalEntryForm.patchValue({
      amount_due: this.roundToTwoDecimals(newAmountDueBase * this.currencyRate)
    }, { emitEvent: false });

    const maximumThreshold = +this.maximum_credit || 0;
    const totalPayableBase = amountPaidBase + totalCreditEnteredBase;

    let tdsAmountBase = 0;
    if (totalPayableBase > maximumThreshold) {
      const taxableAmount = totalPayableBase - maximumThreshold;
      const applicableAmount = amountPaidBase >= maximumThreshold ? totalCreditEnteredBase : taxableAmount;
      tdsAmountBase = (applicableAmount * tdsRate) / 100;
    }

    const tdsAmountCurrent = this.roundToTwoDecimals(tdsAmountBase * this.currencyRate);

    row.patchValue({
      tds_rate_amount: this.roundToTwoDecimals(tdsAmountCurrent)
    }, { emitEvent: false });

    this.storeCurrencyBaseValue(index);
    this.calculateTotals();
  }

  getTds(event: any, i: any) {
    if (event.value == 'yes') {
      this.Account_details.controls[i]?.get('tds_rate')?.enable();
      this.Account_details.controls[i]?.get('tds_rate_amount')?.enable();
    } else {
      this.Account_details.controls[i]?.get('tds_rate')?.disable();
      this.Account_details.controls[i]?.get('tds_rate_amount')?.disable();
      this.Account_details.controls[i]?.get('tds_rate_amount')?.reset();
      this.Account_details.controls[i]?.get('tds_rate')?.reset();
    }
  }

  surcharge(event: any, i: any) {
    if (event.value == 'yes') {
      this.Account_details.controls[i]?.get('surcharge_rate_amount')?.enable();
      this.Account_details.controls[i]?.get('surcharge_rate')?.enable();
    } else {
      this.Account_details.controls[i]?.get('surcharge_rate_amount')?.disable();
      this.Account_details.controls[i]?.get('surcharge_rate')?.disable();
      this.Account_details.controls[i]?.get('surcharge_rate_amount')?.reset();
      this.Account_details.controls[i]?.get('surcharge_rate')?.reset();
    }
  }

  cessAmount(event: any, i: any) {
    if (event.value == 'yes') {
      this.Account_details.controls[i]?.get('cess_rate_amount')?.enable();
      this.Account_details.controls[i]?.get('cess_rate')?.enable();
    } else {
      this.Account_details.controls[i]?.get('cess_rate_amount')?.disable();
      this.Account_details.controls[i]?.get('cess_rate')?.disable();
      this.Account_details.controls[i]?.get('cess_rate_amount')?.reset();
      this.Account_details.controls[i]?.get('cess_rate')?.reset();
    }
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
          document_number: this.randomJournalNumber,
          posting_date: outDate
        });
      });
    });
  }

  default_currency_id: any;
  bankAccountIds: any[] = [];

  submitPublic(key: any): void {
    this.$common.showLoader();

    if (this.createJournalEntryForm.valid && this.createJournalEntryItemForm.valid) {
      this._finaceService.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_id).subscribe({
        next: (res: any) => {
          let totalCreditInINR = 0;

          const accountDetails = this.Account_details.value;
          const accountDetailsInINR = accountDetails.map((item: any, index: number) => {
            const baseValues = this.originalCurrencyValues.get(index);
            if (baseValues && baseValues.credit_amount_inr !== undefined) {
              const inrCredit = baseValues.credit_amount_inr;
              totalCreditInINR += inrCredit;

              return {
                ...item,
                credit_amount: this.roundToTwoDecimals(inrCredit)
              };
            }
            const inrCredit = (item.credit_amount || 0) / this.currencyRate;
            totalCreditInINR += inrCredit;

            return {
              ...item,
              credit_amount: this.roundToTwoDecimals(inrCredit)
            };
          });

          totalCreditInINR = this.roundToTwoDecimals(totalCreditInINR);

          let paylod = {
            ...this.createJournalreferanceForm.value,
            ...this.createJournalEntryForm.value,
            ...this.createJournalEntryItemForm.value,
            financial_id: this.financial_id,
            entity_id: this.entity_id,
            currency_code: this.currencyCode,
            currency_rate: this.currencyRate,
            document_value: this.documentValueBase,
            amount_paid_now: this.amountPaidBase,
            amount_due: this.amountDueBase,
            total_of_credit: totalCreditInINR,
            Account_details: accountDetailsInINR
          };

          paylod.transaction_date = moment(this.createJournalEntryForm.value.transaction_date).format('YYYY-MM-DD');
          paylod.posting_date = moment(new Date()).format('YYYY-MM-DD');

          if (paylod.journalDocument == null) {
            paylod.journalDocument = [];
          }
          paylod.journalDocument = this.createJournalEntryForm.value.journalDocument;

          this.bankAccountIds = [];
          this._finaceService.createCashPayment(paylod).subscribe((response: any) => {
            if (response) {
              this.toast.success('Cash Payment Created Successfully');
              this.router.navigate(['master/finance/transactions/cash-payment']);
              this.$common.hideLoader();
            } else {
              this.$common.hideLoader();
            }
          });
        },
        error: (err: any) => {
          this.$common.hideLoader();
          if (err.error.code === 404) {
            this.$common.hideLoader();
            this.toast.warning('This month is not active');
          }
        }
      });
    }
  }

  viewImg(imageUrl: any) {
    console.log(this.journalDocuments);
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

  remove(i: number) {
    this.journalDocuments.removeAt(i);
  }

  vendor_id: any;
  maximum_credit: any;
  threshold_limits: any;

  getVendorData(data: any) {
    this.vendor_id = data.id;
    this._finaceService.getVendorDataByTds(this.vendor_id).subscribe((res: any) => {
      console.log(res.data);

      if (!res.data?.length) {
        return this.toast.warning('TDS Not Mapped On This Vendor');
      } else {
        this.getAllTdsSection = res.data;
        const row = this.Account_details.at(0) as FormGroup;

        this._finaceService.getTdsNatureOfTransaction(res.data[0].nature_id, this.vendor_id).subscribe((res: any) => {
          console.log(res.data);
          this.getAllNatureOfTrsanction[0] = res.data;
          this.maximum_credit = +res.data[0].maximum_amount;
          this.threshold_limits = +res.data[0]?.threshold_limit;
        });
      }
    });
  }

  documentType: any = '';
  getAllAdvanceData: any;
  payload: any;

  getAllDocumentType(event: any) {
    this.documentType = event.value;
    if (this.documentType !== 'OTHERS') {
      if (this.partyTypeCheck == 'VENDOR') {
        this.payload = {
          vendor_id: this.createJournalEntryForm.value.vendor_id,
          document_type: this.createJournalEntryForm.value.document_type,
          entity_id: this.entity_id
        };
      } else {
        this.payload = {
          customer_id: this.createJournalEntryForm.value.customer_id,
          document_type: this.createJournalEntryForm.value.document_type,
          entity_id: this.entity_id
        };
      }
      this._finaceService.getAllPoGrnSoByVendorId(this.payload).subscribe((res: any) => {
        console.log(res);
        this.getAllAdvanceData = res.data;
      }, (err: any) => {
        this.documentType = '';
        this.toast.warning(err.error.message);
      });
    }
  }

  customer_id: any;

  getCustomerData(data: any) {
    this.customer_id = data.id;
  }

  data: any;
  historyData: any = [];
  document_value: any;
  amount_paid_now: any;
  amount_due: any;
  isChecked: boolean = false;

  isCheckedData(data: any) {
    let payload = {
      po_id: data.po_id,
      invoice_id: data.invoice_id,
      grn_id: data.grn_id,
      purchase_journal_id: data.purchase_journal_id
    };
    if (data) {
      this.data = data;
      this.isChecked = true;
      this._finaceService.getPaymentAdviceHistory(payload).subscribe((res: any) => {
        this.documentValueBase = res.document_value || 0;
        this.amountPaidBase = res.amount_paid_now || 0;
        this.amountDueBase = res.amount_due || 0;

        this.document_value = this.roundToTwoDecimals(this.documentValueBase * this.currencyRate);
        this.amount_paid_now = this.roundToTwoDecimals(this.amountPaidBase * this.currencyRate);
        this.amount_due = this.roundToTwoDecimals(this.amountDueBase * this.currencyRate);

        this.historyData = res.data;
        this.createJournalEntryForm.patchValue({
          document_value: this.document_value,
          amount_paid_now: this.amount_paid_now,
          amount_due: this.amount_due
        });

        if (this.historyData && this.historyData.length > 0) {
          const gridDataWithBase = this.historyData.map((row: any) => {
            const baseRow = { ...row };
            ['document_value', 'tds_rate_amount', 'amount_due', 'record_amount'].forEach(field => {
              if (baseRow[field] !== undefined && baseRow[field] !== null) {
                baseRow[field + '_base'] = Number(baseRow[field]);
                baseRow._isBaseCurrency = true;
              }
            });
            return baseRow;
          });
          this.setGridData(gridDataWithBase);
        }
      }, (err: any) => {
        return this.toast.error(err.error.message);
      });
    } else {
      this.isChecked = false;
    }
  }

  typeValue: any;
  paymentAdviceData: any = [];

  isSelectData(event: any) {
    let payload = {
      type: event.value
    };
    this.typeValue = payload;
    let entity_id = localStorage.getItem("selectedEntityId");
    this._finaceService.getAdvicepayment(entity_id, payload).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.paymentAdviceData = response.data;

          if (this.paymentAdviceData.length === 0) {
            this.createJournalEntryForm.get('transport_id')?.reset();
            this.createJournalEntryForm.get('service_id')?.reset();
            this.toast.error(response.message || 'Document Not Available');
          }
        } else {
          this.toast.error(response.message || 'Document Not Available');
        }
      },
      (error) => {
        this.toast.error(error?.error?.message || 'Something went wrong');
      }
    );
  }

  getAllNatureOfTrsanction: any = [];

  getAllNatureTransaction(data: any, i: any) {
    console.warn(data);
    this.Account_details.controls[i].get('nature')?.setValue(data.nature);
    let vendor_id = this.Account_details.controls[i].get('vendor_id')?.value;

    this._finaceService.getTdsNatureOfTransaction(data.nature_id, this.vendor_id).subscribe((res: any) => {
      console.log(res.data);
      this.getAllNatureOfTrsanction = res.data;
    });
  }

  getAllTdsSection: any = [];

  getVendorTdsById(data: any, i: any) {
    this._finaceService.getVendorDataByTds(data.id).subscribe((res: any) => {
      console.log(res.data);

      if (!res.data?.length) {
        return this.toast.warning('TDS Not Mapped On This Vendor');
      } else {
        this.getAllTdsSection[i] = res.data;
      }
    });
  }

  getTdsRateData(data: any, i: any) {
    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
    const row = accountDetailsArray.at(i) as FormGroup;
    console.log(data, 'data');
    row.get('tds_rate')?.setValue(data.current_rate);

    const tdsRate = parseFloat(data.current_rate) || 0;

    let debitAmountRaw = row.get('debit_amount')?.value || '0';
    const debitAmount = parseFloat(debitAmountRaw.toString().replace(/,/g, '').replace(/[^\d.-]/g, ''));
    if (debitAmount > 0) {
      const tdsAmount = (debitAmount * tdsRate) / 100;
      row.get('tds_rate_amount')?.setValue(tdsAmount.toFixed(2), { emitEvent: false });
    }

    let creditAmountRaw = row.get('credit_amount')?.value || '0';
    const creditAmount = parseFloat(creditAmountRaw.toString().replace(/,/g, '').replace(/[^\d.-]/g, ''));
    if (creditAmount > 0) {
      const tdsAmountCredit = (creditAmount * tdsRate) / 100;
      row.get('tds_rate_amount')?.setValue(tdsAmountCredit.toFixed(2), { emitEvent: false });
    }
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      maxWidth: 85,
    },
    {
      headerName: 'Posting Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data?.createdAt ? moment(params.data.createdAt).format('DD-MM-YYYY') : '';
      }
    },
    {
      headerName: 'Document Type',
      field: 'document_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Document Number',
      field: 'document_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Document Value (' + this.currencyCode + ')',
      field: 'document_value',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return this.$common.formatCurrency(amount, this.currencyCode);
        }
        return ' 0.00';
      },
      valueGetter: (params: any) => {
        if (params.data) {
          const value = params.data.document_value;
          return value !== undefined && value !== null ? Number(value) : 0;
        }
        return 0;
      }
    },
    {
      headerName: 'TDS Rate',
      field: 'rate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return amount + '%';
        }
        return ' 0%';
      }
    },
    {
      headerName: 'TDS Value (' + this.currencyCode + ')',
      field: 'tds_rate_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return this.$common.formatCurrency(amount, this.currencyCode);
        }
        return ' 0.00';
      },
      valueGetter: (params: any) => {
        if (params.data) {
          const value = params.data.tds_rate_amount;
          return value !== undefined && value !== null ? Number(value) : 0;
        }
        return 0;
      }
    },
    {
      headerName: 'Amount Due (' + this.currencyCode + ')',
      field: 'amount_due',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return this.$common.formatCurrency(amount, this.currencyCode);
        }
        return ' 0.00';
      },
      valueGetter: (params: any) => {
        if (params.data) {
          const value = params.data.amount_due;
          return value !== undefined && value !== null ? Number(value) : 0;
        }
        return 0;
      }
    },
    {
      headerName: 'Amount Paid (' + this.currencyCode + ')',
      field: 'record_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return this.$common.formatCurrency(amount, this.currencyCode);
        }
        return ' 0.00';
      },
      valueGetter: (params: any) => {
        if (params.data) {
          const value = params.data.record_amount;
          return value !== undefined && value !== null ? Number(value) : 0;
        }
        return 0;
      }
    },
    {
      headerName: 'Party Type',
      field: 'party_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Party Name',
      field: 'vendor_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  vendorPartyDataTransporter: any = [];
  vendorPartyData1: any = [];
  vendorPartyData2: any = [];

  getALlTransporterData() {
    this.transport_service.getTranportDataList(this.entity_id).subscribe((res: any) => {
      this.vendorPartyDataTransporter = res.data;
      this.vendorPartyData = this.vendorPartyDataTransporter;
      this.vendorPartyData1 = res?.data?.map((x: any) => x.tm_name);
      this.vendorPartyData2 = this.vendorPartyDataTransporter;
    });
  }

  searchByParty(e: any) {
    const aa = e;
    let filteredVariable = this.vendorPartyData2.filter((item: any) => aa.includes(item.tm_name));
    this.vendorPartyDataTransporter = filteredVariable;
  }



// ============================================
// LEDGER PREVIEW METHODS - CASH PAYMENT
// ============================================

hasAccounts(): boolean {
    return this.Account_details?.controls?.some((control: any) =>
        Number(control.get('credit_amount')?.value) > 0
    ) || false;
}

getPartyName(): string {
    const partyType = this.createJournalEntryForm.get('party_type')?.value;
    const vendorId = this.createJournalEntryForm.get('vendor_id')?.value;
    const customerId = this.createJournalEntryForm.get('customer_id')?.value;
    const employeeId = this.createJournalEntryForm.get('employee_id')?.value;

    if (partyType === 'VENDOR' && vendorId) {
        const vendor = this.vendorPartyData.find((v: any) => v.id === Number(vendorId));
        return vendor ? vendor.vendor_name : '';
    } else if (partyType === 'CUSTOMER' && customerId) {
        const customer = this.customerPartyData.find((c: any) => c.id === Number(customerId));
        return customer ? customer.company_name : '';
    } else if (partyType === 'EMPLOYEE' && employeeId) {
        const employee = this.employeePartyData.find((e: any) => e.employee_id === Number(employeeId));
        return employee ? employee.first_name + ' ' + employee.last_name : '';
    }
    return '';
}

getAccountNameById(accountId: number): string {
    if (!accountId) return 'Unknown Account';
    const account = this.chartedAccount.find((acc: any) => acc.id === accountId);
    if (account) return account.account_name;

    const accountMap: { [key: number]: string } = {
        51: 'Sundry Creditors',
        168: 'Sundry Debtors',
        45: 'TDS Payable',
        85: 'Employee Payable'
    };

    return accountMap[accountId] || `Account ID: ${accountId}`;
}

getAccountCodeById(accountId: number): string {
    if (!accountId) return '-';
    const account = this.chartedAccount.find((acc: any) => acc.id === accountId);
    if (account) return account.account_code;

    const codeMap: { [key: number]: string } = {
        51: '2322',
        168: '1135',
        45: '2337',
        85: '240'
    };

    return codeMap[accountId] || '-';
}

buildLedgerAccounts(): any[] {
    const accounts: any[] = [];

    const partyType = this.createJournalEntryForm.get('party_type')?.value;
    const vendorId = this.createJournalEntryForm.get('vendor_id')?.value;
    const customerId = this.createJournalEntryForm.get('customer_id')?.value;
    const employeeId = this.createJournalEntryForm.get('employee_id')?.value;
    const paymentAdviceIds = this.createJournalEntryForm.get('payment_advice_ids')?.value;

    let totalCredit = 0;
    let totalTds = 0;

    this.Account_details.controls.forEach((control: any) => {
        const credit = Number(control.get('credit_amount')?.value) || 0;
        const tds = Number(control.get('tds_rate_amount')?.value) || 0;
        totalCredit += credit;
        totalTds += tds;
    });

    const grandTotal = totalCredit;

    console.log('===== CASH PAYMENT SUMMARY =====');
    console.log('Party Type:', partyType);
    console.log('Total Credit:', totalCredit);
    console.log('Total TDS:', totalTds);
    console.log('Grand Total:', grandTotal);
    console.log('Payment Advice ID:', paymentAdviceIds);
    console.log('====================================');

    // ============================================
    // 1. CREDIT ENTRIES (Account_details - Credit)
    // ============================================
    this.Account_details.controls.forEach((control: any) => {
        const chartAccountId = control.get('chart_account_id')?.value;
        const creditAmount = Number(control.get('credit_amount')?.value) || 0;
        const tdsAmount = Number(control.get('tds_rate_amount')?.value) || 0;

        if (chartAccountId && creditAmount > 0) {
            accounts.push({
                account_name: this.getAccountNameById(chartAccountId),
                account_code: this.getAccountCodeById(chartAccountId),
                debit_amount: 0,
                credit_amount: creditAmount,
                type: 'CREDIT',
                chart_account_id: chartAccountId
            });
        }

        if (tdsAmount > 0) {
            accounts.push({
                account_name: this.getAccountNameById(45),
                account_code: this.getAccountCodeById(45),
                debit_amount: 0,
                credit_amount: tdsAmount,
                type: 'CREDIT',
                chart_account_id: 45,
                is_tds: true
            });
        }
    });

    // ============================================
    // 2. DEBIT ENTRIES (Party Wise)
    // ============================================
    const partyChartId = partyType === 'VENDOR' ? 51 :
                        partyType === 'CUSTOMER' ? 168 :
                        partyType === 'EMPLOYEE' ? 85 : null;

    if (partyChartId && grandTotal > 0) {
        accounts.push({
            account_name: this.getAccountNameById(partyChartId),
            account_code: this.getAccountCodeById(partyChartId),
            debit_amount: grandTotal,
            credit_amount: 0,
            type: 'DEBIT',
            chart_account_id: partyChartId,
            party_name: this.getPartyName()
        });
    }

    return accounts;
}

showLedgerPreview(): void {
    const ledgerAccounts = this.buildLedgerAccounts();

    let totalDebit = 0;
    let totalCredit = 0;
    ledgerAccounts.forEach((acc: any) => {
        totalDebit += acc.debit_amount || 0;
        totalCredit += acc.credit_amount || 0;
    });

    const voucherNumber = this.createJournalEntryForm.get('document_number')?.value || '-';
    const transactionDate = this.createJournalEntryForm.get('transaction_date')?.value || new Date();

    const previewData = {
        title: 'Cash Payment - Ledger Preview',
        voucherNumber: voucherNumber,
        voucherDate: transactionDate,
        currencySymbol: this.currencySymbol || '₹',
        currencyCode: this.currencyCode || 'INR',
        accounts: ledgerAccounts,
        totalDebit: totalDebit,
        totalCredit: totalCredit,
        narration: this.createJournalEntryForm.get('notes')?.value || '',
        partyName: this.getPartyName() || 'Party',
        showSubmitButton: this.paramsType !== 'view',
        isViewMode: this.paramsType === 'view'
    };

    this.ledgerPreviewService.openPreview(previewData)
        .subscribe((result: any) => {
            if (result?.action === 'submit') {
                this.submitPublic('APPROVED');
            }
        });
}

}
