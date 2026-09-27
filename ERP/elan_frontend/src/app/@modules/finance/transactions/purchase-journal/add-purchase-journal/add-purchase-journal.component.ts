import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SalesManagementService } from 'src/app/@modules/sales-management/sales-management-service/sales-management.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { environment } from 'src/app/environments/environment';
import { AddChartAccountComponent } from '../../../add-chart-account/add-chart-account.component';
import { SalesService } from 'src/app/@modules/sales/service/sales.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { LedgerPreviewService } from 'src/app/@shared/ledgerPreview/services/ledger-preview.service';

@Component({
  selector: 'app-add-purchase-journal',
  templateUrl: './add-purchase-journal.component.html',
  styleUrls: ['./add-purchase-journal.component.scss']
})
export class AddPurchaseJournalComponent {
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

  currencyData: any = [];
  currencyCode: string = 'INR';
  currencySymbol: string = '₹';
  currencyRate: number = 1;
  private isUpdatingCurrency: boolean = false;
  private isCalculating: boolean = false;

  lessAmountInINR: number = 0;

  dataListBilling: any = [];
  selectedBranchStateId: any;
  selectedVendorStateId: any;

  branchStateId: string = '';
  vendorStateId: string = '';
  isIntraState: boolean = true;
  selectedBranchData: any = null;
  branchName: string = '';
  vendorStateName: string = '';

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
    private _empService: EmpRegistrationService,
    private salesService: SalesService,
    private vendorService: VendorManagementService,
    private ledgerPreviewService: LedgerPreviewService,
  ) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    this.maxDate = moment({ year: year + 100, month, date }).format('YYYY-MM-DD');
    this.minDate = moment({ year, month, date }).format('YYYY-MM-DD');

    this.createJournalEntryForm = this.fb.group({
      posting_date: [null],
      entity_id: [null],
      voucher_id: [null],
      currency_id: [null],
      document_number: [null, Validators.required],
      transaction_date: [null],
      branch_id: [null],
      reference_number: [null],
      vendor_id: [null],
      party_type: ['VENDOR'],
      nature: [null],
      nature_id: [null],
      tds_id: [null],
      document_type: [null],
      others: [null],
      po_id: [null],
      grn_id: [null],
      invoice_id: [null],
      sales_order_id: [null],
      delivery_order_id: [null],
      sales_invoice_id: [null],
      document_value: [null],
      notes: [null],
      document_po_value: [null],
      less_amount: [0],
      billing_id: [null]
    });

    this.createJournalEntryItemForm = this.fb.group({
      Account_details: this.fb.array([this.createAccountDetailGroup()])
    });

    this.createJournalreferanceForm = this.fb.group({
      reference: [null],
      reference_date: [null],
      total_tds_amount: [null],
      purchase_value: [null],
      bill_amount: [null]
    });
  }

  customerParty1: any[] = [];
  customerParty2: any[] = [];
  financial_id: any;
  journalDocs: any;
  getUserRole: any;
  getEmployeeList: any = [];

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

  get displayedLessAmount(): number {
    return this.multiplyWithPrecision(this.lessAmountInINR, this.currencyRate);
  }

  ngOnInit() {
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        if (!currency || this.isUpdatingCurrency) return;

        this.isUpdatingCurrency = true;
        const oldRate = this.currencyRate;
        this.currencyData = currency;
        this.createJournalEntryForm.get('currency_id')?.setValue(this.currencyData.Currency_Convert_id);
        this.currencyCode = currency.Currency_Type || currency.symbols || 'INR';
        this.currencyRate = Number(currency.rate);
        this.currencySymbol = currency.symbols || '₹';

        this.updateAmountsWithCurrencyRate(oldRate);

        setTimeout(() => {
          this.isUpdatingCurrency = false;
        }, 100);
      });

    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");
    localStorage.setItem('employee_id:', 'undefined');
    const signInUserData = localStorage.getItem('signInUser');

    if (signInUserData) {
      const signInUserObject = JSON.parse(signInUserData);
      this.getUserRole = signInUserObject;
    } else {
      console.log('Value for signInUser not found in localStorage');
    }
    let entity_id = localStorage.getItem("selectedEntityId");

    this._empService.grtEmployeeList(entity_id, this.getUserRole).subscribe((res: any) => {
      this.getEmployeeList = res.data;
    });

    this.getChartAccountList();
    this.getAllVouchers();
    this.getCurrency();
    this.getAllVendor();
    this.getAllCustomerList();
    this.getAllItem();
    this.getAllBranch();
    this.getAllProfitCenter();
    this.getAllCostCenter();
    this.getAllBank();

    this.activeroute.queryParams.subscribe((params: any) => {
      this.journal_id = params.id;
      this.paramsType = params.actionType;
      this.isView = params.actionType === 'view' ? true : false;
      this.tabType = params.tabType;
      this.randomJournalNumber = "";

      if (this.journal_id && this.Account_details.length > 0) {
        this.Account_details.removeAt(0);

        this._finaceService.purchaseJournalById(this.journal_id).subscribe((res: any) => {
          if (res.code == 200) {
            this.singleGeneral = res.data;
            this.lessAmountInINR = Number(this.singleGeneral.less_amount) || 0;

            this._finaceService.getVendorDataByTds(this.singleGeneral.vendor_id)
              .subscribe((res: any) => {
                console.log(res.data);
                if (!res.data?.length) {
                  this.getAllTdsSection = [];
                  return this.toast.warning('TDS Not Mapped On This Vendor');
                }
                this.getAllTdsSection = res.data;
                this.calculateTotals();
              });

            this.accountDetailList = res.account_list;
            this.parent_journal_no = this.singleGeneral.parent_journal_no;

            this.createJournalEntryForm.patchValue({
              posting_date: this.singleGeneral.posting_date,
              document_number: this.singleGeneral.document_number,
              transaction_date: this.singleGeneral.transaction_date,
              entity_id: this.entity_id,
              notes: this.singleGeneral.notes,
              voucher_id: this.singleGeneral.voucher_list_id,
              reference_number: this.singleGeneral.reference_number,
              vendor_id: this.singleGeneral.vendor_id,
              party_type: this.singleGeneral.party_type,
              document_type: this.singleGeneral.document_type,
              tds_id: this.singleGeneral.tds_id,
              branch_id: this.singleGeneral.branch_id,
              nature_id: this.singleGeneral.nature_id,
              less_amount: this.singleGeneral.less_amount || 0,
            });
            this.getBillingAddressById(this.singleGeneral.vendor_id); setTimeout(() => {
              this.createJournalEntryForm.patchValue({ billing_id: this.singleGeneral.billing_id });
            }, 300);
            this._finaceService.getTdsNatureOfTransaction(this.singleGeneral.nature_id, this.singleGeneral.vendor_id)
              .subscribe((res: any) => {
                console.log(res.data);
                this.getAllNatureOfTrsanction = res.data;
              });

            this.isVendorRcm = this.singleGeneral.rcm_charge;

            this.singleGeneral.account_list.forEach((elm: any) => {
              const baseRate = elm.rate || 0;
              const baseQty = elm.qty || 1;
              const baseTax = elm.value || 0;
              const baseTdsAmount = elm.tds_rate_amount || 0;
              const baseGstAmount = elm.gst_amount || 0;
              const baseFinalAmount = elm.final_amount || 0;

              let baseTdsRate = elm.tds_rate || 0;
              if (baseTdsRate === 0 && baseTdsAmount > 0 && baseRate > 0 && baseQty > 0) {
                const totalAmount = baseRate * baseQty;
                baseTdsRate = this.roundToTwoDecimals((baseTdsAmount / totalAmount) * 100);
              }

              const index = this.Account_details.length;
              this.originalCurrencyValues.set(index, {
                rate: baseRate,
                qty: baseQty,
                tax: baseTax,
                tds_rate: baseTdsRate,
                tds_rate_amount: baseTdsAmount,
                gst_amount: baseGstAmount,
                final_amount: baseFinalAmount,
                gross_amount: (baseRate * baseQty) + baseGstAmount,
                cgst_amount: 0,
                sgst_amount: 0,
                igst_amount: 0,
                remarks:elm.remarks
              });

              const isIgst = Number(this.vendorStateId) !== Number(this.branchStateId);
              let cgst = 0, sgst = 0, igst = 0;
              if (isIgst) {
                igst = baseGstAmount;
              } else {
                cgst = this.roundToTwoDecimals(baseGstAmount / 2);
                sgst = this.roundToTwoDecimals(baseGstAmount / 2);
              }

              let controls = this.fb.group({
                item_id: [elm.item_id],
                item_code: [elm.item_code],
                hsn_code: [elm.hsn_sac_code],
                tax: [baseTax],
                qty: [baseQty],
                rate: [this.multiplyWithPrecision(baseRate, this.currencyRate)],
                gst_amount: [this.multiplyWithPrecision(baseGstAmount, this.currencyRate)],
                profit_center_id: [elm.profit_center_id],
                cost_center_id: [elm.cost_center_id],
                tds_rate: [baseTdsRate],
                tds_rate_amount: [this.multiplyWithPrecision(baseTdsAmount, this.currencyRate)],
                final_amount: [this.multiplyWithPrecision(baseFinalAmount, this.currencyRate)],
                gross_amount: [this.multiplyWithPrecision((baseRate * baseQty) + baseGstAmount, this.currencyRate)],
                cgst_amount: [this.multiplyWithPrecision(cgst, this.currencyRate)],
                sgst_amount: [this.multiplyWithPrecision(sgst, this.currencyRate)],
                igst_amount: [this.multiplyWithPrecision(igst, this.currencyRate)],
                is_igst: [isIgst],
                remarks: [elm.remarks],
                id: null
              });
              this.Account_details.push(controls);
            });

            this.calculateTotals();
          }
        }, (err) => {});
      } else {
        const posting_date = moment(new Date()).format('YYYY-MM-DD');
        this.createJournalEntryForm.patchValue({
          entity_id: this.entity_id,
          posting_date: posting_date
        });
      }
    });
  }

  getBranchDetailsFromList(branchId: any) {
    const selectedBranch = this.getAllBranchData.find((branch: any) => branch.id === branchId);
    if (selectedBranch) {
      this.selectedBranchData = selectedBranch;
      this.branchStateId = selectedBranch.state_id || '';
      this.branchName = selectedBranch.branch_name || '';
      this.updateGSTCalculation();
    }
  }

  updateGSTCalculation() {
    this.isIntraState = this.branchStateId && this.vendorStateId
      ? this.branchStateId === this.vendorStateId
      : true;
    this.calculateTotals();
  }

  getBillingAddressById(vendor_id: any) {
    this._finaceService.getBillingAddressById(vendor_id).subscribe((res: any) => {
      this.dataListBilling = res.data;
    });
  }

  calculateLessAmount(amount: any): void {
    const enteredValue = Number(amount) || 0;
    this.lessAmountInINR = this.divideWithPrecision(enteredValue, this.currencyRate);

    const inrVendorPayable = this.summary.vendorPayable ? this.divideWithPrecision(this.summary.vendorPayable, this.currencyRate) : 0;
    const inrPayable = this.roundToTwoDecimals(inrVendorPayable - this.lessAmountInINR);
    this.summary.payableAmount = this.multiplyWithPrecision(inrPayable, this.currencyRate);

    this.createJournalEntryForm.patchValue({
      less_amount: this.lessAmountInINR
    });
  }

  updateLessAmountDisplay(): void {
    const inrVendorPayable = this.summary.vendorPayable ? this.divideWithPrecision(this.summary.vendorPayable, this.currencyRate) : 0;
    const inrPayable = this.roundToTwoDecimals(inrVendorPayable - this.lessAmountInINR);
    this.summary.payableAmount = this.multiplyWithPrecision(inrPayable, this.currencyRate);
  }

  get Currency_Details() {
    return this.createJournalEntryForm.get('currency_id');
  }

  getCurrency() {
    this._configurationalMasterService.CurrencyList().subscribe((res: any) => {
      this.currencyData = res.data;
    });
  }

  changeCurrencyAmount(data: any) {
    console.log(data);
    const oldRate = this.currencyRate;
    this.currencyCode = data.Currency_Type || data.symbols || 'INR';
    this.currencySymbol = data.symbols || '₹';
    this.currencyRate = Number(data.rate);
    console.log({
      code: this.currencyCode,
      symbol: this.currencySymbol,
      rate: this.currencyRate
    });
    this.updateAmountsWithCurrencyRate(oldRate);
  }

  updateAmountsWithCurrencyRate(oldRate: number = 1) {
    if (oldRate === this.currencyRate) return;

    this.Account_details.controls.forEach((control: any, index: number) => {
      const originalValue = this.originalCurrencyValues.get(index);
      if (originalValue) {
        const newRate = this.multiplyWithPrecision(originalValue.rate, this.currencyRate);
        const newGstAmount = this.multiplyWithPrecision(originalValue.gst_amount, this.currencyRate);
        const newTdsAmount = this.multiplyWithPrecision(originalValue.tds_rate_amount, this.currencyRate);
        const newFinalAmount = this.multiplyWithPrecision(originalValue.final_amount, this.currencyRate);
        const newGrossAmount = this.multiplyWithPrecision(originalValue.gross_amount, this.currencyRate);

        const isIgst = Number(this.vendorStateId) !== Number(this.branchStateId);
        let cgst = 0, sgst = 0, igst = 0;

        if (isIgst) {
          igst = newGstAmount;
        } else {
          cgst = this.roundToTwoDecimals(newGstAmount / 2);
          sgst = this.roundToTwoDecimals(newGstAmount / 2);
        }

        control.patchValue({
          rate: newRate,
          tds_rate_amount: newTdsAmount,
          gst_amount: newGstAmount,
          final_amount: newFinalAmount,
          gross_amount: newGrossAmount,
          cgst_amount: cgst,
          sgst_amount: sgst,
          igst_amount: igst
        }, { emitEvent: false });
      }
    });

    this.createJournalEntryForm.patchValue({
      less_amount: this.lessAmountInINR
    });

    const totalTdsBase = this.createJournalreferanceForm.get('total_tds_amount')?.value || 0;
    const purchaseValueBase = this.createJournalreferanceForm.get('purchase_value')?.value || 0;
    const billAmountBase = this.createJournalreferanceForm.get('bill_amount')?.value || 0;

    if (totalTdsBase) {
      this.createJournalreferanceForm.patchValue({
        total_tds_amount: this.multiplyWithPrecision(totalTdsBase, this.currencyRate)
      }, { emitEvent: false });
    }

    if (purchaseValueBase) {
      this.createJournalreferanceForm.patchValue({
        purchase_value: this.multiplyWithPrecision(purchaseValueBase, this.currencyRate)
      }, { emitEvent: false });
    }

    if (billAmountBase) {
      this.createJournalreferanceForm.patchValue({
        bill_amount: this.multiplyWithPrecision(billAmountBase, this.currencyRate)
      }, { emitEvent: false });
    }

    this.updateLessAmountDisplay();
    this.calculateTotalsWithoutStore();
  }

  originalCurrencyValues = new Map<number, any>();

  storeCurrencyBaseValue(index: number) {
    const row: any = this.Account_details.at(index);

    const displayRate = Number(row.get('rate')?.value || 0);
    const displayQty = Number(row.get('qty')?.value || 0);
    const displayTax = Number(row.get('tax')?.value || 0);
    const displayTdsRate = Number(row.get('tds_rate')?.value || 0);

    const inrRate = this.divideWithPrecision(displayRate, this.currencyRate);
    const inrQty = displayQty;
    const inrTax = displayTax;
    const inrTdsRate = displayTdsRate;

    const inrAmount = this.roundToTwoDecimals(inrQty * inrRate);
    const inrGstAmount = this.roundToTwoDecimals((inrAmount * inrTax) / 100);
    const inrTdsAmount = this.roundToTwoDecimals((inrAmount * inrTdsRate) / 100);
    const inrGrossAmount = this.roundToTwoDecimals(inrAmount + inrGstAmount);
    const inrFinalAmount = this.roundToTwoDecimals(inrGrossAmount - inrTdsAmount);

    this.originalCurrencyValues.set(index, {
      rate: inrRate,
      qty: inrQty,
      tax: inrTax,
      tds_rate: inrTdsRate,
      tds_rate_amount: inrTdsAmount,
      gst_amount: inrGstAmount,
      final_amount: inrFinalAmount,
      gross_amount: inrGrossAmount,
      cgst_amount: 0,
      sgst_amount: 0,
      igst_amount: 0
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

  geAllItem: any = [];
  getAllItem() {
    let payload = {
      page: null,
      pageSize: null
    };
    this._configurationalMasterService.getAllItem(payload).subscribe((res: any) => {
      this.geAllItem = res.data.reverse();
    });
  }

  customerList: any = [];
  getAllCustomerList() {
    let data = {
      entity_id: this.entity_id,
      financial_year_id: this.financial_id,
      employee_id: this.getUserRole?.employee_id,
      userRole: this.getUserRole?.role
    };
    this.salesService.getAllCustomersList(data).subscribe((res: any) => {
      if (res) {
        this.customerList = res.data;
      }
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

  vendorDetails(data: any, index: any) {
    this._finaceService.getVendorDetails(data.id).subscribe((res: any) => {
      if (res.data.length) {
        this.getCategoryData[index] = res.data;
      } else {
        this.toast.error('Category not found on this vendor');
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

  chartedAccount1: any[] = [];
  chartedAccount2: any[] = [];

  getChartAccountList() {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {
      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
      this.chartedAccount1 = this.chartedAccount.map((res: any) => res.account_name);
      this.chartedAccount2 = this.chartedAccount;
    });
  }

  voucherData: any = [];
  getAllVouchers() {
    this._configurationalMasterService.getVouchersByID(8, this.entity_id).subscribe((res: any) => {
      this.voucherData = res.data;
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
      item_id: [null],
      item_code: [null],
      hsn_code: [null],
      tax: [null],
      qty: [null],
      rate: [null],
      gst_amount: [0],
      profit_center_id: [null],
      cost_center_id: [null],
      tds_rate: [null],
      tds_rate_amount: [null],
      remarks: [null],
      journal_id: journal,
      final_amount: [0],
      gross_amount: [0],
      cgst_amount: [0],
      sgst_amount: [0],
      igst_amount: [0],
      is_igst: [false],
      id: null
    });
  }

  getItemCode(data: any, i: any) {
    let controls = this.Account_details.at(i);
    controls.get('item_code')?.setValue(data.item_code);
    controls.get('hsn_code')?.setValue(data.MASTER_HSN_SAC_CODE?.hsn_sac_code);
    controls.get('tax')?.setValue(data.MASTER_HSN_SAC_CODE?.gst_value);
    this.calculateTotals();
  }

  AddRow(): void {
    const lastRowIndex = this.Account_details.length - 1;
    let lastTdsRate = null;
    if (lastRowIndex >= 0) {
      lastTdsRate = this.Account_details.at(lastRowIndex).get('tds_rate')?.value || null;
    }
    const newRow = this.createAccountDetailGroup();
    newRow.patchValue({
      tds_rate: lastTdsRate
    });
    this.Account_details.push(newRow);
    this.calculateTotals();
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
    this.Account_details.reset();
    this.createJournalEntryForm.get('document_value')?.reset();
    if (this.Account_details.value.length > 1) {
      this.Account_details.removeAt(0);
    }
  }

  clearDropdown(control: any, index: any) {
    this.Account_details.controls[index].get(control)?.setValue(null);
  }

  clearPartyDropdown(control: any, index: any) {
    this.Account_details.controls[index].get(control)?.setValue(null);
    this.Account_details.controls[index].get('employee_id')?.setValue(null);
    this.Account_details.controls[index].get('vendor_id')?.setValue(null);
  }

  clearreferenceDate(control: any) {}

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

  tds_rate_amount: any;

  calculation(event: any, field: string, index: number): void {
    this.storeCurrencyBaseValue(index);
    this.calculateTotals();
  }

  summary = {
    taxable: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    gstTotal: 0,
    gross: 0,
    net: 0,
    tdsAmt: 0,
    vendorPayable: 0,
    rcmLiability: 0,
    payableAmount: 0,
    isIntraState: true,
    branchStateId: '',
    vendorStateId: ''
  };

  calculateTotals(): void {
    if (this.isCalculating) return;
    this.isCalculating = true;

    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;

    let inrTotal = 0;
    let inrTotalTdsAmount = 0;
    let inrTotalGstAmount = 0;
    let inrTotalCgst = 0;
    let inrTotalSgst = 0;
    let inrTotalIgst = 0;

    const isIgst = Number(this.vendorStateId) !== Number(this.branchStateId);

    accountDetailsArray.controls.forEach((row: AbstractControl, index: number) => {
      this.storeCurrencyBaseValue(index);

      const baseValues = this.originalCurrencyValues.get(index);
      if (!baseValues) {
        this.originalCurrencyValues.set(index, {
          rate: 0,
          qty: 0,
          tax: 0,
          tds_rate: 0,
          tds_rate_amount: 0,
          gst_amount: 0,
          final_amount: 0,
          gross_amount: 0,
          cgst_amount: 0,
          sgst_amount: 0,
          igst_amount: 0
        });
        return;
      }

      const inrRate = baseValues.rate || 0;
      const inrQty = baseValues.qty || 1;
      const inrTax = baseValues.tax || 0;
      const inrTdsRate = baseValues.tds_rate || 0;

      const inrAmount = this.roundToTwoDecimals(inrQty * inrRate);
      const inrGstAmount = this.roundToTwoDecimals((inrAmount * inrTax) / 100);
      const inrTdsAmount = this.roundToTwoDecimals((inrAmount * inrTdsRate) / 100);

      let inrGrossAmount = this.roundToTwoDecimals(inrAmount + inrGstAmount);
      if (this.isVendorRcm) {
        inrGrossAmount = inrAmount;
      }

      const inrFinalAmount = this.roundToTwoDecimals(inrGrossAmount - inrTdsAmount);

      let inrCgst = 0;
      let inrSgst = 0;
      let inrIgst = 0;

      if (isIgst) {
        inrIgst = inrGstAmount;
        inrCgst = 0;
        inrSgst = 0;
      } else {
        inrCgst = this.roundToTwoDecimals(inrGstAmount / 2);
        inrSgst = this.roundToTwoDecimals(inrGstAmount / 2);
        inrIgst = 0;
      }

      inrTotal += inrAmount;
      inrTotalGstAmount += inrGstAmount;
      inrTotalTdsAmount += inrTdsAmount;
      inrTotalCgst += inrCgst;
      inrTotalSgst += inrSgst;
      inrTotalIgst += inrIgst;

      const displayedRate = this.multiplyWithPrecision(inrRate, this.currencyRate);
      const displayedGstAmount = this.multiplyWithPrecision(inrGstAmount, this.currencyRate);
      const displayedTdsAmount = this.multiplyWithPrecision(inrTdsAmount, this.currencyRate);
      const displayedFinalAmount = this.multiplyWithPrecision(inrFinalAmount, this.currencyRate);
      const displayedGrossAmount = this.multiplyWithPrecision(inrGrossAmount, this.currencyRate);
      const displayedCgst = this.multiplyWithPrecision(inrCgst, this.currencyRate);
      const displayedSgst = this.multiplyWithPrecision(inrSgst, this.currencyRate);
      const displayedIgst = this.multiplyWithPrecision(inrIgst, this.currencyRate);

      row.patchValue({
        rate: displayedRate,
        gst_amount: displayedGstAmount,
        tds_rate_amount: displayedTdsAmount,
        final_amount: displayedFinalAmount,
        gross_amount: displayedGrossAmount,
        cgst_amount: displayedCgst,
        sgst_amount: displayedSgst,
        igst_amount: displayedIgst,
        is_igst: isIgst
      }, { emitEvent: false });

      this.originalCurrencyValues.set(index, {
        rate: inrRate,
        qty: inrQty,
        tax: inrTax,
        tds_rate: inrTdsRate,
        tds_rate_amount: inrTdsAmount,
        gst_amount: inrGstAmount,
        final_amount: inrFinalAmount,
        gross_amount: inrGrossAmount,
        cgst_amount: inrCgst,
        sgst_amount: inrSgst,
        igst_amount: inrIgst
      });
    });

    let inrGross = this.roundToTwoDecimals(inrTotal + inrTotalGstAmount);
    let inrVendorPayable = this.roundToTwoDecimals(inrGross - inrTotalTdsAmount);
    let inrRcmLiability = 0;

    if (this.isVendorRcm) {
      inrGross = inrTotal;
      inrVendorPayable = this.roundToTwoDecimals(inrTotal - inrTotalTdsAmount);
      inrRcmLiability = inrTotalGstAmount;
    }

    const inrPayableAmount = this.roundToTwoDecimals(inrVendorPayable - this.lessAmountInINR);

    this.summary = {
      taxable: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotal), this.currencyRate),
      cgst: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotalCgst), this.currencyRate),
      sgst: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotalSgst), this.currencyRate),
      igst: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotalIgst), this.currencyRate),
      gstTotal: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotalGstAmount), this.currencyRate),
      gross: this.multiplyWithPrecision(this.roundToTwoDecimals(inrGross), this.currencyRate),
      net: this.multiplyWithPrecision(this.roundToTwoDecimals(inrVendorPayable), this.currencyRate),
      tdsAmt: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotalTdsAmount), this.currencyRate),
      vendorPayable: this.multiplyWithPrecision(this.roundToTwoDecimals(inrVendorPayable), this.currencyRate),
      rcmLiability: this.multiplyWithPrecision(this.roundToTwoDecimals(inrRcmLiability), this.currencyRate),
      payableAmount: this.multiplyWithPrecision(this.roundToTwoDecimals(inrPayableAmount), this.currencyRate),
      isIntraState: !isIgst,
      branchStateId: this.branchStateId,
      vendorStateId: this.vendorStateId
    };

    this.createJournalreferanceForm.patchValue({
      total_tds_amount: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotalTdsAmount), this.currencyRate),
      purchase_value: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotal), this.currencyRate),
      bill_amount: this.multiplyWithPrecision(this.roundToTwoDecimals(inrVendorPayable), this.currencyRate)
    }, { emitEvent: false });

    this.isCalculating = false;
  }

  calculateTotalsWithoutStore(): void {
    if (this.isCalculating) return;
    this.isCalculating = true;

    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;

    let inrTotal = 0;
    let inrTotalTdsAmount = 0;
    let inrTotalGstAmount = 0;
    let inrTotalCgst = 0;
    let inrTotalSgst = 0;
    let inrTotalIgst = 0;

    const isIgst = Number(this.vendorStateId) !== Number(this.branchStateId);

    accountDetailsArray.controls.forEach((row: AbstractControl, index: number) => {
      const baseValues = this.originalCurrencyValues.get(index);
      if (!baseValues) {
        return;
      }

      const inrRate = baseValues.rate || 0;
      const inrQty = baseValues.qty || 1;
      const inrTax = baseValues.tax || 0;
      const inrTdsRate = baseValues.tds_rate || 0;

      const inrAmount = this.roundToTwoDecimals(inrQty * inrRate);
      const inrGstAmount = this.roundToTwoDecimals((inrAmount * inrTax) / 100);
      const inrTdsAmount = this.roundToTwoDecimals((inrAmount * inrTdsRate) / 100);

      let inrGrossAmount = this.roundToTwoDecimals(inrAmount + inrGstAmount);
      if (this.isVendorRcm) {
        inrGrossAmount = inrAmount;
      }

      const inrFinalAmount = this.roundToTwoDecimals(inrGrossAmount - inrTdsAmount);

      let inrCgst = 0;
      let inrSgst = 0;
      let inrIgst = 0;

      if (isIgst) {
        inrIgst = inrGstAmount;
        inrCgst = 0;
        inrSgst = 0;
      } else {
        inrCgst = this.roundToTwoDecimals(inrGstAmount / 2);
        inrSgst = this.roundToTwoDecimals(inrGstAmount / 2);
        inrIgst = 0;
      }

      inrTotal += inrAmount;
      inrTotalGstAmount += inrGstAmount;
      inrTotalTdsAmount += inrTdsAmount;
      inrTotalCgst += inrCgst;
      inrTotalSgst += inrSgst;
      inrTotalIgst += inrIgst;

      const displayedRate = this.multiplyWithPrecision(inrRate, this.currencyRate);
      const displayedGstAmount = this.multiplyWithPrecision(inrGstAmount, this.currencyRate);
      const displayedTdsAmount = this.multiplyWithPrecision(inrTdsAmount, this.currencyRate);
      const displayedFinalAmount = this.multiplyWithPrecision(inrFinalAmount, this.currencyRate);
      const displayedGrossAmount = this.multiplyWithPrecision(inrGrossAmount, this.currencyRate);
      const displayedCgst = this.multiplyWithPrecision(inrCgst, this.currencyRate);
      const displayedSgst = this.multiplyWithPrecision(inrSgst, this.currencyRate);
      const displayedIgst = this.multiplyWithPrecision(inrIgst, this.currencyRate);

      row.patchValue({
        rate: displayedRate,
        gst_amount: displayedGstAmount,
        tds_rate_amount: displayedTdsAmount,
        final_amount: displayedFinalAmount,
        gross_amount: displayedGrossAmount,
        cgst_amount: displayedCgst,
        sgst_amount: displayedSgst,
        igst_amount: displayedIgst,
        is_igst: isIgst
      }, { emitEvent: false });
    });

    let inrGross = this.roundToTwoDecimals(inrTotal + inrTotalGstAmount);
    let inrVendorPayable = this.roundToTwoDecimals(inrGross - inrTotalTdsAmount);
    let inrRcmLiability = 0;

    if (this.isVendorRcm) {
      inrGross = inrTotal;
      inrVendorPayable = this.roundToTwoDecimals(inrTotal - inrTotalTdsAmount);
      inrRcmLiability = inrTotalGstAmount;
    }

    const inrPayableAmount = this.roundToTwoDecimals(inrVendorPayable - this.lessAmountInINR);

    this.summary = {
      taxable: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotal), this.currencyRate),
      cgst: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotalCgst), this.currencyRate),
      sgst: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotalSgst), this.currencyRate),
      igst: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotalIgst), this.currencyRate),
      gstTotal: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotalGstAmount), this.currencyRate),
      gross: this.multiplyWithPrecision(this.roundToTwoDecimals(inrGross), this.currencyRate),
      net: this.multiplyWithPrecision(this.roundToTwoDecimals(inrVendorPayable), this.currencyRate),
      tdsAmt: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotalTdsAmount), this.currencyRate),
      vendorPayable: this.multiplyWithPrecision(this.roundToTwoDecimals(inrVendorPayable), this.currencyRate),
      rcmLiability: this.multiplyWithPrecision(this.roundToTwoDecimals(inrRcmLiability), this.currencyRate),
      payableAmount: this.multiplyWithPrecision(this.roundToTwoDecimals(inrPayableAmount), this.currencyRate),
      isIntraState: !isIgst,
      branchStateId: this.branchStateId,
      vendorStateId: this.vendorStateId
    };

    this.createJournalreferanceForm.patchValue({
      total_tds_amount: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotalTdsAmount), this.currencyRate),
      purchase_value: this.multiplyWithPrecision(this.roundToTwoDecimals(inrTotal), this.currencyRate),
      bill_amount: this.multiplyWithPrecision(this.roundToTwoDecimals(inrVendorPayable), this.currencyRate)
    }, { emitEvent: false });

    this.isCalculating = false;
  }

  getAllVendorList: any = [];
  vendorPartyData1: any = [];
  vendorPartyData2: any = [];

  getAllVendor() {
    this._configurationalMasterService.getVendorBillingList(this.entity_id).subscribe((res: any) => {
      this.getAllVendorList = res.data;
      this.vendorPartyData1 = res?.data?.map((x: any) => x.vendor_name);
      this.vendorPartyData2 = this.getAllVendorList;
      let date = new Date();
      let outDate = moment(date).format("YYYY-MM-DD");
    });
  }

  searchByParty(e: any) {
    const aa = e;
    let filteredVariable = this.vendorPartyData2.filter((item: any) => aa.includes(item.vendor_name));
    this.getAllVendorList = filteredVariable;
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
    });
  }

  default_currency_id: any;
  bankAccountIds: any[] = [];

  submitPublic(key: any): void {
    let inrTotal = 0;
    let inrTotalTdsAmount = 0;
    let inrTotalGstAmount = 0;
    let inrTotalCgst = 0;
    let inrTotalSgst = 0;
    let inrTotalIgst = 0;

    const accountDetails = this.Account_details.value;

    const accountDetailsInINR = accountDetails.map((item: any, index: number) => {
      const baseValues = this.originalCurrencyValues.get(index);

      if (baseValues) {
        const inrRate = baseValues.rate || 0;
        const inrQty = baseValues.qty || 0;
        const inrTax = baseValues.tax || 0;
        const inrTdsRate = baseValues.tds_rate || 0;
        const inrTdsAmount = baseValues.tds_rate_amount || 0;
        const inrGstAmount = baseValues.gst_amount || 0;
        const inrFinalAmount = baseValues.final_amount || 0;
        const inrGrossAmount = baseValues.gross_amount || 0;
        const inrCgst = baseValues.cgst_amount || 0;
        const inrSgst = baseValues.sgst_amount || 0;
        const inrIgst = baseValues.igst_amount || 0;

        inrTotal += this.roundToTwoDecimals(inrQty * inrRate);
        inrTotalGstAmount += inrGstAmount;
        inrTotalTdsAmount += inrTdsAmount;
        inrTotalCgst += inrCgst;
        inrTotalSgst += inrSgst;
        inrTotalIgst += inrIgst;

        return {
          ...item,
          rate: this.roundToTwoDecimals(inrRate),
          qty: this.roundToTwoDecimals(inrQty),
          tax: this.roundToTwoDecimals(inrTax),
          tds_rate: this.roundToTwoDecimals(inrTdsRate),
          tds_rate_amount: this.roundToTwoDecimals(inrTdsAmount),
          gst_amount: this.roundToTwoDecimals(inrGstAmount),
          final_amount: this.roundToTwoDecimals(inrFinalAmount),
          gross_amount: this.roundToTwoDecimals(inrGrossAmount),
          cgst_amount: this.roundToTwoDecimals(inrCgst),
          sgst_amount: this.roundToTwoDecimals(inrSgst),
          igst_amount: this.roundToTwoDecimals(inrIgst)
        };
      }

      return {
        ...item,
        rate: this.roundToTwoDecimals(Number(item.rate) || 0),
        qty: this.roundToTwoDecimals(Number(item.qty) || 0),
        tax: this.roundToTwoDecimals(Number(item.tax) || 0),
        tds_rate: this.roundToTwoDecimals(Number(item.tds_rate) || 0),
        tds_rate_amount: this.roundToTwoDecimals(Number(item.tds_rate_amount) || 0),
        gst_amount: this.roundToTwoDecimals(Number(item.gst_amount) || 0),
        final_amount: this.roundToTwoDecimals(Number(item.final_amount) || 0),
        gross_amount: this.roundToTwoDecimals(Number(item.gross_amount) || 0),
        remarks:item.remarks
      };
    });

    inrTotal = this.roundToTwoDecimals(inrTotal);
    inrTotalGstAmount = this.roundToTwoDecimals(inrTotalGstAmount);
    inrTotalTdsAmount = this.roundToTwoDecimals(inrTotalTdsAmount);
    inrTotalCgst = this.roundToTwoDecimals(inrTotalCgst);
    inrTotalSgst = this.roundToTwoDecimals(inrTotalSgst);
    inrTotalIgst = this.roundToTwoDecimals(inrTotalIgst);

    const inrGross = this.roundToTwoDecimals(inrTotal + inrTotalGstAmount);
    const inrVendorPayable = this.roundToTwoDecimals(inrGross - inrTotalTdsAmount);

    let inrRcmLiability = 0;
    if (this.isVendorRcm) {
      inrRcmLiability = inrTotalGstAmount;
    }

    const inrPayableAmount = this.roundToTwoDecimals(inrVendorPayable - this.lessAmountInINR);

    const formValues = this.createJournalEntryForm.value;

    let payload = {
      ...formValues,
      ...this.createJournalEntryItemForm.value,
      financial_id: this.financial_id,
      currency_code: this.currencyCode,
      currency_rate: this.currencyRate,
      taxable: inrTotal,
      cgst: inrTotalCgst,
      sgst: inrTotalSgst,
      igst: inrTotalIgst,
      gstTotal: inrTotalGstAmount,
      gross: inrGross,
      net: inrVendorPayable,
      tdsAmt: inrTotalTdsAmount,
      vendorPayable: inrVendorPayable,
      rcmLiability: inrRcmLiability,
      purchase_value: inrTotal,
      bill_amount: inrPayableAmount,
      total_tds_amount: inrTotalTdsAmount,
      less_amount: this.lessAmountInINR,
      is_intra_state: !(Number(this.vendorStateId) !== Number(this.branchStateId)),
      branch_state_id: this.branchStateId,
      vendor_state_id: this.vendorStateId,
      Account_details: accountDetailsInINR
    };

    if (this.createJournalEntryForm.value?.vendor_id) {
      payload.party_type = 'VENDOR';
    }

    delete payload.summary;

    console.log('========== Payload in INR:', payload);

    if (this.createJournalEntryForm.valid && this.createJournalEntryItemForm.valid) {
      this._finaceService.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_id).subscribe({
        next: (res: any) => {
          this.bankAccountIds = [];
          this._finaceService.createPurchaseJournal(payload).subscribe((response: any) => {
            if (response) {
              this.toast.success('Purchase Journal Created Successfully');
              this.router.navigate(['master/finance/transactions/purchase-journal']);
            }
          }, (err: any) => {
            this.toast.error(err.error?.message);
          });
        },
        error: (err) => {
          this.$common.hideLoader();
          this.toast.error(err.error?.message);
          this.toast.warning('This month is not active');
        },
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

  back() {
    this.router.navigate(['/master/finance/transactions/purchase-journal']);
  }

  getAllTdsSection: any = [];
  vendor_ids: any;
  vendorHistoryData: any = [];
  isVendorRcm: any;

  getVendorData(data: any) {
    this.vendorStateId = data.billing_state_id;
    this.vendor_ids = data.id;
    this.isVendorRcm = data?.rcm_charge === true || data?.rcm_charge == 1;
    this.getBillingAddressById(this.vendor_ids);
    this.updateGSTCalculation();

    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
    const hasData = accountDetailsArray.controls.some((row: AbstractControl) => {
      return (+row.get('qty')?.value > 0 || +row.get('rate')?.value > 0 || +row.get('tax')?.value > 0);
    });

    if (hasData) {
      accountDetailsArray.controls.forEach((row: AbstractControl, index: number) => {
        const currentTdsRate = row.get('tds_rate')?.value || 0;
        this.originalCurrencyValues.set(index, {
          rate: 0,
          qty: 0,
          tax: 0,
          tds_rate: currentTdsRate,
          tds_rate_amount: 0,
          gst_amount: 0,
          final_amount: 0,
          gross_amount: 0,
          cgst_amount: 0,
          sgst_amount: 0,
          igst_amount: 0
        });
        row.patchValue({
          qty: '',
          rate: '',
          tax: '',
          tds_rate: currentTdsRate,
          item_id: '',
          item_code: '',
          gross_amount: '',
          tds_rate_amount: '',
          gst_amount: '',
          final_amount: ''
        }, { emitEvent: false });
      });

      this.summary = {
        taxable: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        gstTotal: 0,
        gross: 0,
        net: 0,
        tdsAmt: 0,
        vendorPayable: 0,
        rcmLiability: 0,
        payableAmount: 0,
        isIntraState: true,
        branchStateId: '',
        vendorStateId: ''
      };
    }

    this._finaceService.getVendorDataByTds(data.id).subscribe((res: any) => {
      console.log(res.data);
      if (!res.data?.length) {
        this.getAllTdsSection = [];
        return this.toast.warning('TDS Not Mapped On This Vendor');
      }
      this.getAllTdsSection = res.data;
      this.updateTdsAmounts();
      this.calculateTotals();
    });
  }

  updateTdsAmounts() {
    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;

    accountDetailsArray.controls.forEach((row: AbstractControl, index: number) => {
      const baseValues = this.originalCurrencyValues.get(index);
      if (baseValues) {
        const rate = baseValues.rate || 0;
        const qty = baseValues.qty || 0;
        const tdsRate = Number(row.get('tds_rate')?.value || 0);
        const amount = rate * qty;
        const inrTdsAmount = this.roundToTwoDecimals((amount * tdsRate) / 100);

        baseValues.tds_rate = tdsRate;
        baseValues.tds_rate_amount = inrTdsAmount;

        this.originalCurrencyValues.set(index, baseValues);

        row.patchValue({
          tds_rate_amount: this.multiplyWithPrecision(inrTdsAmount, this.currencyRate)
        }, { emitEvent: false });
      }
    });
  }

  documentType: any = '';
  getAllAdvanceData: any;
  payload: any;
  partyTypeCheck: any;

  getAllDocumentType(event: any) {
    this.documentType = event.value;
    if (this.documentType !== 'OTHERS') {
      if (this.partyTypeCheck == 'VENDOR') {
        this.payload = {
          vendor_id: this.vendor_ids,
          document_type: this.documentType,
          entity_id: this.entity_id
        };
      } else {
        this.payload = {
          vendor_id: this.vendor_ids,
          document_type: this.documentType,
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

  remainingAmount: any;
  ischeckedTdsAmount: any;

  getAmountByPo(data: any) {
    this.createJournalEntryForm.get('document_po_value')?.setValue(data.total_amount);
    let payload = {
      entity_id: this.entity_id,
      vendor_id: this.vendor_ids,
      document_type: this.documentType,
      po_id: data.po_id,
    };

    this._finaceService.getVendorPaymentHistoryByVendor(payload).subscribe((res: any) => {
      this.vendorHistoryData = res.data;
      this.ischeckedTdsAmount = res.tds_valid;
      if (res.poItems.length) {
        this.Account_details.removeAt(0);
        this.Account_details.clear();
        this.originalCurrencyValues.clear();

        res.poItems.forEach((res: any, index: number) => {
          const baseRate = res.unit_price || 0;
          const baseQty = res.quantity || 1;
          const baseTax = res.MASTER_HSN_SAC_CODE?.gst_value || 0;
          const baseTdsRate = this.getAllNatureOfTrsanction[0]?.current_rate || this.getAllTdsSection[0]?.current_rate || 0;
          const baseTdsAmount = this.roundToTwoDecimals((baseRate * baseQty * baseTdsRate) / 100);

          this.originalCurrencyValues.set(index, {
            rate: baseRate,
            qty: baseQty,
            tax: baseTax,
            tds_rate: baseTdsRate,
            tds_rate_amount: baseTdsAmount,
            gst_amount: 0,
            final_amount: 0,
            gross_amount: 0,
            cgst_amount: 0,
            sgst_amount: 0,
            igst_amount: 0
          });

          let controls = this.fb.group({
            item_id: [res.item_master_id],
            item_code: [res.item_code],
            hsn_code: [res.MASTER_HSN_SAC_CODE?.hsn_sac_code || ''],
            tax: [baseTax],
            qty: [baseQty],
            rate: [this.multiplyWithPrecision(baseRate, this.currencyRate)],
            profit_center_id: [null],
            cost_center_id: [res.cost_center_id],
            tds_rate: [baseTdsRate],
            tds_rate_amount: [this.multiplyWithPrecision(baseTdsAmount, this.currencyRate)],
            id: null,
            gross_amount: [0],
            cgst_amount: [0],
            sgst_amount: [0],
            igst_amount: [0],
            is_igst: [false],
            gst_amount: [0],
            final_amount: [0]
          });
          this.Account_details.push(controls);
        });

        this.calculateTotals();

        let tdsAmountDisplayed = (this.Account_details as FormArray).controls.reduce(
          (acc: number, control: any) => {
            const value = Number(control.get('tds_rate_amount')?.value) || 0;
            return acc + value;
          },
          0
        );

        const inrTotalAmount = data.total_amount;
        const inrTdsAmount = this.divideWithPrecision(tdsAmountDisplayed, this.currencyRate);

        this.createJournalreferanceForm.patchValue({
          total_tds_amount: tdsAmountDisplayed,
          purchase_value: this.multiplyWithPrecision(inrTotalAmount, this.currencyRate),
          bill_amount: this.multiplyWithPrecision(inrTotalAmount - inrTdsAmount, this.currencyRate)
        });
      }
    }, (err: any) => {
      this.toast.error('History Not Found..');
    });
  }

  getAllNatureOfTrsanction: any = [];

  getAllNatureTransaction(data: any) {
    this.createJournalEntryForm.get('nature')?.setValue(data.nature);
    let vendor_id = this.createJournalEntryForm.get('vendor_id')?.value;

    this._finaceService.getTdsNatureOfTransaction(data.nature_id, this.vendor_ids).subscribe((res: any) => {
      console.log(res.data);
      this.getAllNatureOfTrsanction = res.data;
      const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;

      accountDetailsArray.controls.forEach((row: AbstractControl, index: number) => {
        const baseTdsRate = Number(res.data[0]?.current_rate || 0);
        const baseValues = this.originalCurrencyValues.get(index);

        if (baseValues) {
          const rate = baseValues.rate || 0;
          const qty = baseValues.qty || 0;
          const amount = rate * qty;
          const inrTdsAmount = this.roundToTwoDecimals((amount * baseTdsRate) / 100);

          baseValues.tds_rate = baseTdsRate;
          baseValues.tds_rate_amount = inrTdsAmount;
          this.originalCurrencyValues.set(index, baseValues);

          row.patchValue({
            tds_rate: baseTdsRate,
            tds_rate_amount: this.multiplyWithPrecision(inrTdsAmount, this.currencyRate)
          }, { emitEvent: false });
        } else {
          row.patchValue({
            tds_rate: baseTdsRate
          }, { emitEvent: false });
        }
      });

      this.calculateTotals();
    });
  }

  branch_id: any;

  getBranchId(b: any) {
    this.branch_id = b.id;
    this.branchStateId = b.state_id;
    this.createJournalEntryForm.get('voucher_id')?.reset();
    this.createJournalEntryForm.get('document_number')?.reset();
    this.updateGSTCalculation();
    this.calculateTotals();
  }

  getVoucherId(event: any) {
    let payload = {
      branch_id: this.branch_id,
      voucher_id: event.value
    };

    this._finaceService.generatePurchaseJournalNumber(payload).subscribe((res: any) => {
      if (res) {
        this.createJournalEntryForm.patchValue({
          document_number: res.data
        });
      }
    });
  }


hasAccounts(): boolean {
    return this.Account_details?.controls?.some((control: any) =>
        Number(control.get('rate')?.value) > 0 ||
        Number(control.get('qty')?.value) > 0
    ) || false;
}

getVendorName(): string {
    const vendorId = this.createJournalEntryForm.get('vendor_id')?.value;
    if (!vendorId) return '';
    const vendor = this.getAllVendorList.find((v: any) => v.id === Number(vendorId));
    return vendor ? vendor.vendor_name : '';
}

getAccountNameById(accountId: number): string {
    if (!accountId) return 'Unknown Account';
    const account = this.chartedAccount.find((acc: any) => acc.id === accountId);
    if (account) return account.account_name;

    const accountMap: { [key: number]: string } = {
        21: 'CGST INPUT',
        41: 'SGST INPUT',
        29: 'IGST INPUT',
        45: 'TDS PAYABLE',
        51: 'Sundry Creditors',
        229: 'Purchase Account',
        400: 'IGST RCM OUTPUT LIABILITY',
        401: 'CGST RCM OUTPUT LIABILITY',
        402: 'SGST RCM OUTPUT LIABILITY',
        403: 'IGST RCM INPUT TAX',
        404: 'CGST RCM INPUT TAX',
        405: 'SGST RCM INPUT TAX'
    };

    return accountMap[accountId] || `Account ID: ${accountId}`;
}

getAccountCodeById(accountId: number): string {
    if (!accountId) return '-';
    const account = this.chartedAccount.find((acc: any) => acc.id === accountId);
    if (account) return account.account_code;

    const codeMap: { [key: number]: string } = {
        21: '2313',
        41: '2333',
        29: '2321',
        45: '2337',
        51: '2322',
        229: '530',
        400: '2347',
        401: '2346',
        402: '2345',
        403: '2344',
        404: '2343',
        405: '2342'
    };

    return codeMap[accountId] || '-';
}

buildLedgerAccounts(): any[] {
    const accounts: any[] = [];

    const isRcm = this.isVendorRcm || false;
    const isIgst = Number(this.vendorStateId) !== Number(this.branchStateId);

    let totalAmount = 0;
    let totalGst = 0;
    let totalTds = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    this.Account_details.controls.forEach((control: any) => {
        const rate = Number(control.get('rate')?.value) || 0;
        const qty = Number(control.get('qty')?.value) || 0;
        const gstAmount = Number(control.get('gst_amount')?.value) || 0;
        const tdsAmount = Number(control.get('tds_rate_amount')?.value) || 0;

        totalAmount += rate * qty;
        totalGst += gstAmount;
        totalTds += tdsAmount;
    });

    if (isIgst) {
        totalIgst = totalGst;
        totalCgst = 0;
        totalSgst = 0;
    } else {
        totalCgst = this.roundToTwoDecimals(totalGst / 2);
        totalSgst = this.roundToTwoDecimals(totalGst / 2);
        totalIgst = 0;
    }

    let grossTotal = 0;
    let vendorPayable = 0;

    if (isRcm) {
        grossTotal = totalAmount;
        vendorPayable = this.roundToTwoDecimals(grossTotal - totalTds);
    } else {
        grossTotal = this.roundToTwoDecimals(totalAmount + totalGst);
        vendorPayable = this.roundToTwoDecimals(grossTotal - totalTds);
    }

    const lessAmount = this.lessAmountInINR || 0;
    const payableAmount = this.roundToTwoDecimals(vendorPayable - lessAmount);

    accounts.push({
        account_name: this.getAccountNameById(229),
        account_code: this.getAccountCodeById(229),
        debit_amount: totalAmount,
        credit_amount: 0,
        type: 'DEBIT',
        chart_account_id: 229
    });

    if (totalGst > 0) {
        if (isRcm) {
            if (isIgst) {
                accounts.push({
                    account_name: this.getAccountNameById(403),
                    account_code: this.getAccountCodeById(403),
                    debit_amount: totalIgst,
                    credit_amount: 0,
                    type: 'DEBIT',
                    chart_account_id: 403,
                    is_rcm: true
                });

                accounts.push({
                    account_name: this.getAccountNameById(400),
                    account_code: this.getAccountCodeById(400),
                    debit_amount: 0,
                    credit_amount: totalIgst,
                    type: 'CREDIT',
                    chart_account_id: 400,
                    is_rcm: true
                });
            } else {
                accounts.push({
                    account_name: this.getAccountNameById(404),
                    account_code: this.getAccountCodeById(404),
                    debit_amount: totalCgst,
                    credit_amount: 0,
                    type: 'DEBIT',
                    chart_account_id: 404,
                    is_rcm: true
                });

                accounts.push({
                    account_name: this.getAccountNameById(405),
                    account_code: this.getAccountCodeById(405),
                    debit_amount: totalSgst,
                    credit_amount: 0,
                    type: 'DEBIT',
                    chart_account_id: 405,
                    is_rcm: true
                });

                accounts.push({
                    account_name: this.getAccountNameById(401),
                    account_code: this.getAccountCodeById(401),
                    debit_amount: 0,
                    credit_amount: totalCgst,
                    type: 'CREDIT',
                    chart_account_id: 401,
                    is_rcm: true
                });

                accounts.push({
                    account_name: this.getAccountNameById(402),
                    account_code: this.getAccountCodeById(402),
                    debit_amount: 0,
                    credit_amount: totalSgst,
                    type: 'CREDIT',
                    chart_account_id: 402,
                    is_rcm: true
                });
            }
        } else {
            if (isIgst) {
                accounts.push({
                    account_name: this.getAccountNameById(29),
                    account_code: this.getAccountCodeById(29),
                    debit_amount: totalIgst,
                    credit_amount: 0,
                    type: 'DEBIT',
                    chart_account_id: 29
                });
            } else {
                accounts.push({
                    account_name: this.getAccountNameById(21),
                    account_code: this.getAccountCodeById(21),
                    debit_amount: totalCgst,
                    credit_amount: 0,
                    type: 'DEBIT',
                    chart_account_id: 21
                });

                accounts.push({
                    account_name: this.getAccountNameById(41),
                    account_code: this.getAccountCodeById(41),
                    debit_amount: totalSgst,
                    credit_amount: 0,
                    type: 'DEBIT',
                    chart_account_id: 41
                });
            }
        }
    }

    if (totalTds > 0) {
        accounts.push({
            account_name: this.getAccountNameById(45),
            account_code: this.getAccountCodeById(45),
            debit_amount: 0,
            credit_amount: totalTds,
            type: 'CREDIT',
            chart_account_id: 45,
            is_tds: true,
            tds_section: this.createJournalEntryForm.get('tds_id')?.value || '194C',
            tds_rate: this.getAllTdsSection[0]?.current_rate || 0
        });
    }

    accounts.push({
        account_name: this.getAccountNameById(51),
        account_code: this.getAccountCodeById(51),
        debit_amount: 0,
        credit_amount: vendorPayable,
        type: 'CREDIT',
        chart_account_id: 51,
        party_name: this.getVendorName()
    });

    if (lessAmount > 0) {
        accounts.push({
            account_name: this.getAccountNameById(51) + ' (Less Amount)',
            account_code: this.getAccountCodeById(51),
            debit_amount: lessAmount,
            credit_amount: 0,
            type: 'DEBIT',
            chart_account_id: 51,
            is_less: true
        });

        accounts.push({
            account_name: this.getAccountNameById(229) + ' (Less Amount)',
            account_code: this.getAccountCodeById(229),
            debit_amount: 0,
            credit_amount: lessAmount,
            type: 'CREDIT',
            chart_account_id: 229,
            is_less: true
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

    const isRcm = this.isVendorRcm || false;

    const previewData = {
        title: isRcm ? 'Purchase Journal - RCM Ledger Preview' : 'Purchase Journal - Ledger Preview',
        voucherNumber: voucherNumber,
        voucherDate: transactionDate,
        currencySymbol: this.currencySymbol || '₹',
        currencyCode: this.currencyCode || 'INR',
        accounts: ledgerAccounts,
        totalDebit: totalDebit,
        totalCredit: totalCredit,
        narration: this.createJournalEntryForm.get('notes')?.value || '',
        partyName: this.getVendorName() || 'Vendor',
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
