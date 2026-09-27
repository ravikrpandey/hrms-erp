import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseMasterService } from 'src/app/@modules/itticketing/configurationalmaster/purchase-masters/services/purchase-master.service';
import { AddProductDialogComponent } from 'src/app/@modules/purchase-management/dialog/add-product-dialog/add-product-dialog.component';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';
import { ItemInterface } from 'src/app/@shared/interface/item.interface';
import { PurchaseItemFormInterface } from 'src/app/@shared/interface/purchase.interface';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss'],
})
export class PurchaseFormComponent implements OnInit, OnChanges {
  @Input() title = 'Purchase Management';
  @Input() subTitle = '';
  @Input() subheading = '';
  @Input() buttonText = '';
  @Input() buttonLink = '';
  @Input() isBack: boolean = true;
  @Output() buttonClick = new EventEmitter<void>();
  @Input() showActions: boolean = false;
  @Input() actions: {
    label: string;
    icon?: string;
    callback: () => void;
    color?: string;
  }[] = [];
  @Input() formType: 'PR' | 'PO' = 'PR';
  @Output() submitForm = new EventEmitter<FormGroup>();
  @Output() updateForm = new EventEmitter<FormGroup>();
  @Output() approvalForm = new EventEmitter<FormGroup>();

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  form: FormGroup;
  mode: 'Add' | 'Edit' | 'View' | 'Approval' = 'Add';
  id: string = '';
  totalPurchaseAmount: number = 0;
  currencyCode: string = 'INR';
  financialYear: any[] = [];
  branchData: any[] = [];
  departmentList: any[] = [];
  employeeData: any = {};
  costCenterData: any[] = [];
  profitCenterList: any[] = [];
  currencyData: any[] = [];
  budgetData: any = {
    amount: 0,
    remainingAmount: 0,
    financial_year: '',
  };
  warehouseList: any[] = [];
  vendorList: any[] = [];
  filteredCurrencyData: any[] = [];
  paymentTerms: any[] = [];
  portList: any[] = [];
  incotermList: any[] = [];
  prData: any;
  vendor_id: any = null;

  prRequiredKeys = [
    'prCategory',
    'financial_year_id',
    'department_id',
    'type',
    'employee_id',
    'warehouse_id',
    'date',
    'cost_center_id',
  ];
  poRequiredKeys = [
    'prCategory',
    'billing_branch_id',
    'financial_year_id',
    'department_id',
    'type',
    'employee_id',
    'vendor_id',
    'warehouse_id',
    'date',
    'cost_center_id',
    'delivery_term',
    'payment_term_id',
    'profit_center_id',
  ];

  prItemRequiredKeys = [
    'item_master_id',
    'item_name',
    'item_code',
    'quantity',
    'priority',
    'vendor_ids',
    'asset_category_id',
  ];
  poItemRequiredKeys = [
    'item_master_id',
    'item_name',
    'item_code',
    'quantity',
    'unit_price',
    'total_mvp',
    'grand_total',
  ];

