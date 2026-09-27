import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { GrnServiceService } from '../../services/grn-service.service';

@Component({
  selector: 'app-create-multi-po-invoice',
  templateUrl: './create-multi-po-invoice.component.html',
  styleUrls: ['./create-multi-po-invoice.component.scss']
})
export class CreateMultiPoInvoiceComponent implements OnInit {
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
  rowData: any;
  getByData: any;
  getByItem: any;
  getByService: any;
  withoutFile: string;
  fileView: any[];
  typeCateg: string;
  totalAmountItem: number;
  CF_1: any;
  totalAmountService: number;
  createPrForm: any;
  budgetAmount: any;
  remainingAmount: any;
  dept_po: any;
  mode: string;
  poBypr: any;
  selectedGRNs: string[] = [];
  a: any = [];
  finalDataForVersion: any;
  filteredPOData: any;
  emp_id: any;
  formDisabled: boolean = false;
  vendorsData: any[] = [];
  grnListData: any[] = [];

  grnDataAllItems: any = [];
  po_id: any;
  status: any;
  version_id: any;
  closedStatus: any;
  rejectView: any;
  rowList: any = [];
  storeList: any = [];
  itemList: any[] = [];

  statusNumber: any;
  promoDataAllItems: any[] = [];
  vendor_id: any;
  grnList: any = [];

  totalAmount: number = 0;
  invoiceValues: any;

  get poList(): FormArray {
    return this.POformGroup.get('poList') as FormArray;
  }

