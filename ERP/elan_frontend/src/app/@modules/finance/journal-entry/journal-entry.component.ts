import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { AddChartAccountComponent } from '../add-chart-account/add-chart-account.component';
import { SalesManagementService } from '../../sales-management/sales-management-service/sales-management.service';
import Swal from 'sweetalert2';
import { environment } from 'src/app/environments/environment';
import { CommonService } from 'src/app/@shared/services/common.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { GridReadyEvent } from 'ag-grid-community';
import { LedgerPreviewService } from 'src/app/@shared/ledgerPreview/services/ledger-preview.service';

@Component({
  selector: 'app-journal-entry',
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.scss']
})
export class JournalEntryComponent {
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
  rowClass: any;
  singleItem: any;
  isView: boolean = false;
  public gridOptions: any = { rowSelection: 'multiple', };
  imageToUpload: any;
  imageUrl: any;
  handleViewImg: boolean = true;
  rowData: any;
  voucherData: any = [];
  getAllProfitCenterData: any = [];
  costCenter: any = [];
  chartedAccount1: any[] = [];
  chartedAccount2: any[] = [];
  vendor2: any[] = [];
  vendor3: any[] = [];
  employee2: any[] = [];
  employee3: any[] = [];
  getServiceData: any = [];
  partyCustomer: boolean = false;
  customerType: any = [];
  partyTypeCheck: any = '';
  customerParty1: any[] = [];
  customerParty2: any[] = [];
  financial_id: any;
  journalDocs: any;
  vendorPartyData: any = [];
  customerPartyData: any = [];
  customerPartyData1: any = [];
  customerPartyData2: any = [];
  getAllTdsSection: any = [];
  getAllNatureOfTrsanction: any = [];
  maximum_amount: number = 0;
  threshold_limit: number = 0;
  gross_total = 0;
  tds_amount = 0;
  gst_total = 0;
  net_amount = 0;
  igst_rate = 0;
  igst_amount = 0;
  cgst_amount = 0;
  sgst_amount = 0;
  vendor_id: any;
  rcm_charge: any;
  totalAmount: any;
  documentType: any = '';
  getAllAdvanceData: any;
  payload: any;
  isCustomerSelected: boolean = false;
  advance_amount: any;
  recordData: any = [];
  customer_id: any;
  getCategoryDatas: any = [];
  getCategoryData: any = [];
  data: any;
  historyData: any = [];
  document_value: any;
  amount_paid_now: any;
  advance_payment_type: any;
  done_payment_from_vendor: any;
  isChecked: boolean = false;
  default_currency_id: any;
  bankAccountIds: any[] = [];
  partyCustomers: boolean = false;
  customerTypess: any = [];

  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyRate: any = 1;
  currencyData: any;
  oldCurrencyRate: number = 1;

  private originalCurrencyValues = new Map<number, any>();
  private isUpdatingCurrency: boolean = false;