  constructor(
    private toast: ToastrService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private prService: PurchaseRequestService,
    private vendorService: VendorManagementService,
    private finance: FinaceService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private inventoryService: InventoryManagementService,
    private accessCtrl: AccessControlService,
    private purchaseMasterService: PurchaseMasterService,
  ) {
    this.form = this.fb.group({
      id: [null],
      prCategory: ['Item'],
      billing_branch_id: [null],
      entity_id: [this.accessCtrl.getEntityId()],
      financial_year_id: new FormControl(this.accessCtrl.getFinancialId()),
      department_id: new FormControl(this.accessCtrl.getUser()?.department_id),
      type: new FormControl(null, Validators.required),
      employee_id: new FormControl(this.accessCtrl.getEmployeeId()),
      employee_code: new FormControl(null),
      vendor_id: [null],
      vendor_category: [null],
      advance_amount: [0],
      warehouse_id: [null],
      delivery_address: new FormControl(null),
      state: new FormControl(null),
      purchase_number: new FormControl(null),
      po_number: new FormControl(null),
      date: new FormControl(new Date(), Validators.required),
      remark: new FormControl(null),
      cost_center_id: new FormControl(null, Validators.required),
      profit_center_id: [null],
      totalPurchaseAmount: [0],
      remainingAmount: [0],
      item_detail: this.fb.array([]),
      delivery_term: [null],
      delivery_term_remark: [null],
      payment_term_id: [null],
      port_id: [null],
      incoterm_id: [null],
      advance_utilization_percent: [null],
      payment_term_remark: [null],
      purchase_request_id: [null],
      quotation_id: [null],
      currency_id: [null],
      currency_rate: [null],
      file: new FormControl(null),
    });
    // this.fileArray.push({ imagePath: null, url: null });

    this.form.get('type')?.valueChanges.subscribe((value: any) => {
      if (value && !this.id && this.formType === 'PR') {
        this.generatePrCode(value);
      }
      if (value && this.mode === 'Add' && this.formType === 'PO') {
        this.generatePOCode(value);
      }
    });
    this.form.get('cost_center_id')?.valueChanges.subscribe((value: any) => {
      if (value) {
        const selectedCostData = this.costCenterData.find(
          (item: any) => item.id === value,
        );
        this.budgetData.financial_year = this.financialYear.find(
          (item: any) => item.id === selectedCostData.financial_year_id,
        )?.financial_year;
        this.budgetData.amount = selectedCostData.amount;
        this.budgetData.remainingAmount = selectedCostData.remainingAmount;

        this.getTotalPurchaseBudget = selectedCostData.totalPurchaseAmount;
      }
    });
    this.form.get('warehouse_id')?.valueChanges.subscribe((value: any) => {
      if (value) {
        const warehouseData = this.warehouseList.find(
          (item: any) => item.id === value,
        );
        this.form.get('delivery_address')?.setValue(warehouseData?.address);
        this.form.get('state')?.setValue(warehouseData?.postal_address?.State);
      }
    });
    this.form.get('vendor_id')?.valueChanges.subscribe((value: any) => {
      if (value) {
        const vendorData = this.vendorList.find(
          (item: any) => item.id === value,
        );
        if (vendorData) {
          console.log(vendorData, 'vendorData');
          this.form
            .get('vendor_category')
            ?.setValue(vendorData?.vendor_category);
          this.form.get('advance_amount')?.setValue(vendorData?.advance_amount);
          this.currencyCode = vendorData?.vendor_currency || 'INR';
          this.form
            .get('payment_term_id')
            ?.setValue(vendorData?.payment_term_id);
          this.filterTradeCurrencies(vendorData);
          this.itemDetail.controls.forEach((control: AbstractControl) => {
            this.calculateQuantityChange(control);
          });
        }
      }
    });
    this.form.get('currency_id')?.valueChanges.subscribe((value: any) => {
      if (value) {
        const currencyData = this.currencyData.find(
          (item: any) => item.Currency_Convert_id === value,
        );
        if (currencyData) {
          this.currencyCode = currencyData?.Currency_Type;
          this.form.get('currency_rate')?.setValue(currencyData.rate);
        }
      }
    });
    this.getFinancialYear();
    this.getBranchData();
    this.getDepartment();
    this.getVendorName();
    this.getWarehouseList();
    this.getPaymentTermMasterList();
    this.getAllIncoterms();
    this.getAllPorts();
    this.getCurrency();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params.type) {
        this.mode = params.type;
      } else {
        this.mode = 'Add';
      }
      this.id = params.id;
      const quotation_id = params.quotation_id;
      this.vendor_id = params.vendor_id ? parseInt(params.vendor_id) : null;
      this.form.patchValue({ id: this.id });
      if (!this.id) {
        this.getEmployeeData(this.accessCtrl.getEmployeeId());
      } else {
        if (this.formType === 'PR') {
          this.getPRDataById(this.id);
        } else if (
          this.formType === 'PO' &&
          this.mode === 'Add' &&
          quotation_id
        ) {
          this.getVendorQuotationById(this.id, quotation_id, this.vendor_id);
          this.form.patchValue({ purchase_request_id: this.id, quotation_id: quotation_id });
        } else if (this.formType === 'PO' && this.mode === 'Add') {
          this.form.patchValue({ purchase_request_id: this.id });
          setTimeout(() => {
            this.getPRDataById(this.id);
          }, 0);
        } else if (this.formType === 'PO') {
          setTimeout(() => {
          this.getPODataById(this.id);
          }, 0);
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formType']) {
      this.formType = changes['formType'].currentValue;
      if (this.formType === 'PR') {
        this.prRequiredKeys.forEach((key: string) => {
          this.form.get(key)?.setValidators(Validators.required);
          this.form.get(key)?.updateValueAndValidity();
        });
      } else if (this.formType === 'PO') {
        // add required fields for PO
        this.poRequiredKeys.forEach((key: string) => {
          this.form.get(key)?.setValidators(Validators.required);
          this.form.get(key)?.updateValueAndValidity();
        });
      }
    }
  }

  get itemDetail(): FormArray {
    return this.form.get('item_detail') as FormArray;
  }

