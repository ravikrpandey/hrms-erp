import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { ItemAllocationDialogComponent } from '../../dialog/item-allocation-dialog/item-allocation-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-grn-warehouse-allocation-form',
  templateUrl: './grn-warehouse-allocation-form.component.html',
  styleUrls: ['./grn-warehouse-allocation-form.component.scss'],
})
export class GrnWarehouseAllocationFormComponent implements OnInit {
  form: FormGroup;
  submitBtn: boolean = true;
  showBtn: boolean = true;
  imageToUpload: any;
  imagePath: any;
  po_category_type: any;
  fileType: any;
  warehouse_id: any;
  selectedRowIds: any[][] = [];
  finalSelfArray: any[][] = [];

  selectedShelfIds: any[][] = [];
  finalSectionsArray: any[][] = [];

  storeList: any = [];
  rowList: any = [];

  constructor(
    private _ActiveRoute: ActivatedRoute,
    private _fb: FormBuilder,
    public dialog: MatDialog,
    private _toasterService: ToastrService,
    private router: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _inventory: InventoryManagementService,
  ) {
    this.form = _fb.group({
      po_number: new FormControl(),
      po_date: new FormControl(),
      po_type: new FormControl(),
      invoice_no: new FormControl('', [Validators.required]),
      invoice_date: new FormControl('', [Validators.required]),
      grn_number: new FormControl('', [Validators.required]),
      image: new FormControl(),
      vendor_name: new FormControl(),
      warehouse_id: new FormControl('', [Validators.required]),
      warehouse_name: new FormControl(''),
      container_type: new FormControl('', [Validators.required]),
      store_id: new FormControl(''),
      shelf_id: new FormControl(),
      advance_payment: new FormControl(),
      section_id: new FormControl(),
      row_id: new FormControl(),
      excelFile: new FormControl(''),
      grn_date: new FormControl('', [Validators.required]),
      grnItem: new FormArray([
        new FormGroup({
          item_cat: new FormControl(),
          item_name: new FormControl(),
          manage_by: new FormControl(),
          item_code: new FormControl(),
          po_qty: new FormControl(),
          invoice_qty: new FormControl(),
          rcvd_qty: new FormControl(''),
          select_qty: new FormControl(),
          reject_qty: new FormControl(),
          isQuantityEqual: new FormControl(),
          item_id: new FormControl(),
          po_item_id: new FormControl(),
          amount: new FormControl(),
          remaining_qty: new FormControl(),
          total_amount: new FormControl(),
          grn_item_id: new FormControl(),
          isDisabled: new FormControl(false),
          self_id: new FormControl(),
          row_id: new FormControl(),
          section_id: new FormControl(),
        }),
      ]),
    });
  }

  get GrnDataItem() {
    return this.form.get('grnItem') as FormArray;
  }

  grnDataAllItems: any = [];
  po_id: any;
  status: any;
  version_id: any;
  closedStatus: any;
  rejectView: any;

  ngOnInit(): void {
    this._ActiveRoute.queryParams.subscribe((res: any) => {
      this.po_id = res.po_id ? res.po_id : null;
      this.status = res.status;
      this.version_id = res.version_id ? res.version_id : null;
      ((this.closedStatus = res.rejectGRN),
        (this.rejectView = res.RejectStatus));
    });
    if (this.po_id) {
      this.getPoListById();
    }
  }

  openWarehouseStore(grnItem: any) {
    const warehouseId = this.form.get('warehouse_id')?.value;

    const dialogRef = this.dialog.open(ItemAllocationDialogComponent, {
      height: 'calc(100% - 0px)',
      width: 'calc(100% - 0px)',
      maxWidth: '100%',
      maxHeight: '100%',
      disableClose: true,
      data: {
        itemData: grnItem.value,
        warehouse_id: warehouseId,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getPoListById('stock');
      }
    });
  }

  calculateInvoiceQty(index: number) {
    const grnItem = this.GrnDataItem.at(index) as FormGroup;
    const rcvdQty = grnItem.get('rcvd_qty')?.value;
    const rejectQty = grnItem.get('reject_qty')?.value || 0;
    const invoiceQty = rcvdQty + rejectQty;

    grnItem.patchValue({
      invoice_qty: invoiceQty,
    });
  }
  getAllPartialData: any = [];
  statusNumber: any;
  promoDataAllItems: any[] = [];
  getAllItemPoList: any = [];
  vendor_id: any;

