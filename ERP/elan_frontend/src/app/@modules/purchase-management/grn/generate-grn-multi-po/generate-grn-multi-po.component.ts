import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StoreManagementService } from 'src/app/@modules/store-management/store-management.service';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { GenerateBatchDialogComponent } from '../../dialog/generate-batch-dialog/generate-batch-dialog.component';
import { GrnServiceService } from '../../services/grn-service.service';

@Component({
  selector: 'app-generate-grn-multi-po',
  templateUrl: './generate-grn-multi-po.component.html',
  styleUrls: ['./generate-grn-multi-po.component.scss']
})
export class GenerateGrnMultiPoComponent implements OnInit {
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
  rowList: any[] = [];
  storeList: any[] = [];
  warehouseList: any[] = [];
  vendorsData: any[] = [];
  vendorPoList: any[] = [];
  selfList: any[] = [];
  sectionList: any[] = [];

  grnDataAllItems: any[] = [];
  po_id: any;
  status: any;
  version_id: any;
  closedStatus: any;
  rejectView: any;

  getAllPartialData: any = [];
  statusNumber: any;
  promoDataAllItems: any[] = [];
  getAllItemPoList: any = [];
  vendor_id: any;

  totalAmount: any;
  invoiceValues: any;

  uploadImage: any;
  uploadImageData: any;
  imagePathData: any;