  public columnDefs: any[] = [];
  gridApi: any;
  debitFocusState: { [key: number]: boolean } = {};
  creditFocusState: { [key: number]: boolean } = {};

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
    private ledgerPreviewService: LedgerPreviewService,
    private salesManagementService: SalesManagementService
  ) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    this.maxDate = moment({ year: year + 100, month, date }).format('YYYY-MM-DD');
    this.minDate = moment({ year, month, date }).format('YYYY-MM-DD');
    let financial_id = localStorage.getItem("financial_id");

    this.createJournalEntryForm = this.fb.group({
      posting_date: [this.minDate, Validators.required],
      voucher_id: [null],
      financial_posting: [null],
      entity_id: [null],
      bill_number: [null],
      general_number: [null, Validators.required],
      transaction_date: [null],
      party_type: [null],
      vendor_id: [null],
      customer_id: [null],
      document_type: [null],
      others: [null],
      po_id: [null],
      grn_id: [null],
      invoice_id: [null],
      sales_order_id: [null],
      delivery_order_id: [null],
      sales_invoice_id: [null],
      document_value: [null],
      amount_paid_now: [null],
      proforma_invoice_id: [null],
      sales_booking_id: [null],
      amount_due: [null],
      grand_total: [null],
      gst_amount: [null],
      discount_amount: [null],
      gross_amount: [null],
      financial_id: [financial_id],
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

  private roundToTwoDecimals(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private multiplyWithPrecision(value: number, multiplier: number): number {
    if (value === null || value === undefined || isNaN(value)) return 0;
    return this.roundToTwoDecimals(value * multiplier);
  }

  private divideWithPrecision(value: number, divisor: number): number {
    if (!value || divisor === 0) return 0;
    return this.roundToTwoDecimals(value / divisor);
  }

  ngOnInit() {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");

    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        if (!currency || this.isUpdatingCurrency) return;

        this.isUpdatingCurrency = true;
        this.oldCurrencyRate = this.currencyRate;
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';

        this.updateDisplayAmountsWithCurrencyRate();

        this.columnDefs = this.getColumnDefs();
        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
          this.gridApi.refreshCells();
        }

        setTimeout(() => {
          this.isUpdatingCurrency = false;
        }, 100);
      });

    this.columnDefs = this.getColumnDefs();

    this.getAllVoucherData();
    this.getChartAccountList();
    this.getAllCostCenter();
    this.getAllProfitCenter();
    this.getAllVouchers();

    this.activeroute.queryParams.subscribe((params: any) => {
      this.journal_id = params.journalid;
      this.paramsType = params.actionType;
      this.isView = params.actionType === 'view' ? true : false;
      this.tabType = params.tabType;
      this.randomJournalNumber = "";

      if (this.journal_id) {
        this._finaceService.getgeneralById(this.journal_id).subscribe((res: any) => {
          if (res.code !== 200) {
            this.toast.error("Something went wrong!");
            return;
          }
          this.singleGeneral = res.data;

          // Store base values in INR
          const inrTotalDebit = Number(this.singleGeneral.total_of_debit) || 0;
          const inrTotalCredit = Number(this.singleGeneral.total_of_credit) || 0;

          this.totalDebit = this.multiplyWithPrecision(inrTotalDebit, this.currencyRate);
          this.totalCredit = this.multiplyWithPrecision(inrTotalCredit, this.currencyRate);
          this.Different = this.totalDebit - this.totalCredit;
          this.redColor = this.Different !== 0;

          this.accountDetailList = res.list;
          this.journalDocs = res.journalDocument;
          this.vendor_id = res.data?.vendor_id;
          this.parent_journal_no = this.singleGeneral.parent_journal_no;
          if (res.data.party_type) {
            this.handlePartyType();
            this.handleVendorTds();
          }
          this.patchMainForm();
          this.handleAccountList();
          this.handleDocuments();
          this.recalculateTotals();
          this.redColor = false;
        }, () => {
          this.toast.error("Something went wrong in DB!");
        });
      } else {
        this.AddRow();
        this.createJournalEntryForm.patchValue({
          entity_id: this.entity_id
        });
        this._finaceService.getgeneralNumber().subscribe((res: any) => {
          this.randomJournalNumber = res.data;
          this.parent_journal_no = res.data;
          this.createJournalEntryForm.patchValue({
            general_number: this.randomJournalNumber
          });
        });
      }
    });
  }

  updateDisplayAmountsWithCurrencyRate(): void {
    const accountDetailsArray = this.Account_details;

    accountDetailsArray.controls.forEach((control: any, index: number) => {
      const baseValue = this.originalCurrencyValues.get(index);
      if (baseValue) {
        const displayDebit = this.multiplyWithPrecision(baseValue.debit_amount || 0, this.currencyRate);
        const displayCredit = this.multiplyWithPrecision(baseValue.credit_amount || 0, this.currencyRate);

        control.patchValue({
          debit_amount: displayDebit,
          credit_amount: displayCredit
        }, { emitEvent: false });

        const debitInputs = document.querySelectorAll(`input[formControlName="debit_amount"]`);
        if (debitInputs && debitInputs[index]) {
          (debitInputs[index] as HTMLInputElement).value = displayDebit > 0 ? `${this.currencySymbol} ${displayDebit.toFixed(2)}` : '';
        }
        const creditInputs = document.querySelectorAll(`input[formControlName="credit_amount"]`);
        if (creditInputs && creditInputs[index]) {
          (creditInputs[index] as HTMLInputElement).value = displayCredit > 0 ? `${this.currencySymbol} ${displayCredit.toFixed(2)}` : '';
        }
      }
    });

    // Update totals
    let baseTotalDebit = 0;
    let baseTotalCredit = 0;
    accountDetailsArray.controls.forEach((row: any, index: number) => {
      const baseValues = this.originalCurrencyValues.get(index);
      if (baseValues) {
        baseTotalDebit += baseValues.debit_amount || 0;
        baseTotalCredit += baseValues.credit_amount || 0;
      }
    });

    this.totalDebit = this.multiplyWithPrecision(baseTotalDebit, this.currencyRate);
    this.totalCredit = this.multiplyWithPrecision(baseTotalCredit, this.currencyRate);
    this.Different = this.totalDebit - this.totalCredit;
    this.redColor = this.Different !== 0;
  }

  formatCurrencyForInput(value: any): string {
    const numValue = Number(value || 0);
    if (isNaN(numValue) || numValue === 0) return '';
    return `${this.currencySymbol} ${numValue.toFixed(2)}`;
  }

  getRawValueFromFormatted(formattedValue: string): number {
    if (!formattedValue) return 0;
    const cleaned = formattedValue.replace(/[^0-9.\-]/g, '');
    return parseFloat(cleaned) || 0;
  }

  onDebitInputChange(event: any, index: number): void {
    const rawValue = event.target.value;
    const cleanValue = rawValue.replace(/[^0-9.]/g, '');
    const numValue = parseFloat(cleanValue) || 0;

    // Store base INR value
    const baseDebit = this.divideWithPrecision(numValue, this.currencyRate);

    this.originalCurrencyValues.set(index, {
      debit_amount: baseDebit,
      credit_amount: this.originalCurrencyValues.get(index)?.credit_amount || 0
    });

    this.Account_details.controls[index].get('debit_amount')?.setValue(numValue, { emitEvent: false });
    this.calculations(event, 'debit_amount', index);
  }

  onDebitBlur(index: number): void {
    const control = this.Account_details.controls[index].get('debit_amount');
    if (control) {
      const value = control.value;
      if (value && value > 0) {
        const debitInputs = document.querySelectorAll(`input[formControlName="debit_amount"]`);
        if (debitInputs && debitInputs[index]) {
          (debitInputs[index] as HTMLInputElement).value = `${this.currencySymbol} ${Number(value).toFixed(2)}`;
        }
      }
    }
  }



hasAccounts(): boolean {
    return this.Account_details?.controls?.some((control: any) =>
        control.get('chart_account_id')?.value
    ) || false;
}


getVendorName(): string {
    const vendorId = this.createJournalEntryForm.get('vendor_id')?.value;
    if (!vendorId) return '';
    const vendor = this.vendorPartyData.find((v: any) => v.id === vendorId);
    return vendor ? vendor.vendor_name : '';
}


