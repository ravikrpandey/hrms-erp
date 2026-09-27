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
import { LedgerPreviewService } from 'src/app/@shared/ledgerPreview/services/ledger-preview.service';

@Component({
  selector: 'app-add-cash-reciept',
  templateUrl: './add-cash-reciept.component.html',
  styleUrls: ['./add-cash-reciept.component.scss']
})
export class AddCashRecieptComponent {

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
  redColor: boolean = false;
  employeee: boolean = false;
  journalEmployeeParty: any;
  employeeParty: any = [];
  customerParty: any = [];
  vendorParty: any = [];
  chartedAccount: any = [];
  journal_id: any;
  singleGeneral: any = [];
  public gridOptions: any = { rowSelection: 'multiple' };
  rowData: any = [];
  rowClass: any;
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
  bank_reciept_id: any;
  customerPartyData1: any = [];
  customerPartyData2: any = [];
  financial_id: any;
  journalDocs: any = [];
  customerPartyData: any = [];
  vendorPartyData: any = [];
  employeePartyData: any = [];
  isVendorRefund: boolean = false;
  isEmployee_reciept: boolean = false;
  partyTypeCheck: any = '';
  documentType: any = '';
  isChecked: boolean = false;
  isDocumentActive: boolean = false;
  IsCustomerActive: boolean = false;
  paymentHistoryData: any = [];
  paymentHistoryBaseData: any[] = [];
  recordData: any = [];
  paymentAdviceData: any = [];
  typeValue: any;
  getAllAdvanceData: any;
  customer_id: any;
  vendor_id: any;
  getAllTdsSection: any = [];
  getAllNatureOfTrsanction: any = [];
  branch_id: any;
  data: any;
  historyData: any = [];
  document_value: any;
  amount_paid_now: any;
  amount_due: any;
  getAllBranchData: any = [];
  getAllProfitCenterData: any = [];
  costCenter: any = [];
  getCurrencyData: any = [];
  chartedAccount1: any[] = [];
  chartedAccount2: any[] = [];
  vendor2: any[] = [];
  vendor3: any[] = [];
  employee2: any[] = [];
  employee3: any[] = [];
  partyCustomer: boolean = false;
  customerType: any = [];
  customer2: any = [];
  getCategoryData: any = [];
  voucherData: any = [];
  getBank: any = [];
  gridApi: any;
  default_currency_id: any;
  bankAccountIds: any[] = [];
  payload: any;
  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyRate: any = 1;
  currencyData: any;
  oldCurrencyRate: number = 1;
  isPartySelected: boolean = false;
  isDocumentSelected: boolean = false;
  displayCurrencyRate: number = 1;
  originalRecordData: any = null;

  originalCurrencyValues = new Map<number, any>();
  private isCalculating: boolean = false;
  documentValueBase: number = 0;
  amountPaidBase: number = 0;
  amountDueBase: number = 0;