  item_document_images: any;
  vendorIdSubscription!: Subscription;

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
    private fb: FormBuilder,
    public dialog: MatDialog,
    private _toasterService: ToastrService,
    private router: Router,
    private $common: CommonService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _inventory: InventoryManagementService,
    private storeService: StoreManagementService,
    private vendorService: VendorManagementService
  ) {
    this.POformGroup = fb.group({
      vendorId: [null, Validators.required],
      poNumbers: [null, Validators.required],
      po_number: new FormControl(),
      po_date: new FormControl(),
      po_type: new FormControl(),
      invoice_no: new FormControl('', [Validators.required]),
      invoice_date: new FormControl('', [Validators.required]),
      grn_number: new FormControl('', [Validators.required]),
      image: new FormControl(),
      vendor_name: new FormControl(),
      warehouse_id: new FormControl(null),
      container_type: new FormControl(null),
      store_id: new FormControl(null),
      shelf_id: new FormControl(null),
      advance_payment: new FormControl(),
      section_id: new FormControl(),
      row_id: new FormControl(),
      grn_date: new FormControl('', [Validators.required]),
      poList: this.fb.array([]),
    });
    const vendorIdControl = this.POformGroup.get('vendorId');

    if (!vendorIdControl) return;
    this.vendorIdSubscription = vendorIdControl.valueChanges.subscribe(
      (vendorId: number) => {
        if (!vendorId) {
          this.poList.clear();
          return;
        }

        this.fetchVendorPoList(vendorId);
      }
    );
    this.POformGroup.get('poNumbers')?.valueChanges.subscribe(
      (poNumbers: number[]) => {
        this.poList.clear(); // clear the array before repopulating

        if (!poNumbers?.length) return;

        poNumbers.forEach((poId: number) => {
          const po = this.vendorPoList.find((po: any) => po.id === poId);
          const poGroup = this.createPOForm(po);
          this.poList.push(poGroup);
          this.getGrnSetValue(po.id, poGroup);
        });
      }
    );

    this.employee_id = localStorage.getItem('EmpMainId');
    this.loginUserDetails = localStorage.getItem('signInUser');
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    const finacial_id = localStorage.getItem('financial_id');
    this.getAllWarehouseList(this.entity_id, finacial_id);
    this.getAllStoreList();
    this.createGrnNo();

    this.finacial_id = Number(finacial_id);
    this._ActiveRoute.queryParams.subscribe((res: any) => {
      this.status = res.status;
      this.version_id = res.version_id;
      this.closedStatus = res.rejectGRN;
      this.rejectView = res.RejectStatus;
    });
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

  fetchVendorPoList(vendorId: number): void {
    this.vendorPoList = []; // Clear previous list
    this._GrnService.getVendorPoList(vendorId).subscribe({
      next: (res: any) => {
        if (res?.data?.length) {
          this.vendorPoList = res.data;
        } else {
          this.poList.clear();
        }
      },
      error: (err) => {
        console.error('Error fetching PO list:', err);
        this.poList.clear();
      },
    });
  }

  getGrnSetValue(poId: number, poGroup: FormGroup<any>) {
    this.statusNumber = 0;
    this._GrnService
      .getPoGrnGetBy(poId, this.statusNumber, this.version_id)
      .subscribe((response: any) => {
        let itemsArray = this.getItemsArray(poGroup);
        this.getAllPartialData = response.data?.itemList;
        this.vendor_id = response.data.vendor_id;
        if (this.version_id) {
          this.getAllPartialData = response.data?.itemList;
        }
        this.getAllPartialData.forEach((itemSpec: any) => {
          const matchedGroup = itemsArray.controls.find(
            (ctrl) => ctrl.get('item_name')?.value === itemSpec.item_name
          ) as FormGroup;

          if (matchedGroup) {
            matchedGroup.patchValue({
              po_item_id: itemSpec.po_item_id,
              po_qty: itemSpec?.quantity,
              remaining_qty: itemSpec?.remaining_qty,
              invoice_qty: itemSpec?.invoice_qty,
              rcvd_qty: itemSpec?.receiveQty,
              reject_qty: itemSpec?.rejectQty ? itemSpec.rejectQty : 0,
              amount: itemSpec?.total_mvp,
              total_amount:
                (itemSpec.total_mvp / itemSpec.quantity) * itemSpec.receiveQty,
              grn_item_id: itemSpec?.grn_item_id,
              rejectQty: itemSpec?.rejectQty,
              final_reject: itemSpec?.final_reject,
              receiveQty: itemSpec?.receiveQty,
              isDisabled: itemSpec?.quantity === itemSpec?.selection_item,
            });
          }
        });

        if (this.status == 'partial-list' || this.version_id) {
          this.getAllSelfList(response.data.row_id);
          this.getAllSectionList(response.data.shelf_id);
          this.totalAmount = this.getAllPartialData.reduce(
            (sum: number, item: any) => {
              return +sum + (item.total_mvp / item.quantity) * item.receiveQty;
            },
            0
          );
          console.warn(this.totalAmount, 'totalAmountdddd');

          if (response.data.total_amount) {
            // this.totalAmount=response.data.amount
          }
          this.POformGroup.patchValue({
            invoice_no:
              this.closedStatus == 'OPEN' ? '' : response.data.invoiceNo,
            grn_date: response.data.grn_date,
            warehouse_id: response.data.warehouse_id,
            row_id: response.data.row_id,
            shelf_id: response.data.shelf_id,
            section_id: response.data.section_id,
            // advance_payment:response.data.advance_payment,
            invoice_date: response.data.invoiceDate,
            po_type: response.data.po_category_type,
            vendor_name: response.data.vendor_name,
            po_number: response.data.po_number,
            po_date: response.data.po_date,
            uses_id: response.data.uses_id,
          });
          console.warn(this.getAllPartialData, 'this.getAllPartialData');

          const isValid = this.getAllPartialData?.every((item: any) => {
            return item.receiveQty == '0' && item.rejectQty == '0';
          });

          this.submitBtn = !!isValid;

          this.totalAmount = this.getAllPartialData.reduce(
            (sum: number, item: any) => {
              return +sum + (item.total_mvp / item.quantity) * item.receiveQty;
            },
            0
          );
          console.warn(response.data?.ItemList, 'totalAmountdddd');
          response.data?.ItemList?.forEach((itemSpec: any) => {
            const rcvdQty =
              itemSpec?.manage_by === 'S.No. Only'
                ? itemSpec?.receiveQty
                : itemSpec?.receiveQty || 0;

            const rejectQty =
              itemSpec?.manage_by === 'S.No. Only'
                ? itemSpec?.rejectedCount
                : itemSpec?.rejectQty || 0;

            const invoiceQty = rcvdQty + rejectQty;

            console.warn(invoiceQty, 'invoice');
            const newRow = this.fb.group({
              item_id: itemSpec?.item_id,
              manage_by: itemSpec?.manage_by,
              status: this.status,
              item_cat: itemSpec?.asset_category_name,

              item_name: itemSpec?.item_name,
              item_code: itemSpec?.item_code,
              po_qty: itemSpec?.quantity,
              remaining_qty: itemSpec?.remaining_qty,
              invoice_qty: itemSpec?.invoice_qty,
              rcvd_qty: itemSpec.receiveQty,
              reject_qty: itemSpec?.rejectQty ? itemSpec.rejectQty : 0,
              isQuantityEqual: itemSpec?.isQuantityEqual,
              po_item_id: itemSpec?.po_item_id,
              amount: itemSpec?.total_mvp,
              total_amount:
                (itemSpec.total_mvp / itemSpec.quantity) * itemSpec.receiveQty,
              grn_item_id: itemSpec?.grn_item_id,
              rejectQty: itemSpec?.rejectQty,
              final_reject: itemSpec.final_reject,
              receiveQty: itemSpec?.receiveQty,
              isDisabled:
                itemSpec?.quantity == itemSpec?.selection_item ? true : false,
            });
            itemsArray.push(newRow);
          });
        } else {
          this.po_category_type = response.dcata?.po_category_type;
          this.grnDataAllItems = response.data?.itemList;
        }
        this.promoDataAllItems = response.data?.promotion_detail;
      });
  }

  createPOForm(po: any): FormGroup {
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
        po.PROCUREMENT_PURCHASE_ORDER_ITEMs?.map((item: any) =>
          this.createPOItemForm(item)
        ) || []
      ),
    });
  }

  createPOItemForm(item: any): FormGroup {
    const masterItem = item.MASTER_ITEM;
    const fb = this.fb.group({
      id: [masterItem.id],
      item_name: [item.MASTER_ITEM?.item_name],
      item_code: [item.MASTER_ITEM?.item_code],
      quantity: [item.quantity],
      unit_price: [item.unit_price],
      grand_total: [item.grand_total],
      total_igst: [item.total_igst],
      total_discount: [item.total_discount],
      manage_by: [masterItem.manage_by],
      item_id: masterItem?.id,
      item_cat: masterItem.MASTER_ASSET?.asset_category_name,

      po_qty: item?.quantity,
      remaining_qty: item?.GRN_ITEMs[0]?.remaining_qty,
      invoice_qty: item?.invoice_qty,
      rcvd_qty: item?.receiveQty,
      select_qty: item?.selection_item,
      reject_qty: item?.rejectQty ? item.rejectQty : 0,
      amount: item?.total_mvp,
      total_amount: (item.total_mvp / item.quantity) * item.receiveQty,
      isQuantityEqual: item?.isQuantityEqual,
      po_item_id: item?.po_item_id,
      grn_item_id: item?.grn_item_id,
      receiveQty: item?.receiveQty,
      final_reject: item.final_reject,
      isDisabled: item?.quantity === item?.selection_item,
    });
    fb.get('total_amount')?.valueChanges.subscribe(() => {
      this.totalAmount = this.poList.controls
        .flatMap((poGroup) => (poGroup.get('items') as FormArray).controls)
        .reduce((sum, itemGroup) => {
          const amount = itemGroup.get('total_amount')?.value;
          return (
            sum + (typeof amount === 'number' && !isNaN(amount) ? amount : 0)
          );
        }, 0);
    });

    return fb;
  }

  getAllStoreList() {
    this.storeService
      .getAllStockList(
        this.entity_id,
        this.finacial_id,
        this.employee_id,
        this.role
      )
      .subscribe((response: any) => {
        this.storeList = response.data;
      });
  }

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

  getAllWarehouseList(entity_id: any, id: any) {
    this._inventory.getAllWarehouseList(entity_id, id).subscribe((res: any) => {
      this.warehouseList = res.data;
    });
  }

  getWarehouseRowList(event: any): void {
    this.getAllRowList(event.value);
  }

  getAllRowList(warehouse_id: any) {
    this._inventory
      .getAllRowList(this.entity_id, this.finacial_id, warehouse_id)
      .subscribe((res: any) => {
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
      (err: any) => {
        this._toasterService.error('Self data not found!', 'Error Message');
      }
    );
  }

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
      (err: any) => {
        this._toasterService.error('Section data not found!', 'Error Message');
      }
    );
  }

  goBack() {
    this._location.back();
  }

  keyUpValues(
    value: any,
    poIndex: number,
    poItemIndex: number,
    grnItem: AbstractControl
  ) {
    const poArray = this.POformGroup.get('poList') as FormArray;
    const poGroup = poArray.at(poIndex) as FormGroup;
    const items = poGroup.get('items') as FormArray;

    const itemIndex = items.controls.indexOf(grnItem);
    const po_qty = grnItem.get('po_qty')?.value || 0;
    const amount = grnItem.get('amount')?.value || 0;
    const rcvd_qty = grnItem.get('rcvd_qty')?.value || 0;

    // Avoid division by zero
    const perItemRate = po_qty > 0 ? amount / po_qty : 0;
    const totalAmount = perItemRate * rcvd_qty;

    grnItem.patchValue({ total_amount: totalAmount });

    // Sum all total_amounts in this PO's items
    let grandTotal = 0;

    poArray.controls.forEach((poGroup: AbstractControl) => {
      const items = (poGroup.get('items') as FormArray)?.controls || [];

      const poTotal = items.reduce((sum, itemGroup: AbstractControl) => {
        const amount = itemGroup.get('total_amount')?.value || 0;
        return sum + amount;
      }, 0);

      grandTotal += poTotal;
    });

    this.totalAmount = grandTotal;

    const manage_by = grnItem.get('manage_by')?.value;

    if (manage_by !== 'S.No. Only') {
      const poQty = grnItem.get('po_qty')?.value || 0;
      if (value > poQty) {
        this._toasterService.error(
          'Invoice QTY should be less than or equal to PO-QTY'
        );
      } else {
        this.invoiceValues = value;
      }
    }
    console.log(JSON.stringify(this.POformGroup.getRawValue()), 'form');
  }

  generateImageUrl() {
    return environment.servralUrl + '/';
  }

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

      console.log(this.imageToUpload.name, 'fff');

      let formData = new FormData();
      formData.append('file', this.imageToUpload);

      console.warn(formData.get('file'), 'formData');

      this._configurationalMasterService
        .uploadImg(formData)
        .subscribe((res: any) => {
          this.uploadImageData = res.backendUrl;
          console.warn(res.backendUrl, 'backendfa');

          console.warn(this.uploadImage, 'upload');
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

  onsubmitData() {
    // if(!this.submitBtn){
    //   return this._toasterService.error('Please Select the Accepted and rejected quantities from Item.')
    // }
    let entity_id = localStorage.getItem('selectedEntityId');
    let financial_id = localStorage.getItem('financial_id');

    if (this.POformGroup.invalid) {
      this._toasterService.error('All the fields are required');
      return;
    }

    let val = this.POformGroup?.value;

    val?.grnItem?.map((item: any) => {
      item.grn_item_id = item?.grn_item_id;
      item.item_id = item?.item_id;
      item.receiveQty = item?.rcvd_qty;
      item.rejectQty = item?.reject_qty;
      item.po_item_id = item?.po_item_id;
      item.invoice_qty = item?.invoice_qty;
      item.po_qty = item?.po_qty;
    });

    let employeeId = localStorage.getItem('EmpMainId');
    const extractedItems: any[] = [];

    const formData = this.POformGroup.value; // or your actual formData object
    const poIds: number[] = [];
    formData.poList.forEach((po: any) => {
      poIds.push(po.id);
      po.items.forEach((item: any) => {
        extractedItems.push({
          po_id: po.id,
          item_id: item.item_id ?? item.id, // fallback to 'id' if 'item_id' is null
          receiveQty: item.receiveQty,
          rejectQty: item.reject_qty,
          po_item_id: item.po_item_id ?? item.id, // fallback to 'id' if po_item_id is null
          invoice_qty: item.receiveQty,
          po_qty: item?.po_qty,
        });
      });
    });

    console.log(extractedItems);
    let req = {
      po_Id: poIds,
      financial_year_id: financial_id,
      entity_id: entity_id,
      total_amount: this.totalAmount,
      employee_id: employeeId,
      vendor_id: this.vendor_id,
      invoiceNo: val?.invoice_no,
      invoiceDate: val?.invoice_date,
      warehouse_id: val?.warehouse_id,
      shelf_id: val?.shelf_id,
      row_id: val?.row_id,
      uses_id: val?.uses_id,
      // advance_payment: val?.advance_payment,
      section_id: val?.section_id,
      grn_date: moment(val?.grn_date).format('YYYY-MM-DD'),
      grn_number: val?.grn_number,
      po_category_type: 'Item_PO',
      version_id: this.version_id,
      invoiceDoc: this.uploadImageData,
      item: extractedItems,
      status: this.status == 'po-list' ? 0 : 1,
    };

    let isInvalid = extractedItems.some((res: any) => res.receiveQty == null);
    if (isInvalid) {
      return this._toasterService.error(
        'Please Allocate the Accept and Reject quantities from Item list'
      );
    }

    if (this.closedStatus == 'OPEN') {
      let isInvalidReject = this.getAllPartialData.some(
        (res: any) => res.receiveQty == '0' && res.total_amount == '0'
      );
      if (isInvalidReject) {
        return this._toasterService.error(
          'Please Allocate the Accept and Reject quantities from Item list'
        );
      }
    }

    if (!this.version_id) {
      delete req.version_id;
    }

    this.$common.showLoader();
    this._GrnService.createGrnData(req).subscribe(
      (response: any) => {
        if (response) {
          this._toasterService.success(response.message);
          this.router.navigate(['/master/purchase-management/grn']);
          this.$common.hideLoader();
        }
      },
      (err: any) => {
        if (err.error && err.error.message) {
          this._toasterService.error(err.error.message);
          this.$common.hideLoader();
        } else {
          this._toasterService.error('An unexpected error occurred.');
        }
      }
    );
  }

  createGrnNo() {
    this._GrnService.CreateGrnNo().subscribe((res: any) => {
      this.POformGroup.patchValue({
        grn_number: res.data,
        invoice_no: generateInvoiceNumber(),
      });
    });
  }

  viewImage() {
    window.open(this.item_document_images, '_blank');
  }

  generateFileUrl(uploadDoc: any) {
    this.item_document_images =
      environment.servralUrl + '/uploadDoc/' + uploadDoc;
  }

  openPopUp(data: AbstractControl<any>, index: any) {
    const { manage_by, rcvd_qty, po_qty, reject_qty, remaining_qty } =
      data.value;

    const receivedQty = +rcvd_qty || 0;
    const rejectedQty = +reject_qty || 0;
    const poQty = +po_qty || 0;
    const totalEnteredQty = receivedQty + rejectedQty;

    if (!receivedQty) {
      return this._toasterService.error(
        'Accept Quantities cannot be zero or empty!'
      );
    }

    if (receivedQty > poQty) {
      return this._toasterService.error('Received Qty cannot exceed PO Qty!');
    }

    if (remaining_qty && receivedQty > remaining_qty) {
      return this._toasterService.error(
        'Received Qty cannot exceed Remaining Qty!'
      );
    }

    if (totalEnteredQty > poQty) {
      return this._toasterService.error(
        'Sum of Accepted and Rejected Qty cannot exceed PO Qty!'
      );
    }

    if (remaining_qty && totalEnteredQty > remaining_qty) {
      return this._toasterService.error(
        'Sum of Accepted and Rejected Qty cannot exceed Remaining Qty!'
      );
    }

    const dialogRef = this.dialog.open(GenerateBatchDialogComponent, {
      data: {
        item_id: data.value,
        formData: data.value,
      },
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.data?.item_list) {
        const item = result.data.item_list;
        data.patchValue({
          item_id: item?.item_id,
          status: this.status,
          po_qty: item?.po_qty,
          remaining_qty: item?.remaining_qty,
          rcvd_qty: item.receiveQty,
          reject_qty: item?.rejectQty || 0,
          po_item_id: item?.po_item_id,
          amount: item?.amount,
          rejectQty: item?.rejectQty,
          receiveQty: item?.receiveQty,
          isDisabled: item?.quantity === item?.selection_item,
        });
      }
    });
  }

  // editPartialData(data: any, event: any) {
  //     if (data.value.rcvd_qty == 0) {
  //         return this._toasterService.error('Please Fill the Acceted QTY')
  //     }
  //     if ((data.value.rcvd_qty + parseInt(data.value.reject_qty)) > data.value.final_reject) {
  //         return this._toasterService.error('Accepted Quantity should less than reject-QTY')
  //     }
  //
  //
  //     if ((data.value.rcvd_qty + parseInt(data.value.reject_qty)) != data.value.final_reject) {
  //         return this._toasterService.error('The total of accept and reject quantity should be equal to the rejected quantity')
  //     } else {
  //         const dialogRef = this.dialog.open(PoActionComponent, {
  //             data: {item_id: data.value, formData: data.value},
  //             width: '600px',
  //         });
  //         dialogRef.afterClosed().subscribe((result: any) => {
  //             const item = result.data.item_list;
  //             data.patchValue({
  //                 item_id: item?.item_id,
  //                 status: this.status,
  //                 po_qty: item?.po_qty,
  //                 remaining_qty: item?.remaining_qty,
  //                 rcvd_qty: item.receiveQty,
  //                 reject_qty: item?.rejectQty ? item.rejectQty: 0,
  //                 po_item_id: item?.po_item_id,
  //                 amount: item?.amount,
  //                 rejectQty: item?.rejectQty,
  //                 receiveQty: item?.receiveQty,
  //                 isDisabled: item?.quantity === item?.selection_item,
  //             });
  //         });
  //     }
  // }
}
let counter = 1;

function generateInvoiceNumber() {
  let invoiceNumber = 'INV' + String(counter).padStart(5, '0');
  counter++;
  return invoiceNumber;
}
