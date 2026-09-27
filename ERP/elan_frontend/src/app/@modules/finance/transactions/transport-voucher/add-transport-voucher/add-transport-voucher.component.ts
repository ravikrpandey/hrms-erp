import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LedgerPreviewService } from 'src/app/@shared/ledgerPreview/services/ledger-preview.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';

@Component({
  selector: 'app-add-transport-voucher',
  templateUrl: './add-transport-voucher.component.html',
  styleUrls: ['./add-transport-voucher.component.scss']
})
export class AddTransportVoucherComponent {
  rowClass: any;
  transportForm: any;
  non_register: boolean = false;
  vendor_id: any;
  codeGet: any;
  cccodeGet: any;
  codeSncGet: any;
  checkRegister: string;
  supplierCheck: string;
  editBankData: any;
  supplierPurchaseChecked: boolean = false;
  type: any;
  accountData: any = [];
  data: any = [];
  lrList: any = [];
  entity_id: any = null;

  currencyData: any = [];
  currencyCode: string = 'INR';
  currencySymbol: string = '₹';
  currencyRate: number = 1;

  private isUpdatingCurrency: boolean = false;
  private isCalculating: boolean = false;

  hasChargesLoaded: boolean = false;

  constructor(
    private route: Router,
    private _empRegistration: EmpRegistrationService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    private vendorService: VendorManagementService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _commonService: CommonService,
    private crm: CrmService,
    private _finaceService: FinaceService,
    private _location: Location,
    private transport_service: TransportManagementService,
    public commonService: CommonService,
    public ledgerPreviewService: LedgerPreviewService,
  ) {
    this.rowClass = 'rowClass';

    this.transportForm = this.fb.group({
      transport_id: new FormControl(null, [Validators.required]),
      transport_date: new FormControl(new Date()),
      currency_id: new FormControl(),
      branch_id: new FormControl(),
      address: new FormControl(null),
      bill_invoice_number: new FormControl(null, [Validators.required]),
      gstin: new FormControl(null),
      gst_rate: new FormControl(null),
      rcm_check: new FormControl(null),
      tds_id: new FormControl(null),
      nature: new FormControl(null),
      nature_id: new FormControl(null),
      grand_total: new FormControl(null),
      total_tds: new FormControl(null),
      gross_total: new FormControl(null),
      Account_details: this.fb.array([]),
      transportList: this.fb.array([this.createItemsField()])
    });
  }

  id: any;
  financial_id: any;
  status: any;