  get totalUnitPriceQty(): number {
    let sum = 0;
    for (const control of this.itemDetail.controls) {
      const qty = parseFloat(control.get('quantity')?.value ?? 0);
      const unitPrice = parseFloat(control.get('unit_price')?.value ?? 0);
      if (!isNaN(qty) && !isNaN(unitPrice)) {
        sum += qty * unitPrice;
      }
    }
    return sum;
  }

  get totalDiscount(): number {
    let sum = 0;
    for (const control of this.itemDetail.controls) {
      const qty = parseFloat(control.get('quantity')?.value ?? 0);
      const unitPrice = parseFloat(control.get('unit_price')?.value ?? 0);
      const discountPercent = parseFloat(control.get('discount')?.value ?? 0);
      if (!isNaN(qty) && !isNaN(unitPrice) && !isNaN(discountPercent)) {
        sum += (qty * unitPrice * discountPercent) / 100;
      }
    }
    return sum;
  }

  get totalTaxGst(): number {
    if (this.form.get('vendor_category')?.value !== 'Domestic') {
      return 0;
    }
    let sum = 0;
    for (const control of this.itemDetail.controls) {
      const qty = parseFloat(control.get('quantity')?.value ?? 0);
      const unitPrice = parseFloat(control.get('unit_price')?.value ?? 0);
      const discountPercent = parseFloat(control.get('discount')?.value ?? 0);
      const igstPercent = parseFloat(control.get('tax')?.value ?? 0);

      if (
        !isNaN(qty) &&
        !isNaN(unitPrice) &&
        !isNaN(discountPercent) &&
        !isNaN(igstPercent)
      ) {
        const amount = qty * unitPrice;
        const discountAmount = (amount * discountPercent) / 100;
        const netAmount = amount - discountAmount;
        sum += (netAmount * igstPercent) / 100;
      }
    }
    return sum;
  }

  get grandTotal(): number {
    return this.totalUnitPriceQty - this.totalDiscount + this.totalTaxGst;
  }

  get advanceUtilizedAmount(): number {
    const advanceAmount = parseFloat(
      this.form.get('advance_amount')?.value ?? 0,
    );
    const utilizationPercent = parseFloat(
      this.form.get('advance_utilization_percent')?.value ?? 0,
    );
    if (!isNaN(advanceAmount) && !isNaN(utilizationPercent)) {
      return (advanceAmount * utilizationPercent) / 100;
    }
    return 0;
  }

  get balanceAmount(): number {
    return this.grandTotal - this.advanceUtilizedAmount;
  }

  addItem(item: PurchaseItemFormInterface) {
    const fb = this.createItem(item);
    if (this.formType === 'PR') {
      this.prItemRequiredKeys.forEach((key: string) => {
        fb.get(key)?.setValidators(Validators.required);
        fb.get(key)?.updateValueAndValidity();
      });
    } else if (this.formType === 'PO') {
      // add required fields for PO
      this.poItemRequiredKeys.forEach((key: string) => {
        fb.get(key)?.setValidators(Validators.required);
        fb.get(key)?.updateValueAndValidity();
      });
    }
    this.itemDetail.push(fb);
    if (this.formType === 'PO') {
      this.calculateQuantityChange(fb);
    }
  }

  createItem(item: PurchaseItemFormInterface): FormGroup {
    return this.fb.group({
      item_id: [item.id || null],
      item_master_id: [item.item_master_id],
      item_name: [item.item_name || null],
      item_code: [item.item_code || null],
      quantity: [item.quantity || null],
      unit_price: [item.unit_price || null],
      hsn_sac_code: [item.hsn_sac_code || null],
      mvp: [item.mvp || 0],
      total_mvp: [item.total_mvp || 0],
      grand_total: [item.grand_total || 0],
      priority: [item.priority || 'HIGH'],
      vendor_ids: [item.vendor_ids || null],
      item_image: [item.item_image],
      asset_category_id: [item.asset_category_id],
      discount: [item.discount || 0],
      tax: [item.tax || 0],
    });
  }

  calculateQuantityChange(control: AbstractControl) {
    const mvp =
      this.formType === 'PO'
        ? control.get('unit_price')?.value
        : control.get('mvp')?.value;
    const quantity = control.get('quantity')?.value;
    let tax = control.get('tax')?.value; // In Percentage

    if (typeof tax === 'undefined') {
      tax = 0;
    }
    const vendorCategory = this.form.get('vendor_category')?.value;
    const effectiveTax = vendorCategory === 'Domestic' ? tax : 0;
    control.patchValue({
      total_mvp: mvp * quantity,
      grand_total:
        mvp * quantity + (mvp * effectiveTax ? effectiveTax : 0) / 100,
    });
    if (this.formType === 'PO') {
      this.calculation(control);
    }
    this.totalPurchaseAmount = this.grandTotal;
  }

