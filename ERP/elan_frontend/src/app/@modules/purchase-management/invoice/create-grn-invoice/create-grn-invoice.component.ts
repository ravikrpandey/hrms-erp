import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoreManagementService } from 'src/app/@modules/store-management/store-management.service';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { GrnServiceService } from '../../services/grn-service.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-create-grn-invoice',
  templateUrl: './create-grn-invoice.component.html',
  styleUrls: ['./create-grn-invoice.component.scss']
})
export class CreateGrnInvoiceComponent implements OnInit {
  POformGroup: FormGroup;
  submitBtn: boolean = true;
  showBtn: boolean = true;
  imageToUpload: any;
  imagePath: any;
  po_category_type: any;
  fileType: any;
  entity_id: any;
  finacial_id: any;
  employee_id: any;
  loginUserDetails: any;
  role: any;

  chargeFields = [
    {
      label: 'Freight Charges',
      key: 'freight_charges',
      vendor_category: "both",
      isReadonly: true
    },
    {
      label: 'CHA Service Charges',
      key: 'cha_service_charges',
      vendor_category: "both",
      isReadonly: true
    },
    {
      label: 'CHA Other Charges',
      key: 'cha_other_charges',
      vendor_category: "both",
      isReadonly: true
    },
    {
      label: 'Loading Unloading Charges',
      key: 'loading_unloading_charges',
      vendor_category: "both",
      isReadonly: true
    },
    {
      label: 'Port To Warehouse Charges',
      key: 'port_to_warehouse_charges',
      vendor_category: "International",
      isReadonly: true
    },
    {
      label: 'BOE Freight Charges',
      key: 'boe_freight_charges',
      vendor_category: "International",
      isReadonly: true
    },
    {
      label: 'Insurance Charges',
      key: 'insurance_charges',
      vendor_category: "International",
      isReadonly: true
    },
    {
      label: 'Duty Amount',
      key: 'duty_amount',
      vendor_category: "International",
      isReadonly: true
    }
  ];

  itemsTotal: number = 0;
  itemsGstTotal: number = 0;
  shippingChargesTotal: number = 0;
  shippingChargesGst: number = 0;
  mappingTotal: number = 0;
  totalGstAmount: number = 0;
  grandTotal: number = 0;
  totalAmount: string = '0';

  tdsAmount: number = 0;
  tdsRate: number = 0;

  originalAdvanceAmount: number = 0;
  advance_amount: any = 0;
  adjustedAdvanceAmount: number = 0;
  balancePayable: number = 0;
  netPayableAfterAdjustment: number = 0;
  advanceAdjustmentApplied: boolean = false;
  adjustmentAmount: number = 0;

  advance_utilization_percent: number = 0;
  calculatedAdvanceAmount: number = 0;
  showAdvanceUtilization: boolean = false;

  rcm_type: any;
  rcmAmount: number = 0;

  summaryData: any = {
    itemsTotal: 0,
    itemsGst: 0,
    shippingCharges: 0,
    shippingGst: 0,
    mappingTotal: 0,
    totalGst: 0,
    grandTotal: 0,
    tdsRate: 0,
    tdsAmount: 0,
    tdsApplicable: false,
    tdsThreshold: 0,
    originalAdvanceAmount: 0,
    advanceAmount: 0,
    advanceUtilizationPercent: 0,
    calculatedAdvanceAmount: 0,
    adjustmentType: 'no_adjust',
    adjustmentAmount: 0,
    adjustedAmount: 0,
    netPayable: 0,
    rcmType: 'Forwarder',
    rcmAmount: 0,
    finalTotal: 0,
    amountAfterTDS: 0
  };

  constructor(
    public _location: Location,
    private _GrnService: GrnServiceService,
    private _ActiveRoute: ActivatedRoute,
    private _fb: FormBuilder,
    public dialog: MatDialog,
    private _toasterService: ToastrService,
    private router: Router,
    private $common: CommonService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _inventory: InventoryManagementService,
    private storeService: StoreManagementService,
    private _finaceService: FinaceService,
  ) {
    this.POformGroup = _fb.group({
      po_number: new FormControl(),
      po_date: new FormControl(),
      po_type: new FormControl(),
      invoice_no: new FormControl('', [Validators.required]),
      invoice_date: new FormControl('', [Validators.required]),
      grn_number: new FormControl('', [Validators.required]),
      image: new FormControl(),
      vendor_name: new FormControl(),
      warehouse_id: new FormControl(''),
      container_type: new FormControl(''),
      store_id: new FormControl(''),
      shelf_id: new FormControl(),
      advance_payment: new FormControl(),
      vendor_category: new FormControl(),
      section_id: new FormControl(),
      grn_date: new FormControl('', [Validators.required]),
      row_id: new FormControl(),
      tds_id: new FormControl('', [Validators.required]),
      nature: new FormControl(),
      nature_id: new FormControl('', [Validators.required]),
      tds_rate: new FormControl(),
      tds_rate_amount: new FormControl(),
      total_gst_amount: new FormControl(),
      total_charges_amount: new FormControl(),
      original_advance_amount: new FormControl(),
      advance_amount: new FormControl(),
      advance_utilization_percent: new FormControl(),
      calculated_advance_amount: new FormControl(),
      advance_adjustment_type: new FormControl('no_adjust'),
      advance_adjustment_amount: new FormControl(0),
      adjusted_advance_amount: new FormControl(0),
      net_payable_amount: new FormControl(0),
      amount_after_tds: new FormControl(0),
      grnItem: new FormArray([]),
      shippingCharges: new FormArray([]),
      grnMappingComponent: this._fb.array([this.createAccountDetailGroup()]),
      chargesDetailList: new FormArray([]),
    });

    this.employee_id = localStorage.getItem('EmpMainId');
    this.loginUserDetails = localStorage.getItem('signInUser');
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;
  }