  constructor(private fb: FormBuilder, public $common: CommonService, private $crm: CrmService, public dialog: MatDialog, private toast: ToastrService, private router: Router, private _finaceService: FinaceService, private activeroute: ActivatedRoute, private salesManagementService: SalesManagementService, private _configurationalMasterService: ConfigurationalmasterService,private ledgerPreviewService:LedgerPreviewService) {
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
      party_type: ['CUSTOMER'],
      vendor_id: [null],
      customer_id: [null],
      document_type: [null],
      others: [null],
      po_id: [null],
      grn_id: [null],
      sales_journal_id: [null],
      gst_amount: [null],
      taxable_amount: [null],
      invoice_id: [null],
      sales_order_id: [null],
      sales_quotation_id: [null],
      delivery_order_id: [null],
      sales_invoice_id: [null],
      proforma_invoice_id: [null],
      document_value: [null],
      amount_paid_now: [null],
      employee_id: [null],
      amount_due: [null],
      payment_advice_ids: [],
      document_number_id: [],
      notes: [null],
      journalDocument: this.fb.array([this.addDoc])
    });

    this.createJournalEntryItemForm = this.fb.group({
      Account_details: this.fb.array([this.createAccountDetailGroup()])
    });

    this.createJournalreferanceForm = this.fb.group({
      cheque_ref_no: [null],
      cheque_ref_date: [null],
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

  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    this.loadInitialData();

    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        if (currency) {
          this.oldCurrencyRate = this.displayCurrencyRate;
          this.currencyData = currency;
          this.currencyCode = currency.Currency_Type || 'INR';
          this.displayCurrencyRate = Number(currency.rate) || 1;
          this.currencyRate = Number(currency.rate) || 1;
          this.currencySymbol = currency.symbols || '₹';
          this.updateDisplayValues();
          this.updateColumnHeaders();
          this.updatePaymentHistoryDisplay();
          if (this.gridApi) {
            this.gridApi.refreshCells({ force: true });
            this.gridApi.refreshHeader();
          }
        }
      });

    this.activeroute.queryParams.subscribe((params: any) => {
      this.bank_reciept_id = params.id;
      this.paramsType = params.actionType;
      this.isView = params.actionType === 'view';
      this.tabType = params.tabType;
      this.randomJournalNumber = '';
      if (!this.bank_reciept_id) {
        this.Account_details.removeAt(0);
      }
      if (this.bank_reciept_id) {
        this.loadBankReceipt();
      } else {
        this.initializeNewReceipt();
      }
    });
  }

  loadInitialData() {
    this._finaceService.getGParty('CUSTOMER').subscribe((res: any) => {
      this.customerPartyData = res.data;
      this.customerPartyData1 = res.data.map((x: any) => x.company_name);
      this.customerPartyData2 = res.data;
    });

    this.getChartAccountList();
    this.getAllBranch();
    this.getAllProfitCenter();
    this.getAllCostCenter();
    this.getCurrency();
    this.getBankAccountList();
    this.getAllVouchers();
  }

  loadBankReceipt() {
    this._finaceService.getCashRecieptById(this.bank_reciept_id).subscribe({
      next: (res: any) => {
        if (!res?.data) {
          this.toast.error('Something went wrong!');
          return;
        }
        this.singleGeneral = res.data;
        this.journalDocs = res.data.journalDocument || [];
        this.accountDetailList = res.data.Account_details || [];
        this.setGeneralData();
        this.patchHeaderForm();
        this.loadPartyData();
        this.loadAccountDetails();
        this.loadDocuments();
        this.loadPaymentHistoryForEdit();
      },
      error: () => {
        this.toast.error('Something went wrong in db!');
      }
    });
  }

  loadPaymentHistoryForEdit() {
    const documentId = this.singleGeneral.sales_invoice_id ||
                       this.singleGeneral.proforma_invoice_id ||
                       this.singleGeneral.sales_quotation_id ||
                       this.singleGeneral.sales_journal_id;

    if (!documentId) {
      return;
    }

    let payload: any = {
      proforma_id: documentId,
      entity_id: this.entity_id
    };

    if (this.singleGeneral.customer_id) {
      payload.customer_id = this.singleGeneral.customer_id;
      payload.documentType = this.singleGeneral.document_type || 'sales_invoice';
    } else if (this.singleGeneral.vendor_id) {
      payload.vendor_id = this.singleGeneral.vendor_id;
      payload.documentType = this.singleGeneral.document_type || 'purchase_invoice';
    }

    this._finaceService.customerRecordPayment(payload).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.recordData = res.data;
          this.originalRecordData = JSON.parse(JSON.stringify(res.data));
          this.paymentHistoryData = res.data?.historyData || [];

          this.paymentHistoryBaseData = this.paymentHistoryData.map((item: any) => ({
            ...item,
            total_amount_base: this.divideWithPrecision(item.total_amount || 0, this.currencyRate),
            record_amount_base: this.divideWithPrecision(item.record_amount || 0, this.currencyRate),
            amount_due_base: this.divideWithPrecision(item.amount_due || 0, this.currencyRate)
          }));

          this.updatePaymentHistoryDisplay();

          const totalAmount = parseFloat(this.recordData?.total_value) || 0;
          const amountPaid = this.recordData?.amount_paid || 0;
          const dueAmount = totalAmount - amountPaid;

          this.documentValueBase = this.divideWithPrecision(totalAmount, this.currencyRate);
          this.amountPaidBase = this.divideWithPrecision(amountPaid, this.currencyRate);
          this.amountDueBase = this.divideWithPrecision(dueAmount > 0 ? dueAmount : 0, this.currencyRate);

          this.createJournalEntryForm.patchValue({
            document_value: this.multiplyWithPrecision(this.documentValueBase, this.currencyRate),
            amount_paid_now: this.multiplyWithPrecision(this.amountPaidBase, this.currencyRate),
            amount_due: this.multiplyWithPrecision(this.amountDueBase, this.currencyRate),
            gst_amount: this.recordData?.gst_amount || 0,
            taxable_amount: this.recordData?.taxable_amount || 0
          });
        }
      },
      error: (err: any) => {
        console.log('Error loading payment history:', err);
      }
    });
  }

  updatePaymentHistoryDisplay() {
    if (!this.paymentHistoryBaseData || this.paymentHistoryBaseData.length === 0) {
      this.rowData = [];
      if (this.gridApi) {
        this.gridApi.setRowData([]);
      }
      return;
    }

    const displayData = this.paymentHistoryBaseData.map((item: any) => ({
      ...item,
      total_amount_display: this.multiplyWithPrecision(item.total_amount_base || 0, this.currencyRate),
      record_amount_display: this.multiplyWithPrecision(item.record_amount_base || 0, this.currencyRate),
      amount_due_display: this.multiplyWithPrecision(item.amount_due_base || 0, this.currencyRate)
    }));

    this.rowData = displayData;

    if (this.gridApi) {
      this.gridApi.setRowData(displayData);
      this.gridApi.refreshCells({ force: true });
      this.gridApi.refreshHeader();
    }
  }

  setGeneralData() {
    this.isChecked = this.singleGeneral.manage_advance == 1;
    this.documentType = this.singleGeneral.document_type;
    this.partyTypeCheck = this.singleGeneral.party_type;
    this.parent_journal_no = this.singleGeneral.parent_journal_no;
    this.totalDebit = this.singleGeneral.total_of_debit;
    this.totalCredit = this.singleGeneral.total_of_credit;
    this.Different = this.singleGeneral.different;
    this.redColor = this.Different !== 0;
  }

  patchHeaderForm() {
    this.partyTypeCheck = this.singleGeneral.party_type;

    if (this.singleGeneral.document_value) {
      const totalAmount = parseFloat(this.singleGeneral.document_value) || 0;
      const amountPaid = parseFloat(this.singleGeneral.amount_paid_now) || 0;
      const dueAmount = totalAmount - amountPaid;

      this.documentValueBase = this.divideWithPrecision(totalAmount, this.currencyRate);
      this.amountPaidBase = this.divideWithPrecision(amountPaid, this.currencyRate);
      this.amountDueBase = this.divideWithPrecision(dueAmount > 0 ? dueAmount : 0, this.currencyRate);
    }

    this.createJournalEntryForm.patchValue({
      posting_date: this.singleGeneral.posting_date,
      document_number: this.singleGeneral.document_number,
      transaction_date: this.singleGeneral.transaction_date,
      entity_id: this.entity_id,
      branch_id: this.singleGeneral.branch_id,
      notes: this.singleGeneral.notes,
      voucher_id: this.singleGeneral.voucher_list_id,
      party_type: this.singleGeneral.party_type,
      customer_id: this.singleGeneral.customer_id,
      vendor_id: this.singleGeneral.vendor_id,
      document_type: this.singleGeneral.document_type,
      others: this.singleGeneral.others,
      po_id: this.singleGeneral.po_id,
      grn_id: this.singleGeneral.grn_id,
      invoice_id: this.singleGeneral.invoice_id,
      sales_order_id: this.singleGeneral.sales_order_id,
      delivery_order_id: this.singleGeneral.delivery_order_id,
      sales_invoice_id: this.singleGeneral.sales_invoice_id,
      manage_advance: this.singleGeneral.manage_advance == 1,
      reference_number: this.singleGeneral.reference_number,
      cheque_ref_date: this.singleGeneral.cheque_ref_date,
      payment_advice_ids: this.singleGeneral.payment_advice_ids,
      document_number_id: this.singleGeneral.sales_journal_id,
      document_value: this.multiplyWithPrecision(this.documentValueBase, this.currencyRate),
      amount_paid_now: this.multiplyWithPrecision(this.amountPaidBase, this.currencyRate),
      amount_due: this.multiplyWithPrecision(this.amountDueBase, this.currencyRate)
    });

    this.createJournalreferanceForm.patchValue({
      cheque_ref_date: this.singleGeneral.cheque_ref_date,
      cheque_ref_no: this.singleGeneral.cheque_ref_no
    });
  }

  loadPartyData() {
    const type = this.singleGeneral?.party_type;
    const value = this.singleGeneral?.service_voucher_id ? this.singleGeneral.service_voucher_id : this.singleGeneral?.sales_journal_id;

    if (value && this.singleGeneral?.payment_advice_ids) {
      this._finaceService.getPaymentAmountBYpaymentAdvoiceId(value, this.singleGeneral.payment_advice_ids).subscribe({
        next: (res: any) => {
          const paymentData = Array.isArray(res?.data) ? res.data[0] : res?.data;
          if (paymentData) {
            const totalValue = Number(paymentData?.total_value || 0);
            const amountPaid = Number(paymentData?.amount_paid || 0);
            this.createJournalEntryForm.patchValue({
              document_value: totalValue.toFixed(2),
              amount_paid_now: amountPaid.toFixed(2),
              amount_due: (totalValue - amountPaid).toFixed(2)
            });
          }
          this.paymentHistoryData = res.historyData;
        },
        error: (err: any) => {
          console.log(err, 'payment error');
        }
      });
    }

    if (type === 'CUSTOMER') {
      this.customer_id = this.singleGeneral?.customer_id;
    }

    if (type === 'VENDOR') {
      this.vendor_id = this.singleGeneral?.vendor_id;
    }

    this._finaceService.getGParty(type).subscribe((res: any) => {
      if (type === 'CUSTOMER') {
        this.customerPartyData = res?.data || [];
      } else if (type === 'VENDOR') {
        this.vendorPartyData = res?.data || [];
      }
    });

    if (this.singleGeneral?.document_type !== 'OTHERS') {
      const payload = type === 'CUSTOMER'
        ? { customer_id: this.singleGeneral?.customer_id, entity_id: this.entity_id, document_type: this.singleGeneral?.document_type }
        : { vendor_id: this.singleGeneral?.vendor_id, entity_id: this.entity_id, document_type: this.singleGeneral?.document_type };

      this._finaceService.getAllPoGrnSoByVendorId(payload).subscribe({
        next: (res: any) => {
          this.getAllAdvanceData = res?.data || [];
        },
        error: (err: any) => {
          console.log(err, 'advance data error');
        }
      });
    }
  }

  storeCurrencyBaseValue(index: number) {
    const row: any = this.Account_details.at(index);
    const currentDebitAmount = Number(row.get('debit_amount')?.value || 0);

    if (this.currencyRate !== 0) {
      const inrDebit = currentDebitAmount / this.currencyRate;
      this.originalCurrencyValues.set(index, {
        debit_amount_inr: inrDebit
      });
    }
  }

  patchAccountRow(index: number, element: any) {
    const baseDebitAmount = element.debit_amount || 0;
    const baseCreditAmount = element.credit_amount || 0;

    this.originalCurrencyValues.set(index, {
      debit_amount_inr: baseDebitAmount,
      credit_amount_inr: baseCreditAmount
    });

    this.Account_details.controls[index]?.patchValue({
      chart_account_id: element.chart_account_id,
      party_type: element.party_type,
      employee_id: element.employee_id,
      customer_id: element.customer_id,
      vendor_id: element.vendor_id,
      debit_amount: this.multiplyWithPrecision(baseDebitAmount, this.currencyRate),
      credit_amount: this.multiplyWithPrecision(baseCreditAmount, this.currencyRate),
      journal_id: this.journal_id,
      id: element.id,
      bank_id: element.bank_id,
      currency_id: element.currency_id,
      narration: element.narration,
      nature_id: element.nature_id,
      nature: element.nature,
      tds: element.tds,
      tds_id: element.tds_id,
      tds_rate: element.tds_rate,
      tds_rate_amount: element.tds_rate_amount,
      surcharge: element.surcharge,
      surcharge_rate: element.surcharge_rate,
      surcharge_rate_amount: element.surcharge_rate_amount,
      cess_rate: element.cess_rate,
      gross_amount: element.gross_amount,
      profit_center_id: element.profit_center_id,
      cost_center_id: element.cost_center_id,
      remarks: element.remarks,
    });
  }

  loadAccountDetails() {
    this.vendorParty = [];
    this.employeeParty = [];

    this.accountDetailList.forEach((element: any, index: number) => {
      if (index < this.accountDetailList.length - 1) {
        this.AddRow();
      }
      this.patchAccountRow(index, element);
      if (element.party_type === 'VENDOR') {
        this.loadVendor(index, element);
      }
      if (element.party_type === 'CUSTOMER') {
        this.loadCustomer(index, element);
      }
      if (element.party_type === 'EMPLOYEE') {
        this.loadEmployee(index, element);
      }
      this.chartedAccount.forEach((x: any) => {
        if (x.id === element.chart_account_id) {
          x.hidden = true;
        }
      });
    });
  }

  loadVendor(index: number, element: any) {
    this._finaceService.getGParty('VENDOR').subscribe((res: any) => {
      this.vendorParty[index] = res.data;
      this.vendor2[index] = res.data.map((x: any) => x.vendor_name);
      this.vendor3[index] = res.data;
    });

    this._finaceService.getVendorDataByTds(element.vendor_id).subscribe((res: any) => {
      if (!res.data?.length) {
        return this.toast.warning('TDS Not Mapped On This Vendor');
      }
      this.getAllTdsSection[index] = res.data;
    });

    this._finaceService.getTdsNatureOfTransaction(element.nature_id, element.vendor_id).subscribe((res: any) => {
      this.getAllNatureOfTrsanction[index] = res.data;
    });
  }

  loadCustomer(index: number, element: any) {
    this._finaceService.getGParty('CUSTOMER').subscribe((res: any) => {
      this.customerParty[index] = res.data;
      this.customerPartyData1[index] = res.data.map((x: any) => x.business_name);
      this.customerPartyData2[index] = res.data;
    });
  }

  loadEmployee(index: number, element: any) {
    this._finaceService.getGParty('EMPLOYEE').subscribe((res: any) => {
      this.employeeParty[index] = res.data;
    });
  }

  loadDocuments() {
    this.journalDocuments.clear();
    this.journalDocs.forEach((doc: any) => {
      this.addDoc();
      const index = this.journalDocuments.length - 1;
      this.journalDocuments.at(index)?.patchValue({ file: doc.image });
    });
    if (this.paramsType === 'edit' && this.journalDocuments.length === 0) {
      this.addDoc();
    }
  }

  initializeNewReceipt() {
    this.AddRow();
    const now = new Date();
    const posting_date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    this.createJournalEntryForm.patchValue({ entity_id: this.entity_id, posting_date });
  }

  searchByParty(e: any) {
    const aa = e;
    let filteredVariable = this.customerPartyData2.filter((item: any) => aa.includes(item.company_name));
    this.customerPartyData = filteredVariable;
  }

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
    this._finaceService.generateCashRecieptNumber().subscribe((res: any) => {
      this.createJournalEntryForm.patchValue({ document_number: res.data });
    });
    if (item.voucher_name == 'Vendor Refund') {
      this.isVendorRefund = true;
      this.isEmployee_reciept = false;
    } else if (item.voucher_name == 'Employee Reciept') {
      this.isEmployee_reciept = true;
      this.partyTypeCheck = 'CUSTOMER';
      this.isVendorRefund = false;
      this.customer_id = '';
      this._finaceService.getGParty('EMPLOYEE').subscribe((res: any) => {
        this.employeePartyData = res.data;
      });
    } else {
      this.partyTypeCheck = '';
      this.isVendorRefund = false;
      this.vendor_id = '';
      this.documentType = '';
      this.createJournalEntryForm.get('document_value')?.reset();
      this.createJournalEntryForm.get('amount_paid_now')?.reset();
      this.createJournalEntryForm.get('amount_due')?.reset();
      this.isEmployee_reciept = false;
    }
  }

  getAllVouchers() {
    this._configurationalMasterService.getVouchersByID(4, this.entity_id).subscribe((res: any) => {
      this.voucherData = res.data;
    });
  }

  getBankAccountList() {
    this._finaceService.getBankAccountList(this.entity_id).subscribe((res: any) => {
      if (res) {
        this.getBank = res.data;
      }
    });
  }

  back() {
    this.router.navigate(['/master/finance/transactions/cash-receipt']);
  }

  clearData(control: any) {
    this.createJournalEntryForm.get(control)?.setValue(null);

    if (control == 'vendor_id' && control == 'po_id') {
      this.vendor_id = null;
      this.isChecked = false;
      this.documentType = null;
    } else if (control == 'party_type') {
      this.partyTypeCheck = '';
      this.vendor_id = null;
      this.isChecked = false;
      this.documentType = null;
    } else if (control == 'payment_advice_ids') {
      this.paymentAdviceData = [];
      this.paymentHistoryData = [];
      this.paymentHistoryBaseData = [];
      this.recordData = [];
      this.originalRecordData = null;
      this.createJournalEntryForm.get('document_number_id')?.setValue(null);
      this.createJournalEntryForm.get('document_value')?.setValue(null);
      this.createJournalEntryForm.get('amount_paid_now')?.setValue(null);
      this.createJournalEntryForm.get('amount_due')?.setValue(null);
      this.createJournalEntryForm.get('gst_amount')?.setValue(null);
      this.createJournalEntryForm.get('taxable_amount')?.setValue(null);
      this.createJournalEntryForm.get('reference_number')?.setValue(null);
      this.createJournalEntryForm.get('vendor_id')?.setValue(null);
      this.createJournalEntryForm.get('customer_id')?.setValue(null);
      this.createJournalEntryForm.get('party_type')?.setValue(null);
      this.isDocumentActive = false;
      this.IsCustomerActive = false;
      this.partyTypeCheck = '';
      this.isDocumentSelected = false;
      this.isPartySelected = false;
      this.recordData = null;

      const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
      if (accountDetailsArray.length > 0) {
        const row = accountDetailsArray.at(0) as FormGroup;
        row.get('debit_amount')?.setValue(null);
        row.get('credit_amount')?.setValue(null);
      }

      if (this.gridApi) {
        this.gridApi.setRowData([]);
      }
    } else if (control == 'document_number_id') {
      this.paymentHistoryData = [];
      this.paymentHistoryBaseData = [];
      this.recordData = null;
      this.originalRecordData = null;
      this.createJournalEntryForm.get('document_value')?.setValue(null);
      this.createJournalEntryForm.get('amount_paid_now')?.setValue(null);
      this.createJournalEntryForm.get('amount_due')?.setValue(null);
      this.createJournalEntryForm.get('gst_amount')?.setValue(null);
      this.createJournalEntryForm.get('taxable_amount')?.setValue(null);
      this.createJournalEntryForm.get('reference_number')?.setValue(null);

      const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
      if (accountDetailsArray.length > 0) {
        const row = accountDetailsArray.at(0) as FormGroup;
        row.get('debit_amount')?.setValue(null);
        row.get('credit_amount')?.setValue(null);
      }

      if (this.gridApi) {
        this.gridApi.setRowData([]);
      }
      this.isDocumentSelected = false;
      this.isPartySelected = false;
    } else if (control == 'customer_id' || control == 'vendor_id') {
      this.isPartySelected = false;
      this.isDocumentSelected = false;
      this.createJournalEntryForm.get('payment_advice_ids')?.setValue(null);
      this.createJournalEntryForm.get('document_number_id')?.setValue(null);
      this.createJournalEntryForm.get('document_type')?.setValue(null);
      this.paymentAdviceData = [];
      this.paymentHistoryData = [];
      this.paymentHistoryBaseData = [];
      this.recordData = null;
      this.originalRecordData = null;
      this.customer_id = null;
      this.vendor_id = null;

      const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
      if (accountDetailsArray.length > 0) {
        const row = accountDetailsArray.at(0) as FormGroup;
        row.get('debit_amount')?.setValue(null);
        row.get('credit_amount')?.setValue(null);
      }

      this.createJournalEntryForm.patchValue({
        document_value: null,
        amount_paid_now: null,
        amount_due: null
      });
    } else {
      this.customer_id = '';
      this.documentType = null;
      this.vendor_id = null;
      this.isChecked = false;
    }
  }

  isCheckedData(data: any) {
    let payload = {
      po_id: data.po_id,
      invoice_id: data.invoice_id,
      grn_id: data.grn_id,
    };
    if (data) {
      this.data = data;
      this.isChecked = true;
      this._finaceService.getPaymentAdviceHistory(payload).subscribe((res: any) => {
        const documentValueBase = this.divideWithPrecision(res.document_value || 0, this.currencyRate);
        const amountPaidBase = this.divideWithPrecision(res.amount_paid_now || 0, this.currencyRate);
        const amountDueBase = this.divideWithPrecision(res.amount_due || 0, this.currencyRate);

        this.documentValueBase = documentValueBase;
        this.amountPaidBase = amountPaidBase;
        this.amountDueBase = amountDueBase;

        this.document_value = this.multiplyWithPrecision(documentValueBase, this.currencyRate);
        this.amount_paid_now = this.multiplyWithPrecision(amountPaidBase, this.currencyRate);
        this.amount_due = this.multiplyWithPrecision(amountDueBase, this.currencyRate);

        this.historyData = res.data;
        this.createJournalEntryForm.patchValue({
          document_value: this.document_value,
          amount_paid_now: this.amount_paid_now,
          amount_due: this.amount_due
        });
        const items = this.createJournalEntryItemForm.get('Account_details') as FormArray;
        const row = items.at(0) as FormGroup;
        row.get('cost_center_id')?.setValue(data.cost_center_id);
      }, (err: any) => {
        return this.toast.error(err.error.message);
      });
    } else {
      this.isChecked = false;
    }
  }

  vendorDetails(data: any, index: any) {
    this._finaceService.getVendorDetails(data.id).subscribe((res: any) => {
      if (res.data.length) {
        this.getCategoryData[index] = res.data;
      } else {
        this.toast.error('Category not found on this vendor');
      }
    });
  }

  getAllBranch() {
    this._configurationalMasterService.getListBranchSetup().subscribe((res: any) => {
      this.getAllBranchData = res.data;
    });
  }

  getAllProfitCenter() {
    let entity_id = localStorage.getItem('selectedEntityId');
    this._finaceService.getAllProfitCenter(entity_id).subscribe((res: any) => {
      this.getAllProfitCenterData = res.data;
    });
  }

  getAllCostCenter() {
    this._finaceService.getAllCostCenter(this.entity_id).subscribe((res: any) => {
      this.costCenter = res.data;
    }, ((err: any) => {
      this.costCenter = [];
    }));
  }

  getCurrency() {
    this._configurationalMasterService.CurrencyList().subscribe((res: any) => {
      this.getCurrencyData = res.data;
    }, (err: any) => {
      this.getCurrencyData = [];
    });
  }

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

  vendorFilter(e: any, i: number) {
    const aa = e;
    let filteredVariable = this.vendor3[i].filter((item: any) => aa.includes(item.vendor_name));
    this.vendorParty[i] = filteredVariable;
  }

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
      party_type: [null],
      customer_id: [null],
      product_id: [null],
      vendor_id: [null],
      debit_amount: [null],
      credit_amount: [null],
      profit_center_id: [null],
      chart_account_id: [null],
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
      debit_amount_inr: 0,
      credit_amount_inr: 0
    });
    this.Account_details.push(newRow);
    this.calculations(null, null, 0);
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

      this.totalDebit = 0;
      this.totalCredit = 0;
      this.Different = 0;

      this.Account_details.controls.forEach((element: any) => {
        this.totalDebit += Number(element.controls.debit_amount.value) || 0;
        this.totalCredit += Number(element.controls.credit_amount.value) || 0;
      });

      this.Different = this.totalDebit - this.totalCredit;
      this.redColor = this.Different !== 0;

      this.calculations(null, null, 0);
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

  getCustomerDetail(data: any, index: number) {
    this._finaceService.getCustomerCategory(data.id).subscribe((res: any) => {
      if (res.data.length) {
        this.getCategoryData[index] = res.data;
      } else {
        this.toast.error('Category Not Found On This Customer');
      }
    }, (err: any) => { });
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

  get hasCustomerPartyType(): boolean {
    return this.Account_details.controls.some(control => control.get('party_type')?.value == 'CUSTOMER' || control.get('party_type')?.value == 'VENDOR');
  }

  employeeFilter1(e: any) {
    const aa = e;
    let filteredVariable = this.customerType.filter((item: any) => aa.includes(item.business_name));
    this.customerParty = filteredVariable;
  }

  calculation(event: any, control: any, index: any) {
    let values = +event.target.value;
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

  calculateTotals(): void {
    if (this.isCalculating) return;
    this.isCalculating = true;

    let totalDebitInINR = 0;
    let totalCreditInINR = 0;

    this.Account_details.controls.forEach((element: any, index: number) => {
      const baseValues = this.originalCurrencyValues.get(index);
      if (baseValues) {
        totalDebitInINR += baseValues.debit_amount_inr || 0;
        totalCreditInINR += baseValues.credit_amount_inr || 0;
      }
    });

    totalDebitInINR = this.roundToTwoDecimals(totalDebitInINR);
    totalCreditInINR = this.roundToTwoDecimals(totalCreditInINR);

    this.totalDebit = this.roundToTwoDecimals(totalDebitInINR * this.currencyRate);
    this.totalCredit = this.roundToTwoDecimals(totalCreditInINR * this.currencyRate);
    this.Different = this.roundToTwoDecimals(this.totalDebit - this.totalCredit);
    this.redColor = this.Different !== 0;

    this.isCalculating = false;
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

  submitPublic(key: any): void {
    if (this.createJournalEntryForm.valid && this.createJournalEntryItemForm.valid) {
      this._finaceService.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_id).subscribe({
        next: (res: any) => {
          let totalDebitInINR = 0;
          let totalCreditInINR = 0;
          const totalAmount = Number(this.documentValueBase) || 0;
          const originalPaid = Number(this.amountPaidBase) || 0;
          let currentEnteredDebit = 0;

          const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
          accountDetailsArray.controls.forEach((element: any, idx: number) => {
            const baseValues = this.originalCurrencyValues.get(idx);
            if (baseValues) {
              currentEnteredDebit += baseValues.debit_amount_inr || 0;
            }
          });

          const totalPaid = originalPaid + currentEnteredDebit;
          let dueAmount = totalAmount - totalPaid;
          if (dueAmount < 0) dueAmount = 0;

          this.amountDueBase = dueAmount;

          const accountDetails = this.createJournalEntryItemForm.value.Account_details;
          const accountDetailsInINR = accountDetails.map((item: any, index: number) => {
            const baseValues = this.originalCurrencyValues.get(index);
            if (baseValues) {
              const inrDebit = baseValues.debit_amount_inr || 0;
              const inrCredit = baseValues.credit_amount_inr || 0;
              totalDebitInINR += inrDebit;
              totalCreditInINR += inrCredit;

              return {
                ...item,
                debit_amount: this.roundToTwoDecimals(inrDebit),
                credit_amount: this.roundToTwoDecimals(inrCredit)
              };
            }
            const inrDebit = (item.debit_amount || 0) / this.currencyRate;
            const inrCredit = (item.credit_amount || 0) / this.currencyRate;
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

          let payload = {
            ...this.createJournalreferanceForm.value,
            ...this.createJournalEntryForm.value,
            Account_details: accountDetailsInINR,
            financial_id: this.financial_id,
            currency_id: this.currencyData?.Currency_Convert_id,
            currency_rate: this.currencyRate,
            totalDebit: totalDebitInINR,
            totalCredit: totalCreditInINR,
            document_value: this.documentValueBase || 0,
            amount_paid_now: this.amountPaidBase || 0,
            amount_due: this.amountDueBase || 0
          };
          this.createJournalEntryForm.patchValue({
            amount_due: this.multiplyWithPrecision(this.amountDueBase, this.currencyRate)
          });
          payload.cheque_ref_date = this.createJournalreferanceForm.value.cheque_ref_date ?
            moment(this.createJournalreferanceForm.value.cheque_ref_date).format('YYYY-MM-DD') : null;
          payload.transaction_date = this.createJournalEntryForm.value.transaction_date ?
            moment(this.createJournalEntryForm.value.transaction_date).format('YYYY-MM-DD') : null;
          payload.posting_date = moment(new Date()).format('YYYY-MM-DD')

          if (!payload.journalDocument) {
            payload.journalDocument = [];
          }
          payload.journalDocument = this.createJournalEntryForm.value.journalDocument;

          this.bankAccountIds = [];
          this._finaceService.createCashReciept(payload).subscribe((response: any) => {
            if (response) {
              this.toast.success('Cash Receipt Created Successfully');
              this.router.navigate(['master/finance/transactions/cash-receipt']);
              this.$common.hideLoader();
            }
          }, (error: any) => {
            this.$common.hideLoader();
            this.toast.error(error.error?.message || 'Something went wrong');
          });
        }, error: (err) => {
          this.$common.hideLoader();
          if (err.error.code === 404) {
            this.toast.warning('This month is not active');
          }
        }
      });
    } else {
      this.Account_details.controls.forEach(control => {
        control.markAllAsTouched();
      });
      this.toast.error('Please fill in all required fields');
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

  getVendorData(data: any) {
    this.vendor_id = data.id;
    this._finaceService.getVendorDataByTds(data.id).subscribe((res: any) => {
      console.log(res.data);
      if (!res.data?.length) {
        return this.toast.warning('TDS Not Mapped On This Vendor');
      } else {
        this.getAllTdsSection = res.data;
      }
    });
  }

  getAllDocumentType(event: any) {
    const resetControls = [
      'sales_quotation_id',
      'proforma_invoice_id',
      'sales_booking_id',
      'sales_order_id',
      'sales_invoice_id',
      'sales_journal_id'
    ];

    resetControls.forEach((control: any) => {
      this.createJournalEntryForm.get(control)?.reset();
      this.createJournalEntryForm.get(control)?.setValue(null);
      this.createJournalEntryForm.get(control)?.updateValueAndValidity();
    });

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
        this.createJournalEntryForm.get('document_type')?.reset();
      });
    }
  }

  getCustomerData(data: any) {
    this.customer_id = data.id;
    this.isPartySelected = true;
    this.isDocumentSelected = false;
    this.createJournalEntryForm.get('payment_advice_ids')?.setValue(null);
    this.createJournalEntryForm.get('document_number_id')?.setValue(null);
    this.paymentAdviceData = [];
    this.paymentHistoryData = [];
    this.paymentHistoryBaseData = [];
    this.recordData = [];
    this.partyTypeCheck = 'CUSTOMER';

    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
    if (accountDetailsArray.length > 0) {
      const row = accountDetailsArray.at(0) as FormGroup;
      row.get('debit_amount')?.setValue(null);
      row.get('credit_amount')?.setValue(null);
    }

    if (this.gridApi) {
      this.gridApi.setRowData([]);
    }

    this.createJournalEntryForm.patchValue({
      document_value: null,
      amount_paid_now: null,
      amount_due: null,
      gst_amount: null,
      taxable_amount: null,
      reference_number: null,
      vendor_id: null,
      customer_id: data.id,
      party_type: 'CUSTOMER'
    });
  }

  onPartyTypeChangeAdvance(event: any): any {
    this.partyTypeCheck = event.value;
    this.documentType = '';
    let party: any = "";
    party = event.value;

    if (party == 'CUSTOMER') {
      if (!Array.isArray(this.customerPartyData)) {
        this.customerPartyData = [];
      }
      this.customerPartyData = [];
      this._finaceService.getGParty(party).subscribe((res: any) => {
        let customerPartyData = res.data;
        this.customerPartyData = customerPartyData;
      });
      this.partyCustomer = true;
    } else {
      if (!Array.isArray(this.vendorPartyData)) {
        this.vendorPartyData = [];
      }
      this.vendorPartyData = [];
      this._finaceService.getGParty(party).subscribe((res: any) => {
        this.vendorPartyData = res.data;
        this.vendorPartyData = this.vendorPartyData;
      });
    }
    this.partyCustomer = false;
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

  calculations(event: any, field: any, index: number): void {
    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;

    let totalAmount = Number(this.createJournalEntryForm.get('document_value')?.value) || 0;
    let originalPaidAmount = Number(this.recordData?.amount_paid) || 0;

    if (this.originalRecordData) {
      originalPaidAmount = Number(this.originalRecordData.amount_paid) || 0;
    }

    let currentEnteredDebit = 0;

    accountDetailsArray.controls.forEach((element: any, idx: number) => {
      const debitValue = Number(element.get('debit_amount')?.value || 0);
      currentEnteredDebit += debitValue;
      this.storeCurrencyBaseValue(idx);
    });

    let totalPaidAmount = originalPaidAmount + currentEnteredDebit;
    if (totalPaidAmount > totalAmount) {
      totalPaidAmount = totalAmount;
      this.toast.warning('Payment amount cannot exceed document value');
    }

    let dueAmount = totalAmount - totalPaidAmount;
    if (dueAmount < 0) {
      dueAmount = 0;
    }

    this.createJournalEntryForm.patchValue({
      amount_paid_now: totalPaidAmount.toFixed(2),
      amount_due: dueAmount.toFixed(2)
    }, { emitEvent: false });

    this.calculateTotals();
  }

  isSelectData(event: any) {
    let payload: any = { type: event.value };
    if (event.value === 'PAYMENT_ADVICE') {
      payload.party_type = 'CUSTOMER';
    }
    this.typeValue = payload;
    let entity_id = localStorage.getItem("selectedEntityId");

    this.isDocumentSelected = true;
    this.isPartySelected = false;
    this.createJournalEntryForm.get('customer_id')?.setValue(null);
    this.createJournalEntryForm.get('vendor_id')?.setValue(null);
    this.createJournalEntryForm.get('party_type')?.setValue(null);

    if (event.value === 'PAYMENT_ADVICE') {
      this.createJournalEntryForm.patchValue({
        party_type: 'CUSTOMER'
      });
    } else {
      this.createJournalEntryForm.patchValue({
        party_type: null
      });
    }
    if (event.value !== 'PAYMENT_ADVICE') {
      this.createJournalEntryForm.get('customer_id')?.setValue(null);
      this.createJournalEntryForm.get('vendor_id')?.setValue(null);
    }
    this.paymentHistoryData = [];
    this.paymentHistoryBaseData = [];
    this.recordData = [];
    this.paymentAdviceData = [];
    this.createJournalEntryForm.patchValue({
      document_number_id: null,
      document_value: null,
      amount_paid_now: null,
      amount_due: null,
      gst_amount: null,
      taxable_amount: null,
      reference_number: null,
      vendor_id: null,
      customer_id: null,
      party_type: null
    });

    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
    if (accountDetailsArray.length > 0) {
      const row = accountDetailsArray.at(0) as FormGroup;
      row.get('debit_amount')?.setValue(null);
      row.get('credit_amount')?.setValue(null);
    }

    if (this.gridApi) {
      this.gridApi.setRowData([]);
    }

    this._finaceService.getAdvicepayment(entity_id, payload).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.paymentAdviceData = response.data;
        } else {
          this.toast.error(response.message || 'Document Not Available');
        }
      },
      (error) => {
        this.toast.error(error?.error?.message || 'Something went wrong');
      }
    );
  }

  getAllNatureTransaction(data: any, i: any) {
    this.Account_details.controls[i].get('nature')?.setValue(data.nature);
    let vendor_id = this.Account_details.controls[i].get('vendor_id')?.value;
    this._finaceService.getTdsNatureOfTransaction(data.nature_id, this.vendor_id).subscribe((res: any) => {
      console.log(res.data);
      this.getAllNatureOfTrsanction[i] = res.data;
    });
  }

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
      valueFormatter: (params: any) => {
        return params.value
          ? moment(params.value).format('DD-MM-YYYY HH:mm,a')
          : '';
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
      field: 'total_amount_display',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount)) {
          return this.$common.formatCurrency(amount, this.currencyCode);
        }
        return ' 0.00';
      }
    },
    {
      headerName: 'Amount Paid (' + this.currencyCode + ')',
      field: 'record_amount_display',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount)) {
          return this.$common.formatCurrency(amount, this.currencyCode);
        }
        return ' 0.00';
      }
    },
    {
      headerName: 'Amount Due (' + this.currencyCode + ')',
      field: 'amount_due_display',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount)) {
          return this.$common.formatCurrency(amount, this.currencyCode);
        }
        return ' 0.00';
      }
    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
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
        this.originalRecordData = JSON.parse(JSON.stringify(res.data));
        this.paymentHistoryData = res.data?.historyData || [];

        this.paymentHistoryBaseData = this.paymentHistoryData.map((item: any) => ({
          ...item,
          total_amount_base: this.divideWithPrecision(item.total_amount || 0, this.currencyRate),
          record_amount_base: this.divideWithPrecision(item.record_amount || 0, this.currencyRate),
          amount_due_base: this.divideWithPrecision(item.amount_due || 0, this.currencyRate)
        }));

        this.originalRecordData.amount_paid = this.paymentHistoryData.reduce((acc: number, res: any) => {
          return acc + parseFloat(res.record_amount) || 0;
        }, 0);

        const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
        let currentEnteredDebit = 0;
        accountDetailsArray.controls.forEach((element: any, idx: number) => {
          currentEnteredDebit += Number(element.get('debit_amount')?.value || 0);
          this.storeCurrencyBaseValue(idx);
        });

        const totalAmount = parseFloat(this.recordData?.total_value) || 0;
        const originalPaid = this.originalRecordData.amount_paid || 0;
        const totalPaid = originalPaid + currentEnteredDebit;
        const dueAmount = totalAmount - totalPaid;

        this.documentValueBase = this.divideWithPrecision(totalAmount, this.currencyRate);
        this.amountPaidBase = this.divideWithPrecision(totalPaid, this.currencyRate);
        this.amountDueBase = this.divideWithPrecision(dueAmount > 0 ? dueAmount : 0, this.currencyRate);

        this.createJournalEntryForm.patchValue({
          document_value: this.multiplyWithPrecision(this.documentValueBase, this.currencyRate),
          amount_due: this.multiplyWithPrecision(this.amountDueBase, this.currencyRate),
          amount_paid_now: this.multiplyWithPrecision(this.amountPaidBase, this.currencyRate),
          gst_amount: this.recordData?.gst_amount || 0,
          taxable_amount: this.recordData.taxable_amount || 0
        });

        if (accountDetailsArray.length > 0) {
          const row = accountDetailsArray.at(0) as FormGroup;
          const currentDebit = Number(row.get('debit_amount')?.value) || 0;
          if (currentDebit === 0 && dueAmount > 0) {
            const inrDebit = this.divideWithPrecision(dueAmount, this.currencyRate);
            row.get('debit_amount')?.setValue(this.multiplyWithPrecision(inrDebit, this.currencyRate));
            this.originalCurrencyValues.set(0, {
              debit_amount_inr: inrDebit,
              credit_amount_inr: 0
            });
          }
        }

        this.updatePaymentHistoryDisplay();
        this.calculateTotals();
      }, (err) => {
        return this.toast.error(err.error.message);
      });
    }
  }

  getPaymentAdvice(item: any) {
    this.isDocumentActive = true;
    this.partyTypeCheck = 'CUSTOMER';

    let control = this.createJournalEntryItemForm.get('Account_details') as FormArray;
    const row = control.at(0) as FormGroup;

    this.createJournalEntryForm.get('reference_number')?.setValue(item.document_number);

    this.createJournalEntryForm.patchValue({
      party_type: item.party_type,
      customer_id: item.customer_id
    });

    this._finaceService.getPaymentAmountBYpaymentAdvoiceId(item.id, this.typeValue?.type).subscribe((res: any) => {
      if (!res?.data || (Array.isArray(res.data) && res.data.length === 0)) {
        this.IsCustomerActive = true;
        this.createJournalEntryForm.patchValue({
          payment_advice_ids: item.id,
          document_number_id: item.id,
          transport_id: item.id,
          service_id: item.id
        });
        this.partyTypeCheck = '';
        this.paymentHistoryData = [];
        this.paymentHistoryBaseData = [];
        if (this.gridApi) {
          this.gridApi.setRowData([]);
        }
        return this.toast.warning(res?.message || 'Amount Already Paid');
      }

      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      this.recordData = data;
      this.originalRecordData = JSON.parse(JSON.stringify(data));
      this.originalRecordData.amount_paid = data.amount_paid || 0;
      this.originalRecordData.total_value = data.document_value || 0;

      const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
      let currentEnteredDebit = 0;
      accountDetailsArray.controls.forEach((element: any, idx: number) => {
        const debitValue = Number(element.get('debit_amount')?.value || 0);
        currentEnteredDebit += debitValue;
        this.storeCurrencyBaseValue(idx);
      });

      const totalAmount = Number(data.document_value) || 0;
      const originalPaid = Number(data.amount_paid) || 0;
      const totalPaid = originalPaid + currentEnteredDebit;
      let dueAmount = totalAmount - totalPaid
      if (dueAmount < 0) {
        dueAmount = 0;
      }
      this.documentValueBase = this.divideWithPrecision(totalAmount, this.currencyRate);
      this.amountPaidBase = this.divideWithPrecision(totalPaid, this.currencyRate);
      this.amountDueBase = this.divideWithPrecision(dueAmount > 0 ? dueAmount : 0, this.currencyRate);

      this.createJournalEntryForm.patchValue({
        document_value: this.multiplyWithPrecision(this.documentValueBase, this.currencyRate),
        amount_paid_now: this.multiplyWithPrecision(this.amountPaidBase, this.currencyRate),
        amount_due: this.multiplyWithPrecision(this.amountDueBase, this.currencyRate)
      });

      this.paymentHistoryData = res.historyData || [];
      this.paymentHistoryBaseData = this.paymentHistoryData.map((item: any) => ({
        ...item,
        total_amount_base: this.divideWithPrecision(item.total_amount || 0, this.currencyRate),
        record_amount_base: this.divideWithPrecision(item.record_amount || 0, this.currencyRate),
        amount_due_base: this.divideWithPrecision(item.amount_due || 0, this.currencyRate)
      }));

      if (accountDetailsArray.length > 0) {
        const row = accountDetailsArray.at(0) as FormGroup;
        const currentDebit = Number(row.get('debit_amount')?.value) || 0;
        if (currentDebit === 0 && dueAmount > 0) {
          const inrDebit = this.divideWithPrecision(dueAmount, this.currencyRate);
          this.originalCurrencyValues.set(0, {
            debit_amount_inr: 0,
            credit_amount_inr: 0
          });
        }
      }

      if (data.customer_id && data.party_type == 'CUSTOMER') {
        this.partyTypeCheck = 'CUSTOMER';
        this.IsCustomerActive = true;
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
        this.createJournalEntryForm.patchValue({
          party_type: 'EMPLOYEE',
          employee_id: data.employee_id,
          vendor_id: null,
          customer_id: null
        });
      }

      this.updatePaymentHistoryDisplay();
      this.calculateTotals();
    });
  }

  loadPaymentHistory(documentId: any) {
    let payload = {
      proforma_id: documentId,
      customer_id: this.customer_id,
      documentType: this.documentType || 'sales_invoice',
      entity_id: this.entity_id
    };

    this._finaceService.customerRecordPayment(payload).subscribe((res: any) => {
      this.recordData = res.data;
      this.originalRecordData = JSON.parse(JSON.stringify(res.data));
      this.paymentHistoryData = res.data?.historyData || [];

      let amount_paid = this.paymentHistoryData.reduce((acc: number, res: any) => {
        return acc + parseFloat(res.record_amount) || 0;
      }, 0);
      this.originalRecordData.amount_paid = amount_paid;

      const totalAmount = parseFloat(this.recordData?.total_value) || 0;
      const dueAmount = this.recordData.amount - this.recordData.amount_paid || 0;

      this.documentValueBase = this.divideWithPrecision(totalAmount, this.currencyRate);
      this.amountPaidBase = this.divideWithPrecision(amount_paid, this.currencyRate);
      this.amountDueBase = this.divideWithPrecision(dueAmount, this.currencyRate);

      this.createJournalEntryForm.patchValue({
        document_value: this.multiplyWithPrecision(this.documentValueBase, this.currencyRate),
        amount_due: this.multiplyWithPrecision(this.amountDueBase, this.currencyRate),
        amount_paid_now: this.multiplyWithPrecision(this.amountPaidBase, this.currencyRate),
        gst_amount: this.recordData?.gst_amount || 0,
        taxable_amount: this.recordData.taxable_amount || 0
      });

      const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
      if (accountDetailsArray.length > 0) {
        const row = accountDetailsArray.at(0) as FormGroup;
        const inrDebit = this.divideWithPrecision(dueAmount, this.currencyRate);
        row.get('debit_amount')?.setValue(this.multiplyWithPrecision(inrDebit, this.currencyRate));
        this.originalCurrencyValues.set(0, {
          debit_amount_inr: inrDebit,
          credit_amount_inr: 0
        });
      }

      if (this.gridApi) {
        this.gridApi.setRowData(this.paymentHistoryData);
      }

      this.calculateTotals();
    }, (err) => {
      return this.toast.error(err.error.message);
    });
  }

  updateDisplayValues(): void {
    const accountDetailsArray = this.Account_details;
    accountDetailsArray.controls.forEach((control: any, index: number) => {
      const baseValues = this.originalCurrencyValues.get(index);
      if (baseValues) {
        const newDebit = this.multiplyWithPrecision(baseValues.debit_amount_inr || 0, this.currencyRate);
        const newCredit = this.multiplyWithPrecision(baseValues.credit_amount_inr || 0, this.currencyRate);
        control.get('debit_amount')?.setValue(newDebit, { emitEvent: false });
        control.get('credit_amount')?.setValue(newCredit, { emitEvent: false });
      }
    });

    this.createJournalEntryForm.patchValue({
      document_value: this.multiplyWithPrecision(this.documentValueBase, this.currencyRate),
      amount_paid_now: this.multiplyWithPrecision(this.amountPaidBase, this.currencyRate),
      amount_due: this.multiplyWithPrecision(this.amountDueBase, this.currencyRate)
    }, { emitEvent: false });

    this.updatePaymentHistoryDisplay();
    this.calculateTotals();
  }



