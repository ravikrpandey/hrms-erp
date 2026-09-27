import { Location } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { GenerateBatchDialogComponent } from '../../dialog/generate-batch-dialog/generate-batch-dialog.component';
import { GrnServiceService } from '../../services/grn-service.service';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-create-grn',
  templateUrl: './create-grn.component.html',
  styleUrls: ['./create-grn.component.scss'],
})
export class CreateGrnComponent implements OnInit {

  @ViewChild('serialFileInput')
  serialFileInput!: ElementRef<HTMLInputElement>;
  importedSerialData: any[] = [];
  excelErrors: string[] = [];
  isFileImported: boolean = false;
  excelMsg: boolean = false;

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
  totalAmount: any;
  invoiceValues: any;
  grnData: any;
  today: Date = new Date();

  constructor(
    public _location: Location,
    private _GrnService: GrnServiceService,
    private _ActiveRoute: ActivatedRoute,
    private _fb: FormBuilder,
    public dialog: MatDialog,
    private _toasterService: ToastrService,
    private router: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.POformGroup = _fb.group({
      po_number: new FormControl(),
      shiped_no: new FormControl(),
      po_date: new FormControl(),
      po_type: new FormControl(),
      invoice_no: new FormControl('', [Validators.required]),
      invoice_date: new FormControl('', [Validators.required]),
      grn_number: new FormControl('', [Validators.required]),
      image: new FormControl(),
      vendor_name: new FormControl(),
      container_type: new FormControl(''),
      advance_amount: new FormControl(0),
      advance_payment: new FormControl(),
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
          reject_qty: new FormControl(0),
          isQuantityEqual: new FormControl(),
          item_id: new FormControl(),
          po_item_id: new FormControl(),
          amount: new FormControl(),
          remaining_qty: new FormControl(),
          claim_qty: new FormControl(),
          total_amount: new FormControl(),
          grn_item_id: new FormControl(),
          isDisabled: new FormControl(false),
        }),
      ]),
    });

    this.employee_id = localStorage.getItem('EmpMainId');
    this.loginUserDetails = localStorage.getItem('signInUser');
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.role_master_id;
  }

  // get promotionalDetails() {
  //   return this.POformGroup.get('promotional_details') as FormArray;
  // }

  get GrnDataItem() {
    return this.POformGroup.get('grnItem') as FormArray;
  }

  grnDataAllItems: any = [];
  po_id: any;
  ship_id: any;
  status: any;
  version_id: any;
  closedStatus: any;
  rejectView: any;
  po_status: any;

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    let finacial_id = localStorage.getItem('financial_id');
    this.finacial_id = Number(finacial_id);

    this._ActiveRoute.queryParams.subscribe((res: any) => {
      this.po_id = res.po_id;
      this.ship_id = res.ship_id;
      this.status = res.status;
      this.version_id = res.version_id;
      ((this.closedStatus = res.rejectGRN),
        (this.rejectView = res.RejectStatus));
      this.po_status = res.po_status;
    });
    if (this.po_id) {
      this.createGrnNo();
      this.getPoListById();
    }
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
  }

  getAllPartialData: any = [];
  statusNumber: any;
  promoDataAllItems: any[] = [];
  getAllItemPoList: any = [];
  vendor_id: any;
  shippingCharges: any;

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
      this._GrnService
        .getPoGrnGetBy(
          this.po_id,
          this.statusNumber,
          this.version_id,
          '',
          this.ship_id,
        )
        .subscribe((response: any) => {
          this.getAllPartialData = response.data?.ItemList;
          this.shippingCharges = response.data;
          this.grnData = response.data;
          if (response) {
            this.POformGroup.patchValue({
              po_number: response?.data?.po_number,
              shiped_no: response?.data?.shiped_no,
              po_date: response?.data?.po_date,
              po_type: response?.data?.po_type,
              vendor_name: response?.data?.vendor_name,
              invoice_no: response?.data?.invoice_no,
              invoice_date: response?.data?.invoice_date,
              grn_date: response.data.grn_date,
              advance_amount: response.data.advance_amount
            });
          }

          this.vendor_id = response.data.vendor_id;
          this.POformGroup.patchValue({
            // advance_payment:response.data.advance_payment,
          });
          if (this.version_id) {
            this.getAllPartialData = response.data?.ItemList;
          }
          if (this.status == 'partial-list' || this.version_id) {
            this.totalAmount = this.getAllPartialData.reduce(
              (sum: number, item: any) => {
                return (
                  +sum + (item.total_mvp / item.quantity) * item.receiveQty
                );
              },
              0,
            );
            this.POformGroup.patchValue({
              // invoice_no:
              //   this.closedStatus == 'OPEN' ? '' : response.data.invoiceNo,
              grn_date: response.data.grn_date,
              grn_number: response.data.grn_number,
              warehouse_id: response.data.warehouse_id,
              // advance_payment:response.data.advance_payment,
              // invoice_date: response.data.invoiceDate,
              // po_type: response.data.po_category_type,
              // vendor_name: response.data.vendor_name,
              // po_number: response.data.po_number,
              // po_date: response.data.po_date,
              uses_id: response.data.uses_id,
            });
            // console.warn(this.getAllPartialData, 'this.getAllPartialData');

            const isValid = this.getAllPartialData?.every((item: any) => {
              return item.receiveQty == '0' && item.rejectQty == '0';
            });

            if (isValid) {
              this.submitBtn = true;
            } else {
              this.submitBtn = false;
            }

            const totalAmountData = this.getAllPartialData.reduce(
              (sum: number, item: any) => {
                return (
                  +sum + (item.total_mvp / item.quantity) * item.receiveQty
                );
              },
              0,
            );
            this.totalAmount = +totalAmountData.toFixed(0);
            response.data?.ItemList?.forEach((itemSpec: any, index: number) => {
              const rcvdQty =
                itemSpec?.manage_by === 'S.No. Only'
                  ? itemSpec?.receiveQty
                  : itemSpec?.receiveQty || 0;

              const rejectQty =
                itemSpec?.manage_by === 'S.No. Only'
                  ? itemSpec?.rejectedCount
                  : itemSpec?.rejectQty || 0;

              const invoiceQty = rcvdQty + rejectQty;

              const newRow = this._fb.group({
                item_id: itemSpec?.item_id,
                manage_by: itemSpec?.manage_by,
                status: this.status,
                item_cat: itemSpec?.asset_category_name,
                item_name: itemSpec?.item_name,
                item_code: itemSpec?.item_code,
                po_qty: itemSpec?.quantity,
                remaining_qty: itemSpec?.remaining_qty,
                claim_qty: itemSpec?.claim_qty,
                invoice_qty: itemSpec?.invoice_qty,
                rcvd_qty: itemSpec.receiveQty || itemSpec.claim_qty,
                reject_qty: itemSpec?.rejectQty ? itemSpec?.rejectQty : 0,
                isQuantityEqual: itemSpec?.isQuantityEqual,
                po_item_id: itemSpec?.po_item_id,
                amount: itemSpec?.total_mvp || 0,

                // Total Value
                total_mvp: itemSpec?.total_mvp || 0,

                total_amount: itemSpec.amount
                  ? itemSpec.amount
                  : (
                      (itemSpec.total_mvp / itemSpec.quantity) *
                      itemSpec.receiveQty
                    ).toFixed(2),
                // itemSpec?.receiveQty && itemSpec?.quantity
                //   ? +(
                //       (Number(itemSpec.amount) || 0) *
                //       Number(itemSpec.receiveQty)
                //     ).toFixed(2)
                //   : 0,
                grn_item_id: itemSpec?.grn_item_id,
                rejectQty: itemSpec?.rejectQty,
                final_reject: itemSpec.final_reject,
                receiveQty: itemSpec?.receiveQty,
                isDisabled:
                  itemSpec?.quantity == itemSpec?.selection_item ? true : false,
              });

              this.GrnDataItem.push(newRow);
              this.keyUpValues(newRow.value, index, newRow);
              newRow.patchValue({ final_reject: itemSpec.final_reject });
            });
          } else {
            this.po_category_type = response.data?.po_category_type;
            this.grnDataAllItems = response.data?.itemList;
            const elsetotalAmountData = this.grnDataAllItems.reduce(
              (sum: number, item: any) => {
                return sum + (item.total_mvp / item.quantity) * item.receiveQty;
              },
              0,
            );
            this.totalAmount = elsetotalAmountData.toFixed(0);
            console.warn(this.totalAmount, 'totalAmount');

            // if (response) {
            //   this.POformGroup.patchValue({
            //     po_number: response?.data?.po_number,
            //     po_date: response.data.po_date,
            //     po_type: response?.data?.po_type,
            //     vendor_name: response?.data?.vendor_name,
            //   });
            // }

            this.grnDataAllItems?.forEach((itemSpec: any, index: number) => {
              const rcvdQty =
                itemSpec?.manage_by === 'S.No. Only'
                  ? itemSpec?.receiveQty
                  : itemSpec?.receiveQty || 0;

              const rejectQty =
                itemSpec?.manage_by === 'S.No. Only'
                  ? itemSpec?.rejectedCount
                  : itemSpec?.rejectQty || 0;

              const invoiceQty = rcvdQty + rejectQty;

              const newRow = this._fb.group({
                item_id: itemSpec?.item_id,
                manage_by: itemSpec.manage_by,
                item_cat: itemSpec?.asset_category_name,

                item_name: itemSpec?.item_name,
                item_code: itemSpec?.item_code,
                po_qty: itemSpec?.quantity,
                remaining_qty: itemSpec?.remaining_qty,
                claim_qty: itemSpec?.claim_qty,
                invoice_qty: itemSpec?.invoice_qty,
                rcvd_qty: itemSpec?.receiveQty || itemSpec.claim_qty,
                select_qty: itemSpec?.selection_item,
                reject_qty: itemSpec?.rejectQty ? itemSpec?.rejectQty : 0,
                amount: itemSpec?.total_mvp,
                total_amount:
                  itemSpec.rejectQty == null
                    ? ''
                    : (
                        (itemSpec.total_mvp / itemSpec.quantity) *
                        itemSpec.receiveQty
                      ).toFixed(2),
                isQuantityEqual: itemSpec?.isQuantityEqual,
                po_item_id: itemSpec?.po_item_id,
                grn_item_id: itemSpec?.grn_item_id,
                rejectQty: itemSpec?.rejectQty,
                receiveQty: itemSpec?.receiveQty,
                final_reject: itemSpec.final_reject,
                isDisabled:
                  itemSpec?.quantity == itemSpec?.selection_item ? true : false,
              });

              this.GrnDataItem.push(newRow);
              this.keyUpValues(newRow.value, index, newRow);

              newRow.patchValue({ final_reject: itemSpec.final_reject });
            });
          }

          this.promoDataAllItems = response.data?.promotion_detail;
        });
    }
  }

  keyUpValues(value: any, i: number, grnItem: any) {
    const control = this.POformGroup.get('grnItem') as FormArray;
    const item = control.at(i).value;

    // Total Amount Calculation
    let values = (item.amount / item.po_qty) * item.rcvd_qty;

    // Reject Qty Calculation
    const rejectQty = (item.claim_qty || 0) - (item.rcvd_qty || 0);

    control.at(i).patchValue({
      reject_qty: rejectQty > 0 ? rejectQty : 0,
      total_amount: +values.toFixed(2),
    });

    // Final Total Amount
    let finalData = control.controls.reduce((sum: number, formGroup: any) => {
      return sum + parseFloat(formGroup.get('total_amount')?.value || 0);
    }, 0);

    this.totalAmount = finalData.toFixed(2);

    // Validation
    if (grnItem.manage_by !== 'S.No. Only') {
      const poQty = item.claim_qty || 0;

      if (+value > +poQty) {
        this._toasterService.error(
          'Invoice QTY should be less than or equal to PO QTY',
        );

        control.at(i).patchValue({
          rcvd_qty: poQty,
        });

        this.invoiceValues = poQty;
      } else {
        this.invoiceValues = value;
      }
    }
  }

  openPopUp(data: AbstractControl<any>, event: any) {
    const {
      manage_by,
      rcvd_qty,
      po_qty,
      reject_qty,
      remaining_qty,
      claim_qty,
    } = data.value;
    if (manage_by === 'Batch Only') {
      if (data.value.rcvd_qty > claim_qty) {
        return this._toasterService.error(
          'Inovice Qty should less than PO-QTY and RCVD-QTY should less than Invoive-Qty and PO-QTY',
        );
      } else if (data.value.rcvd_qty > claim_qty) {
        return this._toasterService.error(
          'Inovice Qty should less than PO-QTY and RCVD-QTY should less than Invoive-Qty and PO-QTY',
        );
      }
      // else if(data.value.rcvd_qty==null || data.value.rcvd_qty=='0' || data.value.rcvd_qty==0){
      //   return this._toasterService.error('Accept Quantities cannot be zero!!')
      // }
      else if (
        data.value?.claim_qty &&
        data.value?.claim_qty < data.value?.rcvd_qty
      ) {
        return this._toasterService.error(
          'Rcvd Qty should be less than Remaining Qty!!',
        );
      } else if (
        data.value.rcvd_qty + data.value.reject_qty >
        data.value.po_qty
      ) {
        return this._toasterService.error(
          'The total of accept and reject quantity cannot be greater than total PO quantites!',
        );
      } else if (
        parseInt(data.value?.rcvd_qty) + data.value?.reject_qty >
        parseInt(data.value?.claim_qty)
      ) {
        return this._toasterService.error(
          'The total of accept and reject quantity cannot be greater than total Remaining Quantities!',
        );
      } else {
        let formData = data?.value;
        let list = this.POformGroup?.value?.grnItem;
        const rcvdQty = +data.value.rcvd_qty || 0;
        const rejectQty = +data.value.reject_qty || 0;
        const poQty = +data.value.po_qty || 0;

        const invoiceQty = rcvdQty + rejectQty;

        this.grnDataAllItems?.map((res: any) => {
          if (res.item_name == data.value.item_name) {
            const dialogRef = this.dialog.open(GenerateBatchDialogComponent, {
              data: { item_id: res, formData: data.value },
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
                  isDisabled: item?.receiveQty === item?.selection_item,
                });
                res.amount = item?.amount;
                res.rejectQty = item?.rejectQty;
                res.receiveQty = item?.receiveQty;
              }
            });
          }
        });
      }
    } else if (data.value.manage_by == 'S.No. Only') {
      if (data.value.rcvd_qty > data.value?.po_qty) {
        return this._toasterService.error(
          'Inovice Qty should less than PO-QTY !!',
        );
      } else if (data.value.rcvd_qty == null || data.value.rcvd_qty == null) {
        return this._toasterService.error(
          'Please Enter invoice-qty and rcvd-qty!!',
        );
      } else {
        let formData = data?.value;
        let list = this.POformGroup?.value?.grnItem;
        const rcvdQty = +data.value.rcvd_qty || 0;
        const rejectQty = +data.value.reject_qty || 0;
        const poQty = +data.value.po_qty || 0;

        const invoiceQty = rcvdQty + rejectQty;

        this.grnDataAllItems?.map((res: any) => {
          if (res.item_name == data.value.item_name) {
            const dialogRef = this.dialog.open(GenerateBatchDialogComponent, {
              data: { item_id: res, formData: data.value },
              width: '600px',
            });

            dialogRef.afterClosed().subscribe((result: any) => {
              console.log(result);
              if (result?.data?.item_list) {
                const item = result.data.item_list;
                data.patchValue({
                  item_id: item?.item_id,
                  status: this.status,
                  po_qty: item?.po_qty,
                  remaining_qty: item?.claim_qty,
                  claim_qty: formData?.claim_qty,
                  rcvd_qty: item.receiveQty,
                  reject_qty: item?.rejectQty || 0,
                  po_item_id: item?.po_item_id,
                  amount: item?.amount,
                  rejectQty: item?.rejectQty,
                  receiveQty: item?.receiveQty,
                  isDisabled: item?.receiveQty === item?.selection_item,
                });
              }
            });
          }
        });
      }
    }
  }

  editPartialData(data: any, event: any) {
    if (data.value.rcvd_qty == 0) {
      return this._toasterService.error('Please Fill the Acceted QTY');
    }
    if (
      data.value.rcvd_qty + parseInt(data.value.reject_qty) >
      data.value.final_reject
    ) {
      return this._toasterService.error(
        'Accepted Quantity should less than reject-QTY',
      );
    }

    if (
      data.value.rcvd_qty + parseInt(data.value.reject_qty) !=
      data.value.final_reject
    ) {
      return this._toasterService.error(
        'The total of accept and reject quantity should be equal to the rejected quantity',
      );
    } else {
      this.getAllPartialData?.map((res: any) => {
        if (res.item_name == data.value.item_name) {
          const dialogRef = this.dialog.open(GenerateBatchDialogComponent, {
            data: { item_id: res, formData: data.value, status: this.status },
            width: '600px',
          });

          dialogRef.afterClosed().subscribe((result: any) => {
            console.log(result);

            if (result?.data?.item_list) {
              const item = result.data.item_list;
              data.patchValue({
                item_id: item?.item_id,
                status: this.status,
                po_qty: item?.po_qty,
                remaining_qty: item?.claim_qty,
                claim_qty: item?.claim_qty,
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
      });
    }
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

    // let isValidExtension = this.$common.checkForValidFile(e, false, false);
    // if (!isValidExtension) {
    //   return this.POformGroup.patchValue({
    //     image: null,
    //   });
    // }

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

  onsubmitData(data: any) {
    // if(!this.submitBtn){
    //   return this._toasterService.error('Please Select the Accepted and rejected quantities from Item.')
    // }

    let entity_id = localStorage.getItem('selectedEntityId');
    let financial_id = localStorage.getItem('financial_id');
    if (this.POformGroup.status === 'INVALID') {
      this._toasterService.error('All the fields are required');
      return;
    }

    let val = this.POformGroup?.value;

    const isBatchOrSerialInvalid = val?.grnItem?.some((res: any) => {
      const isManaged =
        res.manage_by === 'Batch Only' || res.manage_by === 'S.No. Only';
      if (isManaged && res.rcvd_qty > 0) {
        return res.rcvd_qty !== res.receiveQty;
      }
      return false;
    });

    let isInvalid = val?.grnItem.some((res: any) => res.receiveQty == null);
    if (isInvalid) {
      return this._toasterService.error(
        'Please Allocate the Accept and Reject quantities from Item list',
      );
    }

    if (this.closedStatus == 'OPEN') {
      let isInvalidReject = this.getAllPartialData.some(
        (res: any) => res.receiveQty == '0',
      );
      if (isInvalidReject) {
        return this._toasterService.error(
          'Please Allocate the Accept and Reject quantities from Item list',
        );
      }
    }
    if (
      this.closedStatus != 'OPEN' &&
      this.po_status !== 'DISCARDED' &&
      isBatchOrSerialInvalid
    ) {
      return this._toasterService.error(
        'Please select the Batch and Serial Number for the Item',
      );
    }
    // const keyExists = this.grnDataAllItems.every((res: any) => {
    //   return res.receiveQty ;
    // });
    // if (!keyExists) {
    //   return this._toasterService.error(
    //     'Please Allocate the Accept and Reject quantities from Item list --------'
    //   );
    // }

    val?.grnItem?.map((item: any) => {
      item.grn_item_id = item?.grn_item_id;
      item.item_id = item?.item_id;
      item.receiveQty = item?.rcvd_qty;
      item.claim_qty = item?.claim_qty;
      item.rejectQty = item?.reject_qty;
      item.po_item_id = item?.po_item_id;
      item.invoice_qty = item?.invoice_qty;
    });

    let employeeId = localStorage.getItem('EmpMainId');
    let req = {
      po_Id: this.po_id,
      financial_year_id: financial_id,
      entity_id: entity_id,
      total_amount: this.totalAmount,
      employee_id: employeeId,
      shiping_id: this.ship_id,
      vendor_id: this.vendor_id,
      invoiceNo: val?.invoice_no,
      invoiceDate: val?.invoice_date,
      uses_id: val?.uses_id,
      grn_date: moment(val?.grn_date).format('YYYY-MM-DD'),
      grn_number: val?.grn_number,
      po_category_type: 'Item_PO',
      version_id: this.version_id,
      invoiceDoc: this.uploadImageData,
      item: val?.grnItem.filter((res: any) => {
        return res.rcvd_qty != null || res.receiveQty != null;
      }),
      promotional_details: this.promoDataAllItems,
      status: this.status == 'po-list' ? 0 : 1,
    };
    if (!this.version_id) {
      delete req.version_id;
    }

    this._GrnService.createGrnData(req).subscribe(
      (response: any) => {
        if (response) {
          this._toasterService.success(response.message);
          this.router.navigate(['/master/purchase-management/grn']);
        }
      },
      (err: any) => {
        if (err.error && err.error.message) {
          this._toasterService.error(err.error.message);
        } else {
          this._toasterService.error('An unexpected error occurred.');
        }
      },
    );
  }

  close() {
    this.router.navigate(['/master/purchase-management/grn']);
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
    this.item_document_images =
      environment.servralUrl + '/uploadDoc/' + uploadDoc;
  }

  async downloadSerialNoTemplate(): Promise<void> {
    const data = this.grnData;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Serial Import');

    worksheet.columns = [
      { header: 'PO No', key: 'poNo', width: 15 },
      { header: 'Shipment No', key: 'saNo', width: 15 },
      { header: 'Item Name', key: 'itemName', width: 25 },
      { header: 'Item Code', key: 'itemCode', width: 18 },
      { header: 'Qty', key: 'qty', width: 10 },
      { header: 'Manage By', key: 'manageBy', width: 18 },
      { header: 'Status', key: 'status', width: 18 },
      { header: 'Serial No', key: 'serialNo', width: 25 },
    ];

    // Header styling
    const headerRow = worksheet.getRow(1);

    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
      };

      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4472C4' },
      };
    });

    headerRow.height = 25;

    // Generate rows
    data.itemList.forEach((item: any) => {
      if(!item.receiveQty){
        const manageBy = item.manage_by;

        let rowCount = 1;
        let qtyPerRow = Number(item.quantity || 0);

        if (manageBy === 'S.No. Only') {
          const acceptedQty = Number(
            item.receiveQty ??
            item.claim_qty ??
            item.quantity ??
            0
          );

          rowCount = acceptedQty;
          qtyPerRow = 1;
        }

        if (manageBy === 'Batch Only') {
          rowCount = 1;
          qtyPerRow = Number(item.quantity || 0);
        }

        for (let i = 0; i < rowCount; i++) {
          worksheet.addRow({
            poNo: data.po_number,
            saNo: data.shiped_no,
            itemName: item.item_name,
            itemCode: item.item_code,
            qty: qtyPerRow,
            manageBy: manageBy,
            status: 'SELECTED',
            serialNo: '',
          });
        }
      }
    });

    const lastRow = worksheet.rowCount;

    // Status dropdown
    for (let row = 2; row <= lastRow; row++) {
      const statusCell = worksheet.getCell(row, 7);
      const manageByCell = worksheet.getCell(row, 6);
      const manageBy = String(manageByCell.value || '').trim();

      if (manageBy === 'Batch Only') {
        statusCell.value = 'SELECTED';
        statusCell.dataValidation = {
          type: 'list',
          allowBlank: false,
          formulae: ['"SELECTED"'],
          showErrorMessage: true,
          errorStyle: 'stop',
          errorTitle: 'Invalid Status',
          error: 'Batch Only item can only have SELECTED status.',
        };
      }
      else {
        statusCell.value = 'SELECTED';
        statusCell.dataValidation = {
          type: 'list',
          allowBlank: false,
          formulae: ['"SELECTED,REJECTED,NOT RECEIVED"'],
          showErrorMessage: true,
          errorStyle: 'stop',
          errorTitle: 'Invalid Status',
          error: 'Please select a valid status.',
        };
      }

      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E2F0D9' },
      };
    }

    // Serial No duplicate validation
    for (let row = 2; row <= lastRow; row++) {
      const serialCell = worksheet.getCell(row, 8);

      serialCell.dataValidation = {
        type: 'custom',
        allowBlank: true,
        formulae: [
          `=OR(H${row}="",COUNTIF($H$2:$H$${lastRow},H${row})=1)`,
        ],
        showErrorMessage: true,
        errorStyle: 'stop',
        errorTitle: 'Duplicate Serial No',
        error: 'Serial No must be unique.',
        showInputMessage: true,
        promptTitle: 'Serial No',
        prompt: 'Enter unique Serial No.',
      };

      serialCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF2CC' },
      };
    }

    // Freeze header
    worksheet.views = [
      {
        state: 'frozen',
        ySplit: 1,
      },
    ];

    (worksheet.views[0] as any).activeCell = 'H2';

    // Auto filter
    worksheet.autoFilter = {
      from: 'A1',
      to: `H${lastRow}`,
    };

    // BATCH ONLY INFORMATION MESSAGE
    const infoRowNumber = lastRow + 5;

    // Merge Item Code (D) to Serial No (H)
    worksheet.mergeCells(
      `D${infoRowNumber}:H${infoRowNumber}`
    );

    const infoCell = worksheet.getCell(
      `D${infoRowNumber}`
    );

    infoCell.value ='⚠️ Batch No will be generated automatically by the system.';

    // Highlight
    infoCell.font = {
      bold: true,
      size: 11,
    };

    infoCell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };

    infoCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'FFF2CC',
      },
    };

    infoCell.border = {
      top: {
        style: 'thin',
      },
      left: {
        style: 'thin',
      },
      bottom: {
        style: 'thin',
      },
      right: {
        style: 'thin',
      },
    };

    worksheet.getRow(infoRowNumber).height = 35;

    // Alignment
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = {
          vertical: 'middle',
        };
      });

      if (rowNumber > 1) {
        row.getCell(5).alignment = {
          horizontal: 'center',
        };
      }
    });

    // Download
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob(
      [buffer],
      {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }
    );

    saveAs(
      blob,
      `Serial_No_Import_Template_${data.po_number}_${data.shiped_no}.xlsx`
    );
  }

  importSerialNo(): void {
    this.serialFileInput.nativeElement.click();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Previous data clear
    this.importedSerialData = [];
    this.excelErrors = [];
    this.isFileImported = false;

    try {
      await this.readAndValidateExcel(file);
    } catch (error) {
      this._toasterService.error('Unable to read Excel file.');
      this.isFileImported = false;
    }

    // Same file dobara select karne ke liye
    input.value = '';
  }

  async readAndValidateExcel(file: File): Promise<void> {

    const allowedExtensions = ['xlsx', 'xls'];

    const extension = file.name
      .split('.')
      .pop()
      ?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
      this._toasterService.error(
        'Please select a valid Excel file.'
      );
      return;
    }

    const workbook = new ExcelJS.Workbook();

    const buffer = await file.arrayBuffer();

    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet('Serial Import');

    if (!worksheet) {
      this._toasterService.error(
        'Invalid template. Please upload the downloaded Serial No Template.'
      );
      return;
    }

    // Validate Header
    const headers = [
      'PO No',
      'Shipment No',
      'Item Name',
      'Item Code',
      'Qty',
      'Manage By',
      'Status',
      'Serial No'
    ];

    const excelHeaders: string[] = [];

    worksheet.getRow(1).eachCell((cell, colNumber) => {
      excelHeaders[colNumber - 1] =
        String(cell.value || '').trim();
    });

    const headerMismatch = headers.some(
      (header, index) =>
        excelHeaders[index] !== header
    );

    if (headerMismatch) {
      this._toasterService.error(
        'Invalid Excel template. Please download a fresh template.'
      );
      return;
    }

    // Read rows
    const excelRows: any[] = [];

    worksheet.eachRow((row, rowNumber) => {

      if (rowNumber === 1) {
        return;
      }

      // Skip instruction row
      const infoText = this.getExcelCellValue(row.getCell(4).value).toLowerCase();
      if (infoText.includes('batch no will be generated automatically by the system')) {
        return;
      }

      const poNo = this.getExcelCellValue(
        row.getCell(1).value
      );

      const saNo = this.getExcelCellValue(
        row.getCell(2).value
      );

      const itemName = this.getExcelCellValue(
        row.getCell(3).value
      );

      const itemCode = this.getExcelCellValue(
        row.getCell(4).value
      );

      const qty = Number(
        this.getExcelCellValue(
          row.getCell(5).value
        ) || 0
      );

      const manageBy = this.getExcelCellValue(
        row.getCell(6).value
      );

      const status = this.getExcelCellValue(
        row.getCell(7).value
      ).toUpperCase();

      const serialNo = this.getExcelCellValue(
        row.getCell(8).value
      );

      // Completely empty row skip
      if (
        !poNo &&
        !saNo &&
        !itemName &&
        !itemCode &&
        !qty &&
        !manageBy &&
        !status &&
        !serialNo
      ) {
        return;
      }

      excelRows.push({
        excelRow: rowNumber,
        poNo,
        saNo,
        itemName,
        itemCode,
        qty,
        manageBy,
        status,
        serialNo
      });
    });

    if (!excelRows.length) {
      this._toasterService.error('Excel file does not contain any data.');
      return;
    }

    // Validate against GRN
    const validationResult =
      this.validateExcelData(excelRows);

    if (!validationResult.valid) {

      this.excelErrors = validationResult.errors;

      // console.error('Excel Validation Errors:',this.excelErrors);

      this.excelErrors.forEach((error) => {
        this._toasterService.error(error);
      });

      this.importedSerialData = [];
      this.isFileImported = false;

      return;
    }

    // Valid data
    this.importedSerialData = validationResult.data;
    this.isFileImported = true;
    // console.log('VALID IMPORT DATA:',this.importedSerialData);
    this._toasterService.success(`${this.importedSerialData.length} records validated successfully.`);
  }

  getExcelCellValue(value: any): string {

    if (value === null || value === undefined) {
      return '';
    }

    if (
      typeof value === 'object' &&
      value.text
    ) {
      return String(value.text).trim();
    }

    if (
      typeof value === 'object' &&
      value.result !== undefined
    ) {
      return String(value.result).trim();
    }

    return String(value).trim();
  }

  validateExcelData(rows: any[]): {
    valid: boolean;
    errors: string[];
    data: any[];
  } {

    const errors: string[] = [];
    const validData: any[] = [];

    const serialSet = new Set<string>();

    // -----------------------------------
    // ERROR TRACKING
    // -----------------------------------

    const invalidPoRows: number[] = [];
    const invalidSaRows: number[] = [];

    const invalidStatusRows: {
      row: number;
      status: any;
    }[] = [];

    const invalidItemRows: {
      row: number;
      itemCode: any;
    }[] = [];

    const itemNameMismatchRows: number[] = [];
    const manageByMismatchRows: number[] = [];

    const serialQtyRows: number[] = [];
    const batchQtyRows: {
      row: number;
      expected: number;
      actual: number;
    }[] = [];

    const missingSerialRows: number[] = [];
    const notReceivedSerialRows: number[] = [];

    const duplicateSerialRows: {
      row: number;
      serial: string;
    }[] = [];


    // -----------------------------------
    // GRN BASIC DATA
    // -----------------------------------

    const grnPoNo =
      String(this.grnData?.po_number || '').trim();

    const grnSaNo =
      String(this.grnData?.shiped_no || '').trim();


    if (!grnPoNo) {

      errors.push(
        'PO Number not found in GRN data.'
      );
    }

    if (!grnSaNo) {

      errors.push(
        'SA Number not found in GRN data.'
      );
    }


    // -----------------------------------
    // Allowed Status
    // -----------------------------------

    const allowedStatus = [
      'SELECTED',
      'REJECTED',
      'NOT RECEIVED'
    ];


    // -----------------------------------
    // Row Count Expected
    // -----------------------------------

    let expectedRows = 0;

    this.grnData?.itemList?.forEach(
      (item: any) => {

        if (!item.receiveQty) {

          const manageBy =
            item.manage_by;

          if (manageBy === 'S.No. Only') {

            const acceptedQty =
              Number(
                item.receiveQty ??
                item.claim_qty ??
                item.quantity ??
                0
              );

            expectedRows += acceptedQty;

          } else if (
            manageBy === 'Batch Only'
          ) {

            expectedRows += 1;
          }
        }
      }
    );


    if (rows.length !== expectedRows) {

      errors.push(
        `Invalid row count. Expected ${expectedRows} rows but Excel contains ${rows.length} rows.`
      );
    }

    // Validate every Excel row
    rows.forEach((row: any) => {

      const rowNo = row.excelRow;

      // PO
      if (
        String(row.poNo || '').trim() !==
        grnPoNo
      ) {

        invalidPoRows.push(rowNo);
      }

      // SHIPMENT
      if (
        String(row.saNo || '').trim() !==
        grnSaNo
      ) {
        invalidSaRows.push(rowNo);
      }

      // STATUS
      if (
        !allowedStatus.includes(
          String(row.status || '').trim()
        )
      ) {

        invalidStatusRows.push({
          row: rowNo,
          status: row.status
        });
      }

      // Find item
      const grnItem =
        this.grnData?.itemList?.find(
          (item: any) =>
            String(item.item_code || '')
              .trim()
              .toLowerCase() ===
            String(row.itemCode || '')
              .trim()
              .toLowerCase()
        );


      if (!grnItem) {

        invalidItemRows.push({
          row: rowNo,
          itemCode: row.itemCode
        });

        return;
      }

      // Item Name
      if (
        String(row.itemName || '')
          .trim()
          .toLowerCase() !==
        String(grnItem.item_name || '')
          .trim()
          .toLowerCase()
      ) {
        itemNameMismatchRows.push(rowNo);
      }

      // Manage By
      if (
        String(row.manageBy || '')
          .trim()
          .toLowerCase() !==
        String(grnItem.manage_by || '')
          .trim()
          .toLowerCase()
      ) {

        manageByMismatchRows.push(rowNo);
      }

      const manageBy = String(grnItem.manage_by || '').trim();

      // Qty
      if (manageBy === 'S.No. Only') {
        if (Number(row.qty) !== 1) {
          serialQtyRows.push(rowNo);
        }
      } else if (manageBy === 'Batch Only') {
        const expectedQty = Number(grnItem.quantity || 0);
        const actualQty = Number(row.qty || 0);

        if (actualQty !== expectedQty) {
          batchQtyRows.push({
            row: rowNo,
            expected: expectedQty,
            actual: actualQty
          });
        }
      }

      // SERIAL VALIDATION
      if (manageBy === 'S.No. Only') {

        if (row.status === 'SELECTED' || row.status === 'REJECTED') {
          if (!row.serialNo) {
            missingSerialRows.push(rowNo);
          } else {
            const serial = String(row.serialNo).trim().toLowerCase();
            // Duplicate inside Excel
            if (serialSet.has(serial)) {
              duplicateSerialRows.push({row: rowNo, serial: row.serialNo});
            } else {
              serialSet.add(serial);
            }
          }
        }

        if (row.status === 'NOT RECEIVED' && row.serialNo) {
          notReceivedSerialRows.push(rowNo);
        }
      }

      // Final object
      validData.push({
        poNo: row.poNo,
        saNo: row.saNo,
        itemName: row.itemName,
        itemCode: row.itemCode,
        qty: row.qty,
        manageBy: row.manageBy,
        status: row.status,
        serialNo: manageBy === 'S.No. Only' ? row.serialNo : null,
        // Backend data
        item_id:grnItem.item_id,
        item_category_id: grnItem.asset_id,
        po_item_id:grnItem.po_item_id,
        total_mvp:grnItem.total_mvp,
        po_qty:grnItem.quantity,
        amount:grnItem.total_mvp,
        expiryDate:this.today
      });

    });

    // PO ERROR
    if (invalidPoRows.length > 0) {

      if (
        invalidPoRows.length <= 10
      ) {

        errors.push(
          `PO No does not match GRN PO No in rows: ${invalidPoRows.join(', ')}.`
        );

      } else {

        errors.push(
          `PO No does not match GRN PO No in ${invalidPoRows.length} rows. Please enter the correct PO No "${grnPoNo}" in all rows.`
        );
      }
    }


    // -----------------------------------
    // SA ERROR
    // -----------------------------------

    if (
      invalidSaRows.length > 0
    ) {

      if (
        invalidSaRows.length <= 10
      ) {

        errors.push(
          `SA No does not match GRN SA No in rows: ${invalidSaRows.join(', ')}.`
        );

      } else {

        errors.push(
          `SA No does not match GRN SA No in ${invalidSaRows.length} rows. Please enter the correct SA No "${grnSaNo}" in all rows.`
        );
      }
    }

    // STATUS ERROR
    if (
      invalidStatusRows.length > 0
    ) {

      if (
        invalidStatusRows.length <= 10
      ) {

        const details =
          invalidStatusRows
            .map(
              x =>
                `Row ${x.row} ("${x.status}")`
            )
            .join(', ');

        errors.push(
          `Invalid Status found in: ${details}.`
        );

      } else {

        errors.push(
          `Invalid Status found in ${invalidStatusRows.length} rows. Please use only SELECTED, REJECTED or NOT RECEIVED.`
        );
      }
    }

    // ITEM CODE ERROR
    if (invalidItemRows.length > 0) {

      if (
        invalidItemRows.length <= 10
      ) {

        const details =
          invalidItemRows
            .map(
              x =>
                `Row ${x.row} (Item Code: "${x.itemCode}")`
            )
            .join(', ');

        errors.push(
          `Item Code does not belong to this GRN in: ${details}.`
        );

      } else {

        errors.push(
          `Item Code does not belong to this GRN in ${invalidItemRows.length} rows. Please check the Item Code in the Excel file.`
        );
      }
    }


    // -----------------------------------
    // ITEM NAME ERROR
    // -----------------------------------

    if (
      itemNameMismatchRows.length > 0
    ) {

      if (
        itemNameMismatchRows.length <= 10
      ) {

        errors.push(
          `Item Name does not match in rows: ${itemNameMismatchRows.join(', ')}.`
        );

      } else {

        errors.push(
          `Item Name does not match in ${itemNameMismatchRows.length} rows. Please check the Item Name against the Item Code.`
        );
      }
    }


    // -----------------------------------
    // MANAGE BY ERROR
    // -----------------------------------

    if (
      manageByMismatchRows.length > 0
    ) {

      if (
        manageByMismatchRows.length <= 10
      ) {

        errors.push(
          `Manage By does not match in rows: ${manageByMismatchRows.join(', ')}.`
        );

      } else {

        errors.push(
          `Manage By does not match in ${manageByMismatchRows.length} rows. Please check the Manage By value against the Item.`
        );
      }
    }

    // SERIAL QTY ERROR
    if (serialQtyRows.length > 0) {

      if (serialQtyRows.length <= 10) {
        errors.push(`Serial No item Qty must be 1 in rows: ${serialQtyRows.join(', ')}.`);
      } else {
        errors.push(`Serial No item Qty must be 1 in ${serialQtyRows.length} rows.`);
      }
    }

    // BATCH QTY ERROR
    if (batchQtyRows.length > 0) {

      if (batchQtyRows.length <= 10) {

        const details =
          batchQtyRows
            .map(
              x =>
                `Row ${x.row}: expected ${x.expected}, got ${x.actual}`
            )
            .join('; ');

        errors.push(`Batch Qty mismatch found: ${details}.`);
      } else {
        errors.push(`Batch Qty mismatch found in ${batchQtyRows.length} rows. Please check the Batch item quantities.`);
      }
    }

    // MISSING SERIAL ERROR
    if (missingSerialRows.length > 0) {
      if (missingSerialRows.length <= 10) {
        errors.push( `Serial No is required in rows: ${missingSerialRows.join(', ')}.`);
      } else {
        errors.push(`Serial No is missing in ${missingSerialRows.length} rows. Please enter Serial No for all SELECTED/REJECTED rows.`);
      }
    }

    // NOT RECEIVED SERIAL ERROR
    if (notReceivedSerialRows.length > 0) {
      if (notReceivedSerialRows.length <= 10) {
        errors.push(`Serial No must be empty in rows: ${notReceivedSerialRows.join(', ')}.`);
      } else {
        errors.push(`Serial No must be empty in ${notReceivedSerialRows.length} NOT RECEIVED rows.`);
      }
    }

    // DUPLICATE SERIAL ERROR
    if (duplicateSerialRows.length > 0) {

      if (duplicateSerialRows.length <= 10) {

        const details =
          duplicateSerialRows
            .map(
              x =>
                `Row ${x.row}: "${x.serial}"`
            )
            .join(', ');

        errors.push(`Duplicate Serial No found in Excel: ${details}.`);
      } else {
        errors.push(`Duplicate Serial No found in ${duplicateSerialRows.length} rows. Please ensure all Serial Numbers are unique.`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      data: errors.length === 0 ? validData : []
    };
  }

  saveImportedSerialData(): void {
    if (!this.importedSerialData || this.importedSerialData.length === 0) {
      this._toasterService.error('Please import a valid Excel file first.');
      return;
    }

    const payload = {
      po_number: this.grnData.po_number,
      shiped_no: this.grnData.shiped_no,
      grn_item_data: this.importedSerialData
    };

    // console.log('FINAL IMPORT PAYLOAD:',payload);
    // console.log('without Serial No', this.grnData);

    this._GrnService.bulkUploadSBExcelAPI(payload).subscribe(
      (response: any) => {
        if (response.code == 200) {
          this.getPoListById();
          this.excelMsg = true;
          this._toasterService.success(response.message);
          // Clear imported data
          this.importedSerialData = [];
          // Hide Save button
          this.isFileImported = false;
          // Clear file input
          if (this.serialFileInput) {
            this.serialFileInput.nativeElement.value = '';
          }
        }else{
          this._toasterService.error(response.message);
        }
      },
      (err: any) => {
        if (err.error && err.error.message) {
          this._toasterService.error(err.error.message);
        } else {
          this._toasterService.error('An unexpected error occurred.');
        }
      },
    );
  }
}