  get GrnDataItem() {
    return this.POformGroup.get('grnItem') as FormArray;
  }
  get shippingCharge(): FormArray {
    return this.POformGroup.get('shippingCharges') as FormArray;
  }
  get additionalCharges() {
    return this.POformGroup.get('chargesDetailList') as FormArray;
  }
  get grnMappingComponentData() {
    return this.POformGroup.get('grnMappingComponent') as FormArray;
  }

  grnDataAllItems: any = [];
  po_id: any;
  status: any;
  version_id: any;
  closedStatus: any;
  rejectView: any;
  isView: boolean = false;
  actionType: any;
  ship_id: any;
  type: string = '';
  formDisabled: boolean = false;
  invoiceNo: string = '';
  navigateStatus: any;
  chargesToggle: boolean = false;
  minimum_threshold_limit: any = 0;

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    let finacial_id = localStorage.getItem('financial_id');
    this.getAllWarehouseList(this.entity_id, finacial_id);
    this.getHsnCode();
    this.getAllVendor();
    this.getChartAccountList();
    this.getItemcostCategoryById();

    this.POformGroup.get('advance_adjustment_type')?.valueChanges.subscribe(() => {
      this.calculateSummary();
    });

    this.POformGroup.get('advance_adjustment_amount')?.valueChanges.subscribe(() => {
      this.calculateSummary();
    });

    this.shippingCharge.valueChanges.subscribe(() => {
      this.calculateSummary();
    });

    this.additionalCharges.valueChanges.subscribe(() => {
      this.calculateSummary();
    });

    this.grnMappingComponentData.valueChanges.subscribe(() => {
      this.calculateSummary();
    });

    this.POformGroup.get('tds_rate')?.valueChanges.subscribe(() => {
      this.calculateSummary();
    });

