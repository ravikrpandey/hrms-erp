import { format } from 'date-fns';
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
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { SalesService } from 'src/app/@modules/sales/service/sales.service';
import { LedgerPreviewService } from 'src/app/@shared/ledgerPreview/services/ledger-preview.service';

@Component({
  selector: 'app-add-sales-journal',
  templateUrl: './add-sales-journal.component.html',
  styleUrls: ['./add-sales-journal.component.scss']
})
export class AddSalesJournalComponent {
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
  customer_id: any;
  customersData: any;

  currencyData: any = [];
  currencyCode: string = 'INR';
  currencySymbol: string = '₹';
  currencyRate: number = 1;

  private isUpdatingCurrency: boolean = false;
  private isCalculating: boolean = false;

  less_amt: any = 0;
  private lessAmtBase: number = 0;
  getAllCustomerBillingList: any;
  customersDataBilling2: any;
  customersDataBilling1: any;

  branchStateId: string = '';
  customerStateId: string = '';
  isIntraState: boolean = true;
  selectedBranchData: any = null;
  branchName: string = '';
  customerStateName: string = '';

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
    private ledgerPreviewService: LedgerPreviewService,
  ) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    this.maxDate = moment({ year: year + 100, month, date }).format('YYYY-MM-DD');
    this.minDate = moment({ year, month, date }).format('YYYY-MM-DD');

    this.createJournalEntryForm = this.fb.group({
      posting_date: [moment(new Date()).format('YYYY/MM/DD')],
      entity_id: [null],
      voucher_id: [null],
      document_number: [null, Validators.required],
      transaction_date: [null],
      branch_id: [null],
      reference_number: [null],
      customer_id: [null],
      billing_id: [null],
      document_type: [null],
      sales_quotation_id: [null],
      proforma_invoice_id: [null],
      sales_booking_id: [null],
      sales_order_id: [null],
      sales_invoice_id: [null],
      total_amount: ['00'],
      notes: [null],
      currency_id: [null]
    });

    this.createJournalEntryItemForm = this.fb.group({
      Account_details: this.fb.array([this.createAccountDetailGroup()])
    });

    this.createJournalreferanceForm = this.fb.group({
      sales_value: ['00'],
      bill_amount: ['00'],
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

    if (this.journal_id && this.singleGeneral?.currency_rate) {
      return;
    }

    if (!currency || this.isUpdatingCurrency) return;

    this.isUpdatingCurrency = true;

    this.currencyData = currency;
    this.currencyCode = currency.Currency_Type || 'INR';
    this.currencyRate = Number(currency.rate || 1);
    this.currencySymbol = currency.symbols || '₹';

    this.createJournalEntryForm
      .get('currency_id')
      ?.setValue(this.currencyData.Currency_Convert_id);

    // sirf display update karo
    this.updateDisplayValues();

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

    let entity_id = localStorage.getItem("selectedEntityId");

    this._empService.grtEmployeeList(entity_id, this.getUserRole).subscribe((res: any) => {
      this.getEmployeeList = res.data;
    });

    this.getAllCustomersData();
    this.getChartAccountList();
    this.getAllItem();
    this.getAllBranch();
    this.getAllProfitCenter();
    this.getAllCostCenter();
    this.getCurrency();
    this.getAllBank();
    this.getAllVouchers();

    this.activeroute.queryParams.subscribe((params: any) => {
      this.journal_id = params.id;
      this.paramsType = params.status;
      this.isView = params.actionType === 'view' ? true : false;
      this.tabType = params.tabType;
      this.randomJournalNumber = "";

      if (this.journal_id) {

        this._finaceService.getsalesJournalById(this.journal_id).subscribe((res: any) => {

          if (res.code == 200) {

            this.singleGeneral = res.data;

            this.currencyCode = this.currencyData?.Currency_Type || res.data.currency_code;
            this.currencyRate = Number(this.currencyData?.rate || res.data.rate || 1);

            this.getCustomerBillingList(res.data.customer_id);

            this.lessAmtBase = Number(res.data.less_amount || 0);

            this.less_amt = this.currencyCode === 'INR'
              ? +this.lessAmtBase.toFixed(2)
              : +(this.lessAmtBase * this.currencyRate).toFixed(2);

            this.createJournalEntryForm.patchValue({
              posting_date: res.data.posting_date
                ? moment(res.data.posting_date).format('YYYY/MM/DD')
                : moment(new Date()).format('YYYY/MM/DD'),
              entity_id: res.data.entity_id,
              voucher_id: res.data.voucher_list_id,
              document_number: res.data.document_number,
              transaction_date: res.data.transaction_date,
              branch_id: res.data.branch_id,
              reference_number: res.data.reference_number,
              customer_id: res.data.customer_id,
              billing_id: res.data.billing_id,
              document_type: res.data.document_type,
              sales_quotation_id: res.data.quotation_id,
              proforma_invoice_id: res.data.proforma_invoice_id,
              sales_booking_id: res.data.sales_booking_id,
              sales_order_id: res.data.sales_order_id,
              sales_invoice_id: res.data.sales_invoice_id,
              total_amount: res.data.bill_amount || '00',
              notes: res.data.notes,
              currency_id: res.data.currency_id
            });

            this.createJournalreferanceForm.patchValue({
              sales_value: res.data.sales_value || '0',
              bill_amount: this.currencyCode === 'INR'
                ? +Number(res.data.bill_amount || 0).toFixed(2)
                : +(Number(res.data.bill_amount || 0) * this.currencyRate).toFixed(2)
            });

            const display = (value: any) => {
              const amount = Number(value || 0);
              return this.currencyCode === 'INR'
                ? +amount.toFixed(2)
                : +(amount * this.currencyRate).toFixed(2);
            };

            this.summary = {
              gross: display(res.data.taxable || 0),
              taxable: display(res.data.taxable || 0),
              totalDiscount: display(res.data.totalDiscount || 0),
              igst: display(res.data.igst || 0),
              cgst: display(res.data.cgst || 0),
              sgst: display(res.data.sgst || 0),
              gstTotal: display(
                Number(res.data.igst || 0) +
                Number(res.data.cgst || 0) +
                Number(res.data.sgst || 0)
              ),
              net: display(res.data.bill_amount || 0),
              payableAmount: display(
                Number(res.data.bill_amount || 0) -
                Number(res.data.less_amount || 0)
              ),
              isIntraState: this.isIntraState,
              branchStateId: this.branchStateId,
              customerStateId: this.customerStateId
            };

            this.Account_details.clear();
            this.originalCurrencyValues.clear();

            if (res.data.Account_details && res.data.Account_details.length > 0) {

              res.data.Account_details.forEach((item: any, index: number) => {

                const group = this.createAccountDetailGroup();

                const gstAmount = Number(item.gst_amount || 0);
                const cgstAmount = this.isIntraState ? gstAmount / 2 : 0;
                const sgstAmount = this.isIntraState ? gstAmount / 2 : 0;
                const igstAmount = this.isIntraState ? 0 : gstAmount;

                this.originalCurrencyValues.set(index, {
                  qty: Number(item.qty || 0),
                  rate: Number(item.rate || 0),
                  discount_value: Number(item.discount_value || 0),
                  discount_amount: Number(item.discount_amount || 0),
                  gst_amount: gstAmount,
                  total_value: Number(item.total_value || 0),
                  cgst_amount: cgstAmount,
                  sgst_amount: sgstAmount,
                  igst_amount: igstAmount,
                  remarks: item.remarks,
                });

                group.patchValue({
                  item_id: item.item_id,
                  item_code: item.item_code || '',
                  qty: item.qty || 0,
                  rate: display(item.rate || 0),
                  discount_type: item.discount_type || 'FIXED',
                  discount_value: Number(item.discount_value || 0),
                  discount_amount: display(item.discount_amount || 0),
                  total_value: display(item.total_value || 0),
                  cost_center_id: item.cost_center_id,
                  profit_center_id: item.profit_center_id,
                  narration: item.narration || '',
                  gst_rate: Number(item.gst_rate || 0),
                  gst_amount: display(gstAmount),
                  remarks: item.remarks,
                  journal_id: item.sales_journal_id || this.journal_id
                });

                this.Account_details.push(group);
              });
            }

            this.updateDisplayValues();
          }
        });
      }
    });
  }

  updateAmountsWithCurrencyRate(oldRate: number = 1) {
    if (oldRate === this.currencyRate) return;

    this.Account_details.controls.forEach((control: any, index: number) => {
      const baseValue = this.originalCurrencyValues.get(index);
      if (baseValue) {
        const newRate = this.multiplyWithPrecision(baseValue.rate, this.currencyRate);
        const newDiscountAmount = this.multiplyWithPrecision(baseValue.discount_amount, this.currencyRate);
        const newGstAmount = this.multiplyWithPrecision(baseValue.gst_amount, this.currencyRate);
        const newTotalValue = this.multiplyWithPrecision(baseValue.total_value, this.currencyRate);

        control.patchValue({
          rate: newRate,
          discount_amount: newDiscountAmount,
          gst_amount: newGstAmount,
          total_value: newTotalValue
        }, { emitEvent: false });
      }
    });

    if (this.lessAmtBase !== undefined && this.lessAmtBase !== null) {
      this.less_amt = this.multiplyWithPrecision(this.lessAmtBase, this.currencyRate);
    }

    this.calculateTotals();
  }

  customersData2: any = [];
  getAllCustomerDataList: any = [];
  customersData1: any = [];

  getAllCustomersData() {
    let entity_ids = localStorage.getItem('selectedEntityId');
    this._finaceService.getGPartyByEntityId('CUSTOMER', entity_ids).subscribe((res: any) => {
      this.getAllCustomerDataList = res.data;
      this.customersData2 = res?.data?.map((x: any) => x.company_name);
      this.customersData1 = this.getAllCustomerDataList;
    });
  }

  getAllCustomerData(event: any) {
    this.customer_id = event.value;
    this.getCustomerBillingList(this.customer_id);
  }

  getCustomerBillingList(customer_id: any) {
    this._finaceService.getCustomerBillingList(customer_id).subscribe((res: any) => {
      this.getAllCustomerBillingList = res.data;
      this.customersDataBilling2 = res?.data?.map((x: any) => x.billing_address);
      this.customersDataBilling1 = this.getAllCustomerBillingList;

      if (this.getAllCustomerBillingList && this.getAllCustomerBillingList.length > 0) {
        const defaultBilling = this.getAllCustomerBillingList[0];
        this.customerStateId = defaultBilling.state_id || '';
        this.customerStateName = defaultBilling.state_name || '';
        this.updateGSTCalculation();
      }
    });
  }

  onBillingChange(event: any) {
    const billingId = event.value;
    if (billingId) {
      const selectedBilling = this.getAllCustomerBillingList.find(
        (b: any) => b.billing_id === billingId
      );
      if (selectedBilling) {
        this.customerStateId = selectedBilling.state_id || '';
        this.customerStateName = selectedBilling.state_name || '';
        this.updateGSTCalculation();
      }
    }
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
    this.isIntraState = this.branchStateId && this.customerStateId
      ? this.branchStateId === this.customerStateId
      : true;
    this.calculateTotals();
  }

  searchByParty(e: any) {
    let aa = e;
    let filteredVariable = this.customersData1.filter((item: any) => aa.includes(item.company_name));
    this.getAllCustomerDataList = filteredVariable;
  }

  documentType: any = '';
  getAllAdvanceData: any;
  payload: any;

  getAllDocumentType(event: any) {
    this.documentType = event.value;
    if (this.documentType !== 'OTHERS') {
      this.payload = {
        customer_id: this.customer_id,
        document_type: this.documentType,
        entity_id: this.entity_id
      };
    }
    this._finaceService.getAllPoGrnSoByVendorId(this.payload).subscribe((res: any) => {
      this.getAllAdvanceData = res.data;
      if (this.getAllAdvanceData.length == 0) {
        this.createJournalEntryForm.get('document_type')?.reset();
      }
    }, (err: any) => {
      this.documentType = '';
      this.toast.warning(err.error.message);
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
    this._configurationalMasterService.getAllItem().subscribe((res: any) => {
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
      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
      this.chartedAccount1 = this.chartedAccount.map((res: any) => res.account_name);
      this.chartedAccount2 = this.chartedAccount;
    });
  }

  voucherData: any = [];

  getAllVouchers() {
    this._configurationalMasterService.getVouchersByID(7, this.entity_id).subscribe((res: any) => {
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
      item_id: [],
      item_code: [''],
      qty: [0],
      rate: [0],
      discount_type: ['FIXED'],
      discount_value: [0],
      total_value: [{ value: 0 }],
      cost_center_id: [],
      profit_center_id: [],
      gst_rate: [0],
      gst_amount: [0],
      narration: [''],
      discount_amount: [0],
      remarks: [''],
      journal_id: journal
    });
  }

  getItemCode(data: any, i: any) {
    let controls = this.Account_details.at(i);
    controls.get('item_code')?.setValue(data.item_code);
    controls.get('gst_rate')?.setValue(data.MASTER_HSN_SAC_CODE?.gst_value);
    this.calculateTotals();
  }

  AddRow(): void {

    const newRow = this.createAccountDetailGroup();

    const index = this.Account_details.length;

    // BASE VALUES (INR)
    this.originalCurrencyValues.set(index, {
      qty: 0,
      rate: 0,
      discount_value: 0,
      discount_amount: 0,
      gst_amount: 0,
      total_value: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      igst_amount: 0
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

  summary = {
    gross: 0,
    taxable: 0,
    totalDiscount: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    gstTotal: 0,
    net: 0,
    payableAmount: 0,
    isIntraState: true,
    branchStateId: '',
    customerStateId: ''
  };

  originalCurrencyValues = new Map<number, any>();

  storeCurrencyBaseValue(index: number) {
    const row: any = this.Account_details.at(index);
    const currentRate = this.currencyRate;

    const displayedRate = Number(row.get('rate')?.value || 0);
    const displayedDiscountAmount = Number(row.get('discount_amount')?.value || 0);
    const displayedGstAmount = Number(row.get('gst_amount')?.value || 0);
    const displayedTotalValue = Number(row.get('total_value')?.value || 0);

    this.originalCurrencyValues.set(index, {
      qty: Number(row.get('qty')?.value || 0),
      rate: this.divideWithPrecision(displayedRate, currentRate),
      discount_value: Number(row.get('discount_value')?.value || 0),
      discount_amount: this.divideWithPrecision(displayedDiscountAmount, currentRate),
      gst_amount: this.divideWithPrecision(displayedGstAmount, currentRate),
      total_value: this.divideWithPrecision(displayedTotalValue, currentRate)
    });
  }

  calculateTotals(): void {

  let gross = 0;
  let taxable = 0;
  let discount = 0;
  let igst = 0;
  let cgst = 0;
  let sgst = 0;
  let gst = 0;

  this.originalCurrencyValues.forEach((base: any) => {

    const qty = Number(base.qty || 0);
    const rate = Number(base.rate || 0);

    gross += qty * rate;
    taxable += Number(base.total_value || 0);
    discount += Number(base.discount_amount || 0);

    igst += Number(base.igst_amount || 0);
    cgst += Number(base.cgst_amount || 0);
    sgst += Number(base.sgst_amount || 0);

    gst += Number(base.gst_amount || 0);
  });

  const grand = taxable + gst;
  const payable = grand - Number(this.lessAmtBase || 0);

  // DISPLAY VALUES ONLY
  this.summary = {
    gross: +(gross * this.currencyRate).toFixed(2),
    taxable: +(taxable * this.currencyRate).toFixed(2),
    totalDiscount: +(discount * this.currencyRate).toFixed(2),

    igst: +(igst * this.currencyRate).toFixed(2),
    cgst: +(cgst * this.currencyRate).toFixed(2),
    sgst: +(sgst * this.currencyRate).toFixed(2),

    gstTotal: +(gst * this.currencyRate).toFixed(2),

    // IMPORTANT
    net: +(grand * this.currencyRate).toFixed(2),
    payableAmount: +(payable * this.currencyRate).toFixed(2),

    isIntraState: this.isIntraState,
    branchStateId: this.branchStateId,
    customerStateId: this.customerStateId
  };

  // update bill amount in display currency
  this.createJournalreferanceForm.patchValue({
    bill_amount: this.summary.net
  }, { emitEvent: false });

  // update less amount display
  this.less_amt = +(Number(this.lessAmtBase || 0) * this.currencyRate).toFixed(2);
}

  calculatePayableAmount(value: any) {
    const displayValue = Number(value || 0);
     this.lessAmtBase = displayValue / this.currencyRate;
     this.less_amt = displayValue;
      this.calculateTotals();
  }

  calculation(event: any, type: string, index: number) {

    const row: any = this.Account_details.at(index);

    let base = this.originalCurrencyValues.get(index) || {};

    const qty = Number(row.get('qty')?.value || 0);
    const displayRate = Number(row.get('rate')?.value || 0);
    const discountValue = Number(row.get('discount_value')?.value || 0);
    const gstRate = Number(row.get('gst_rate')?.value || 0);

    // exact INR from API rate (NOT rounded UI)
    const inrRate = displayRate / this.currencyRate;

    const gross = qty * inrRate;

    let discountAmount = 0;

    if (row.get('discount_type')?.value === 'FIXED') {
      discountAmount = discountValue / this.currencyRate;
    } else {
      discountAmount = gross * discountValue / 100;
    }

    const taxable = gross - discountAmount;

    const gstAmount = taxable * gstRate / 100;


    // STORE EXACT INR VALUES
    base = {
      qty: Number(qty),
      rate: Number(inrRate.toFixed(6)),
       discount_value: Number(discountValue),
       discount_amount: Number(discountAmount.toFixed(6)),
       total_value: Number(taxable.toFixed(6)),
       gst_amount: Number(gstAmount.toFixed(6)),
       cgst_amount: this.isIntraState ? Number((gstAmount / 2).toFixed(6)) : 0,
        sgst_amount: this.isIntraState ? Number((gstAmount / 2).toFixed(6)) : 0,
        igst_amount: this.isIntraState ? 0 : Number(gstAmount.toFixed(6))
      };
    this.originalCurrencyValues.set(index, base);

    // display only
    row.patchValue({
      discount_amount: +(discountAmount * this.currencyRate).toFixed(2),
      total_value: +(taxable * this.currencyRate).toFixed(2),
      gst_amount: +(gstAmount * this.currencyRate).toFixed(2)
    }, { emitEvent: false });

    this.calculateTotals();
  }
  updateDisplayValues() {
    this.Account_details.controls.forEach((row: any, index: number) =>
      {
        const base = this.originalCurrencyValues.get(index);
        if (!base) return;
        row.patchValue({ rate: +(base.rate * this.currencyRate).toFixed(2),
          discount_amount: +(base.discount_amount * this.currencyRate).toFixed(2),
          gst_amount: +(base.gst_amount * this.currencyRate).toFixed(2),
          total_value: +(base.total_value * this.currencyRate).toFixed(2) }, { emitEvent: false });
        });
        this.less_amt = +(this.lessAmtBase * this.currencyRate).toFixed(2);
        this.calculateTotals();
      }

  getData(event: any, control: string) {
    let sales_value = +this.createJournalreferanceForm.get('sales_value')?.value || 0;
    let freight_charge = +this.createJournalreferanceForm.get('freigth_packging_charges')?.value || 0;
    let insurance_charge = +this.createJournalreferanceForm.get('insurance_charges')?.value || 0;

    if (control === 'freight') {
      freight_charge = +event.target.value || 0;
      this.createJournalreferanceForm.get('bill_amount')?.setValue(sales_value + freight_charge);
    } else if (control === 'insurance') {
      insurance_charge = +event.target.value || 0;
      this.createJournalreferanceForm.get('bill_amount')?.setValue(sales_value + freight_charge + insurance_charge);
    }

    const bill_amount = sales_value + freight_charge + insurance_charge;
    this.createJournalreferanceForm.get('bill_amount')?.setValue(bill_amount);
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

      const accountDetailsInINR = this.Account_details.controls.map(
        (control: any, index: number) => {

          const base = this.originalCurrencyValues.get(index);

          return {
            ...control.getRawValue(),

            // EXACT INR VALUES
            qty: base.qty,
            rate: +base.rate.toFixed(6),
            discount_value: base.discount_value,
            discount_amount: +base.discount_amount.toFixed(6),
            total_value: +base.total_value.toFixed(6),
            gst_amount: +base.gst_amount.toFixed(6),
            cgst_amount: +base.cgst_amount.toFixed(6),
            sgst_amount: +base.sgst_amount.toFixed(6),
            igst_amount: +base.igst_amount.toFixed(6)
          };
        }
      );

      // exact INR totals
      let gross = 0;
      let taxable = 0;
      let discount = 0;
      let igst = 0;
      let cgst = 0;
      let sgst = 0;
      let gst = 0;

      accountDetailsInINR.forEach((x: any) => {
        gross += x.qty * x.rate;
        taxable += x.total_value;
        discount += x.discount_amount;
        igst += x.igst_amount;
        cgst += x.cgst_amount;
        sgst += x.sgst_amount;
        gst += x.gst_amount;
      });

      const grand = taxable + gst;

      const finalAmount = grand - (this.lessAmtBase || 0);

      const payload = {
        ...this.createJournalEntryForm.value,
        ...this.createJournalreferanceForm.value,

        financial_id: this.financial_id,
        entity_id: this.entity_id,
        bill_amount: +grand.toFixed(6),
        currency_code: this.currencyCode,
        currency_rate: this.currencyRate,
        currency_id: this.currencyData.Currency_Convert_id,

        // IMPORTANT: INR values
        gross_total: +gross.toFixed(6),
        taxable_value: +taxable.toFixed(6),
        total_discount: +discount.toFixed(6),
        igst: +igst.toFixed(6),
        cgst: +cgst.toFixed(6),
        sgst: +sgst.toFixed(6),
        gst_total: +gst.toFixed(6),
        grand_total: +grand.toFixed(6),
        less_amount: +(this.lessAmtBase || 0).toFixed(6),
        final_amount: +finalAmount.toFixed(6),

        is_intra_state: this.isIntraState,
        branch_state_id: this.branchStateId,
        customer_state_id: this.customerStateId,

        // send INR rows
        Account_details: accountDetailsInINR
      };

      // dates
      if (payload.transaction_date) {
        payload.transaction_date = moment(payload.transaction_date).format('YYYY-MM-DD');
      }

      if (payload.posting_date) {
        payload.posting_date = moment(payload.posting_date).format('YYYY-MM-DD');
      }

      console.log('FINAL INR PAYLOAD =>', payload);

      this._finaceService.createSalesJournal(payload).subscribe(
        (response: any) => {

          this.$common.hideLoader();

          if (response) {
            this.toast.success('Sales Journal Created Successfully');

            this.router.navigate([
              'master/finance/transactions/sales-journal'
            ]);
          }
        },
        (err: any) => {

          this.$common.hideLoader();

          this.toast.error(err?.error?.message || 'Something went wrong');
        }
      );
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
    this.router.navigate(['/master/finance/transactions/sales-journal']);
  }

  branch_id: any;

  getBranchId(event: any) {
    this.branch_id = event.value;
    this.createJournalEntryForm.get('voucher_id')?.reset();
    this.createJournalEntryForm.get('document_number')?.reset();
    this.getBranchDetailsFromList(event.value);
  }

  getVoucherId(event: any) {
    let payload = {
      branch_id: this.branch_id,
      voucher_id: event.value
    };
    this._finaceService.generatesalesJournalNumber(payload).subscribe((res: any) => {
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

getCustomerName(): string {
    const customerId = this.createJournalEntryForm.get('customer_id')?.value;
    if (!customerId) return '';
    const customer = this.getAllCustomerDataList.find((v: any) => v.id === Number(customerId));
    return customer ? customer.company_name : '';
}

getAccountNameById(accountId: number): string {
    if (!accountId) return 'Unknown Account';
    const account = this.chartedAccount.find((acc: any) => acc.id === accountId);
    if (account) return account.account_name;

    const accountMap: { [key: number]: string } = {
        23: 'CGST OUTPUT',
        31: 'IGST OUTPUT',
        43: 'SGST OUTPUT',
        168: 'Sundry Debtors',
        201: 'Discount Allowed',
        203: 'Sales Account',
        209: 'Sales Return'
    };

    return accountMap[accountId] || `Account ID: ${accountId}`;
}

getAccountCodeById(accountId: number): string {
    if (!accountId) return '-';
    const account = this.chartedAccount.find((acc: any) => acc.id === accountId);
    if (account) return account.account_code;

    const codeMap: { [key: number]: string } = {
        23: '2315',
        31: '2323',
        43: '2335',
        168: '1135',
        201: '6114',
        203: '6116',
        209: '614'
    };

    return codeMap[accountId] || '-';
}

buildLedgerAccounts(): any[] {
    const accounts: any[] = [];

    const isIgst = this.summary.igst > 0;
    const lessAmount = this.lessAmtBase || 0;

    const taxable = this.summary.taxable || 0;
    const totalDiscount = this.summary.totalDiscount || 0;
    const igst = this.summary.igst || 0;
    const cgst = this.summary.cgst || 0;
    const sgst = this.summary.sgst || 0;
    const grandTotal = this.summary.net || 0;
    const gstTotal = this.summary.gstTotal || 0;

    let totalAmount = 0;
    this.Account_details.controls.forEach((control: any) => {
        const rate = Number(control.get('rate')?.value) || 0;
        const qty = Number(control.get('qty')?.value) || 0;
        totalAmount += rate * qty;
    });

    accounts.push({
        account_name: this.getAccountNameById(203),
        account_code: this.getAccountCodeById(203),
        debit_amount: 0,
        credit_amount: taxable + totalDiscount,
        type: 'CREDIT',
        chart_account_id: 203
    });

    if (gstTotal > 0) {
        if (isIgst) {
            accounts.push({
                account_name: this.getAccountNameById(31),
                account_code: this.getAccountCodeById(31),
                debit_amount: 0,
                credit_amount: igst,
                type: 'CREDIT',
                chart_account_id: 31
            });
        } else {
            accounts.push({
                account_name: this.getAccountNameById(23),
                account_code: this.getAccountCodeById(23),
                debit_amount: 0,
                credit_amount: cgst,
                type: 'CREDIT',
                chart_account_id: 23
            });

            accounts.push({
                account_name: this.getAccountNameById(43),
                account_code: this.getAccountCodeById(43),
                debit_amount: 0,
                credit_amount: sgst,
                type: 'CREDIT',
                chart_account_id: 43
            });
        }
    }

    if (totalDiscount > 0) {
        accounts.push({
            account_name: this.getAccountNameById(201),
            account_code: this.getAccountCodeById(201),
            debit_amount: totalDiscount,
            credit_amount: 0,
            type: 'DEBIT',
            chart_account_id: 201
        });
    }

    accounts.push({
        account_name: this.getAccountNameById(168),
        account_code: this.getAccountCodeById(168),
        debit_amount: grandTotal,
        credit_amount: 0,
        type: 'DEBIT',
        chart_account_id: 168,
        party_name: this.getCustomerName()
    });

    if (lessAmount > 0) {
        accounts.push({
            account_name: this.getAccountNameById(168) + ' (Less Amount)',
            account_code: this.getAccountCodeById(168),
            debit_amount: 0,
            credit_amount: lessAmount,
            type: 'CREDIT',
            chart_account_id: 168,
            is_less: true
        });

        accounts.push({
            account_name: this.getAccountNameById(209),
            account_code: this.getAccountCodeById(209),
            debit_amount: lessAmount,
            credit_amount: 0,
            type: 'DEBIT',
            chart_account_id: 209,
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

    const previewData = {
        title: 'Sales Journal - Ledger Preview',
        voucherNumber: voucherNumber,
        voucherDate: transactionDate,
        currencySymbol: this.currencySymbol || '₹',
        currencyCode: this.currencyCode || 'INR',
        accounts: ledgerAccounts,
        totalDebit: totalDebit,
        totalCredit: totalCredit,
        narration: this.createJournalEntryForm.get('notes')?.value || '',
        partyName: this.getCustomerName() || 'Customer',
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