// ============================================
// LEDGER PREVIEW METHODS - CASH RECEIPT
// ============================================

hasAccounts(): boolean {
    return this.Account_details?.controls?.some((control: any) =>
        Number(control.get('debit_amount')?.value) > 0 ||
        Number(control.get('credit_amount')?.value) > 0
    ) || false;
}

getPartyName(): string {
    const partyType = this.createJournalEntryForm.get('party_type')?.value;
    const customerId = this.createJournalEntryForm.get('customer_id')?.value;
    const vendorId = this.createJournalEntryForm.get('vendor_id')?.value;
    const employeeId = this.createJournalEntryForm.get('employee_id')?.value;

    if (partyType === 'CUSTOMER' && customerId) {
        const customer = this.customerPartyData.find((c: any) => c.id === Number(customerId));
        return customer ? customer.company_name : '';
    } else if (partyType === 'VENDOR' && vendorId) {
        const vendor = this.vendorPartyData.find((v: any) => v.id === Number(vendorId));
        return vendor ? vendor.vendor_name : '';
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
        168: 'Sundry Debtors',
        51: 'Sundry Creditors',
        85: 'Employee Payable',
        45: 'TDS Payable'
    };

    return accountMap[accountId] || `Account ID: ${accountId}`;
}

getAccountCodeById(accountId: number): string {
    if (!accountId) return '-';
    const account = this.chartedAccount.find((acc: any) => acc.id === accountId);
    if (account) return account.account_code;

    const codeMap: { [key: number]: string } = {
        168: '1135',
        51: '2322',
        85: '240',
        45: '2337'
    };

    return codeMap[accountId] || '-';
}