  getPoListById(from = '') {
    if (!this.po_id) return;
    while (this.GrnDataItem.length > 0) {
      this.GrnDataItem.removeAt(0);
    }

    this.statusNumber =
      this.status === 'po-list' ? 0 : this.status === 'partial-list' ? 1 : 2;

    this._inventory
      .getPendingGrnAllcationById(this.po_id, this.version_id)
      .subscribe(
        (response: any) => {
          const data = response.data;
          this.vendor_id = data.vendor_id;

          const items = data?.ItemList || data?.itemList || [];
          this.getAllPartialData = items;
          this.grnDataAllItems = items;

          this.form.patchValue({
            po_number: data?.po_number,
            po_date: data?.po_date,
            po_type: data?.po_category_type,
            vendor_name: data?.vendor_name,
            invoice_no: this.closedStatus === 'OPEN' ? '' : data.invoiceNo,
            grn_date: data?.grn_date,
            invoice_date: data?.invoiceDate,
            uses_id: data?.uses_id,
            warehouse_name: data?.warehouse_name,
            warehouse_id: data?.warehouse_id,
            grn_number: data?.grn_number,
          });

          this.totalAmount = items.reduce((sum: number, item: any) => {
            const receiveQty = item.receiveQty || 0;
            const totalMvp = item.total_mvp || 0;
            const quantity = item.quantity || 1;
            return sum + (totalMvp / quantity) * receiveQty;
          }, 0);
          this.submitBtn = items.every(
            (item: any) => item.receiveQty == 0 && item.rejectQty == 0,
          );

          items.forEach((itemSpec: any) => {
            const rcvdQty =
              itemSpec?.manage_by === 'S.No. Only'
                ? itemSpec.receiveQty
                : itemSpec.receiveQty || 0;
            const rejectQty =
              itemSpec?.manage_by === 'S.No. Only'
                ? itemSpec.rejectedCount
                : itemSpec.rejectQty || 0;
            const totalAmount =
              rejectQty == null
                ? ''
                : (itemSpec.total_mvp / itemSpec.quantity) * rcvdQty;

            const newRow = this._fb.group({
              item_id: itemSpec?.item_id,
              manage_by: itemSpec?.manage_by,
              status: this.status,
              sub_category_id: itemSpec?.sub_category_id,
              asset_id: itemSpec?.asset_id,
              item_cat: itemSpec?.asset_category_name,
              grn_id: itemSpec?.grn_Id,
              item_name: itemSpec?.item_name,
              item_code: itemSpec?.item_code,
              po_qty: itemSpec?.quantity,
              remaining_qty: itemSpec?.remaining_qty,
              invoice_qty: itemSpec?.invoice_qty,
              rcvd_qty: rcvdQty,
              reject_qty: rejectQty,
              isQuantityEqual: itemSpec?.isQuantityEqual,
              po_item_id: itemSpec?.po_item_id,
              amount: itemSpec?.total_mvp,
              total_amount: totalAmount,
              grn_item_id: itemSpec?.grn_item_id,
              rejectQty: itemSpec?.rejectQty,
              final_reject: itemSpec?.final_reject,
              receiveQty: rcvdQty,
              isDisabled:
                itemSpec?.quantity === itemSpec?.selection_item ? true : false,
              batchNo: itemSpec?.batchNo,
            });

            this.GrnDataItem.push(newRow);
          });
        },
        (err: HttpErrorResponse) => {
          if (from === 'stock') {
            this.router.navigate(['/master/warehouse-management/add-stock']);
            return;
          }
          this._toasterService.error(
            err.error.message || 'Failed to fetch GRN data',
            'Error',
          );
        },
      );
  }

  totalAmount: any;
  invoiceValues: any;

  generateImageUrl() {
    return environment.servralUrl + '/';
  }
  uploadImage: any;
  uploadImageData: any;
  imagePathData: any;

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // encodes file as base64 string
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageToUpload = input.files[0];
      this.convertFileToBase64(this.imageToUpload).then((base64: string) => {
        // Store base64 string in the form control or another object
        this.form.patchValue({ excelFile: base64 });
      });
      // this.form.patchValue({ excelFile: this.imageToUpload });
    }
  }

  onChange(e: any) {
    const file = e.target.files[0];
    if (file) {
      this.imageToUpload = file;
    }
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0);
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

  viewImage() {
    window.open(this.item_document_images, '_blank');
  }

  item_document_images: any;

  generateFileUrl(uploadDoc: any) {
    this.item_document_images =
      environment.servralUrl + '/uploadDoc/' + uploadDoc;
  }
}