getCustomerName(): string {
    const customerId = this.createJournalEntryForm.get('customer_id')?.value;
    if (!customerId) return '';
    const customer = this.customerPartyData.find((c: any) => c.id === customerId);
    return customer ? customer.company_name : '';
}

showLedgerPreview(): void {

    const previewData = this.ledgerPreviewService.buildPreviewData(
        this.createJournalEntryForm,
        this.Account_details,
        this.chartedAccount,
        this.currencySymbol,
        this.currencyCode,
        {
            title: 'Journal Entry Preview',
            partyName: this.getVendorName() || this.getCustomerName(),
            showSubmitButton: this.paramsType !== 'view',
            isViewMode: this.paramsType === 'view'
        }
    );


    this.ledgerPreviewService.openPreview(previewData)
        .subscribe((result: any) => {
            if (result?.action === 'submit') {
                this.submitPublic('APPROVED');
            }
        });
}





  onDebitFocus(index: number): void {
    const control = this.Account_details.controls[index].get('debit_amount');
    if (control) {
      const value = control.value;
      if (value) {
        const debitInputs = document.querySelectorAll(`input[formControlName="debit_amount"]`);
        if (debitInputs && debitInputs[index]) {
          (debitInputs[index] as HTMLInputElement).value = value.toString();
        }
      }
    }
  }

  onCreditInputChange(event: any, index: number): void {
    const rawValue = event.target.value;
    const cleanValue = rawValue.replace(/[^0-9.]/g, '');
    const numValue = parseFloat(cleanValue) || 0;

    // Store base INR value
    const baseCredit = this.divideWithPrecision(numValue, this.currencyRate);

    this.originalCurrencyValues.set(index, {
      debit_amount: this.originalCurrencyValues.get(index)?.debit_amount || 0,
      credit_amount: baseCredit
    });

    this.Account_details.controls[index].get('credit_amount')?.setValue(numValue, { emitEvent: false });
    this.calculations(event, 'credit_amount', index);
  }

  onCreditBlur(index: number): void {
    const control = this.Account_details.controls[index].get('credit_amount');
    if (control) {
      const value = control.value;
      if (value && value > 0) {
        const creditInputs = document.querySelectorAll(`input[formControlName="credit_amount"]`);
        if (creditInputs && creditInputs[index]) {
          (creditInputs[index] as HTMLInputElement).value = `${this.currencySymbol} ${Number(value).toFixed(2)}`;
        }
      }
    }
  }

  onCreditFocus(index: number): void {
    const control = this.Account_details.controls[index].get('credit_amount');
    if (control) {
      const value = control.value;
      if (value) {
        const creditInputs = document.querySelectorAll(`input[formControlName="credit_amount"]`);
        if (creditInputs && creditInputs[index]) {
          (creditInputs[index] as HTMLInputElement).value = value.toString();
        }
      }
    }
  }

  formatCurrency(value: any): string {
    const numValue = Number(value || 0);
    if (isNaN(numValue)) return `${this.currencySymbol} 0.00`;
    return `${this.currencySymbol} ${numValue.toFixed(2)}`;
  }

  getColumnDefs(): any[] {
    return [
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
        field: 'documentNo',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: `Document Value (${this.currencyCode})`,
        field: 'record_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: any) => {
          const amount = Number(params.value || 0);
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
      },
      {
        headerName: `TDS Rate (${this.currencyCode})`,
        field: 'rate',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: any) => {
          const amount = Number(params.value || 0);
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
      },
      {
        headerName: `TDS Value (${this.currencyCode})`,
        field: 'tds_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: any) => {
          const amount = Number(params.value || 0);
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
      },
      {
        headerName: `Amount Paid (${this.currencyCode})`,
        field: 'record_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: any) => {
          const amount = Number(params.value || 0);
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
      },
      {
        headerName: `Amount Due (${this.currencyCode})`,
        field: 'amount_due',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: any) => {
          const amount = Number(params.value || 0);
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
      },
      {
        headerName: `Net Amount (${this.currencyCode})`,
        field: 'net_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: any) => {
          const amount = Number(params.value || 0);
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
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
  }

  patchMainForm() {
    this.createJournalEntryForm.patchValue({
      posting_date: this.singleGeneral.posting_date,
      financial_posting: this.singleGeneral.financial_posting,
      bill_number: this.singleGeneral.bill_number,
      general_number: this.singleGeneral.journal_no,
      transaction_date: this.singleGeneral.transaction_date,
      entity_id: this.entity_id,
      voucher_id: this.singleGeneral.voucher_list_id,
      party_type: this.singleGeneral.party_type,
      vendor_id: this.singleGeneral.vendor_id,
      customer_id: this.singleGeneral.customer_id,
      notes: this.singleGeneral.notes
    });
    this.createJournalreferanceForm.patchValue({
      reference: this.singleGeneral.reference,
      reference_date: this.singleGeneral.reference_date
    });
  }

  handlePartyType() {
    if (this.singleGeneral.party_type === 'VENDOR') {
      this.partyTypeCheck = 'VENDOR';
      this.vendor_id = this.singleGeneral.vendor_id;
      this._finaceService.getGParty('VENDOR').subscribe((res: any) => {
        this.vendorPartyData = res.data;
      });
    } else {
      this.partyTypeCheck = 'CUSTOMER';
      this._finaceService.getGParty('CUSTOMER').subscribe((res: any) => {
        this.customerPartyData = res.data;
      });
    }
  }

  handleVendorTds() {
    this._finaceService.getVendorDataByTds(this.singleGeneral?.vendor_id)
      .subscribe((res: any) => {
        if (!res.data?.length) {
          this.toast.warning('TDS Not Mapped On This Vendor');
          return;
        }
        this.getAllTdsSection = res.data;
      });
  }

  handleAccountList() {
    this.vendorParty = [];
    this.employeeParty = [];
    this.accountDetailList.forEach((element: any, index: number) => {
      if (index < this.accountDetailList.length - 1) {
        this.AddRow();
      }
      this.patchAccountRow(index, element);
      if (element.party_type) {
        this.loadPartyData(element.party_type, index, element);
      }
      const account = this.chartedAccount.find(
        (x: any) => x.id === element.chart_account_id
      );
      if (account) account.hidden = true;
    });
  }

  patchAccountRow(index: number, element: any) {
    const baseDebit = element.debit_amount || 0;
    const baseCredit = element.credit_amount || 0;

    // Store original INR values
    this.originalCurrencyValues.set(index, {
      debit_amount: baseDebit,
      credit_amount: baseCredit
    });

    // Display converted values
    const displayDebit = this.multiplyWithPrecision(baseDebit, this.currencyRate);
    const displayCredit = this.multiplyWithPrecision(baseCredit, this.currencyRate);

    this.Account_details.controls[index]?.patchValue({
      chart_account_id: element.chart_account_id,
      party_type: element.party_type,
      employee_id: element.employee_id,
      vendor_id: element.vendor_id,
      customer_id: element?.SALES_SUPER_USER_MST?.customer_id,
      product_id: element?.VENDOR_BASIC_DETAIL?.id || element?.SYS_PRODUCT_MASTER_MST?.product_id,
      debit_amount: displayDebit,
      credit_amount: displayCredit,
      tds_id: element.tds_id,
      nature: element.TDS_LIST_MST?.nature_of_transaction,
      tds_rate: element.TDS_LIST_MST?.current_rate,
      nature_id: element.nature_id,
      tds_rate_amount: element.tds_rate_amount,
      tax_rate: element.tax_rate,
      tax_amount: element.tax_amount,
      journal_id: this.journal_id,
      id: element.id,
      cost_center_id: element.cost_center_id,
      profit_center_id: element.profit_center_id,
      remarks: element.remarks
    });

    this._finaceService.getTdsNatureOfTransaction(element.nature_id, this.vendor_id).subscribe((res: any) => {
      console.log(res.data);
      this.getAllNatureOfTrsanction[index] = res.data;
    });
  }

  loadPartyData(type: string, index: number, element: any) {
    this._finaceService.getGParty(type).subscribe((res: any) => {
      if (type === 'EMPLOYEE') {
        this.employeeParty[index] = res.data;
      }
      if (type === 'VENDOR') {
        this.vendorParty[index] = res.data;
        this.vendor2[index] = res.data.map((x: any) => x.vendor_name);
        this.vendor3[index] = res.data;
        this._finaceService.getVendorDetails(element?.VENDOR_BASIC_DETAIL?.id)
          .subscribe((res: any) => {
            if (res.data.length) {
              this.getCategoryData[index] = res.data;
            } else {
              this.toast.error('Category not found on this vendor');
            }
          });
      }
      if (type === 'CUSTOMER') {
        this.customerParty[index] = res.data;
        this.customerParty1[index] = res.data.map((x: any) => x.business_name);
        this.customerParty2[index] = res.data;
        this._finaceService.getCustomerCategory(element?.SALES_SUPER_USER_MST?.customer_id)
          .subscribe((res: any) => {
            if (res.data.length) {
              this.getCategoryData = res.data;
            } else {
              this.toast.error('Category Not Found On This Customer');
            }
          });
      }
    });
  }

  handleDocuments() {
    this.journalDocuments.clear();
    for (let doc of this.journalDocs) {
      this.addDoc();
      const index = this.journalDocuments.length - 1;
      this.journalDocuments.at(index)?.patchValue({
        file: doc.image
      });
    }
    if (this.paramsType === 'edit' && this.journalDocuments.length === 0) {
      this.addDoc();
    }
  }

  getAllVoucherData = () => {
    this._configurationalMasterService.getAllVoucherData(this.entity_id).subscribe((res: any) => {
      this.rowData = res.data;
    }, (err: any) => {
      this.rowData = [];
    });
  }

  getAllVouchers() {
    this._configurationalMasterService.getVouchersByID(1, this.entity_id).subscribe((res: any) => {
      this.voucherData = res.data;
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

  vendorDetails(data: any, i: any) {
    this.vendor_id = data.id;
    this.getVendorData(data, i);
    this._finaceService.getVendorDetails(data.id).subscribe((res: any) => {
      if (res.data.length) {
        this.getCategoryData = res.data;
      } else {
        this.toast.error('Category not fount on this vendor');
      }
    });
  }

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
    const journal = this.createJournalEntryForm.get('general_number')?.value;
    return this.fb.group({
      chart_account_id: [null, Validators.required],
      nature: [null],
      party_type: [null],
      nature_id: [null],
      employee_id: [null],
      vendor_id: [null],
      customer_id: [null],
      tds_id: [null],
      tds_rate: [null],
      tds_rate_amount: [null],
      debit_amount: [null],
      credit_amount: [null],
      profit_center_id: [null],
      cost_center_id: [null],
      tax_rate: [null],
      tax_amount: [null],
      remarks: [null],
      journal_id: journal,
      id: null
    });
  }

  onAccountChange(event: any, i: any): void {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {
      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
      this.chartedAccount1 = this.chartedAccount.map((res: any) => res.account_name);
      this.chartedAccount2 = this.chartedAccount;
      this.chartedAccount.forEach((element1: any) => element1['hidden'] = false);
      this.chartedAccount.forEach((element1: any) => {
        this.Account_details.controls.forEach((element: any, index: any) => {
          const value = this.Account_details.controls[index]?.get('chart_account_id')?.value;
          if (value == element1.id) element1['hidden'] = true;
        });
      });
    });

    const selectedAccount = this.chartedAccount.find((acc: any) => acc.id === event.value);
    const chequeNoControl = this.createJournalreferanceForm.get('reference');
    const chequeDateControl = this.createJournalreferanceForm.get('reference_date');

    if (selectedAccount?.marks_cash_account === 'Bank') {
      chequeNoControl?.setValidators([Validators.required]);
      chequeDateControl?.setValidators([Validators.required]);
    } else {
      chequeNoControl?.clearValidators();
      chequeDateControl?.clearValidators();
    }
    chequeNoControl?.updateValueAndValidity();
    chequeDateControl?.updateValueAndValidity();

    this._finaceService.getAllServiceDataById(event.value).subscribe((res: any) => {
      if (res.data.length) {
        this.getServiceData = res.data;
        const formArray = this.Account_details as FormArray;
        const row = formArray.at(i) as FormGroup;
        row.patchValue({
          tax_rate: this.getServiceData[0]?.igst,
        });
      }
    });
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

  AddRow(): void {
    const newRow = this.createAccountDetailGroup();
    const index = this.Account_details.length;

    this.originalCurrencyValues.set(index, {
      debit_amount: 0,
      credit_amount: 0
    });

    this.Account_details.push(newRow);
    this.recalculateTotals();
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
      this.recalculateTotals();
    }
  }

  getCustomerDetail(data: any) {
    this._finaceService.getCustomerCategory(data.id).subscribe((res: any) => {
      if (res.data.length) {
        this.getCategoryData = res.data;
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
    }
    this.getChartAccountList();
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

  onPartyTypeChange(event: any, i: any): any {
    console.log(event.value);
    let party: any = "";
    this.partyTypeCheck = event.value;
    party = event.value;
    if (party == 'EMPLOYEE') {
      if (!Array.isArray(this.employeeParty)) {
        this.employeeParty[i] = [];
      }
      this.employeeParty[i] = [];
      this._finaceService.getGParty(party).subscribe((res: any) => {
        this.journalEmployeeParty = res.data;
        this.employeeParty[i] = this.journalEmployeeParty;
      });
      this.partyCustomer = false;
    } else if (party == 'CUSTOMER') {
      if (!Array.isArray(this.customerParty)) {
        this.customerParty[i] = [];
      }
      this.customerParty[i] = [];
      this._finaceService.getGParty(party).subscribe((res: any) => {
        let partyTypeCustomer = res.data;
        this.customerParty[i] = partyTypeCustomer;
      });
      this.partyCustomer = true;
    } else {
      if (!Array.isArray(this.vendorParty)) {
        this.vendorParty[i] = [];
      }
      this.vendorParty[i] = [];
      this._finaceService.getGParty(party).subscribe((res: any) => {
        this.journalParty = res.data;
        this.vendorParty[i] = this.journalParty;
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

  calculation(event: any, control: any, index: any) {
    const key = event.key;
    if (key == 'Tab') {
      return;
    }

    const row = this.Account_details.at(index);
    let currentDebit = Number(row.get('debit_amount')?.value || 0);
    let currentCredit = Number(row.get('credit_amount')?.value || 0);

    // Convert display currency to base INR
    const baseDebit = this.divideWithPrecision(currentDebit, this.currencyRate);
    const baseCredit = this.divideWithPrecision(currentCredit, this.currencyRate);

    this.originalCurrencyValues.set(index, {
      debit_amount: baseDebit,
      credit_amount: baseCredit
    });

    if (control == 'debit_amount') {
      this.Account_details.controls[index]?.get('credit_amount')?.setValue(0);
      this.originalCurrencyValues.set(index, {
        debit_amount: baseDebit,
        credit_amount: 0
      });
    }
    if (control == 'credit_amount') {
      this.Account_details.controls[index]?.get('debit_amount')?.setValue(0);
      this.originalCurrencyValues.set(index, {
        debit_amount: 0,
        credit_amount: baseCredit
      });
    }
    this.recalculateTotals();
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
        });
      });
    });
  }

  submitPublic(key: any): void {
    if (this.redColor) {
      this.toast.error('Debit and credit different should be 0');
      return;
    }

    if (this.createJournalEntryForm.valid && this.createJournalEntryItemForm.valid) {
      this._finaceService.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_id).subscribe({
        next: (res: any) => {
          if (!this.$common.checkCurrentMonthActive(res.data)) {
            this.toast.warning('Current month is not active');
            this.$common.hideLoader();
            return;
          }

          const accountDetails = this.Account_details.value;
          const accountDetailsInINR = accountDetails.map((item: any, index: number) => {
            const baseValues = this.originalCurrencyValues.get(index);
            if (baseValues) {
              return {
                ...item,
                debit_amount: baseValues.debit_amount || 0,
                credit_amount: baseValues.credit_amount || 0
              };
            }
            return {
              ...item,
              debit_amount: this.divideWithPrecision(item.debit_amount || 0, this.currencyRate),
              credit_amount: this.divideWithPrecision(item.credit_amount || 0, this.currencyRate)
            };
          });

          const totalDebitInINR = accountDetailsInINR.reduce((sum:any, item:any) => sum + (item.debit_amount || 0), 0);
          const totalCreditInINR = accountDetailsInINR.reduce((sum:any, item:any) => sum + (item.credit_amount || 0), 0);

          const grossTotalInINR = this.divideWithPrecision(this.gross_total || 0, this.currencyRate);
          const netAmountInINR = this.divideWithPrecision(this.net_amount || 0, this.currencyRate);
          const tdsAmountInINR = this.divideWithPrecision(this.tds_amount || 0, this.currencyRate);
          const gstTotalInINR = this.divideWithPrecision(this.gst_total || 0, this.currencyRate);
          const cgstAmountInINR = this.divideWithPrecision(this.cgst_amount || 0, this.currencyRate);
          const sgstAmountInINR = this.divideWithPrecision(this.sgst_amount || 0, this.currencyRate);

          let payload = {
            ...this.createJournalEntryForm.value,
            ...this.createJournalreferanceForm.value,
            financial_id: this.financial_id,
            Account_details: accountDetailsInINR,
            journal_book_status: 'Journal',
            totalDebit: this.roundToTwoDecimals(totalDebitInINR),
            totalCredit: this.roundToTwoDecimals(totalCreditInINR),
            different: this.roundToTwoDecimals(totalDebitInINR - totalCreditInINR),
            gross_total: grossTotalInINR,
            tds_amount: tdsAmountInINR,
            gst_total: gstTotalInINR,
            net_amount: netAmountInINR,
            cgst_amount: cgstAmountInINR,
            sgst_amount: sgstAmountInINR,
            currency_id: this.currencyData?.Currency_Convert_id,
            currency_rate: this.currencyRate
          };

          console.log(payload, 'payload with INR values');


          const bankAccountSelected = this.Account_details.controls.some(control => {
            const accountId = control.get('chart_account_id')?.value;
            const account = this.chartedAccount.find((acc: any) => acc.id === accountId);
            return account?.marks_cash_account === 'Bank';
          });




          this.bankAccountIds = [];
          this._finaceService.checkBankAccountForJournal(payload).subscribe((response: any) => {
            this.bankAccountIds = response?.data || [];
            let postingDate = this.createJournalEntryForm.get('posting_date')?.value;
            let newMonth = this._finaceService.getCurrentMonth();
            let isExistData = res.data.some((x: any) => x.month === newMonth);

            if (this.bankAccountIds?.length > 0 && (!this.createJournalreferanceForm.get('reference_date')?.value || !this.createJournalreferanceForm.get('reference')?.value)) {
              this.toast.warning('Please fill the Cheque Reference detail if you are selecting bank Account!');
              return;
            } else if (!isExistData && res.code === 200) {
              this.toast.warning(res.message);
              return;
            } else if (!isExistData && res.code === 201) {
              this.toast.warning(res.message);
              return;
            } else {
              let ref_date = this.createJournalreferanceForm.value?.reference_date;
              let transactn_date = moment(this.createJournalEntryForm.value?.transaction_date).format('YYYY-MM-DD');
              let reference_date = new Date(ref_date);
              reference_date.setDate(reference_date.getDate() + 1);

              let finalPayload = {
                id: this.journal_id,
                general_entry: this.createJournalEntryForm.value,
                reference: this.createJournalreferanceForm.value?.reference,
                transaction_date: transactn_date !== 'Invalid date' ? transactn_date : null,
                reference_date: reference_date,
                journal_book_status: 'Journal',
                account_detail: { Account_details: accountDetailsInINR },
                employee_id: this.createJournalEntryForm.value.employee_id,
                customer_id: this.createJournalEntryForm.value.customer_id,
                party_type: this.createJournalEntryForm.value.party_type,
                vendor_id: this.createJournalEntryForm.value.vendor_id,
                key: key,
                currency_id: this.currencyData?.Currency_Convert_id,
                currency_rate: this.currencyRate,
                totalDebit: this.roundToTwoDecimals(totalDebitInINR),
                totalCredit: this.roundToTwoDecimals(totalCreditInINR),
                different: this.roundToTwoDecimals(totalDebitInINR - totalCreditInINR),
                entity_id: this.entity_id,
                bill_number: this.createJournalEntryForm?.value?.bill_number,
                financial_posting: this.createJournalEntryForm?.value?.financial_posting,
                parent_journal_no: this.parent_journal_no,
                isReversal: this.reversal,
                gross_total: grossTotalInINR,
                tds_amount: tdsAmountInINR,
                gst_total: gstTotalInINR,
                net_amount: netAmountInINR
              };

              if (this.journal_id && this.reversal === false) {
                this._finaceService.UpdateGeneralBook(finalPayload, this.journal_id).subscribe((res: any) => {
                  this.toast.success('Journal Entry updated Successfully');
                  this.router.navigate(['/master/finance/journal/journal-ledger']);
                }, (err: any) => {
                  return this.toast.error(err.error.message);
                });
              } else {
                this._finaceService.createGeneralBook(finalPayload).subscribe((res: any) => {
                  this.toast.success('Journal Entry Submitted Successfully');
                  this.router.navigate(['/master/finance/journal/journal-ledger']);
                }, (err: any) => {
                  return this.toast.error(err.error.message);
                });
              }
            }
          });
        }, error: (err) => {
          if (err.error.code === 404) {
            this.toast.warning('This month is not active');
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
        this.createJournalEntryForm.get('document_type')?.reset();
        this.toast.warning(err.error.message);
      });
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
        this.advance_amount = res.advance_amount;
        if (this.recordData) {
          this.isCustomerSelected = true;
          this.createJournalEntryForm.patchValue({
            grand_total: parseFloat(this.recordData.grant_total) + parseFloat(this.recordData.gstTotal),
            gst_amount: this.recordData.gstTotal,
            gross_amount: this.recordData.grossTotal,
            discount_amount: this.recordData.totalAMTAfterDiscount,
          });
          const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
          if (!this.advance_amount) {
            while (accountDetailsArray.length < 3) {
              accountDetailsArray.push(this.createAccountDetailGroup());
            }
            accountDetailsArray.at(0).patchValue({
              chart_account_id: this.recordData.chart_of_account_id,
              credit_amount: 0,
              debit_amount: parseFloat(this.recordData.grant_total) + parseFloat(this.recordData.gstTotal)
            });
            accountDetailsArray.at(1).patchValue({
              chart_account_id: +this.recordData.map_account_id,
              credit_amount: this.recordData.grossTotal,
              debit_amount: 0
            });
            accountDetailsArray.at(2).patchValue({
              chart_account_id: this.recordData.igst_chart_account_id,
              credit_amount: this.recordData.gstTotal,
              debit_amount: 0
            });
            while (accountDetailsArray.length > 3) {
              accountDetailsArray.removeAt(accountDetailsArray.length - 1);
            }
          }
          if (+this.advance_amount) {
            while (accountDetailsArray.length < 4) {
              accountDetailsArray.push(this.createAccountDetailGroup());
            }
            accountDetailsArray.at(0).patchValue({
              chart_account_id: this.recordData.chart_of_account_id,
              credit_amount: 0,
              debit_amount: (parseFloat(this.recordData.grant_total) + parseFloat(this.recordData.gstTotal)) - parseFloat(this.advance_amount)
            });
            accountDetailsArray.at(1).patchValue({
              chart_account_id: +this.recordData.map_account_id,
              credit_amount: this.recordData.grossTotal,
              debit_amount: 0
            });
            accountDetailsArray.at(2).patchValue({
              chart_account_id: this.recordData.igst_chart_account_id,
              credit_amount: this.recordData.gstTotal,
              debit_amount: 0
            });
            accountDetailsArray.at(3).patchValue({
              chart_account_id: this.recordData.advanced_chart_of_account_id,
              credit_amount: 0,
              debit_amount: this.advance_amount
            });
          }
        }
      }, (err) => {
        this.isCustomerSelected = false;
        return this.toast.error(err.error.message);
      });
    }
  }

  getCustomerData(data: any) {
    this.customer_id = data.id;
  }

  getCustomerDetails(data: any) {
    this._finaceService.getCustomerCategory(data.id).subscribe((res: any) => {
      if (res.data.length) {
        this.getCategoryDatas = res.data;
      } else {
        this.toast.error('Category Not Found On This Customer');
      }
    }, (err: any) => {});
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
        this.customerPartyData = res.data;
        this.customerPartyData1 = this.customerPartyData.map((res: any) => res.company_name);
        this.customerPartyData2 = this.customerPartyData;
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

  filterCustomer(e: any) {
    const aa = e;
    let filteredVariable = this.customerPartyData2.filter((item: any) => aa.includes(item.company_name));
    this.customerPartyData = filteredVariable;
  }

  getVendorData(data: any, i: any) {
    this.vendor_id = data.id;
    this._finaceService.getVendorDataByTds(data.id).subscribe((res: any) => {
      console.log(res.data);
      this.totalAmount = +res.totalAmount;
      this.rcm_charge = data.rcm_charge;
      if (!res.data?.length) {
        return this.toast.warning('TDS Not Mapped On This Vendor');
      } else {
        this.getAllTdsSection = res.data;
      }
    });
    this.Account_details.controls.forEach((element: any) => {
      this.totalDebit = 0;
      this.totalCredit = 0;
      this.gross_total = 0;
      this.tds_amount = 0;
      this.gst_total = 0;
      this.net_amount = 0;
      this.sgst_amount = 0;
      this.cgst_amount = 0;
      element.reset();
    });
  }

  onPartyTypeNameSelect() {
    this.getAllVoucherData();
  }

  remove(i: number) {
    this.journalDocuments.removeAt(i);
  }

  getVendorTdsById(data: any, i: number) {
    this._finaceService.getVendorDataByTds(data.id).subscribe((res: any) => {
      console.log(res.data);
      this.vendor_id = data.id;
      if (!res.data?.length) {
        return this.toast.warning('TDS Not Mapped On This Vendor');
      } else {
        this.getAllTdsSection = res.data;
      }
      const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
      accountDetailsArray.reset();
    });
  }

  getAllNatureTransaction(data: any, i: any) {
    this.Account_details.controls[i].get('nature')?.setValue(data.nature);
    let vendor_id = this.Account_details.controls[i].get('vendor_id')?.value;
    this._finaceService.getTdsNatureOfTransaction(data.nature_id, this.vendor_id).subscribe((res: any) => {
      console.log(res.data);
      this.getAllNatureOfTrsanction[i] = res.data;
    });
  }

  getTdsRateData(data: any, i: number) {
    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
    const row = accountDetailsArray.at(i) as FormGroup;
    this.maximum_amount = +data.maximum_amount || 0;
    this.threshold_limit = +data.threshold_limit || 0;
    row.get('tds_rate')?.setValue(+data.current_rate || 0, { emitEvent: false });
    const tdsRate = +data.current_rate || 0;
    let debitAmountRaw = row.get('debit_amount')?.value || '0';
    const debitAmount = parseFloat(debitAmountRaw.toString().replace(/,/g, '').replace(/[^\d.-]/g, '')) || 0;
    let creditAmountRaw = row.get('credit_amount')?.value || '0';
    const creditAmount = parseFloat(creditAmountRaw.toString().replace(/,/g, '').replace(/[^\d.-]/g, '')) || 0;
    const amount = debitAmount > 0 ? debitAmount : creditAmount;
    const totalAmountData = amount + (+this.totalAmount || 0);
    let tdsAmount = 0;
    if (totalAmountData > this.maximum_amount) {
      tdsAmount = (amount * tdsRate) / 100;
    }
    row.get('tds_rate_amount')?.setValue(tdsAmount.toFixed(2), { emitEvent: false });
    this.tds_amount = tdsAmount;
    this.redColor = false;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setColumnDefs(this.columnDefs);
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
        this.document_value = res.document_value;
        this.amount_paid_now = res.amount_paid_now;
        this.advance_payment_type = res.payment_type;
        this.done_payment_from_vendor = res.done_payment_from_vendor;
        this.historyData = res.data;
        this.createJournalEntryForm.patchValue({
          document_value: res.document_value,
          amount_paid_now: res.amount_paid_now,
          amount_due: res.amount_due
        });
      }, (err: any) => {
        return this.toast.error(err.error.message);
      });
    } else {
      this.isChecked = false;
    }
  }

  calculations(event: any, field: string, index: number): void {
    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
    this.gross_total = 0;
    this.tds_amount = 0;
    this.gst_total = 0;

    accountDetailsArray.controls.forEach((element: any, idx: number) => {
      let debit = Number(element.get('debit_amount')?.value) || 0;
      let credit = Number(element.get('credit_amount')?.value) || 0;

      if (idx === index) {
        if (field === 'debit_amount' && debit > 0) {
          element.get('credit_amount')?.setValue(0, { emitEvent: false });
          credit = 0;
        }
        if (field === 'credit_amount' && credit > 0) {
          element.get('debit_amount')?.setValue(0, { emitEvent: false });
          debit = 0;
        }
      }

      const rate = Number(element.get('tax_rate')?.value) || 0;
      const tdsRate = Number(element.get('tds_rate')?.value) || 0;
      const amount = debit > 0 ? debit : credit;

      // Convert to base INR for calculation
      const baseAmount = this.divideWithPrecision(amount, this.currencyRate);

      let tds = 0;
      const totalamountData = baseAmount + (Number(this.totalAmount) || 0);
      if (totalamountData > Number(this.maximum_amount || 0)) {
        tds = (baseAmount * tdsRate) / 100;
      }
      const displayTds = this.multiplyWithPrecision(tds, this.currencyRate);
      element.get('tds_rate_amount')?.setValue(displayTds.toFixed(2), { emitEvent: false });
      this.tds_amount += displayTds;

      if (rate > 0) {
        const gst = (baseAmount * rate) / 100;
        const displayGst = this.multiplyWithPrecision(gst, this.currencyRate);
        this.gst_total += displayGst;
        element.get('tax_amount')?.setValue(displayGst.toFixed(2), { emitEvent: false });
      } else {
        element.get('tax_amount')?.setValue(0, { emitEvent: false });
      }
    });

    // Calculate gross total from base values
    let baseGrossTotal = 0;
    this.Account_details.controls.forEach((element: any, idx: number) => {
      const baseValues = this.originalCurrencyValues.get(idx);
      if (baseValues) {
        const amount = baseValues.debit_amount > 0 ? baseValues.debit_amount : baseValues.credit_amount;
        baseGrossTotal += amount;
      }
    });
    this.gross_total = this.multiplyWithPrecision(baseGrossTotal, this.currencyRate);

    this.cgst_amount = this.gst_total / 2;
    this.sgst_amount = this.gst_total / 2;
    this.net_amount = this.gross_total + (this.rcm_charge == 0 ? (this.cgst_amount + this.sgst_amount) : 0) - this.tds_amount;

    this.recalculateTotals();
  }

  recalculateTotals(): void {
    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;

    let baseTotalDebit = 0;
    let baseTotalCredit = 0;

    accountDetailsArray.controls.forEach((row: any, index: number) => {
      const baseValues = this.originalCurrencyValues.get(index);
      if (baseValues) {
        baseTotalDebit += baseValues.debit_amount || 0;
        baseTotalCredit += baseValues.credit_amount || 0;
      } else {
        const debit = Number(row.get('debit_amount')?.value) || 0;
        const credit = Number(row.get('credit_amount')?.value) || 0;
        baseTotalDebit += this.divideWithPrecision(debit, this.currencyRate);
        baseTotalCredit += this.divideWithPrecision(credit, this.currencyRate);
      }
    });

    this.totalDebit = this.multiplyWithPrecision(baseTotalDebit, this.currencyRate);
    this.totalCredit = this.multiplyWithPrecision(baseTotalCredit, this.currencyRate);
    this.Different = this.roundToTwoDecimals(this.totalDebit - this.totalCredit);
    this.redColor = this.Different !== 0;
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
      this.isCustomerSelected = false;
      this.Account_details.reset();
      this.Account_details.removeAt(2);
      this.Account_details.removeAt(3);
    } else if (control === 'customer_id' && control === 'proforma_invoice_id') {
      this.customer_id = '';
      this.documentType = null;
      this.vendor_id = null;
      this.isChecked = false;
      this.isCustomerSelected = false;
      this.Account_details.reset();
      this.Account_details.removeAt(2);
      this.Account_details.removeAt(3);
    } else {
      this.customer_id = '';
      this.documentType = null;
      this.vendor_id = null;
      this.isChecked = false;
      this.isCustomerSelected = false;
      this.Account_details.reset();
      this.Account_details.removeAt(2);
      this.Account_details.removeAt(3);
    }
  }
}