  ngOnInit(): void {
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        if (!currency || this.isUpdatingCurrency) return;

        this.isUpdatingCurrency = true;

        const oldRate = this.currencyRate;
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type;
        this.currencyRate = Number(currency.rate);
        this.currencySymbol = currency.symbols || '₹';

        this.transportForm.get('currency_id')?.setValue(this.currencyData.Currency_Convert_id);

        this.updateAmountsWithCurrencyRate(oldRate);

        setTimeout(() => {
          this.isUpdatingCurrency = false;
        }, 100);
      });

    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');

    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.status = params.status;

      if (this.id) {
        this.getTransportById(this.id);
      }
      this.type = params?.type;
      this.getAllVendors();
      this.getCurrency();
      this.getAllBranch();
      this.getChartAccountList();
    });

    this.getAccountChart();
    this.getAllTdsData();
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

  updateAmountsWithCurrencyRate(oldRate: number = 1) {
    if (oldRate === this.currencyRate) return;

    this.Account_details.controls.forEach((control: any, index: number) => {
      const originalValue = this.originalCurrencyValues.get(index);
      if (originalValue && originalValue.amount !== undefined) {
        const newAmount = this.multiplyWithPrecision(originalValue.amount, this.currencyRate);
        control.patchValue({
          amount: newAmount
        }, { emitEvent: false });
      }
    });

    if (this.totalAmtBase !== undefined) {
      this.totalAmt = this.multiplyWithPrecision(this.totalAmtBase, this.currencyRate);
    }

    if (this.lessAmtBase !== undefined) {
      this.less_amt = this.multiplyWithPrecision(this.lessAmtBase, this.currencyRate);
    }

    this.calculateSummary(0);
  }

  get Account_details(): FormArray {
    return this.transportForm.get('Account_details') as FormArray;
  }

  back() {
    this.route.navigate(['/master/finance/transactions/transport-voucher']);
  }

  less_amt: any = 0;
  private lessAmtBase: number = 0;
  private totalAmtBase: number = 0;

  getTransportById(id: any) {
    this._finaceService.getTransportById(id).subscribe((res: any) => {
      if (res.data) {
        let details = res.data.details;
        let items = res.data.items;

        this.lessAmtBase = details.less_value || 0;
        this.less_amt = this.multiplyWithPrecision(this.lessAmtBase, this.currencyRate);

        let Account_details = res.data.Account_details;
        this.patchAccountDetails(Account_details);

        if (Account_details && Account_details.length > 0) {
          this.hasChargesLoaded = true;
        }

        this._finaceService.getTransporterByIdTdsValue(details.transport_id).subscribe((res: any) => {
          if (!res.data?.length) {
            this.getAllTdsSection = [];
            return this.toast.warning('TDS Not Mapped On This Vendor');
          }
          this.getAllTdsSection = res.data;
        });

        this._finaceService.getTdsNatureOfTransactionTransporter(details.nature_id, details.transport_id).subscribe((res: any) => {
          this.getAllNatureOfTrsanction = res.data;
        });

        this._finaceService.getLRDataList(details.transport_id, this.entity_id).subscribe((res: any) => {
          this.lrList = res.data;
        });

        this.rcm_charge = details.rcm_charge;
        this.total_amount = details.total_amount || 0;

        setTimeout(() => {
          this.calculateSummary(0);
        }, 100);

        this.transportForm.patchValue({
          transport_id: details.transport_id,
          tds_id: details.tds_id,
          nature: details.nature,
          rcm_check: details.rcm_check,
          nature_id: details.nature_id,
          gst_rate: details.gst_rate,
          transport_date: details.date,
          address: details.Address,
          bill_invoice_number: details.bill_invoice_number,
          gstin: details.GSTIN,
        });

        this.transportList.removeAt(0);
        items.forEach((element: any) => {
          let controls = this.fb.group({
            LR_id: [element.LR_id],
            LR_Date: [element.date],
            billing_address: [element.from],
            shipping_address: [element.to],
            vehicle_number: [element.vehicle_number],
            LR_number: ['']
          });
          this.transportList.push(controls);
        });
      }
    });
  }

  patchAccountDetails(data: any[]) {
    const accountArray = this.Account_details;
    accountArray.clear();
    this.originalCurrencyValues.clear();

    data.forEach((item: any, i: any) => {
      this._finaceService.getChartOfAccountById(item.parent_chart_account_id).subscribe((res: any) => {
        if (res) {
          this.getAllData[i] = res.data;
        }
      });

      const baseAmount = item.amount || 0;
      this.originalCurrencyValues.set(i, {
        amount: baseAmount,
        lorry_number: item.lorry_number || 'LR001'
      });

      const displayAmount = this.multiplyWithPrecision(baseAmount, this.currencyRate);

      accountArray.push(
        this.fb.group({
          parent_chart_account_id: [item.parent_chart_account_id],
          child_chart_account_id: [item.chart_account_id],
          charges_name: [item.charges_name],
          amount: [displayAmount],
          lorry_number: [item.lorry_number || 'LR001']
        })
      );
    });

    if (data && data.length > 0) {
      this.hasChargesLoaded = true;
    }
  }

  removeAccount(i: any) {
    this.Account_details.removeAt(i);
    this.originalCurrencyValues.delete(i);
    this.reindexOriginalValues();
    this.calculateSummary(0);
    if (this.Account_details.length === 0) {
      this.hasChargesLoaded = false;
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

  getAllData: any = [];

  getChildAccountByID(id: any, i: any) {
    this._finaceService.getChartOfAccountById(id).subscribe((res: any) => {
      if (res) {
        this.getAllData[i] = res.data;
      }
    });
  }

  onAccountChange(event: any, i: any) {
    this.getChildAccountByID(event.value, i);
  }

  chartedAccount: any[] = [];
  chartedAccount1: any[] = [];
  chartedAccount2: any[] = [];
  filteredChartedAccount: any[] = [];

  getChartAccountList() {
    this._finaceService
      .getchartedAccount(this.entity_id)
      .subscribe((res: any) => {
        this.chartedAccount = res.data.filter(
          (element: any) => element.is_group === 'yes'
        );
        this.chartedAccount1 = this.chartedAccount.map((x: any) => x.account_name);
        this.chartedAccount2 = [...this.chartedAccount];
        this.filteredChartedAccount = [...this.chartedAccount];
      });
  }

  getLorryNumber(index: number): string {
    const control = this.Account_details.at(index);
    return control.get('lorry_number')?.value || 'LR001';
  }

  isFirstRowOfLorry(index: number): boolean {
    if (index === 0) return true;
    const currentLorry = this.getLorryNumber(index);
    const prevLorry = this.getLorryNumber(index - 1);
    return currentLorry !== prevLorry;
  }

  getLorryTotal(lorryNumber: string): number {
    let total = 0;
    this.Account_details.controls.forEach((control: any) => {
      if (control.get('lorry_number')?.value === lorryNumber) {
        total += parseFloat(control.get('amount')?.value) || 0;
      }
    });
    return total;
  }

  getData(data: any) {
    this._finaceService.getTransportChargesTotal(data.planning_id)
        .subscribe((res: any) => {
            const charges = res.data || [];

            const controls = this.transportForm.get('Account_details') as FormArray;

            while (controls.length > 0) {
                controls.removeAt(0);
            }
            this.originalCurrencyValues.clear();

            const lorryNumber = data.LR_number || data.vehicle_number || 'LR001';

            if (charges && charges.length > 0) {
              charges.forEach((charge: any, index: number) => {
                  const formGroup = this.fb.group({
                      charge_id: [charge.charge_id || null],
                      charges_name: [charge.charge_name || ''],
                      amount: [this.multiplyWithPrecision(parseFloat(charge.charge_amount) || 0, this.currencyRate)],
                      charge_amount_base: [parseFloat(charge.charge_amount) || 0],
                      vp_trans_id: [charge.vp_trans_id || null],
                      vehicle_planing_id: [charge.vehicle_planing_id || null],
                      transportor_id: [charge.transportor_id || null],
                      trip_status: [charge.trip_status || ''],
                      remark: [charge.remark || ''],
                      parent_chart_account_id: [null],
                      child_chart_account_id: [null],
                      lorry_number: [lorryNumber]
                  });
                  controls.push(formGroup);

                  this.originalCurrencyValues.set(index, {
                      amount: parseFloat(charge.charge_amount) || 0,
                      charge_name: charge.charge_name || '',
                      lorry_number: lorryNumber
                  });
              });

              this.hasChargesLoaded = true;
            } else {
              this.hasChargesLoaded = false;
              this.toast.info('No charges found for this LR');
            }

            const totalAmount = charges.reduce((sum: number, charge: any) => {
                return sum + (parseFloat(charge.charge_amount) || 0);
            }, 0);

            this.totalAmtBase = totalAmount;
            this.totalAmt = this.multiplyWithPrecision(totalAmount, this.currencyRate);

            this.calculateSummary(0);
        }, (error: any) => {
            console.error('Error fetching charges:', error);
            this.hasChargesLoaded = false;
            this.toast.error('Failed to fetch charges');
        });
  }

  accountFilter(e: any, index: number) {
    const filteredVariable = this.chartedAccount2.filter((item: any) =>
      e.includes(item.account_name)
    );
    this.filteredChartedAccount = filteredVariable;
  }

  clearDropdown(control: any, index: any) {
    this.Account_details.controls[index].get(control)?.setValue(null);
  }

  createAccountDetailGroup(): any {
    return this.fb.group({
      parent_chart_account_id: [null, Validators.required],
      child_chart_account_id: [null, Validators.required],
      charges_name: [null, Validators.required],
      amount: [null, Validators.required],
      lorry_number: ['LR001']
    });
  }

  getLRList(transporter_id: any) {
    this._finaceService.getLRDataList(transporter_id, this.entity_id).subscribe((res: any) => {
      this.lrList = res.data;
    });
  }

  onLRSelect(lrNumber: any, index: number) {
    const selectedLR = this.lrList.find((lr: any) => lr.LR_id === lrNumber);
    if (selectedLR) {
      this.transportList.at(index).patchValue({
        LR_Date: selectedLR.LR_Date,
        billing_address: selectedLR.billing_address,
        shipping_address: selectedLR.shipping_address,
        vehicle_number: selectedLR.vehicle_number
      });
    }
  }

  rcm_charge: any = 0;
  totalAmt: any = 0;

  geVendorById(data: any) {
    this.transportForm.patchValue({
      address: data.tm_address,
      gstin: data.tm_gst_number || 'NA',
      rcm_check: data.rcm_check || 'NA',
      gst_rate: data.gst_rate || 'NA'
    });
    this.getVendorData(data);
    this.getLRList(data.id);
    this.getChartAccountList();

    this.rcm_charge = data.rcm_check;

    const controls = this.Account_details;
    while (controls.length > 0) {
        controls.removeAt(0);
    }
    this.originalCurrencyValues.clear();
    this.hasChargesLoaded = false;

    this.transportList.controls.forEach((element: any) => {
      element.reset();
    });

    this.transportForm.patchValue({
      tds_id: null,
      nature: null,
      nature_id: null,
    });

    this.total_amount = 0;
    this.calculateSummary(0);
  }

  getAllTdsSection: any = [];
  transporter_id: any;

  getVendorData(data: any) {
    this.transporter_id = data.id;
    this._finaceService.getTransporterByIdTdsValue(data.id).subscribe((res: any) => {
      if (!res.data?.length) {
        this.getAllTdsSection = [];
        return this.toast.warning('TDS Not Mapped On This Vendor');
      }
      this.getAllTdsSection = res.data;
    });
  }

  tds_rate: any = 0;
  total_amount: any = 0;
  minimum_threshold_limit: any = 0;
  maximum_limit: any = 0;
  tds_section: any;
  nature_id: any;

  getTdsRate(data: any) {
    this.tds_rate = Number(data.current_rate || 0);
    this.total_amount = Number(data.total_amount || 0);
    this.minimum_threshold_limit = Number(data.threshold_limit || 0);
    this.maximum_limit = Number(data.maximum_amount || 0);
    this.tds_section = data.section;
    this.nature_id = data.id;
    this.calculateSummary(0);
  }

  onRcmChange(isChecked: boolean) {
    this.rcm_charge = isChecked ? 1 : 0;
    this.calculateSummary(0);
  }

  less_value: number = 0;

  calculatePayableAmount(value: any) {
    const enteredValue = Number(value) || 0;
    this.lessAmtBase = this.divideWithPrecision(enteredValue, this.currencyRate);
    this.less_value = enteredValue;
    this.calculateSummary(0);
  }

  originalCurrencyValues = new Map<number, any>();

  storeCurrencyBaseValue(index: number) {
    const row: any = this.Account_details.at(index);
    const currentDisplayAmount = Number(row.get('amount')?.value || 0);
    const existing = this.originalCurrencyValues.get(index);

    if (!existing) {
      const baseAmount = this.divideWithPrecision(currentDisplayAmount, this.currencyRate);
      this.originalCurrencyValues.set(index, {
        amount: baseAmount,
        lorry_number: row.get('lorry_number')?.value || 'LR001'
      });
    } else {
      const calculatedBase = this.divideWithPrecision(currentDisplayAmount, this.currencyRate);
      if (Math.abs(calculatedBase - existing.amount) > 0.01) {
        this.originalCurrencyValues.set(index, {
          amount: calculatedBase,
          lorry_number: row.get('lorry_number')?.value || 'LR001'
        });
      }
    }
  }

  summary = {
    taxable: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    gstTotal: 0,
    gross: 0,
    tds: 0,
    net: 0,
    payableAmount: 0
  };

  calculateSummary(i: any) {
    if (this.isCalculating) return;
    this.isCalculating = true;

    this.Account_details.controls.forEach((control: any, index: number) => {
      this.storeCurrencyBaseValue(index);
    });

    let total = 0;
    let totalGst = 0;

    const gstRate = Number(this.transportForm.get('gst_rate')?.value) || 0;

    this.Account_details.controls.forEach((control: any) => {
      const amt = Number(control.get('amount')?.value) || 0;
      total += amt;
      totalGst += this.multiplyWithPrecision(amt * gstRate, 0.01);
    });

    total = this.roundToTwoDecimals(total);
    totalGst = this.roundToTwoDecimals(totalGst);

    const invoiceAmount = this.multiplyWithPrecision(this.total_amount, this.currencyRate);
    const applicableAmount = this.roundToTwoDecimals(total + invoiceAmount);

    let tds = 0;

    if (this.tds_section === '194 C') {
      const minThreshold = this.multiplyWithPrecision(this.minimum_threshold_limit, this.currencyRate);
      const maxLimit = this.multiplyWithPrecision(this.maximum_limit, this.currencyRate);

      if (applicableAmount >= minThreshold && applicableAmount <= maxLimit) {
        tds = this.multiplyWithPrecision(applicableAmount * this.tds_rate, 0.01);
      }
    } else {
      const maxLimit = this.multiplyWithPrecision(this.maximum_limit, this.currencyRate);
      if (this.maximum_limit > 0 && applicableAmount > maxLimit) {
        tds = this.multiplyWithPrecision(applicableAmount * this.tds_rate, 0.01);
      }
    }

    tds = this.roundToTwoDecimals(tds);

    const cgst = this.roundToTwoDecimals(totalGst / 2);
    const sgst = this.roundToTwoDecimals(totalGst / 2);
    const igst = 0;

    const grossTotal = this.roundToTwoDecimals(applicableAmount);
    const netPayable = this.roundToTwoDecimals(
      grossTotal + (this.rcm_charge == 0 ? totalGst : 0) - tds
    );

    const payableAmount = this.roundToTwoDecimals(netPayable - this.less_value);

    this.summary = {
      taxable: total,
      cgst: cgst,
      sgst: sgst,
      igst: igst,
      gstTotal: totalGst,
      gross: grossTotal,
      tds: tds,
      net: netPayable,
      payableAmount: payableAmount
    };

    if (this.is_round_off) {
      this.rounded_payable_amount = Math.round(this.summary.payableAmount);
      this.round_off = Number((this.rounded_payable_amount - this.summary.payableAmount).toFixed(2));
    }

    this.isCalculating = false;
  }

  onAmountChange(index: number) {
    const control = this.Account_details.at(index);
    const amount = Number(control.get('amount')?.value || 0);

    const baseAmount = this.divideWithPrecision(amount, this.currencyRate);
    this.originalCurrencyValues.set(index, {
      amount: baseAmount,
      lorry_number: control.get('lorry_number')?.value || 'LR001'
    });

    this.calculateSummary(0);
  }

  onGstRateChange() {
    this.calculateSummary(0);
  }

  getAllBranchData: any = [];

  getAllBranch() {
    this._configurationalMasterService.getListBranchSetup().subscribe((res: any) => {
      this.getAllBranchData = res.data;
    });
  }

  getBranchId(branch: any) {}

  getCurrency() {
    this._configurationalMasterService.CurrencyList().subscribe((res: any) => {
      this.currencyData = res.data;
    });
  }

  changeCurrencyAmount(data: any) {
    this.currencyCode = data.Currency_Type;
    this.currencySymbol = data.symbols || '₹';
    const oldRate = this.currencyRate;
    this.currencyRate = Number(data.rate);

    this.updateAmountsWithCurrencyRate(oldRate);
  }

  vendorPartyData: any = [];
  vendorPartyData1: any = [];
  vendorPartyData2: any = [];

  getAllVendors() {
    this.transport_service.getTranportDataList(this.entity_id).subscribe((res: any) => {
      this.vendorPartyData = res.data;
      this.vendorPartyData1 = res?.data?.map((x: any) => x.tm_name);
      this.vendorPartyData2 = this.vendorPartyData;
    });
  }

  searchByParty(e: any) {
    const aa = e;
    let filteredVariable = this.vendorPartyData2.filter((item: any) => aa.includes(item.tm_name));
    this.vendorPartyData = filteredVariable;
  }

  getAllNatureOfTrsanction: any = [];

  getAllNatureTransaction(data: any) {
    this.transportForm.get('nature')?.setValue(data.nature);
    this._finaceService.getTdsNatureOfTransactionTransporter(data.nature_id, this.transporter_id).subscribe((res: any) => {
      this.getAllNatureOfTrsanction = res.data;
    });
  }

  createItemsField(): FormGroup {
    return this.fb.group({
      LR_id: ['', Validators.required],
      LR_Date: [''],
      billing_address: ['', Validators.required],
      shipping_address: ['', Validators.required],
      vehicle_number: ['', Validators.required],
      LR_number: ['']
    });
  }

  addAccount(i: any) {
    const newGroup = this.createAccountDetailGroup();
    const lastIndex = this.Account_details.length - 1;
    if (lastIndex >= 0) {
      const lastLorry = this.Account_details.at(lastIndex).get('lorry_number')?.value;
      newGroup.patchValue({
        lorry_number: lastLorry || 'LR001'
      });
    }
    this.Account_details.push(newGroup);
    if (this.Account_details.length > 0) {
      this.hasChargesLoaded = true;
    }
  }

  addItem(i: any) {
    const formArray = this.transportList as FormArray;

    for (let control of formArray.controls) {
      if (control.invalid) {
        control.markAllAsTouched();
        this.toast.warning('Please fill all required fields before adding a new item.');
        return;
      }
    }

    const newRow = this.createItemsField();
    formArray.push(newRow);
  }

  removeItem(index: number) {
    this.transportList.removeAt(index);
  }

  get transportList(): FormArray {
    return this.transportForm.get('transportList') as FormArray;
  }

  tdsData: any = [];

  getAllTdsData = () => {
    this._configurationalMasterService.getAllTdsData(this.entity_id).subscribe((res: any) => {
      this.tdsData = res.data;
    }, (err: any) => {
      this.tdsData = [];
    });
  }

  natureData: any = [];

  getTdsById(data: any, i: any) {
    this._configurationalMasterService.getTdsDataByIdVendor(data.id).subscribe((res: any) => {
      this.natureData[i] = res.data;
    });
  }

  viewFile(data: any) {
    window.open(data, '_blank');
  }

  getAccountChart() {
    this.vendorService.getAccountChart(this.entity_id).subscribe((res: any) => {
      this._commonService?.hideLoader();
      this.data = res?.data;
    }, (err: any) => {
      this._commonService?.hideLoader();
    });
  }

  cancels(path: any) {
    this.route.navigate([path]);
  }

  calculateFooterTotals() {}

  round_off: number = 0;
  rounded_payable_amount: number = 0;
  is_round_off: boolean = false;

  roundOffAmount() {
    let payable = this.summary.payableAmount || 0;
    let rounded = Math.round(payable);

    this.round_off = Number((rounded - payable).toFixed(2));
    this.rounded_payable_amount = rounded;
    this.is_round_off = true;

    this.calculateSummary(0);
  }

  resetRoundOff() {
    this.round_off = 0;
    this.rounded_payable_amount = 0;
    this.is_round_off = false;
    this.calculateSummary(0);
  }

  onSubmit() {
    let val = this.transportForm.value;

    let payload: any = {
      ...val,
      financial_id: this.financial_id,
      entity_id: this.entity_id,
      taxable_value: this.divideWithPrecision(this.summary.taxable, this.currencyRate),
      gst_type: this.rcm_charge,
      igst: this.divideWithPrecision(this.summary.igst, this.currencyRate),
      cgst: this.divideWithPrecision(this.summary.cgst, this.currencyRate),
      sgst: this.divideWithPrecision(this.summary.sgst, this.currencyRate),
      gross_total: this.divideWithPrecision(this.summary.gross, this.currencyRate),
      total_tds: this.divideWithPrecision(this.summary.tds, this.currencyRate),
      gst_total: this.divideWithPrecision(this.summary.gstTotal, this.currencyRate),
      grand_total: this.divideWithPrecision(this.summary.net, this.currencyRate),
      less_value: this.divideWithPrecision(this.less_value, this.currencyRate),
      finalAmount: this.divideWithPrecision(this.summary.payableAmount, this.currencyRate),
      currency_code: this.currencyCode,
      currency_rate: this.currencyRate,
      total_amount: this.total_amount,
      round_off: this.round_off,
      rounded_payable_amount: this.rounded_payable_amount,
      is_round_off: this.is_round_off
    };

    const accountDetails = this.Account_details.value;
    payload.Account_details = accountDetails.map((item: any, index: number) => {
      const baseAmount = this.originalCurrencyValues.get(index)?.amount ||
                         this.divideWithPrecision(item.amount, this.currencyRate);
      return {
        ...item,
        amount: this.roundToTwoDecimals(baseAmount)
      };
    });

    let financial_id = localStorage.getItem('financial_id');

    this._finaceService.getFinancialYearActiveMonthByEntityId(this.entity_id, financial_id).subscribe({
      next: (res: any) => {
        if (!this._commonService.checkCurrentMonthActive(res.data)) {
          this.toast.warning('Current month is not active');
          return;
        }

        this._finaceService.createTransportVoucher(payload).subscribe(
          (res: any) => {
            if (res.code == 200) {
              this.toast.success(res.message);
              this.route.navigate(['/master/finance/transactions/transport-voucher']);
            }
          },
          (err) => {
            this.toast.error(err.error.message);
          }
        );
      }
    });
  }

  hasAccounts(): boolean {
    return this.Account_details?.controls?.some((control: any) =>
        Number(control.get('amount')?.value) > 0
    ) || false;
  }

  getTransporterName(): string {
    const transporterId = this.transportForm.get('transport_id')?.value;
    if (!transporterId) return '';
    const transporter = this.vendorPartyData.find((v: any) => v.id === Number(transporterId));
    return transporter ? transporter.tm_name : '';
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
        339: 'ROUND OFF',
        347: 'Transportation Charges',
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
        339: '2341',
        347: '4183',
        400: '2347',
        401: '2346',
        402: '2345',
        403: '2344',
        404: '2343',
        405: '2342'
    };

    return codeMap[accountId] || '-';
  }

  getChildAccountName(accountId: number): string {
    if (!accountId) return 'Unknown Account';
    const account = this.data.find((acc: any) => acc.id === accountId);
    if (account) return account.account_name;
    return this.getAccountNameById(accountId);
  }

  buildLedgerAccounts(): any[] {
    const accounts: any[] = [];

    const isRcm = this.transportForm.get('rcm_check')?.value || false;

    const cgst = this.summary.cgst || 0;
    const sgst = this.summary.sgst || 0;
    const gstTotal = this.summary.gstTotal || 0;
    const totalTds = this.summary.tds || 0;
    const lessAmount = this.less_value || 0;
    const roundOffAmount = this.round_off || 0;
    const netPayable = this.summary.payableAmount || 0;

    const accountDetailsArray = this.Account_details;

    let totalDebit = 0;
    let totalCredit = 0;

    accountDetailsArray.controls.forEach((control: any) => {
        const childChartAccountId = control.get('child_chart_account_id')?.value;
        const amount = Number(control.get('amount')?.value) || 0;
        const chargesName = control.get('charges_name')?.value || 'Transport Charge';

        if (childChartAccountId && amount > 0) {
            accounts.push({
                account_name: this.getChildAccountName(childChartAccountId),
                account_code: this.getAccountCodeById(childChartAccountId),
                debit_amount: amount,
                credit_amount: 0,
                type: 'DEBIT',
                chart_account_id: childChartAccountId,
                charges_name: chargesName
            });
            totalDebit += amount;
        }
    });

    if (gstTotal > 0) {
        if (isRcm) {
            accounts.push({
                account_name: this.getAccountNameById(404),
                account_code: this.getAccountCodeById(404),
                debit_amount: cgst,
                credit_amount: 0,
                type: 'DEBIT',
                chart_account_id: 404,
                is_rcm: true
            });
            totalDebit += cgst;

            accounts.push({
                account_name: this.getAccountNameById(405),
                account_code: this.getAccountCodeById(405),
                debit_amount: sgst,
                credit_amount: 0,
                type: 'DEBIT',
                chart_account_id: 405,
                is_rcm: true
            });
            totalDebit += sgst;

            accounts.push({
                account_name: this.getAccountNameById(401),
                account_code: this.getAccountCodeById(401),
                debit_amount: 0,
                credit_amount: cgst,
                type: 'CREDIT',
                chart_account_id: 401,
                is_rcm: true
            });
            totalCredit += cgst;

            accounts.push({
                account_name: this.getAccountNameById(402),
                account_code: this.getAccountCodeById(402),
                debit_amount: 0,
                credit_amount: sgst,
                type: 'CREDIT',
                chart_account_id: 402,
                is_rcm: true
            });
            totalCredit += sgst;
        } else {
            accounts.push({
                account_name: this.getAccountNameById(21),
                account_code: this.getAccountCodeById(21),
                debit_amount: cgst,
                credit_amount: 0,
                type: 'DEBIT',
                chart_account_id: 21
            });
            totalDebit += cgst;

            accounts.push({
                account_name: this.getAccountNameById(41),
                account_code: this.getAccountCodeById(41),
                debit_amount: sgst,
                credit_amount: 0,
                type: 'DEBIT',
                chart_account_id: 41
            });
            totalDebit += sgst;
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
            tds_section: this.transportForm.get('tds_id')?.value || '194C',
            tds_rate: this.tds_rate || 0
        });
        totalCredit += totalTds;
    }

    if (lessAmount > 0) {
        accounts.push({
            account_name: this.getAccountNameById(347),
            account_code: this.getAccountCodeById(347),
            debit_amount: 0,
            credit_amount: lessAmount,
            type: 'CREDIT',
            chart_account_id: 347,
            is_less: true
        });
        totalCredit += lessAmount;
    }

    if (netPayable > 0) {
        accounts.push({
            account_name: this.getAccountNameById(51),
            account_code: this.getAccountCodeById(51),
            debit_amount: 0,
            credit_amount: netPayable,
            type: 'CREDIT',
            chart_account_id: 51,
            party_name: this.getTransporterName()
        });
        totalCredit += netPayable;
    }

    const difference = totalDebit - totalCredit;

    if (Math.abs(difference) > 0.01) {
        accounts.push({
            account_name: this.getAccountNameById(339),
            account_code: this.getAccountCodeById(339),
            debit_amount: difference > 0 ? Math.abs(difference) : 0,
            credit_amount: difference < 0 ? Math.abs(difference) : 0,
            type: difference > 0 ? 'DEBIT' : 'CREDIT',
            chart_account_id: 339,
            is_round_off: true
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

    const voucherNumber = this.transportForm.get('bill_invoice_number')?.value || '-';
    const transactionDate = this.transportForm.get('transport_date')?.value || new Date();

    const isRcm = this.transportForm.get('rcm_check')?.value || false;

    const previewData = {
        title: isRcm ? 'Transport Voucher - RCM Ledger Preview' : 'Transport Voucher - Ledger Preview',
        voucherNumber: voucherNumber,
        voucherDate: transactionDate,
        currencySymbol: this.currencySymbol || '₹',
        currencyCode: this.currencyCode || 'INR',
        accounts: ledgerAccounts,
        totalDebit: totalDebit,
        totalCredit: totalCredit,
        narration: '',
        partyName: this.getTransporterName() || 'Transporter',
        showSubmitButton: true,
        isViewMode: false
    };

    this.ledgerPreviewService.openPreview(previewData)
        .subscribe((result: any) => {
            if (result?.action === 'submit') {
                this.onSubmit();
            }
        });
  }
}