buildLedgerAccounts(): any[] {
    const accounts: any[] = [];

    const partyType = this.createJournalEntryForm.get('party_type')?.value;
    const customerId = this.createJournalEntryForm.get('customer_id')?.value;
    const vendorId = this.createJournalEntryForm.get('vendor_id')?.value;
    const employeeId = this.createJournalEntryForm.get('employee_id')?.value;
    const paymentAdviceIds = this.createJournalEntryForm.get('payment_advice_ids')?.value;

    let totalDebit = 0;
    let totalCredit = 0;

    this.Account_details.controls.forEach((control: any) => {
        const debit = Number(control.get('debit_amount')?.value) || 0;
        const credit = Number(control.get('credit_amount')?.value) || 0;
        totalDebit += debit;
        totalCredit += credit;
    });

    const grandTotal = totalDebit;

    console.log('===== CASH RECEIPT SUMMARY =====');
    console.log('Party Type:', partyType);
    console.log('Total Debit:', totalDebit);
    console.log('Total Credit:', totalCredit);
    console.log('Grand Total:', grandTotal);
    console.log('Payment Advice ID:', paymentAdviceIds);
    console.log('====================================');

    // ============================================
    // 1. DEBIT ENTRIES (Account_details - Debit)
    // ============================================
    this.Account_details.controls.forEach((control: any) => {
        const chartAccountId = control.get('chart_account_id')?.value;
        const debitAmount = Number(control.get('debit_amount')?.value) || 0;

        if (chartAccountId && debitAmount > 0) {
            accounts.push({
                account_name: this.getAccountNameById(chartAccountId),
                account_code: this.getAccountCodeById(chartAccountId),
                debit_amount: debitAmount,
                credit_amount: 0,
                type: 'DEBIT',
                chart_account_id: chartAccountId
            });
        }
    });

    // ============================================
    // 2. CREDIT ENTRIES (Party Wise)
    // ============================================
    const partyChartId = partyType === 'CUSTOMER' ? 168 :
                        partyType === 'VENDOR' ? 51 :
                        partyType === 'EMPLOYEE' ? 85 : null;

    if (partyChartId && grandTotal > 0) {
        accounts.push({
            account_name: this.getAccountNameById(partyChartId),
            account_code: this.getAccountCodeById(partyChartId),
            debit_amount: 0,
            credit_amount: grandTotal,
            type: 'CREDIT',
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
        title: 'Cash Receipt - Ledger Preview',
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