  calculation(control: AbstractControl) {
    const qty = parseFloat(control.get('quantity')?.value ?? 0);
    const unitPrice = parseFloat(control.get('unit_price')?.value ?? 0);
    const vendorCategory = this.form.get('vendor_category')?.value;
    const igstPercent =
      vendorCategory === 'Domestic'
        ? parseFloat(control.get('tax')?.value ?? 0)
        : 0;
    const discountPercent = parseFloat(control.get('discount')?.value ?? 0);

    const amount = qty * unitPrice;
    // Discount amount
    const discountAmount = (amount * discountPercent) / 100;
    const netAmount = amount - discountAmount;
    const gstAmount = (netAmount * igstPercent) / 100;
    // Grand Total
    const grandTotal = netAmount + gstAmount;
    // Round to 2 decimals
    control.patchValue({
      total_mvp: amount,
      grand_total: grandTotal,
    });
  }

  getFinancialYear() {
    this.finance.getFinancialYear().subscribe((res: any) => {
      if (res && res.data) {
        this.financialYear = res?.data;
      }
    });
  }

  getBranchData() {
    this._configurationalMasterService
      .getListBranchSetup()
      .subscribe((res: any) => {
        if (res && res.data) {
          this.branchData = res?.data;
        }
      });
  }

  getDepartment() {
    this._configurationalMasterService
      .getDepartmentAll(this.accessCtrl.getEntityId())
      .subscribe((res: any) => {
        if (res && res.data) {
          this.departmentList = res?.data;
        }
      });
  }

  getEmployeeData(id: number) {
    this.prService.getEmployeData(id).subscribe((res: any) => {
      if (res && res.data.length > 0) {
        this.employeeData = res.data[0];
        this.form.patchValue({
          department_id: !this.id ? this.employeeData.department_id : this.form.value.department_id,
          employee_id: this.employeeData.employee_id,
          employee_code: this.employeeData.employee_code,
          billing_branch_id:
            this.mode === 'Add'
              ? this.employeeData.location_id
              : this.prData?.billing_branch_id,
          financial_year_id: this.accessCtrl.getFinancialId(),
          entity_id: this.accessCtrl.getEntityId(),
        });
      }
    });
  }

  generatePrCode(type: string) {
    const data = {
      pr_type: type,
    };
    this.prService.getPrCodeGenrate(data).subscribe((res: any) => {
      if (res && res.data) {
        this.form.patchValue({
          purchase_number: res?.data,
        });
      }
    });

    this.getDepartmentCost(this.form.get('department_id')?.value, type);
  }

  generatePOCode(type: string) {
    const data = {
      po_type: type,
    };
    this.prService.getPoCode(data).subscribe((res: any) => {
      if (res && res.data) {
        this.form.patchValue({
          po_number: res?.data,
        });
      }
    });
    this.getDepartmentCost(this.form.get('department_id')?.value, type);
  }