  getItemsArray(group: AbstractControl): FormArray {
    return group.get('items') as FormArray;
  }

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
    private prService: PurchaseRequestService,
    private fb: FormBuilder,
    private GrnService: GrnServiceService,
    private vendorService: VendorManagementService
  ) {
    this.POformGroup = _fb.group({
      vendorId: [null, Validators.required],
      grn_number: new FormControl('', [Validators.required]),
      poNumbers: [null],
      po_date: new FormControl(),
      po_type: new FormControl(),
      invoice_no: new FormControl('', [Validators.required]),
      grn_id: new FormControl(''),
      invoice_date: new FormControl(''),
      vendor_name: new FormControl(),
      row_id: new FormControl(),
      grn_date: new FormControl(''),
      grnItem: this.fb.array([]), // ✅ keep empty initially
      chargesDetailList: this.fb.array([]),
      poList: this.fb.array([]), // ✅ this must be initialized too
    });
    this.POformGroup.get('vendorId')?.valueChanges.subscribe((vendorId) => {
      if (vendorId) {
        this.rowData = [];
        this.getvendorwithdatepolist(vendorId);
      }
    });

    this.POformGroup.get('grn_number')?.valueChanges.subscribe((value: any) => {
      const vendorId = this.POformGroup.get('vendorId')?.value;
      const grn_number = value;
      if (vendorId && grn_number) {
        this.getVendorWithGrn(vendorId, grn_number);
      }
    });

    this.employee_id = localStorage.getItem('EmpMainId');
    this.loginUserDetails = localStorage.getItem('signInUser');
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;
    let entity_id: any = localStorage.getItem('selectedEntityId');
    var empData: any = localStorage.getItem('signInUser');
    let financial_id: any = localStorage.getItem('financial_id');
    this.entity_id = entity_id;
    this.finacial_id = financial_id;
    this.emp_id = JSON.parse(empData).employee_id;
  }

  selectedGRNNumbers: string[] = [];

  isOptionDisabled(grnNumber: string): boolean {
    if (this.selectedGRNNumbers.length === 0) {
      return false; // If nothing is selected, all options enabled
    }

    return !this.selectedGRNNumbers.includes(grnNumber);
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    let finacial_id = localStorage.getItem('financial_id');

    this.finacial_id = Number(finacial_id);
    this._ActiveRoute.queryParams.subscribe((res: any) => {
      this.po_id = res.po_id;
      this.status = res.status;
      this.version_id = res.version_id;
      this.closedStatus = res.rejectGRN;
      this.rejectView = res.RejectStatus;
    });
    //this.getExistingPo(this.entity_id);
    this.getHsnCode();
    if (this.entity_id) {
      this.getVendorList();
    }
  }

  getVendorList() {
    this.vendorService.getAllVendorListName(this.entity_id).subscribe(
      (res: any) => {
        if (res) {
          this.vendorsData = res.data;
        } else {
        }
      },
      (err: HttpErrorResponse) => { }
    );
  }

  getVendorWithGrn(vendorId: number, grnNumber: string) {
    this.prService.getVendorWithGrn(vendorId, grnNumber).subscribe(
      (res: any) => {
        this.grnListData = res?.data || [];

        if (!this.grnListData.length) return;

        const grnIds = this.grnListData.map(
          (item: any) => item?.grn_number || ''
        );
        this.POformGroup.get('grn_Ids')?.setValue(grnIds);

        const firstInvoiceNo = this.grnListData[0]?.invoiceNo || '';
        this.POformGroup.get('invoice_no')?.setValue(firstInvoiceNo);

        this.poList.clear(); // ✅ clear existing PO list before re-adding

        this.grnListData.forEach((grnData: any) => {
          const po = grnData?.PROCUREMENT_PURCHASE_ORDER;
          if (po) {
            const poGroup = this.createPOForm(po, grnData); // ✅ make sure this method handles null values
            this.poList.push(poGroup);
          }
        });
      },
      (err: HttpErrorResponse) => {
        console.error('Failed to fetch vendor PO data:', err);
      }
    );
  }

  createPOForm(po: any, grnData: any): FormGroup {
    return this.fb.group({
      id: [po.id],
      po_category: [po.po_category],
      po_type: [po.po_type],
      po_number: [po.po_number],
      total_purchase: [po.total_purchase],
      total_tax: [po.total_tax],
      po_remark: [po.po_remark],
      po_date: [po.po_date],
      po_state: [po.po_state],
      inv_number: [po.inv_number],
      po_address: [po.po_address],
      final_status: [po.final_status],
      invoice_status: [po.invoice_status],
      status: [po.status],
      grn_status: [po.grn_status],
      items: this.fb.array(
        po.PROCUREMENT_PURCHASE_ORDER_ITEMs?.map((item: any, index: number) =>
          this.createPOItemForm(item, grnData, index)
        ) || []
      ),
    });
  }

  createPOItemForm(item: any, grnData: any, index: number): FormGroup {
    const masterItem = item?.MASTER_ITEM || {};
    const asset = masterItem?.MASTER_ASSET || {};
    const grnItem = grnData?.GRN_ITEMs?.[index] || {};

    const fb = this.fb.group({
      id: [masterItem.id],
      item_name: [masterItem.item_name ?? ''],
      item_code: [masterItem.item_code ?? ''],
      quantity: [item.quantity],
      unit_price: [item.unit_price],
      manage_by: [masterItem.manage_by ?? ''],
      item_id: [masterItem.id],
      item_cat: [asset.asset_category_name ?? ''],
      amount: [grnItem.total_mvp],
      po_qty: [grnItem.receiveQty],
      receiveQty: [grnItem.receiveQty],
      hsnCode: [masterItem?.MASTER_HSN_SAC_CODE?.hsn_sac_code],
      gstRate: [masterItem?.MASTER_HSN_SAC_CODE?.GST_RATE_MASTER?.value],
      total_amount: [
        grnItem.po_qty
          ? (parseFloat(grnItem.total_mvp) / grnItem.po_qty) *
          grnItem.receiveQty
          : 0,
      ],
    });
    this.totalAmount += fb.get('total_amount')?.value!;

    return fb;
  }

  goBack() {
    this._location.back();
  }

  uploadImage: any;
  uploadImageData: any;
  imagePathData: any;

  onGRNChange(event: MatSelectChange) {
    // a = []
    let b: any = [];
    this.storeList.forEach((item: any) => b.push(item.grn_number));
    const allValues = this.storeList.map((item: any) => item.grn_number);
    this.POformGroup.get('grn_id')?.setValue(allValues);
    // this.selectedGRNs =  b; // this is the array of selected values
    // console.log('Selected GRNs:', this.selectedGRNs);
    // this.POformGroup.get('grn_id')?.setValue(b);
    this.storeList.forEach((value: any) => {
      this.selectedGRNs.forEach((element: any) => {
        if (element == value.grn_number) {
          this.a.push({
            grn_number: value.grn_number,
            version_id: value.version_id,
          });
        }
      });
    });
  }

  getvendorwithdatepolist(vendorId: any) {
    this.GrnService.getvendorwithdatepolist(vendorId).subscribe({
      next: (res: any) => {
        if (res.code === 200 && Array.isArray(res.data)) {
          this.rowData = res.data;
          this.POformGroup.get('poNumbers')?.setValue(res.data.po_ids);
        } else {
          this.rowData = [];
        }
      },
      error: (err) => {
        console.error('Error fetching GRN list:', err);
      },
    });
  }

  onSubmitData() {
    this.POformGroup.markAllAsTouched();
    if (this.POformGroup.invalid) {
      this._toasterService.error('Please fill all the required fields');
      return;
    }
    const payload = {
      vendor_id: this.POformGroup.get('vendorId')?.value,
      grn_number: this.POformGroup.get('grn_number')?.value,
      chargesDetailList: this.additionalCharges.getRawValue(),
      grand_total: this.totalAmount,
      invoice_no: this.POformGroup.get('invoice_no')?.value,
    };
    this._GrnService
      .createmultipleposingalInvoice(payload)
      .subscribe((res: any) => {
        let data = res.message;
        if (data) {
          this._toasterService.success(res.message);
          this.router.navigate(['master/purchase-management/invoice']);
        }
      });
  }
  item_document_images: any;

  chargesToggle: boolean = false;

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
      this.productCalculation();
    }
  }

  get CF_2(): any {
    return this.POformGroup.controls;
  }

  addChargesRow() {
    if (!this.chargesToggle) return; // Prevent adding if toggle is off
    (<FormArray>this.CF_2.chargesDetailList).push(
      new FormGroup({
        additional_charges_name: new FormControl(null, Validators.required),
        amount: new FormControl(null, Validators.required),
        hsn_code_id: new FormControl(null, Validators.required),
        tax_rate: new FormControl(null),
        description: new FormControl(null),
        version_id: new FormControl(this.grnListData[0]?.version_id),
        vendor_id: new FormControl(this.grnListData[0]?.vendor_id),
        grn_master_id: new FormControl(this.grnListData[0]?.id),
      })
    );
  }

  deleteChargesRow(i: any, control: any) {
    if (this.CF_2.chargesDetailList.length >= 1) {
      this.CF_2.chargesDetailList.removeAt(i);
      this.productCalculation();
    } else {
      // this.toast.error('must be one', "Can't Deleted!");
    }
  }

  hsnCodeList: any = [];
  hsnCodeList2: any;
  hsn: any;

  getHsnCode() {
    this._configurationalMasterService
      .getHsnCode(this.entity_id)
      .subscribe((res: any) => {
        this.hsnCodeList = res.data;
        this.hsnCodeList2 = this.hsnCodeList;
        this.hsn = this.hsnCodeList2.map((res: any) => res.hsn_sac_code);
      });
  }

  hsnSearch(e: any) {
    const aa = e;
    let filteredVariable = this.hsnCodeList2.filter((item: any) =>
      aa.includes(item.hsn_sac_code)
    );
    this.hsnCodeList = filteredVariable;
  }

  onHSNCodeChange(value: any, index: number): void {
    let chargesDetailList = this.POformGroup.get(
      'chargesDetailList'
    ) as FormArray;
    const selectedHSN = this.hsnCodeList.find(
      (hsn: { id: any }) => hsn.id == value
    );
    chargesDetailList.at(index).patchValue({
      tax_rate: selectedHSN.value,
      description: selectedHSN.description,
    });
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

  get additionalCharges() {
    return this.POformGroup.get('chargesDetailList') as FormArray;
  }

  productCalculation() {
    const chargeList = this.additionalCharges.value || [];
    const poList = this.poList.controls || [];

    let totalPrice = 0;

    poList.forEach((poGroup: AbstractControl) => {
      const itemsArray = poGroup.get('items') as FormArray;
      if (!itemsArray) return;

      itemsArray.controls.forEach((itemGroup: AbstractControl) => {
        const amount = Number(itemGroup.get('total_amount')?.value) || 0;
        totalPrice += amount;
      });
    });

    let totalAdditionalCharges = 0;
    let totalGSTonCharges = 0;

    chargeList.forEach((charge: any) => {
      const chargeAmount = Number(charge?.amount) || 0;
      const chargeRate = Number(charge?.tax_rate) || 0;

      totalAdditionalCharges += chargeAmount;
      totalGSTonCharges += (chargeAmount * chargeRate) / 100;
    });

    this.totalAmount = totalPrice + totalAdditionalCharges + totalGSTonCharges;
  }
}
