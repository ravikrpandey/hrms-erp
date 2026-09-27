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
  selector: 'app-add-purchase-service-voucher',
  templateUrl: './add-purchase-service-voucher.component.html',
  styleUrls: ['./add-purchase-service-voucher.component.scss']
})
export class AddPurchaseServiceVoucherComponent {
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
  dataListBilling: any;

  currencyData: any = [];
  currencyCode: string = 'INR';
  currencySymbol: string = '₹';
  currencyRate: number = 1;

  private isUpdatingCurrency: boolean = false;
  private isCalculating: boolean = false;

  vendorStateId: any = null;
  branchStateId: any = null;
  isVendorRcm: boolean = false;
  isIgst: boolean = false;
  branch_id: any = null;
  selectedVendorId: any = null;
  selectedVoucherId: any = null;

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
     private ledgerPreviewService: LedgerPreviewService
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
      billing_id: [null],
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

        // ✅ Currency change par GST type check karein
        this.checkGstType();

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
    }

    this._empService.grtEmployeeList(this.entity_id, this.getUserRole).subscribe((res: any) => {
      this.getEmployeeList = res.data;
    });

    this.getChartAccountList();
    this.getAllVouchers();
    this.getCurrency();
    this.getAllVendor();
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

      if (this.journal_id) {
        this.loadPurchaseServiceData();
      } else {
        const posting_date = moment(new Date()).format('YYYY-MM-DD');
        this.createJournalEntryForm.patchValue({
          entity_id: this.entity_id,
          posting_date: posting_date
        });
      }
    });
  }

  loadPurchaseServiceData() {
    this._finaceService.purchaseServiceById(this.journal_id).subscribe((res: any) => {
      if (res.code == 200) {
        this.singleGeneral = res.data;
        this.lessAmtBase = Number(this.singleGeneral.less_amt) || 0;
        setTimeout(() => {
          this.less_amt = this.currencyCode === 'INR' ? this.roundToTwoDecimals(this.lessAmtBase) : this.multiplyWithPrecision(this.lessAmtBase, this.currencyRate);
         });
        this._finaceService.getVendorDataByTds(this.singleGeneral.vendor_id).subscribe((res: any) => {
          if (!res.data?.length) {
            this.getAllTdsSection = [];
            return this.toast.warning('TDS Not Mapped On This Vendor');
          }
          this.getAllTdsSection = res.data;
        });

        this.accountDetailList = res.account_list;
        this.parent_journal_no = this.singleGeneral.parent_journal_no;

        this.vendorStateId = this.singleGeneral.vendor_state_id;
        this.branchStateId = this.singleGeneral.branch_state_id;
        this.isVendorRcm = this.singleGeneral.rcm_charge;
        this.checkGstType();

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
          nature_id: this.singleGeneral.nature_id
        });
        this.getBillingAddressById(this.singleGeneral.vendor_id); setTimeout(() => {
          this.createJournalEntryForm.patchValue({ billing_id: this.singleGeneral.billing_id });
        }, 300);
        this.selectedVendorId = this.singleGeneral.vendor_id;
        this.selectedVoucherId = this.singleGeneral.voucher_list_id;
        this.branch_id = this.singleGeneral.branch_id;

        this._finaceService.getTdsNatureOfTransaction(
          this.singleGeneral.nature_id,
          this.singleGeneral.vendor_id
        ).subscribe((res: any) => {

          this.getAllNatureOfTrsanction = res.data;

          const selectedNature = this.getAllNatureOfTrsanction.find(
            (x: any) => Number(x.nature_id) === Number(this.singleGeneral.nature_id)
          );

          if (selectedNature) {
            this.createJournalEntryForm.patchValue({
              nature_id: selectedNature.nature_id
            });
          }
        });

        this.Account_details.clear();
        this.originalCurrencyValues.clear();

        this.singleGeneral.account_list.forEach((elm: any, index: number) => {
          const baseRate = Number(elm.rate) || 0;
          const baseTax = Number(elm.tax) || 0;
          const baseTdsAmount = Number(elm.tds_rate_amount) || 0;
          const baseGstAmount = Number(elm.gst_amount) || 0;
          const baseFinalAmount = Number(elm.final_amount) || 0;

          let baseTdsRate = 0;
          if (baseRate > 0 && baseTdsAmount > 0) {
            baseTdsRate = this.roundToTwoDecimals((baseTdsAmount / baseRate) * 100);
          }

          this.originalCurrencyValues.set(index, {
            rate: baseRate,
            tax: baseTax,
            tds_rate: baseTdsRate,
            tds_rate_amount: baseTdsAmount,
            gst_amount: baseGstAmount,
            final_amount: baseFinalAmount,
            gross_amount: baseRate + baseGstAmount
          });

          let cgst = 0, sgst = 0, igst = 0;
          if (this.isIgst) {
            igst = baseGstAmount;
          } else {
            cgst = this.roundToTwoDecimals(baseGstAmount / 2);
            sgst = this.roundToTwoDecimals(baseGstAmount / 2);
          }

          this.Account_details.push(
            this.fb.group({
              service_id: [elm.service_id],
              service_code: [elm.service_code],
              rate: [this.multiplyWithPrecision(baseRate, this.currencyRate)],
              tax: [baseTax],
              gst_amount: [this.multiplyWithPrecision(baseGstAmount, this.currencyRate)],
              tds_rate: [baseTdsRate],
              tds_rate_amount: [this.multiplyWithPrecision(baseTdsAmount, this.currencyRate)],
              final_amount: [this.multiplyWithPrecision(baseFinalAmount, this.currencyRate)],
              profit_center_id: [elm.profit_center_id],
              cost_center_id: [elm.cost_center_id],
              gross_amount: [this.multiplyWithPrecision(baseRate + baseGstAmount, this.currencyRate)],
              cgst_amount: [this.multiplyWithPrecision(cgst, this.currencyRate)],
              sgst_amount: [this.multiplyWithPrecision(sgst, this.currencyRate)],
              igst_amount: [this.multiplyWithPrecision(igst, this.currencyRate)],
              is_igst: [this.isIgst],
              remarks: [elm.remarks],
            })
          );
        });

        this.calculateTotals();
      }
    }, (err) => {});
  }

  /**
   * ✅ GST Type Check Method
   * If currency is not INR, always use IGST
   * If currency is INR, check vendor state vs branch state
   */
  checkGstType() {
    // Agar currency INR nahi hai toh hamesha IGST mode mein rahega
    // Kyunki foreign currency transactions mein IGST hi applicable hota hai
    if (this.currencyCode !== 'INR') {
      this.isIgst = true;
      return;
    }

    // Agar INR hai toh state-based GST calculation
    if (this.vendorStateId && this.branchStateId) {
      // Agar vendor state aur branch state alag hai toh IGST, otherwise CGST+SGST
      this.isIgst = Number(this.vendorStateId) !== Number(this.branchStateId);
    } else {
      // Default: CGST+SGST (if states not available)
      this.isIgst = false;
    }
  }

  getBillingAddressById(vendor_id: any) {
    this._finaceService.getBillingAddressById(vendor_id).subscribe((res: any) => {
      this.dataListBilling = res.data;
    });
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
        const newGrossAmount = this.multiplyWithPrecision(originalValue.gross_amount || (originalValue.rate + originalValue.gst_amount), this.currencyRate);

        const tax = originalValue.tax || 0;
        let cgst = 0, sgst = 0, igst = 0;

        if (this.isIgst) {
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

    if (this.lessAmtBase !== undefined && this.lessAmtBase !== null) {
      this.less_value = this.multiplyWithPrecision(this.lessAmtBase, this.currencyRate);
      this.less_amt = this.less_value;
    }

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

    this.calculateTotals();
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
    const oldRate = this.currencyRate;
    this.currencyCode = data.Currency_Type || data.symbols || 'INR';
    this.currencySymbol = data.symbols || '₹';
    this.currencyRate = Number(data.rate);
    // ✅ Currency change par GST type check
    this.checkGstType();
    this.updateAmountsWithCurrencyRate(oldRate);
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
    this._configurationalMasterService.getServiceMasterList(this.entity_id).subscribe((res: any) => {
      this.geAllItem = res.data.reverse();
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
    this._configurationalMasterService.getVouchersByID(11, this.entity_id).subscribe((res: any) => {
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
      service_id: [null],
      service_code: [null],
      hsn_code: [null],
      rate: [0],
      tax: [0],
      gst_amount: [0],
      profit_center_id: [null],
      cost_center_id: [null],
      tds_rate: [0],
      tds_rate_amount: [0],
      final_amount: [0],
      journal_id: journal,
      id: null,
      gross_amount: [0],
      cgst_amount: [0],
      sgst_amount: [0],
      igst_amount: [0],
      remarks: [''],
      is_igst: [false]
    });
  }

  getItemCode(data: any, i: any) {
    const row = this.Account_details.at(i);
    const taxPercentage = Number(data.tax || 0);
    row.patchValue({
      service_code: data.service_code,
      tax: taxPercentage
    });
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
    payableAmount: 0
  };

  originalCurrencyValues = new Map<number, any>();

  storeCurrencyBaseValue(index: number) {
    const row: any = this.Account_details.at(index);
    this.originalCurrencyValues.set(index, {
      rate: this.divideWithPrecision(Number(row.get('rate')?.value || 0), this.currencyRate),
      tax: Number(row.get('tax')?.value || 0),
      tds_rate: Number(row.get('tds_rate')?.value || 0),
      tds_rate_amount: this.divideWithPrecision(Number(row.get('tds_rate_amount')?.value || 0), this.currencyRate),
      gst_amount: this.divideWithPrecision(Number(row.get('gst_amount')?.value || 0), this.currencyRate),
      final_amount: this.divideWithPrecision(Number(row.get('final_amount')?.value || 0), this.currencyRate),
      gross_amount: this.divideWithPrecision(Number(row.get('gross_amount')?.value || 0), this.currencyRate)
    });
  }

  less_amt: any = 0;
  private lessAmtBase: number = 0;

  calculateTotals(): void {
    if (this.isCalculating) return;
    this.isCalculating = true;

    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;

    // ✅ Ensure GST type is correct before calculation
    this.checkGstType();

    let inrTotal = 0;
    let inrTotalTdsAmount = 0;
    let inrTotalGstAmount = 0;
    let inrTotalCgst = 0;
    let inrTotalSgst = 0;
    let inrTotalIgst = 0;

    accountDetailsArray.controls.forEach((row: AbstractControl, index: number) => {
      this.storeCurrencyBaseValue(index);

      const baseValues = this.originalCurrencyValues.get(index);
      if (!baseValues) {
        this.originalCurrencyValues.set(index, {
          rate: 0,
          tax: 0,
          tds_rate: 0,
          tds_rate_amount: 0,
          gst_amount: 0,
          final_amount: 0,
          gross_amount: 0
        });
        return;
      }

      const inrRate = baseValues.rate || 0;
      const inrTax = baseValues.tax || 0;
      const inrTdsRate = baseValues.tds_rate || 0;

      const inrAmount = this.roundToTwoDecimals(inrRate);
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

      if (this.isIgst) {
        inrIgst = inrGstAmount;
      } else {
        inrCgst = this.roundToTwoDecimals(inrGstAmount / 2);
        inrSgst = this.roundToTwoDecimals(inrGstAmount / 2);
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
        gross_amount: displayedGrossAmount,
        tds_rate_amount: displayedTdsAmount,
        gst_amount: displayedGstAmount,
        cgst_amount: displayedCgst,
        sgst_amount: displayedSgst,
        igst_amount: displayedIgst,
        final_amount: displayedFinalAmount,
        is_igst: this.isIgst
      }, { emitEvent: false });

      this.originalCurrencyValues.set(index, {
        rate: inrRate,
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

    inrTotal = this.roundToTwoDecimals(inrTotal);
    inrTotalGstAmount = this.roundToTwoDecimals(inrTotalGstAmount);
    inrTotalTdsAmount = this.roundToTwoDecimals(inrTotalTdsAmount);
    inrTotalCgst = this.roundToTwoDecimals(inrTotalCgst);
    inrTotalSgst = this.roundToTwoDecimals(inrTotalSgst);
    inrTotalIgst = this.roundToTwoDecimals(inrTotalIgst);

    let inrGross = this.roundToTwoDecimals(inrTotal + inrTotalGstAmount);
    let inrVendorPayable = this.roundToTwoDecimals(inrGross - inrTotalTdsAmount);
    let inrRcmLiability = 0;

    if (this.isVendorRcm) {
      inrGross = inrTotal;
      inrVendorPayable = this.roundToTwoDecimals(inrTotal - inrTotalTdsAmount);
      inrRcmLiability = inrTotalGstAmount;
    }

    const inrLessAmount = this.lessAmtBase || 0;
    const inrPayableAmount = this.roundToTwoDecimals(inrVendorPayable - inrLessAmount);

    this.summary = {
      taxable: this.multiplyWithPrecision(inrTotal, this.currencyRate),
      cgst: this.multiplyWithPrecision(inrTotalCgst, this.currencyRate),
      sgst: this.multiplyWithPrecision(inrTotalSgst, this.currencyRate),
      igst: this.multiplyWithPrecision(inrTotalIgst, this.currencyRate),
      gstTotal: this.multiplyWithPrecision(inrTotalGstAmount, this.currencyRate),
      gross: this.multiplyWithPrecision(inrGross, this.currencyRate),
      net: this.multiplyWithPrecision(inrVendorPayable, this.currencyRate),
      tdsAmt: this.multiplyWithPrecision(inrTotalTdsAmount, this.currencyRate),
      vendorPayable: this.multiplyWithPrecision(inrVendorPayable, this.currencyRate),
      rcmLiability: this.multiplyWithPrecision(inrRcmLiability, this.currencyRate),
      payableAmount: this.multiplyWithPrecision(inrPayableAmount, this.currencyRate)
    };

    this.createJournalreferanceForm.patchValue({
      total_tds_amount: this.multiplyWithPrecision(inrTotalTdsAmount, this.currencyRate),
      purchase_value: this.multiplyWithPrecision(inrTotal, this.currencyRate),
      bill_amount: this.multiplyWithPrecision(inrVendorPayable, this.currencyRate)
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

  less_value: number = 0;

  calculatePayableAmount(value: any) {
    const enteredValue = Number(value) || 0;
    this.lessAmtBase = this.divideWithPrecision(enteredValue, this.currencyRate);
    this.less_value = enteredValue;
    this.less_amt = enteredValue;

    const inrVendorPayable = this.summary.vendorPayable ? this.divideWithPrecision(this.summary.vendorPayable, this.currencyRate) : 0;
    const inrPayable = this.roundToTwoDecimals(inrVendorPayable - this.lessAmtBase);

    this.summary.payableAmount = this.multiplyWithPrecision(inrPayable, this.currencyRate);
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

  onVendorSelect(vendorId: any) {
    const vendor = this.getAllVendorList.find((v: any) => v.id === Number(vendorId));
    if (vendor) {
      this.getVendorData(vendor);
    } else {
      this.toast.error('Vendor not found');
    }
  }

  getVendorData(data: any) {
    if (typeof data === 'number' || typeof data === 'string') {
      const vendor = this.getAllVendorList.find((v: any) => v.id === Number(data));
      if (!vendor) {
        this.toast.error('Vendor not found');
        return;
      }
      data = vendor;
    }

    this.vendorStateId = data.billing_state_id;
    this.vendor_ids = data.id;
    this.selectedVendorId = data.id;
    this.getBillingAddressById(this.vendor_ids);
    this.isVendorRcm = data?.rcm_charge === true || data?.rcm_charge == 1;
    // ✅ GST type check
    this.checkGstType();

    this.createJournalEntryForm.patchValue({
      vendor_id: data.id
    });

    const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;
    const hasData = accountDetailsArray.controls.some((row: AbstractControl) => {
      return +row.get('rate')?.value > 0 || +row.get('tax')?.value > 0;
    });

    if (hasData) {
      accountDetailsArray.controls.forEach((row: AbstractControl, index: number) => {
        const currentTdsRate = row.get('tds_rate')?.value || 0;
        this.originalCurrencyValues.set(index, {
          rate: 0,
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
          rate: '',
          tax: '',
          tds_rate: currentTdsRate,
          item_id: '',
          item_code: '',
          gross_amount: '',
          tds_rate_amount: 0,
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
        payableAmount: 0
      };
    }

    this._finaceService.getVendorDataByTds(data.id).subscribe((res: any) => {
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
        const tdsRate = Number(row.get('tds_rate')?.value || 0);
        const inrTdsAmount = this.roundToTwoDecimals((rate * tdsRate) / 100);

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
          const baseTax = res.MASTER_HSN_SAC_CODE?.gst_value || 0;
          const baseTdsRate = this.getAllNatureOfTrsanction[0]?.current_rate || this.getAllTdsSection[0]?.current_rate || 0;
          const baseTdsAmount = this.roundToTwoDecimals((baseRate * baseTdsRate) / 100);

          this.originalCurrencyValues.set(index, {
            rate: baseRate,
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
            service_id: [res.service_id],
            service_code: [res.service_code],
            tax: [baseTax],
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
        let TdsAmount = (this.Account_details as FormArray).controls.reduce(
          (acc: number, control: any) => {
            const value = Number(control.get('tds_rate_amount')?.value) || 0;
            return acc + value;
          },
          0
        );

        const inrTotalAmount = data.total_amount;
        const inrTdsAmount = this.divideWithPrecision(TdsAmount, this.currencyRate);

        this.createJournalreferanceForm.patchValue({
          total_tds_amount: TdsAmount,
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
      this.getAllNatureOfTrsanction = res.data;
      const accountDetailsArray = this.createJournalEntryItemForm.get('Account_details') as FormArray;

      accountDetailsArray.controls.forEach((row: AbstractControl, index: number) => {
        const baseTdsRate = Number(res.data[0]?.current_rate || 0);
        const baseValues = this.originalCurrencyValues.get(index);

        if (baseValues) {
          const rate = baseValues.rate || 0;
          const inrTdsAmount = this.roundToTwoDecimals((rate * baseTdsRate) / 100);

          baseValues.tds_rate = baseTdsRate;
          baseValues.tds_rate_amount = inrTdsAmount;
          this.originalCurrencyValues.set(index, baseValues);

          row.patchValue({
            tds_rate: baseTdsRate,
            tds_rate_amount: this.multiplyWithPrecision(inrTdsAmount, this.currencyRate)
          }, { emitEvent: false });
        }
      });

      this.calculateTotals();
    });
  }

  getBranchId(branch: any) {
    this.branch_id = branch.id;
    this.branchStateId = branch.billing_state_id;
    // ✅ GST type check
    this.checkGstType();
    this.calculateTotals();
    this.createJournalEntryForm.get('voucher_id')?.reset();
    this.createJournalEntryForm.get('document_number')?.reset();

    this.createJournalEntryForm.patchValue({
      branch_id: branch.id
    });
  }

  getVoucherId(event: any) {
    this.selectedVoucherId = event.value;
    this.createJournalEntryForm.patchValue({
      voucher_id: event.value
    });

    let payload = {
      branch_id: this.branch_id,
      voucher_id: event.value
    };

    this._finaceService.generatePurchaseServiceNumber(payload).subscribe((res: any) => {
      if (res) {
        this.createJournalEntryForm.patchValue({
          document_number: res.data
        });
      }
    });
  }

  submitPublic(key: any): void {
    const currentRate = this.currencyRate;

    let inrTotal = 0;
    let inrTotalTdsAmount = 0;
    let inrTotalGstAmount = 0;
    let inrTotalCgst = 0;
    let inrTotalSgst = 0;
    let inrTotalIgst = 0;
    let inrGross = 0;
    let inrVendorPayable = 0;
    let inrRcmLiability = 0;
    let inrPayableAmount = 0;

    const accountDetails = this.Account_details.value;
    const accountDetailsInINR = accountDetails.map((item: any, index: number) => {
      const baseValues = this.originalCurrencyValues.get(index);
      if (baseValues) {
        const inrRate = baseValues.rate || 0;
        const inrTax = baseValues.tax || 0;
        const inrTdsRate = baseValues.tds_rate || 0;

        const inrAmount = this.roundToTwoDecimals(inrRate);
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

        if (this.isIgst) {
          inrIgst = inrGstAmount;
        } else {
          inrCgst = this.roundToTwoDecimals(inrGstAmount / 2);
          inrSgst = this.roundToTwoDecimals(inrGstAmount / 2);
        }

        inrTotal += inrAmount;
        inrTotalGstAmount += inrGstAmount;
        inrTotalTdsAmount += inrTdsAmount;
        inrTotalCgst += inrCgst;
        inrTotalSgst += inrSgst;
        inrTotalIgst += inrIgst;

        return {
          ...item,
          rate: inrRate,
          tax: inrTax,
          tds_rate: inrTdsRate,
          tds_rate_amount: inrTdsAmount,
          gst_amount: inrGstAmount,
          final_amount: inrFinalAmount,
          gross_amount: inrGrossAmount,
          cgst_amount: inrCgst,
          sgst_amount: inrSgst,
          igst_amount: inrIgst
        };
      }
      return {
        ...item,
        rate: this.divideWithPrecision(item.rate || 0, currentRate),
        tax: item.tax || 0,
        tds_rate: item.tds_rate || 0,
        tds_rate_amount: this.divideWithPrecision(item.tds_rate_amount || 0, currentRate),
        gst_amount: this.divideWithPrecision(item.gst_amount || 0, currentRate),
        final_amount: this.divideWithPrecision(item.final_amount || 0, currentRate),
        gross_amount: this.divideWithPrecision(item.gross_amount || 0, currentRate),
        cgst_amount: this.divideWithPrecision(item.cgst_amount || 0, currentRate),
        sgst_amount: this.divideWithPrecision(item.sgst_amount || 0, currentRate),
        igst_amount: this.divideWithPrecision(item.igst_amount || 0, currentRate)
      };
    });

    inrTotal = this.roundToTwoDecimals(inrTotal);
    inrTotalGstAmount = this.roundToTwoDecimals(inrTotalGstAmount);
    inrTotalTdsAmount = this.roundToTwoDecimals(inrTotalTdsAmount);
    inrTotalCgst = this.roundToTwoDecimals(inrTotalCgst);
    inrTotalSgst = this.roundToTwoDecimals(inrTotalSgst);
    inrTotalIgst = this.roundToTwoDecimals(inrTotalIgst);

    inrGross = this.roundToTwoDecimals(inrTotal + inrTotalGstAmount);
    inrVendorPayable = this.roundToTwoDecimals(inrGross - inrTotalTdsAmount);

    if (this.isVendorRcm) {
      inrGross = inrTotal;
      inrVendorPayable = this.roundToTwoDecimals(inrTotal - inrTotalTdsAmount);
      inrRcmLiability = inrTotalGstAmount;
    }

    const inrLessAmount = this.lessAmtBase || 0;
    inrPayableAmount = this.roundToTwoDecimals(inrVendorPayable - inrLessAmount);

    const formValues = this.createJournalEntryForm.value;

    let paylod = {
      ...formValues,
      ...this.createJournalEntryItemForm.value,
      financial_id: this.financial_id,
      currency_code: this.currencyCode,
      currency_rate: currentRate,
      less_amt: inrLessAmount,
      less_value: inrLessAmount,
      taxable_value: inrTotal,
      cgst: inrTotalCgst,
      sgst: inrTotalSgst,
      igst: inrTotalIgst,
      gst_total: inrTotalGstAmount,
      gross_total: inrGross,
      grand_total: inrVendorPayable,
      total_tds: inrTotalTdsAmount,
      rcm_liability: inrRcmLiability,
      payable_amount: inrPayableAmount,
      purchase_value: inrTotal,
      bill_amount: inrVendorPayable,
      total_tds_amount: inrTotalTdsAmount,
      rcm_charge: this.isVendorRcm,
      is_igst: this.isIgst,
      vendor_state_id: this.vendorStateId,
      branch_state_id: this.branchStateId,
      vendor_id: this.selectedVendorId || formValues.vendor_id,
      branch_id: this.branch_id || formValues.branch_id,
      voucher_id: this.selectedVoucherId || formValues.voucher_id,
      Account_details: accountDetailsInINR
    };

    if (paylod.vendor_id) {
      paylod.party_type = 'VENDOR';
    }

    delete paylod.summary;

    if (this.createJournalEntryForm.valid && this.createJournalEntryItemForm.valid) {
      this._finaceService.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_id).subscribe({
        next: (res: any) => {
          this.bankAccountIds = [];
          this._finaceService.createPurchaseService(paylod).subscribe((response: any) => {
            if (response) {
              this.toast.success('Purchase Journal Created Successfully');
              this.router.navigate(['master/finance/transactions/purchase-service-voucher']);
            }
          }, (err: any) => {
            this.toast.error(err.error?.message);
          });
        },
        error: (err) => {
          this.$common.hideLoader();
          this.toast.error(err.error?.message);
          this.toast.warning('This month is not active');
        }
      });
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

  remove(i: number) {
    this.journalDocuments.removeAt(i);
  }

  back() {
    this.router.navigate(['/master/finance/transactions/purchase-service-voucher']);
  }

  getAllTdsSection: any = [];
  vendor_ids: any;
  vendorHistoryData: any = [];
  VendorStateId: any;

hasAccounts(): boolean {
    return this.Account_details?.controls?.some((control: any) =>
        Number(control.get('rate')?.value) > 0 ||
        Number(control.get('final_amount')?.value) > 0
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
    return account ? account.account_name : `Account ID: ${accountId}`;
}

getAccountCodeById(accountId: number): string {
    if (!accountId) return '-';
    const account = this.chartedAccount.find((acc: any) => acc.id === accountId);
    return account ? account.account_code : '-';
}

getServiceChartAccountId(serviceId: number): number | null {
    if (!serviceId) return null;
    const service = this.geAllItem.find((s: any) => s.service_id === serviceId);
    return service?.chart_of_account_id || null;
}

getServiceName(serviceId: number): string {
    if (!serviceId) return 'Unknown Service';
    const service = this.geAllItem.find((s: any) => s.service_id === serviceId);
    return service ? service.service_name : 'Unknown Service';
}

buildLedgerAccounts(): any[] {
    const accounts: any[] = [];

    const isRcm = this.isVendorRcm || false;
    const isIgst = this.isIgst || false;

    const cgst = this.summary.cgst || 0;
    const sgst = this.summary.sgst || 0;
    const igst = this.summary.igst || 0;
    const gstTotal = this.summary.gstTotal || 0;
    const totalTds = this.summary.tdsAmt || 0;
    const grandTotal = this.summary.net || 0;
    const lessAmount = this.less_amt || 0;

    const accountDetailsArray = this.Account_details;

    accountDetailsArray.controls.forEach((control: any) => {
        const serviceId = control.get('service_id')?.value;
        const rate = Number(control.get('rate')?.value) || 0;

        if (serviceId && rate > 0) {
            const serviceChartAccountId = this.getServiceChartAccountId(serviceId);
            const serviceName = this.getServiceName(serviceId);

            if (serviceChartAccountId) {
                accounts.push({
                    account_name: this.getAccountNameById(serviceChartAccountId) || serviceName,
                    account_code: this.getAccountCodeById(serviceChartAccountId),
                    debit_amount: rate,
                    credit_amount: 0,
                    type: 'DEBIT',
                    chart_account_id: serviceChartAccountId,
                    service_id: serviceId
                });
            }
        }
    });

    if (gstTotal > 0) {
        if (isRcm) {
            if (isIgst) {
                accounts.push({
                    account_name: this.getAccountNameById(403) || 'RCM IGST (Debit)',
                    account_code: this.getAccountCodeById(403),
                    debit_amount: igst,
                    credit_amount: 0,
                    type: 'DEBIT',
                    chart_account_id: 403,
                    is_rcm: true
                });

                accounts.push({
                    account_name: this.getAccountNameById(400) || 'RCM IGST Liability',
                    account_code: this.getAccountCodeById(400),
                    debit_amount: 0,
                    credit_amount: igst,
                    type: 'CREDIT',
                    chart_account_id: 400,
                    is_rcm: true
                });
            } else {
                accounts.push({
                    account_name: this.getAccountNameById(404) || 'RCM CGST (Debit)',
                    account_code: this.getAccountCodeById(404),
                    debit_amount: cgst,
                    credit_amount: 0,
                    type: 'DEBIT',
                    chart_account_id: 404,
                    is_rcm: true
                });

                accounts.push({
                    account_name: this.getAccountNameById(405) || 'RCM SGST (Debit)',
                    account_code: this.getAccountCodeById(405),
                    debit_amount: sgst,
                    credit_amount: 0,
                    type: 'DEBIT',
                    chart_account_id: 405,
                    is_rcm: true
                });

                accounts.push({
                    account_name: this.getAccountNameById(401) || 'RCM CGST Liability',
                    account_code: this.getAccountCodeById(401),
                    debit_amount: 0,
                    credit_amount: cgst,
                    type: 'CREDIT',
                    chart_account_id: 401,
                    is_rcm: true
                });

                accounts.push({
                    account_name: this.getAccountNameById(402) || 'RCM SGST Liability',
                    account_code: this.getAccountCodeById(402),
                    debit_amount: 0,
                    credit_amount: sgst,
                    type: 'CREDIT',
                    chart_account_id: 402,
                    is_rcm: true
                });
            }
        } else {
            if (isIgst) {
                accounts.push({
                    account_name: this.getAccountNameById(29) || 'IGST Input',
                    account_code: this.getAccountCodeById(29),
                    debit_amount: igst,
                    credit_amount: 0,
                    type: 'DEBIT',
                    chart_account_id: 29
                });
            } else {
                accounts.push({
                    account_name: this.getAccountNameById(21) || 'CGST Input',
                    account_code: this.getAccountCodeById(21),
                    debit_amount: cgst,
                    credit_amount: 0,
                    type: 'DEBIT',
                    chart_account_id: 21
                });

                accounts.push({
                    account_name: this.getAccountNameById(41) || 'SGST Input',
                    account_code: this.getAccountCodeById(41),
                    debit_amount: sgst,
                    credit_amount: 0,
                    type: 'DEBIT',
                    chart_account_id: 41
                });
            }
        }
    }

    if (totalTds > 0) {
        accounts.push({
            account_name: this.getAccountNameById(45) || 'TDS Payable',
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
        account_name: this.getAccountNameById(51) || 'Vendor Payable',
        account_code: this.getAccountCodeById(51),
        debit_amount: 0,
        credit_amount: grandTotal,
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
            is_less: true,
            entry_status: 'Less Amount'
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
        title: this.isVendorRcm ? 'Purchase Service Voucher - RCM Ledger Preview' : 'Purchase Service Voucher - Ledger Preview',
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