  getDepartmentCost(id: any, type: any) {
    const data = {
      entity_id: this.accessCtrl.getEntityId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };
    this.prService.getDepartmentCostCenter(id, data).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.costCenterData = res.data.filter((value: any) => {
            if (value.status === 'ACTIVE' && value.cost_center_type == type)
              return true;
            else return false;
          });
          this.form
            .get('cost_center_id')
            ?.setValue(this.prData?.cost_center_id, { emitEvent: false });
        }
      },
      (err: any) => {},
    );

    this.finance
      .getAllProfitCenter(this.accessCtrl.getEntityId())
      .subscribe((res: any) => {
        if (res && res.data) {
          this.profitCenterList = res?.data;
          this.form
            .get('cost_center_id')
            ?.setValue(this.prData?.cost_center_id, { emitEvent: false });
        }
      });
  }

  getVendorName() {
    this.vendorService
      .getAllVendorList(this.accessCtrl.getEntityId())
      .subscribe((res: any) => {
        if (res && res.data) {
          const data = [];
          for (let a = 0; a <= res.data.length - 1; a++) {
            data.push({
              asset_category_name:
                res?.data[a]?.MASTER_ASSET?.asset_category_name,
              vendor_name:
                res?.data[a]?.vendor_name +
                ' [' +
                res?.data[a]?.vendor_code +
                ']',
              id: res?.data[a]?.id,
              vendor_category: res?.data[a]?.vendor_category,
              vendor_currency: res?.data[a]?.vendor_currency,
              advance_amount: res?.data[a]?.advance_amount,
              payment_term_id: res?.data[a]?.payment_term_id,
              trade_currency_ids: res?.data[a]?.trade_currency_ids,
            });
          }

          this.vendorList = data;
          this.form
            .get('vendor_id')
            ?.setValue(this.vendor_id, { emitEvent: false });

          const currentVendorId = this.form.get('vendor_id')?.value;
          if (currentVendorId) {
            const vendorData = this.vendorList.find(
              (item: any) => item.id === currentVendorId,
            );
            if (vendorData) {
              this.form
                .get('vendor_category')
                ?.setValue(vendorData?.vendor_category);
              this.form
                .get('advance_amount')
                ?.setValue(vendorData?.advance_amount);
              this.form
                .get('payment_term_id')
                ?.setValue(vendorData?.payment_term_id);
              this.currencyCode = vendorData?.vendor_currency || 'INR';
              this.filterTradeCurrencies(vendorData);
              this.itemDetail.controls.forEach((control: AbstractControl) => {
                this.calculateQuantityChange(control);
              });
            }
          }
        }
      });
  }

  addProduct(indentype: string = 'Item') {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { indentype },
    });
    dialogRef.afterClosed().subscribe((result: ItemInterface[]) => {
      console.log(result);
      if (result && result.length > 0) {
        result?.map((item: ItemInterface) => {
          let duplicateItems = '';
          for (let i = 0; i < this.itemDetail.value.length; i++) {
            if (this.itemDetail.value[i].item_id == item.id) {
              duplicateItems += ', ' + item.item_name;
            }
          }
          if (duplicateItems.length > 0) {
            duplicateItems = duplicateItems.slice(2);
            this.toast.error(`${duplicateItems}  already added`);
            return;
          }
          let payload: PurchaseItemFormInterface;
          payload = {
            item_name: item?.item_name,
            item_code: item?.item_code,
            quantity: item?.quantity,
            mvp:
              typeof item?.MVP === 'string' ? parseFloat(item.MVP) : item.MVP,
            unit_price:
              typeof item?.MVP === 'string' ? parseFloat(item.MVP) : item.MVP,
            total_mvp: Number(
              item.quantity == null
                ? 0
                : item.quantity * parseFloat(item.MVP ? item.MVP : '0'),
            ),
            grand_total: item.MVP
              ? Number(item.MVP) * Number(item.quantity)
              : 0,
            item_image: item?.MASTER_ITEM_IMAGE_DOCUMENTs[0]?.image || '',
            asset_category_id: item.asset_id,
            item_master_id: item.id,
            tax: item?.MASTER_HSN_SAC_CODE?.GST_RATE_MASTER?.value,
            hsn_sac_code: item?.MASTER_HSN_SAC_CODE?.hsn_sac_code,
          };
          this.addItem(payload);
        });
        this.totalPurchaseAmount = this.grandTotal;
      }
    });
  }

  generateImageUrl(uploadDoc: any): string {
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/${uploadDoc}`;
  }

  onImageError(event: any) {
    event.target.src = 'assets/No-Image.png';
  }

  seePreviewTable(path: string) {
    if (path) {
      Swal.fire({
        imageUrl: path,
        imageHeight: 250,
        imageAlt: 'Document',
        confirmButtonColor: '#858586',
        confirmButtonText: 'Ok',
      });
    }
  }

  deleteRow(index: number) {
    this.itemDetail.removeAt(index);
  }

  getWarehouseList() {
    this.inventoryService.getAllWarehouseListNew().subscribe((res: any) => {
      if (res && res.data) {
        this.warehouseList = res.data.map((item: any) => ({
          ...item,
          name: item.name + ' [' + item.code + ']',
        }));
      }
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    const payload = this.form.getRawValue();
    console.log(payload);
    if (this.form.invalid) {
      this.toast.error('Please fill all the required fields');
      return;
    }
    this.totalPurchaseAmount = this.grandTotal;
    this.form.patchValue({
      remainingAmount: this.budgetData.remainingAmount,
      totalPurchaseAmount: this.totalPurchaseAmount,
    });
    this.submitForm.emit(this.form);
  }

  onUpdate() {
    const payload = this.form.getRawValue();
    console.log(payload);
    if (this.form.invalid) {
      this.toast.error('Please fill all the required fields');
      return;
    }
    this.totalPurchaseAmount = this.grandTotal;
    this.form.patchValue({
      remainingAmount: this.budgetData.remainingAmount,
      totalPurchaseAmount: this.totalPurchaseAmount,
    });
    this.updateForm.emit(this.form);
  }

  onApproval() {
    const payload = this.form.getRawValue();
    console.log(payload);
    if (this.form.invalid) {
      this.toast.error('Please fill all the required fields');
      return;
    }
    this.totalPurchaseAmount = this.grandTotal;
    this.form.patchValue({
      remainingAmount: this.budgetData.remainingAmount,
      totalPurchaseAmount: this.totalPurchaseAmount,
    });
    this.approvalForm.emit(this.form);
  }
  /*
   ** For Purchase Request
   */
  getPRDataById(id: any) {
    this.prService.getByPRRequest(id).subscribe((res: any) => {
      this.prData = res.data;
      this.getEmployeeData(this.prData?.employee_id);
      this.getDepartmentCost(this.prData?.department_id, this.prData?.pr_type);

      const budgetPayload = {
        cost_center_id: this.prData?.cost_center_id,
        dept_id: this.prData?.department_id,
        type: this.prData?.pr_type,
        financial_year: this.prData?.financial_year_id,
        entity_id: this.prData.entity_id,
      };
      this.totalPurchaseAmount = 0;
      this.budgtGet(budgetPayload);
      const newFileView: any[] = [];

      const hasNullValue = res?.data?.data_image?.every(
        (doc: any) => doc.uploade_image === null,
      );
      if (hasNullValue === true) {
        // this.withoutFile = "Not Available Any File"
      } else {
        res?.data?.data_image?.forEach((file: any) => {
          if (file?.uploade_image !== null) {
            const parts = file?.uploade_image?.split('.');
            const fileNameWithoutExtension = parts?.slice(0, -1).join('.');
            newFileView.push({
              img_name: fileNameWithoutExtension,
              uploade_image: file?.uploade_image,
            });
          }
        });
        // this.fileView = newFileView
      }

      // Patch Form Data
      this.form.patchValue({
        prCategory: this.prData?.pr_category,
        employee_id: this.prData?.employee_id,
        financial_year_id: this.prData?.financial_year_id,
        entity_id: this.prData.entity_id,
        employee_code: this.prData?.employee_code,
        department_id: this.prData?.department_id,
        type: this.prData?.pr_type,
        date: this.prData?.pr_date,
        delivery_address: this.prData?.pr_address,
        state: this.prData?.pr_state,
        warehouse_id: this.prData?.warehouse_id,
        billing_branch_id: this.prData?.billing_branch_id,
        purchase_number: this.prData?.pr_number,
        remark: this?.prData?.remark,
        vendor_id: this.vendor_id,
      });

      this.form
        .get('cost_center_id')
        ?.setValue(this.prData?.cost_center_id, { emitEvent: false });

      for (let item of this.prData?.data_Item) {
        let vendor_ids: number[] = [];
        item.PROCUREMENT_PURCHASE_REQUEST_VENDORs.forEach((value: any) => {
          vendor_ids.push(value?.vendor_id);
        });
        item.vendor_ids = vendor_ids;
        let payload: PurchaseItemFormInterface;
        payload = {
          item_name: item?.MASTER_ITEM.item_name,
          item_code: item?.MASTER_ITEM.item_code,
          quantity: item?.quantity,
          priority: item?.priority,
          vendor_ids: item.vendor_ids,
          mvp: item?.MASTER_ITEM?.MVP,
          total_mvp: item?.total_mvp,
          grand_total: item.grand_total,
          item_image: item?.MASTER_ITEM?.MASTER_ITEM_IMAGE_DOCUMENTs[0]?.image,
          asset_category_id: item.item_categroy_id,
          id: item.id,
          item_master_id: item.item_master_id,
        };
        if (this.formType === 'PO' && this.mode === 'Add') {
          payload.unit_price = item?.MASTER_ITEM?.MVP;
          payload.total_mvp = item?.MASTER_ITEM?.MVP * item?.quantity;
          payload.hsn_sac_code =
            item?.MASTER_ITEM?.MASTER_HSN_SAC_CODE?.hsn_sac_code;
          payload.tax =
            item?.MASTER_ITEM?.MASTER_HSN_SAC_CODE?.GST_RATE_MASTER?.value;
          console.log(this.vendor_id, payload);

          if (vendor_ids?.includes(this.vendor_id)) {
            this.addItem(payload);
          }
        } else {
          this.addItem(payload);
        }
      }
      this.totalPurchaseAmount = this.grandTotal;
    });
  }

  /*
   ** For Purchase Quotation
   */
  getVendorQuotationById(pr_id: any, quotation_id: any, vendor_id: any) {
    this.prService
      .getVendorQuotationById(pr_id, quotation_id, vendor_id)
      .subscribe((res: any) => {
        if (res && res.data) {
          this.prData = res.data;
          this.getEmployeeData(this.prData?.employee_id);
          this.getDepartmentCost(
            this.prData?.department_id,
            this.prData?.po_type,
          );

          const budgetPayload = {
            cost_center_id: this.prData?.cost_center_id,
            dept_id: this.prData?.department_id,
            type: this.prData?.po_type,
            financial_year: this.prData?.financial_year_id,
            entity_id: this.prData.entity_id,
          };
          this.totalPurchaseAmount = 0;
          this.budgtGet(budgetPayload);

          this.form.patchValue({
            prCategory: this.prData?.pr_category,
            // billing_branch_id: this.prData?.billing_branch_id,
            financial_year_id: this.prData?.financial_year_id,
            department_id: this.prData?.department_id,
            type: this.prData?.po_type,
            employee_id: this.prData?.employee_id,
            date: this.prData?.pr_date,
            delivery_address: this.prData?.pr_address,
            state: this.prData?.pr_state,
            warehouse_id: this.prData?.warehouse_id,
            purchase_number: this.prData?.pr_number,
            remark: this?.prData?.remark,
            vendor_id: this.vendor_id,
            payment_term_id: this.prData?.payment_term_id,
            quotation_id: quotation_id,
          });

          this.form
            .get('cost_center_id')
            ?.setValue(this.prData?.cost_center_id, { emitEvent: false });

          for (let item of this.prData?.itemData) {
            let payload: PurchaseItemFormInterface;
            payload = {
              item_name: item?.item_name,
              item_code: item?.item_code,
              quantity: item?.quantity,
              priority: item?.priority,
              mvp: item?.mvp,
              grand_total: item.grand_total,
              item_image: item?.image,
              asset_category_id: item.item_categroy_id,
              id: item.id,
              item_master_id: item.item_master_id,
              unit_price: item?.unit_price,
              total_mvp:
                (typeof item?.unit_price === 'string'
                  ? parseFloat(item?.unit_price)
                  : item?.unit_price) * item?.quantity,
              hsn_sac_code: item?.hsn_sac_code,
              tax: item?.total_igst,
            };
            this.addItem(payload);
          }
          this.totalPurchaseAmount = this.grandTotal;
        }
      });
  }

  /*
   ** For Purchase Order
   */
  getPODataById(id: any) {
    this.prService.getBYPoNew(id).subscribe((res: any) => {
      if (res && res.data) {
        this.prData = res.data;
        // this.getEmployeeData(this.prData?.employee_id);
        this.getDepartmentCost(
          this.prData?.department_id,
          this.prData?.po_type,
        );

        const budgetPayload = {
          cost_center_id: this.prData?.cost_center_id,
          dept_id: this.prData?.department_id,
          type: this.prData?.po_type,
          financial_year: this.prData?.financial_year_id,
          entity_id: this.prData.entity_id,
        };
        this.totalPurchaseAmount = 0;
        this.budgtGet(budgetPayload);
        const newFileView: any[] = [];

        const hasNullValue = res?.data?.data_image?.every(
          (doc: any) => doc.uploade_image === null,
        );
        if (hasNullValue === true) {
          // this.withoutFile = "Not Available Any File"
        } else {
          res?.data?.data_image?.forEach((file: any) => {
            if (file?.uploade_image !== null) {
              const parts = file?.uploade_image?.split('.');
              const fileNameWithoutExtension = parts?.slice(0, -1).join('.');
              newFileView.push({
                img_name: fileNameWithoutExtension,
                uploade_image: file?.uploade_image,
              });
            }
          });
          // this.fileView = newFileView
        }

        // Patch Form Data
        this.form.patchValue({
          prCategory: this.prData?.po_category,
          billing_branch_id: this.prData?.billing_address_id,
          employee_id: this.prData?.employee_id,
          financial_year_id: this.prData?.financial_year_id,
          entity_id: this.prData.entity_id,
          employee_code: this.prData?.employee_code,
          department_id: this.prData?.department_id,
          type: this.prData?.po_type,
          date: this.prData?.po_date,
          delivery_address: this.prData?.po_address,
          state: this.prData?.po_state,
          warehouse_id: this.prData?.warehouse_id,
          po_number: this.prData?.po_number,
          remark: this?.prData?.po_remark,
          vendor_id: this.prData?.vendor_id,
          delivery_term: this.prData?.delivery_term,
          delivery_term_remark: this.prData?.delivery_term_remark,
          payment_term_id: this.prData?.payment_term_id,
          payment_term_remark: this.prData?.payment_term_remark,
          port_id: this.prData?.port_id,
          incoterm_id: this.prData?.incoterm_id,
          currency_id: this.prData?.currency_id,
          advance_utilization_percent: this.prData?.advance_utilization_percent,
          advance_payment: this.prData?.advance_payment,
        });

        this.form
          .get('currency_id')
          ?.setValue(this.prData?.currency_id, { emitEvent: false });
        this.form
          .get('cost_center_id')
          ?.setValue(this.prData?.cost_center_id, { emitEvent: false });
        this.form
          .get('profit_center_id')
          ?.setValue(this.prData?.profit_center_id, { emitEvent: false });

        for (let item of this.prData?.data_Item) {
          let payload: PurchaseItemFormInterface;
          payload = {
            id: item.id,
            item_master_id: item.item_master_id,
            hsn_sac_code: item.hsn_sac_code,
            tax: item.gst_percentage,
            discount: item.discount_percentage,
            unit_price: item.unit_price,
            item_name: item?.item_name,
            item_code: item?.item_code,
            quantity: item?.quantity,
            mvp: item?.MVP,
            total_mvp: item?.total_mvp,
            grand_total: item.grand_total,
            item_image: item?.item_document,
            asset_category_id: item.asset_id,
          };
          this.addItem(payload);
        }
        this.totalPurchaseAmount = this.grandTotal;
      }
    });
  }

  getTotalPurchaseBudget: any;
  budgtGet(payload: any) {
    this.prService.getBudgetNew(payload).subscribe(
      (res: any) => {
        if (res && res.data) {
          const data = res.data;

          this.budgetData.remainingAmount = parseFloat(data.remainingAmount);
          this.budgetData.amount = data.amount;
          this.getTotalPurchaseBudget = res.Total_purchase;
          if (this.formType === 'PR') {
            this.totalPurchaseAmount = res.Total_purchase;
          }
          this.budgetData.financial_year = this.financialYear.find(
            (item: any) => item.id === data.financial_year_id,
          )?.financial_year;
        }
        // this.budget_details = res.data
        // this.enableCheck = true;

        // if (!this.flag) {
        //   if (this.totalAmountItem) {
        //     this.dept_po += this.totalAmountItem
        //   }
        //   if (this.totalAmountService) {
        //     this.dept_po += this.totalAmountService
        //   }
        // }

        // this.fianceYear?.find((year: any) => {
        //   if (res.data?.financial_year_id === year?.id) {
        //     this.getFinacialYear = year?.financial_year
        //   }
        // })
        // this.budgetId = res.data.id;
      },
      (err: any) => {
        // this._commonService?.hideLoader()
        // if (err.error.code === 404) {
        //   this.toast.error("This Department Budget Is Not Define!")
        //   this.financialYear = "";
        //   this.budgetAmount = "";
        //   this.remainingAmount = 0;
        //   this.dept_po = "";
        //   this.budgetId = 0;
        // }
      },
    );
  }

  getPaymentTermMasterList() {
    this._configurationalMasterService
      .getPaymentTermMasterList(this.accessCtrl.getEntityId(), 'ACTIVE')
      .subscribe(
        (res: any) => {
          this.paymentTerms = res.data;
        },
        (err) => {
          this.paymentTerms = [];
        },
      );
  }

  getAllIncoterms() {
    this.purchaseMasterService.getAllIncoterms().subscribe((res: any) => {
      this.incotermList = res?.data;
    });
  }

  getAllPorts() {
    this.purchaseMasterService.getAllPorts().subscribe((res: any) => {
      this.portList = res?.data;
    });
  }

  getCurrency() {
    this._configurationalMasterService.CurrencyList().subscribe(
      (res: any) => {
        this.currencyData = res.data;
        const currentVendorId = this.form.get('vendor_id')?.value;
        if (currentVendorId && this.vendorList) {
          const vendorData = this.vendorList.find(
            (item: any) => item.id === currentVendorId,
          );
          if (vendorData) {
            this.filterTradeCurrencies(vendorData);
          }
        }
      },
      (err: any) => {},
    );
  }

  filterTradeCurrencies(vendorData: any) {
    if (!vendorData || !this.currencyData) {
      this.filteredCurrencyData = [];
      return;
    }

    let tradeIds = vendorData.trade_currency_ids;
    if (typeof tradeIds === 'string') {
      try {
        tradeIds = JSON.parse(tradeIds);
      } catch (e) {
        tradeIds = [];
      }
    }

    if (Array.isArray(tradeIds)) {
      const ids = tradeIds.map((id) => Number(id));
      this.filteredCurrencyData = this.currencyData.filter((currency: any) =>
        ids.includes(Number(currency.Currency_Convert_id)),
      );
    } else {
      this.filteredCurrencyData = [];
    }
  }

  get selectedBranchData() {
    const billing_branch_id = this.form.get('billing_branch_id')?.value;
    const branchData = this.branchData.find(
      (item: any) => item.id === billing_branch_id,
    );
    return branchData;
  }
}