    this.finacial_id = Number(finacial_id);
    this._ActiveRoute.queryParams.subscribe((res: any) => {
      this.po_id = res.po_id;
      this.status = res.status;
      this.isView = !!res?.actionType;
      this.invoiceNo = res.invoiceNo;
      this.actionType = res.actionType;
      this.ship_id = res.shiping_id;
      this.type = res.type;
      this.navigateStatus = res.navigateFrom;
      this.version_id = res.version_id;
      this.closedStatus = res.rejectGRN;
      this.rejectView = res.RejectStatus;
      if (this.po_id) {
        this.getPoListById();
      }
      if (this.isView) {
        this.formDisabled = true;
      }
    });
  }

  showTdsMessage: boolean = false;
  getAllTdsSection: any = [];

  getAllTdsSections(vendor_id: any) {
    this._finaceService.getVendorDataByTds(vendor_id).subscribe((res: any) => {
      if (!res.data?.length) {
        this.getAllTdsSection = [];
        this.showTdsMessage = true;
      } else {
        this.showTdsMessage = false;
      }
      this.getAllTdsSection = res.data;
    });
  }

  getAllNatureOfTrsanction: any = [];

  getAllNatureTransaction(data: any) {
    this.POformGroup.get('nature')?.setValue(data.nature);
    this._finaceService.getTdsNatureOfTransaction(data.nature_id, this.vendor_id).subscribe((res: any) => {
      this.getAllNatureOfTrsanction = res.data;
      this.POformGroup.patchValue({
        tds_rate: data.current_rate
      });
      this.calculateSummary();
    });
  }

  tds_rate: any;
  total_amount: any;
  maximum_limit: any;

  getTdsRate(data: any) {
    let finaAmount: any = this.GrnDataItem.controls.reduce(
      (sum: number, control: any) => {
        const value = control.get('amount')?.value || 0;
        return sum + parseFloat(value);
      },
      0
    );
    this.tds_rate = +data.current_rate;
    this.total_amount = +finaAmount;
    this.minimum_threshold_limit = +data.threshold_limit;
    this.maximum_limit = +data.maximum_amount;
    let tdsRateAmount = 0;
    if (this.total_amount > this.minimum_threshold_limit) {
      tdsRateAmount = (this.total_amount * this.tds_rate) / 100;
    }
    this.POformGroup.patchValue({
      tds_rate: this.tds_rate,
      tds_rate_amount: +tdsRateAmount.toFixed(2)
    });
    this.calculateSummary();
  }

  accountsData: any = [];

  getItemcostCategoryById() {
    this._GrnService.getItemcostCategoryById().subscribe((res: any) => {
      this.accountsData = res.data;
    });
  }

  createShipCharges(data?: any): FormGroup {
    return this._fb.group({
      label: new FormControl(data?.label || ''),
      key: new FormControl(data?.key || ''),
      value: new FormControl(data?.value || 0),
      coa_id: new FormControl(data?.coa_id ?? null),
      vendor_id: new FormControl(data?.vendor_id ?? null),
      isReadonly: new FormControl(data?.isReadonly || 0)
    });
  }

  rowList: any = [];

  manageStore(event: any) {
    let manage_by = event.target.value;
    if (manage_by == 'store') {
      const storeControl = this.POformGroup.get('store_id');
      storeControl?.addValidators([Validators.required]);
      storeControl?.updateValueAndValidity();
      this.POformGroup.get('warehouse_id')?.setValue(null);
      this.POformGroup.get('row_id')?.setValue(null);
      this.POformGroup.get('shelf_id')?.setValue(null);
      this.POformGroup.get('section_id')?.setValue(null);
      const warehouseControl = this.POformGroup.get('warehouse_id');
      warehouseControl?.clearValidators();
      warehouseControl?.updateValueAndValidity();
      const rowControl = this.POformGroup.get('row_id');
      rowControl?.clearValidators();
      rowControl?.updateValueAndValidity();
      const shelfControl = this.POformGroup.get('shelf_id');
      shelfControl?.clearValidators();
      shelfControl?.updateValueAndValidity();
      const sectionControl = this.POformGroup.get('section_id');
      sectionControl?.clearValidators();
      sectionControl?.updateValueAndValidity();
    } else {
      this.POformGroup.get('store_id')?.setValue(null);
      const storeControl = this.POformGroup.get('store_id');
      storeControl?.clearValidators();
      storeControl?.updateValueAndValidity();
      const warehouseControl = this.POformGroup.get('warehouse_id');
      warehouseControl?.addValidators([Validators.required]);
      warehouseControl?.updateValueAndValidity();
      const rowControl = this.POformGroup.get('row_id');
      rowControl?.addValidators([Validators.required]);
      rowControl?.updateValueAndValidity();
      const shelfControl = this.POformGroup.get('shelf_id');
      shelfControl?.addValidators([Validators.required]);
      shelfControl?.updateValueAndValidity();
      const sectionControl = this.POformGroup.get('section_id');
      sectionControl?.addValidators([Validators.required]);
      sectionControl?.updateValueAndValidity();
    }
  }

  warehouseList: any = [];

  getAllWarehouseList(entity_id: any, id: any) {
    this._inventory.getAllWarehouseList(entity_id, id).subscribe((res: any) => {
      this.warehouseList = res.data;
    });
  }

  getWarehouseRowList(event: any): void {
    this.getAllRowList(event.value);
  }

  chartedAccount1: any[] = [];
  chartedAccount2: any[] = [];
  chartedAccount: any[] = [];

  getChartAccountList() {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {
      this.chartedAccount = res.data.filter((element: any) =>
        element.is_group === 'no' &&
        (
          element.account_name.toLowerCase().includes('charge') ||
          element.account_name.toLowerCase().includes('expenses')
        )
      );
      this.chartedAccount1 = this.chartedAccount.map((x: any) => x.account_name);
      this.chartedAccount2 = this.chartedAccount;
    });
  }

  accountFilter(e: any) {
    const aa = e;
    let filteredVariable = this.chartedAccount2.filter((item: any) => aa.includes(item.account_name));
    this.chartedAccount = filteredVariable;
  }

  AddRow() {
    const formArray = this.grnMappingComponentData as FormArray;
    for (let control of formArray.controls) {
      if (control.invalid) {
        control.markAllAsTouched();
        this._toasterService.warning('Please fill all required fields before adding a new item.');
        return;
      }
    }
    const newRow = this.createAccountDetailGroup();
    formArray.push(newRow);
    this.calculateSummary();
  }

  removeRow(i: any) {
    this.grnMappingComponentData.removeAt(i);
    this.calculateSummary();
  }

  createAccountDetailGroup(): any {
    return this._fb.group({
      mapping_account_id: [null, Validators.required],
      mapping_amount: [null, Validators.required],
    });
  }

  getAllRowList(warehouse_id: any) {
    this._inventory.getAllRowList(this.entity_id, this.finacial_id, warehouse_id).subscribe((res: any) => {
      this.rowList = res.data;
      const rowControl = this.POformGroup.get('row_id');
      if (this.rowList.length) {
        rowControl?.addValidators([Validators.required]);
      } else {
        rowControl?.clearValidators();
      }
      rowControl?.updateValueAndValidity();
    });
  }

  selfList: any = [];

  getAllSelfList(row_id: any) {
    this._inventory.getAllSelfList(row_id).subscribe(
      (res: any) => {
        this.selfList = res.data;
        const shelfControl = this.POformGroup.get('shelf_id');
        if (this.selfList.length) {
          shelfControl?.addValidators([Validators.required]);
        } else {
          shelfControl?.clearValidators();
        }
        shelfControl?.updateValueAndValidity();
      },
      (err: any) => { }
    );
  }

  mapping_amounts: any = 0;

  calculations() {
    const formArray = this.grnMappingComponentData as FormArray;
    this.mapping_amounts = formArray.controls
      .map((control: AbstractControl) => +control.get('mapping_amount')?.value || 0)
      .reduce((sum: number, current: number) => sum + current, 0);
    this.calculateSummary();
  }

  sectionList: any = [];

  getAllSectionList(row_id: any) {
    this._inventory.getAllSectionList(row_id).subscribe(
      (res: any) => {
        this.sectionList = res.data;
        const sectionControl = this.POformGroup.get('section_id');
        if (this.sectionList.length) {
          sectionControl?.addValidators([Validators.required]);
        } else {
          sectionControl?.clearValidators();
        }
        sectionControl?.updateValueAndValidity();
      },
      (err: any) => { }
    );
  }

  goBack() {
    this._location.back();
  }

  calculateInvoiceQty(index: number) {
    const grnItem = this.GrnDataItem.at(index) as FormGroup;
    const rcvdQty = grnItem.get('rcvd_qty')?.value;
    const rejectQty = grnItem.get('reject_qty')?.value || 0;
    const invoiceQty = rcvdQty + rejectQty;
    grnItem.patchValue({
      invoice_qty: invoiceQty,
    });
    this.calculateSummary();
  }

  getAllPartialData: any = [];
  statusNumber: any;
  promoDataAllItems: any[] = [];
  getAllItemPoList: any = [];
  vendor_id: any;

  getPoListById() {
    if (this.po_id) {
      while (this.GrnDataItem.length > 0) {
        this.GrnDataItem.removeAt(0);
      }
      if (this.status == 'po-list') {
        this.statusNumber = 0;
      } else if (this.status == 'partial-list') {
        this.statusNumber = 1;
      } else {
        this.statusNumber = 2;
      }
      this._GrnService.getPoGrnGetBy(
        this.po_id,
        this.statusNumber,
        this.version_id,
        this.invoiceNo,
        this.ship_id
      ).subscribe((response: any) => {
        this.rcm_type = response.data.rcm_charge;
        this.getAllPartialData = response.data?.ItemList;
        this.vendor_id = response.data.vendor_id;

        // Patch advance data from response
        const advanceAmount = parseFloat(response.data?.advance_amount) || 0;
        const utilizationPercent = parseFloat(response.data?.advance_utilization_percent) || 0;
        const adjustedAmount = parseFloat(response.data?.adjusted_amount) || 0;
        const adjustmentType = response.data?.adjustment_type || 'no_adjust';

        this.originalAdvanceAmount = advanceAmount;
        this.advance_utilization_percent = utilizationPercent;

        if (utilizationPercent > 0 && advanceAmount > 0) {
          this.calculatedAdvanceAmount = (advanceAmount * utilizationPercent) / 100;
          this.showAdvanceUtilization = true;
          this.advance_amount = this.calculatedAdvanceAmount;
        } else {
          this.advance_amount = advanceAmount;
          this.calculatedAdvanceAmount = 0;
          this.showAdvanceUtilization = false;
        }

        this.adjustmentAmount = adjustedAmount;
        this.adjustedAdvanceAmount = adjustedAmount;
        this.balancePayable = parseFloat(this.totalAmount) - adjustedAmount;
        this.netPayableAfterAdjustment = this.balancePayable;

        // Patch all advance fields
        this.POformGroup.patchValue({
          original_advance_amount: advanceAmount,
          advance_amount: this.advance_amount,
          advance_utilization_percent: utilizationPercent,
          calculated_advance_amount: this.calculatedAdvanceAmount,
          advance_adjustment_type: adjustmentType,
          advance_adjustment_amount: adjustedAmount,
          adjusted_advance_amount: adjustedAmount,
          net_payable_amount: this.balancePayable
        }, { emitEvent: false });

        this.getAllTdsSections(this.vendor_id);
        if (this.version_id) {
          this.getAllPartialData = response.data?.ItemList;
        }
        if (this.status == 'partial-list' || this.version_id) {
          this._finaceService.getTdsNatureOfTransaction(response.data?.nature_id, response.data?.vendor_id).subscribe((res: any) => {
            this.getAllNatureOfTrsanction = res.data;
          });
          this.POformGroup.patchValue({
            grn_number: response.data.grn_number,
            invoice_no: this.closedStatus == 'OPEN' ? '' : response.data.invoiceNo,
            grn_date: response.data.grn_date,
            warehouse_id: response.data.warehouse_id,
            row_id: response.data.row_id,
            shelf_id: response.data.shelf_id,
            section_id: response.data.section_id,
            invoice_date: response.data.invoiceDate,
            vendor_category: response.data.vendor_category,
            po_type: response.data.po_category_type,
            vendor_name: response.data.vendor_name,
            po_number: response.data.po_number,
            po_date: response.data.po_date,
            uses_id: response.data.uses_id,
            tds_id: response.data?.tds_id,
            tds_rate: response.data?.current_rate,
            tds_rate_amount: response.data?.tds_rate_amount,
            nature_id: response.data?.nature_id,
            nature: response.data?.nature_of_transaction
          });
          const isValid = this.getAllPartialData?.every((item: any) => {
            return item.receiveQty == '0' && item.rejectQty == '0';
          });
          if (isValid) {
            this.submitBtn = true;
          } else {
            this.submitBtn = false;
          }
          response.data?.ItemList?.forEach((itemSpec: any) => {
            const amount = +itemSpec.amount || 0;
            const gstRate = +itemSpec.gstRate || 0;
            const gstAmount = (amount * gstRate) / (100 + gstRate);
            const basicAmount = amount - gstAmount;
            const totalAmount = basicAmount + gstAmount;
            const newRow = this._fb.group({
              po_id: itemSpec.po_number ? itemSpec.po_number : null,
              item_id: itemSpec?.item_id,
              manage_by: itemSpec?.manage_by,
              status: this.status,
              item_cat: itemSpec?.asset_category_name,
              item_name: itemSpec?.item_name,
              item_code: itemSpec?.item_code,
              hsnCode: itemSpec?.hsnCode,
              gstRate: gstRate,
              po_qty: itemSpec?.quantity,
              remaining_qty: itemSpec?.remaining_qty,
              invoice_qty: itemSpec?.invoice_qty,
              rcvd_qty: itemSpec.receiveQty,
              reject_qty: itemSpec.rejectQty,
              isQuantityEqual: itemSpec?.isQuantityEqual,
              po_item_id: itemSpec?.po_item_id,
              amount: +basicAmount.toFixed(2),
              gst_amount: +gstAmount.toFixed(2),
              total_amount: +totalAmount.toFixed(2),
              grn_item_id: itemSpec?.grn_item_id,
              rejectQty: itemSpec?.rejectQty,
              final_reject: itemSpec.final_reject,
              receiveQty: itemSpec?.receiveQty,
              isDisabled: itemSpec?.quantity == itemSpec?.selection_item ? true : false,
            });
            this.GrnDataItem.push(newRow);
          });
          this.setShipCharges(response.data);
          if (Array.isArray(response.data.list) && response.data.list.length > 0) {
            const chargesList = response.data.list;
            chargesList.forEach((charge: any) => {
              const chargeGroup = new FormGroup({
                id: new FormControl(charge.id, Validators.required),
                additional_charges_name: new FormControl(
                  charge.additional_charges_name,
                  Validators.required
                ),
                amount: new FormControl(charge.amount, Validators.required),
                hsn_code_id: new FormControl(
                  charge.hsn_code_id,
                  Validators.required
                ),
                tax_rate: new FormControl(charge.tax_rate || null),
                description: new FormControl(charge.description || null),
                version_id: new FormControl(charge.version_id || null),
                grn_master_id: new FormControl(charge.grn_master_id || null),
              });
              this.additionalCharges.push(chargeGroup);
            });
            this.chargesToggle = true;
            this.calculateSummary();
          }
          this.calculateSummary();
        } else {
          this.po_category_type = response.data?.po_category_type;
          this.grnDataAllItems = response.data?.itemList;
          if (response) {
            this.POformGroup.patchValue({
              po_number: response?.data?.po_number,
              po_date: response.data.po_date,
              po_type: response?.data?.po_type,
              vendor_name: response?.data?.vendor_name,
              tds_id: response.data?.tds_id,
              nature: response.data?.nature
            });
          }
          this.grnDataAllItems?.forEach((itemSpec: any) => {
            const rcvdQty = itemSpec?.manage_by === 'S.No. Only'
              ? itemSpec?.receiveQty
              : itemSpec?.receiveQty || 0;
            const rejectQty = itemSpec?.manage_by === 'S.No. Only'
              ? itemSpec?.rejectedCount
              : itemSpec?.rejectQty || 0;
            const invoiceQty = rcvdQty + rejectQty;
            const newRow = this._fb.group({
              item_id: itemSpec?.item_id,
              manage_by: itemSpec.manage_by,
              item_cat: itemSpec?.asset_category_name,
              item_name: itemSpec?.item_name,
              item_code: itemSpec?.item_code,
              hsnCode: itemSpec?.hsnCode,
              gstRate: itemSpec?.gstRate,
              po_qty: itemSpec?.quantity,
              remaining_qty: itemSpec?.remaining_qty,
              invoice_qty: itemSpec?.invoice_qty,
              rcvd_qty: itemSpec?.receiveQty,
              select_qty: itemSpec?.selection_item,
              reject_qty: itemSpec?.rejectQty,
              amount: itemSpec?.total_mvp,
              total_amount: itemSpec.rejectQty == null ? '' : (itemSpec.total_mvp / itemSpec.quantity) * itemSpec.receiveQty,
              isQuantityEqual: itemSpec?.isQuantityEqual,
              po_item_id: itemSpec?.po_item_id,
              grn_item_id: itemSpec?.grn_item_id,
              rejectQty: itemSpec?.rejectQty,
              receiveQty: itemSpec?.receiveQty,
              final_reject: itemSpec.final_reject,
              isDisabled: itemSpec?.quantity == itemSpec?.selection_item ? true : false,
            });
            this.GrnDataItem.push(newRow);
          });
          if (Array.isArray(response.data.list) && response.data.list.length > 0) {
            const chargesList = response.data.list;
            const chargesFormArray = this.CF_2.get('chargesDetailList') as FormArray;
            chargesFormArray.clear();
            chargesList.forEach((charge: any) => {
              const chargeGroup = new FormGroup({
                id: new FormControl(charge.id, Validators.required),
                additional_charges_name: new FormControl(
                  charge.additional_charges_name,
                  Validators.required
                ),
                amount: new FormControl(charge.amount, Validators.required),
                hsn_code_id: new FormControl(
                  charge.hsn_code_id,
                  Validators.required
                ),
                tax_rate: new FormControl(charge.tax_rate || null),
                description: new FormControl(charge.description || null),
              });
              chargeGroup.disable();
              chargesFormArray.push(chargeGroup);
            });
            this.chargesToggle = true;
            this.calculateSummary();
          }
        }
        this.promoDataAllItems = response.data?.promotion_detail;
        this.calculateSummary();
      });
    }

    this._GrnService.getPOAdvanceUtilization(this.po_id).subscribe((res: any) => {
      console.log(res.data, 'dataaaaaaa');
    });
  }

  calculateSummary() {
    this.itemsTotal = this.GrnDataItem.controls.reduce((sum: number, control: any) => {
      const value = control.get('amount')?.value || 0;
      return sum + parseFloat(value);
    }, 0);

    this.itemsGstTotal = this.GrnDataItem.controls.reduce((sum: number, control: any) => {
      const value = control.get('gst_amount')?.value || 0;
      return sum + parseFloat(value);
    }, 0);

    this.shippingChargesTotal = 0;
    this.shippingCharge.controls.forEach((control: any) => {
      const amount = Number(control.get('value')?.value) || 0;
      this.shippingChargesTotal += amount;
    });

    this.shippingChargesGst = this.calculateChargesGst();

    this.mappingTotal = this.mapping_amounts || 0;

    this.totalGstAmount = this.itemsGstTotal + this.shippingChargesGst;

    this.grandTotal = this.itemsTotal + this.shippingChargesTotal + this.totalGstAmount + this.mappingTotal;
    this.totalAmount = this.grandTotal.toFixed(2);

    // Calculate TDS from Grand Total
    this.tdsRate = this.POformGroup.get('tds_rate')?.value || 0;
    const tdsRateAmount = this.POformGroup.get('tds_rate_amount')?.value || 0;
    this.tdsAmount = parseFloat(tdsRateAmount) || 0;

    // If TDS not set through dropdown, calculate from grand total
    if (this.tdsRate > 0 && this.tdsAmount === 0 && this.grandTotal > this.minimum_threshold_limit) {
      this.tdsAmount = (this.grandTotal * this.tdsRate) / 100;
      this.POformGroup.patchValue({
        tds_rate_amount: this.tdsAmount
      }, { emitEvent: false });
    }

    // Amount after TDS deduction
    const amountAfterTDS = this.grandTotal - this.tdsAmount;

    this.rcmAmount = this.rcm_type == 1 ? this.totalGstAmount : 0;

    // Get advance adjustment values from form
    const adjustmentType = this.POformGroup.get('advance_adjustment_type')?.value || 'no_adjust';
    let adjustmentAmount = 0;

    if (adjustmentType === 'full_adjust') {
      adjustmentAmount = Math.min(this.advance_amount, this.grandTotal);
    } else if (adjustmentType === 'partial_adjust') {
      adjustmentAmount = parseFloat(this.POformGroup.get('advance_adjustment_amount')?.value) || 0;
    }

    this.adjustmentAmount = adjustmentAmount;
    this.adjustedAdvanceAmount = adjustmentAmount;
    this.balancePayable = this.grandTotal - adjustmentAmount;
    this.netPayableAfterAdjustment = this.balancePayable;

    // Get final amount after adjustment
    let finalAmount = this.netPayableAfterAdjustment > 0 ? this.netPayableAfterAdjustment : this.grandTotal;

    // Apply TDS on final amount
    if (this.tdsAmount > 0) {
      finalAmount = finalAmount - this.tdsAmount;
    }

    this.summaryData = {
      itemsTotal: this.itemsTotal,
      itemsGst: this.itemsGstTotal,
      shippingCharges: this.shippingChargesTotal,
      shippingGst: this.shippingChargesGst,
      mappingTotal: this.mappingTotal,
      totalGst: this.totalGstAmount,
      grandTotal: this.grandTotal,
      tdsRate: this.tdsRate,
      tdsAmount: this.tdsAmount,
      tdsApplicable: this.grandTotal > this.minimum_threshold_limit,
      tdsThreshold: this.minimum_threshold_limit,
      originalAdvanceAmount: this.originalAdvanceAmount,
      advanceAmount: this.advance_amount,
      advanceUtilizationPercent: this.advance_utilization_percent,
      calculatedAdvanceAmount: this.calculatedAdvanceAmount,
      adjustmentType: adjustmentType,
      adjustmentAmount: this.adjustmentAmount,
      adjustedAmount: this.adjustedAdvanceAmount,
      netPayable: this.netPayableAfterAdjustment,
      rcmType: this.rcm_type == 1 ? 'RCM' : 'Forwarder',
      rcmAmount: this.rcmAmount,
      amountAfterTDS: amountAfterTDS,
      finalTotal: finalAmount > 0 ? finalAmount : 0
    };

    this.POformGroup.patchValue({
      total_charges_amount: this.shippingChargesTotal,
      total_gst_amount: this.totalGstAmount,
      amount_after_tds: amountAfterTDS,
      net_payable_amount: this.netPayableAfterAdjustment,
      adjusted_advance_amount: this.adjustedAdvanceAmount
    }, { emitEvent: false });
  }

  calculateChargesGst(): number {
    let totalGst = 0;
    const charges = this.shippingCharge.controls;
    charges.forEach((control: any) => {
      const amount = Number(control.get('value')?.value) || 0;
      const coaId = control.get('coa_id')?.value;
      if (coaId) {
        const account = this.chartedAccount.find((acc: any) => acc.id === coaId);
        if (account && account.gst_rate) {
          totalGst += (amount * Number(account.gst_rate)) / 100;
        }
      }
    });
    return totalGst;
  }

  setShipCharges(data: any) {
    const vendorCategory = data?.vendor_category;
    this.shippingCharge.clear();
    this.shippingChargesTotal = 0;
    const filteredCharges = this.chargeFields
      .filter((field: any) => {
        if (vendorCategory === 'International') {
          return true;
        }
        return field.vendor_category === 'both';
      })
      .map((field: any) => {
        let updatedLabel = field.label;
        if (vendorCategory === 'Domestic') {
          if (field.key === 'cha_service_charges') {
            updatedLabel = 'Insurance Charges (Optional)';
          }
          if (field.key === 'cha_other_charges') {
            updatedLabel = 'Other Logistics Charges';
          }
        }
        if (vendorCategory === 'International') {
          if (field.key === 'cha_service_charges') {
            updatedLabel = 'CHA Service Charges';
          }
          if (field.key === 'cha_other_charges') {
            updatedLabel = 'CHA Other Charges';
          }
        }
        return {
          ...field,
          label: updatedLabel
        };
      });
    filteredCharges.forEach((field: any, index: number) => {
      const chargeDetails = data?.chargesList?.[index] || {};
      const amount = Number(data[field.key] || 0);
      const defaultCoa = this.chartedAccount.find((account: any) => {
        const accountName = account.account_name.toLowerCase();
        switch (field.key) {
          case 'freight_charges':
            return accountName.includes('freight');
          case 'cha_service_charges':
            return accountName.includes('cha service');
          case 'cha_other_charges':
            return accountName.includes('cha other');
          case 'loading_unloading_charges':
            return accountName.includes('loading');
          case 'port_to_warehouse_charges':
            return accountName.includes('port');
          case 'insurance_charges':
            return accountName.includes('insurance');
          case 'duty_amount':
            return accountName.includes('custom') || accountName.includes('duty');
          default:
            return false;
        }
      });
      this.shippingCharge.push(
        this.createShipCharges({
          label: field.label,
          key: field.key,
          value: amount,
          coa_id: chargeDetails?.chart_account_id || defaultCoa?.id || null,
          vendor_id: chargeDetails?.vendor_id || null,
          isReadonly: field.isReadonly
        })
      );
      this.shippingChargesTotal += amount;
    });
    this.shippingCharge.controls.forEach((control: any, index: number) => {
      const chargeDetails = data?.chargesList?.[index];
      if (chargeDetails) {
        control.patchValue({
          coa_id: chargeDetails.chart_account_id,
          vendor_id: chargeDetails.vendor_id
        });
      }
    });
    this.calculateSummary();
  }

  getAllVendorData: any = [];

  getAllVendor() {
    this._finaceService.getGParty('VENDOR').subscribe((res: any) => {
      this.getAllVendorData = res.data;
    });
  }

  addShippingCharge() {
    this.shippingCharge.push(this.createShipCharges());
    this.calculateSummary();
  }

  removeShippingCharge(index: number) {
    this.shippingCharge.removeAt(index);
    this.calculateSummary();
  }

  onShippingChargeChange(key: string, index: number) {
    const selected = this.chargeFields.find(x => x.key === key);
    if (selected) {
      this.shippingCharge.at(index).patchValue({
        label: selected.label
      });
      this.calculateSummary();
    }
  }

  invoiceValues: any;

  keyUpValues(value: any, i: number, grnItem: any) {
    const control = this.POformGroup.get('grnItem') as FormArray;
    const item = control.at(i).value;

    let values = (item.total_amount / item.po_qty) * item.rcvd_qty;
    control.at(i).patchValue({ total_amount: values });

    this.calculateSummary();

    if (grnItem.manage_by !== 'S.No. Only') {
      const poQty = grnItem.value?.po_qty;
      if (value > poQty) {
        this._toasterService.error('Invoice QTY should less than the PO-QTY');
      } else {
        this.invoiceValues = value;
      }
    }
  }

  onGstRateChange(index: number) {
    const control = this.GrnDataItem.at(index) as FormGroup;
    const amount = control.get('amount')?.value || 0;
    const gstRate = control.get('gstRate')?.value || 0;
    const gstAmount = (amount * gstRate) / 100;

    control.patchValue({
      gst_amount: gstAmount
    });

    this.calculateSummary();
  }

  calculateAdvanceAdjustment() {
    const totalAmount = parseFloat(this.totalAmount) || 0;
    const advanceAmount = parseFloat(this.advance_amount) || 0;
    const adjustmentType = this.POformGroup.get('advance_adjustment_type')?.value;
    let adjustmentAmount = 0;

    if (adjustmentType === 'full_adjust') {
      adjustmentAmount = Math.min(advanceAmount, totalAmount);
    } else if (adjustmentType === 'partial_adjust') {
      adjustmentAmount = parseFloat(this.POformGroup.get('advance_adjustment_amount')?.value) || 0;
      if (adjustmentAmount > advanceAmount) {
        adjustmentAmount = advanceAmount;
        this.POformGroup.patchValue({ advance_adjustment_amount: advanceAmount });
        this._toasterService.warning('Adjustment amount cannot exceed advance amount');
      }
      if (adjustmentAmount > totalAmount) {
        adjustmentAmount = totalAmount;
        this.POformGroup.patchValue({ advance_adjustment_amount: totalAmount });
        this._toasterService.warning('Adjustment amount cannot exceed invoice total');
      }
    } else {
      adjustmentAmount = 0;
    }

    this.adjustmentAmount = adjustmentAmount;
    this.adjustedAdvanceAmount = adjustmentAmount;
    this.balancePayable = totalAmount - adjustmentAmount;
    this.netPayableAfterAdjustment = this.balancePayable;

    this.POformGroup.patchValue({
      adjusted_advance_amount: adjustmentAmount,
      net_payable_amount: this.balancePayable
    }, { emitEvent: false });
  }

  onAdjustmentTypeChange() {
    if (this.POformGroup.get('advance_adjustment_type')?.value === 'partial_adjust') {
      this.POformGroup.patchValue({ advance_adjustment_amount: 0 });
    }
    this.calculateSummary();
  }

  onSubmit() {
    if (!this.POformGroup.get('tds_id')?.value || !this.POformGroup.get('nature_id')?.value) {
      this.POformGroup.markAllAsTouched();
      return this._toasterService.error('Please fill the required field');
    }

    const adjustmentType = this.POformGroup.get('advance_adjustment_type')?.value;
    let adjustmentAmount = 0;

    if (adjustmentType === 'full_adjust') {
      adjustmentAmount = parseFloat(this.advance_amount) || 0;
    } else if (adjustmentType === 'partial_adjust') {
      adjustmentAmount = parseFloat(this.POformGroup.get('advance_adjustment_amount')?.value) || 0;
    }

    const totalAmount = parseFloat(this.totalAmount) || 0;
    const tdsAmount = this.tdsAmount || 0;
    const adjustedTotal = totalAmount - adjustmentAmount - tdsAmount;
    const netPayable = adjustedTotal > 0 ? adjustedTotal : 0;

    let obj: any = {
      type: 'Direct',
      po_number: this.POformGroup.value.po_number,
      invoice_number: this.POformGroup.value.invoice_no,
      purchase_oredr_id: this.po_id,
      entity_id: this.entity_id,
      financial_year_id: this.finacial_id,
      invoice_status: 'COMPLETE',
      invoice_version: this.version_id,
      chargesDetailList: this.additionalCharges.getRawValue(),
      shippingCharge: this.POformGroup.value?.shippingCharges,
      grand_total: netPayable || this.totalAmount,
      total_without_advance: totalAmount,
      vendor_id: this.vendor_id,
      original_advance_amount: this.originalAdvanceAmount,
      advance_amount: this.advance_amount,
      advance_utilization_percent: this.advance_utilization_percent,
      calculated_advance_amount: this.calculatedAdvanceAmount,
      advance_adjustment_amount: adjustmentAmount,
      advance_adjustment_type: adjustmentType,
      adjusted_total: netPayable,
      total_invoice_amount: totalAmount,
      items_total: this.itemsTotal,
      items_gst_total: this.itemsGstTotal,
      charges_total: this.shippingChargesTotal,
      charges_gst_total: this.shippingChargesGst,
      mapping_total: this.mappingTotal || 0,
      tds_rate: this.tdsRate,
      tds_amount: this.tdsAmount,
      amount_after_tds: totalAmount - tdsAmount,
      rcm_amount: this.rcmAmount,
      shiping_id: this.ship_id,
      ...this.POformGroup.value
    };
    delete obj.shippingCharges;
    if (adjustmentType === 'no_adjust') {
      obj.advance_adjustment_amount = 0;
    }

    this._GrnService.createPoInvoice(obj).subscribe((res: any) => {
      let data = res.message;
      if (data) {
        this._toasterService.success(res.message);
        this.router.navigate(['/master/purchase-management/invoice']);
      }
    });
  }

  generateImageUrl() {
    return environment.servralUrl + '/';
  }

  uploadImage: any;
  uploadImageData: any;
  imagePathData: any;

  onChange(e: any) {
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0);
    }
    let isValidExtension = this.$common.checkForValidFile(e, false, false);
    if (!isValidExtension) {
      return this.POformGroup.patchValue({
        image: null,
      });
    }
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;
      this.imagePathData = this.imageToUpload?.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
      };
      reader.readAsDataURL(this.imageToUpload);
      let formData = new FormData();
      formData.append('file', this.imageToUpload);
      this._configurationalMasterService.uploadImg(formData).subscribe((res: any) => {
        this.uploadImageData = res.backendUrl;
      });
    }
  }

  seePreview(imagePath: any) {
    if (this.imagePath) {
      if (imagePath) {
        Swal.fire({
          imageUrl: imagePath,
          imageHeight: 250,
          imageAlt: 'Profile Image',
          confirmButtonColor: '#063178',
          confirmButtonText: 'Ok',
        });
      }
    }
  }

  close() {
    this.router.navigate(['/master/purchase-management/invoice']);
  }

  createGrnNo() {
    this._GrnService.CreateGrnNo().subscribe((res: any) => {
      this.POformGroup.patchValue({
        grn_number: res.data,
      });
    });
  }

  viewImage() {
    window.open(this.item_document_images, '_blank');
  }

  item_document_images: any;

  generateFileUrl(uploadDoc: any) {
    this.item_document_images = environment.servralUrl + '/uploadDoc/' + uploadDoc;
  }

  toggleChargesRow(event: any) {
    if (this.chargesToggle) {
      if (this.CF_2.chargesDetailList.length === 0) {
        this.addChargesRow();
      }
    } else {
      const chargesFormArray = <FormArray>this.CF_2.chargesDetailList;
      while (chargesFormArray.length !== 0) {
        chargesFormArray.removeAt(0);
      }
      this.calculateSummary();
    }
  }

  get CF_2(): any {
    return this.POformGroup.controls;
  }

  addChargesRow() {
    if (!this.chargesToggle) return;
    (<FormArray>this.CF_2.chargesDetailList).push(
      new FormGroup({
        additional_charges_name: new FormControl(null, Validators.required),
        amount: new FormControl(null, Validators.required),
        hsn_code_id: new FormControl(null, Validators.required),
        tax_rate: new FormControl(null),
        description: new FormControl(null),
        version_id: new FormControl(this.version_id),
        grn_master_id: new FormControl(null),
      })
    );
    this.calculateSummary();
  }

  deleteChargesRow(i: any, control: any) {
    if (this.CF_2.chargesDetailList.length >= 1) {
      this.CF_2.chargesDetailList.removeAt(i);
      this.calculateSummary();
    }
  }

  hsnCodeList: any = [];
  hsnCodeList2: any;
  hsn: any;

  getHsnCode() {
    this._configurationalMasterService.getHsnCode(this.entity_id).subscribe((res: any) => {
      this.hsnCodeList = res.data;
      this.hsnCodeList2 = this.hsnCodeList;
      this.hsn = this.hsnCodeList2.map((res: any) => res.hsn_sac_code);
    });
  }

  hsnSearch(e: any) {
    const aa = e;
    let filteredVariable = this.hsnCodeList2.filter((item: any) => aa.includes(item.hsn_sac_code));
    this.hsnCodeList = filteredVariable;
  }

  onHSNCodeChange(value: any, index: number): void {
    let chargesDetailList = this.POformGroup.get('chargesDetailList') as FormArray;
    const selectedHSN = this.hsnCodeList.find((hsn: { id: any }) => hsn.id == value);
    chargesDetailList.at(index).patchValue({
      tax_rate: selectedHSN.value,
      description: selectedHSN.description,
    });
    this.calculateSummary();
  }

  keyPress2(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);
    const currentValue = (event.target as HTMLInputElement).value;
    const isNumber = /[0-9]/.test(inputChar);
    const isDot = inputChar === '.';
    if (event.keyCode !== 8 && !isNumber) {
      if (isDot) {
        if (currentValue.includes('.')) {
          event.preventDefault();
        }
      } else {
        event.preventDefault();
      }
    }
    if (event.key === ' ' || event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  }

  productCalculation() {
    this.calculateSummary();
  }

  getTdsDetails() {
    return {
      applicable: this.grandTotal > this.minimum_threshold_limit,
      thresholdLimit: this.minimum_threshold_limit,
      rate: this.tdsRate,
      amount: this.tdsAmount,
      taxableAmount: this.grandTotal
    };
  }
}