import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseRequestService } from '../@shared/services/purchase-request.service';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from '../@shared/services/configurationalmaster.service';
import * as moment from 'moment';
import { environment } from '../environments/environment';
import { QuestionDialogAnswerComponent } from './question-dialog-answer/question-dialog-answer.component';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';

@Component({
  selector: 'app-send-rfp',
  templateUrl: './send-rfp.component.html',
  styleUrls: ['./send-rfp.component.scss'],
})
export class SendRfpComponent {
  form: FormGroup;
  details_pr: any;

  imageToUpload: any;
  imagePath: any;
  editDocData: any;
  vendorData: any;
  noOfVendor: any;
  id: any;
  singlePrData: any;
  sendRfpData: any;
  endData: any;
  currencyData: any;
  role: any;
  previousQuoteData: any;
  sgstDisabled: boolean = false;
  someCondition: boolean = false;
  totleCgstIgst: any = [];
  totelIgst: any = [];
  totelAmount: any;
  totalAmountPrice: any;
  fileBind: string;
  rfpNo: any;
  vendor_id: any;
  vendor_id_header: any;
  type_pr: any;
  startDate: Date;
  endDate: Date;
  alertActive: boolean = false;
  star: Date;
  end: Date;
  currentDatess: Date;
  check: any;
  sendProposal: boolean;
  isSubmited: boolean = false;
  stopRfpEnd: any;
  fileView: any;
  curncyMZN: any;
  today: Date = new Date();

  expirationDate: Date;
  currentDate: Date = new Date();
  linkExpired: boolean = false;

  constructor(
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private cryptoService: CryptoService,
    private prService: PurchaseRequestService,
    private configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.form = this.fb.group({
      vendor_remarks: new FormControl(null),
      item_detail: this.fb.array([]),
    });
  }

  get itemDetail(): FormArray {
    return this.form.get('item_detail') as FormArray;
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      // this.rfpNo = params.Rfp_no;
      // this.vendor_id = params.vendor_id;
      // this.type_pr = params.type;
      this.vendor_id_header = params?.vendor_id;
      this.vendor_id = this.cryptoService.decrypt(this.vendor_id_header);
      this.rfpNo = this.cryptoService.decrypt(params.Rfp_no);
      this.type_pr = this.cryptoService.decrypt(params.type);

      if (this.type_pr == 'Bom') {
        this.getByBomLink();
      } else if (this.type_pr == 'Service') {
        this.getByRfpServiceLink();
      } else {
        this.getByRfpLink();
      }
    });

    this.getCurrency();
  }

  createItem(item: any): FormGroup {
    const defaultCurrency = this.currencyData?.find(
      (c: any) => c.Currency_Type === 'INR',
    );
    const itemForm = this.fb.group({
      price_amt: [item.price_amt || null, [Validators.required]],
      igst: [item.igst || ''],
      delivery_charges: [item.delivery_charges || 0, [Validators.required]],
      additional_charges: [item.additional_charges || 0, [Validators.required]],
      currency_id: [
        defaultCurrency?.Currency_Convert_id || item?.currency_id || 1,
      ],
      mvp: [item.mvp_product || item.mvp || '-'],

      item_document: [item.item_document],
      product_name: [item.product_name || item.item_name || '-'],
      item_code: [item.item_code || '-'],
      priority: [item.priority || '-'],
      product_quantity: [item.product_quantity || 0],
      hsn_code_id: [item?.hsn_code_id],
      item_id: [item.item_id],
      index: [item.index],
      totelAmount: [item.grand_total || null],
      expected_delivery_date: [item.expected_delivery_date || null],
      delivery_date: [item.delivery_date || null],
      questionForm: this.fb.array([]),
    });

    const qArray = itemForm.get('questionForm') as FormArray;
    (item?.questionForm || []).forEach((q: any) =>
      qArray?.push(this.createQuestion(q)),
    );
    return itemForm;
  }

  createQuestion(question: any): FormGroup {
    return this.fb.group({
      id: [question?.id],
      question: [question?.question],
      answer: [question?.answer || null, Validators.required],
    });
  }

  getByRfpLink() {
    this.prService
      .getByRfpLink(this.vendor_id, this.rfpNo, this.type_pr)
      .subscribe((res: any) => {
        this.details_pr = res.data;
        const newFileView: any[] = [];

        res?.data?.PROCUREMENT_PURCHASE_REQUEST_IMAGEs?.forEach((file: any) => {
          if (!file?.uploade_image) {
            return;
          }
          const parts = file?.uploade_image?.split('.');
          const fileNameWithoutExtension = parts.slice(0, -1).join('.');
          newFileView.push({
            img_name: fileNameWithoutExtension,
            uploade_image: file?.uploade_image,
          });
        });
        this.fileView = newFileView;
        this.fileBind = this.details_pr?.file || null;
        this.isSubmited = res?.item_Data.vendor_responded;
        this.stopRfpEnd = res?.item_Data?.rfp_status;
        if (this.stopRfpEnd == 'CLOSE RFP') {
          this.stopRfp();
        }
        if (this.isSubmited) {
          this.proposalSubmit();
        }
        this.dateExpire();
        this.checkDateRange();
        if (
          Array.isArray(this.details_pr?.procurement_Item_requests) &&
          this.details_pr?.procurement_Item_requests.length > 0
        ) {
          this.details_pr?.procurement_Item_requests.forEach(
            (itemData: any) => {
              const item = {
                PR_category: itemData?.PR_category,
                product_name: itemData?.product_name || itemData?.item_name,
                product_varient: itemData?.product_varient,
                item_quantity: itemData?.item_quantity,
                mvp: itemData?.mvp,
                mvp_product: itemData?.mvp_product,
                product_quantity: Number(itemData?.quantity),
                item_code: itemData?.item_code,
                item_document: itemData?.item_document
                  ? `${environment.servralUrl}/${itemData.item_document}`
                  : null,
                item_name: itemData?.ItemMaster?.item_name,
                item_id: itemData?.item_id,
                priority: itemData?.priority,
                currency_id: 1,
                igst: itemData?.tax || Number(itemData?.igst),
                hsn_code_id: itemData?.hsn_sac_code,
                delivery_date: itemData?.delivery_date,
                expected_delivery_date: itemData?.expected_delivery_date,
                questionForm: itemData.questionForm,
              };

              console.log(item);
              this.itemDetail.push(this.createItem(item));
            },
          );
        }
      });
  }

  // bom GteBy
  getByBomLink() {
    this.prService
      .getByRfpBomLink(this.vendor_id, this.rfpNo, this.type_pr)
      .subscribe(
        (res: any) => {
          this.details_pr = res.data;
          this.isSubmited = res?.vendor_data?.vendor_responded;

          if (this.isSubmited) {
            this.proposalSubmit();
          }
          this.dateExpire();
          this.checkDateRange();

          if (
            this.details_pr?.procurement_Item_requests &&
            Array.isArray(
              this.details_pr?.procurement_Item_requests &&
                this.details_pr?.procurement_Item_requests?.length > 0,
            )
          ) {
            this.details_pr?.procurement_Item_requests.forEach(
              (itemData: any) => {
                const item = {
                  PR_category: itemData?.PR_category,
                  product_name: itemData?.product_name || itemData?.item_name,
                  product_varient: itemData?.product_varient,
                  item_quantity: itemData?.item_quantity,
                  mvp: itemData?.mvp,
                  mvp_product: itemData?.mvp_product,
                  product_quantity: Number(itemData?.quantity),
                  item_code: itemData?.item_code,
                  item_document: `${
                    environment.servralUrl + '/' + itemData?.item_document
                  }`,
                  item_name: itemData?.ItemMaster?.item_name,
                  item_id: itemData?.item_id,
                  priority: itemData?.priority,
                  currency_id: 1,
                  igst: itemData?.tax || Number(itemData?.igst),
                  hsn_code_id: itemData?.hsn_sac_code,
                  expected_delivery_date: itemData?.expected_delivery_date,
                  questionForm: itemData.questionForm,
                };
                this.itemDetail.push(this.createItem(item));
              },
            );
          }
        },
        (err: any) => {
          this.toast.error('Something Went To Wrong');
        },
      );
  }

  // service getBy
  getByRfpServiceLink() {
    this.prService
      .getByRfpServiceLink(this.vendor_id, this.rfpNo, this.type_pr)
      .subscribe(
        (res: any) => {
          console.log(res, 'ressssss');
          this.details_pr = res.data;
          // this.procurement_requests =
          //   res.data?.procurement_serviceItem_requests;
          const newFileView: any[] = [];

          res?.data?.PROCUREMENT_PURCHASE_REQUEST_IMAGEs?.forEach(
            (file: any) => {
              const parts = file?.uploade_image?.split('.');

              const fileNameWithoutExtension = parts.slice(0, -1).join('.');

              newFileView.push({
                img_name: fileNameWithoutExtension,
                uploade_image: file?.uploade_image,
              });
            },
          );

          console.log(newFileView, 'newFileView');
          this.fileView = newFileView;
          this.isSubmited = res?.serviceData?.vendor_responded;
          this.fileBind = this.details_pr?.file || null;

          this.stopRfpEnd = res?.data?.rfp_status;
          if (this.stopRfpEnd == 'CLOSE RFP') {
            this.stopRfp();
          }
          if (this.isSubmited) {
            this.proposalSubmit();
          }
          this.dateExpire();
          this.checkDateRange();

          if (
            this.details_pr?.procurement_Item_requests &&
            Array.isArray(
              this.details_pr?.procurement_Item_requests &&
                this.details_pr?.procurement_Item_requests?.length > 0,
            )
          ) {
            this.details_pr?.procurement_Item_requests.forEach(
              (itemData: any) => {
                const item = {
                  PR_category: itemData?.PR_category,
                  product_name: itemData?.product_name || itemData?.item_name,
                  product_varient: itemData?.product_varient,
                  item_quantity: itemData?.item_quantity,
                  mvp: itemData?.mvp,
                  mvp_product: itemData?.mvp_product,
                  product_quantity: Number(itemData?.quantity),
                  item_code: itemData?.item_code,
                  item_document: `${
                    environment.servralUrl + '/' + itemData?.item_document
                  }`,
                  item_name: itemData?.ItemMaster?.item_name,
                  item_id: itemData?.item_id,
                  priority: itemData?.priority,
                  currency_id: 1,
                  igst: itemData?.tax || Number(itemData?.igst),
                  hsn_code_id: itemData?.hsn_sac_code,
                  expected_delivery_date: itemData?.expected_delivery_date,
                  questionForm: itemData.questionForm,
                };
                this.itemDetail.push(this.createItem(item));
              },
            );
          }
        },
        (error: any) => {
          console.log(error, 'errr');
          this.toast.error(`${error?.error?.message}`);
        },
      );
  }

  dateExpire() {
    //
    this.startDate = new Date(this.details_pr?.start_date);
    this.endDate = new Date(this.details_pr?.end_date);
    this.currentDate = new Date();

    this.endDate.setHours(23, 59, 59, 999);

    let startTimestamp = this.startDate.getTime();
    let endTimestamp = this.endDate.getTime();
    let currentTimestamp = this.currentDate.getTime();

    this.check =
      currentTimestamp >= startTimestamp && currentTimestamp <= endTimestamp;
    return this.check;
  }

  checkDateRange() {
    if (this.check == false) {
      Swal.fire({
        title: `Your RFP Link Open Only This Date: ${moment(
          this.startDate,
        ).format('DD-MM-YYYY')} To ${moment(this.endDate).format(
          'DD-MM-YYYY',
        )}`,
        // text: 'You will not be able to recover this file!',
        icon: 'warning',
        // showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        // cancelButtonColor: '#063178',
        // confirmButtonColor: '#f44336',
        // confirmButtonText: 'Delete!',
        // cancelButtonText: 'Skip',
      }).then((result) => {});
    }
  }

  findCurrency(id: any) {
    return this.currencyData.find((c: any) => c.Currency_Convert_id == id);
  }

  keyUpPrice(control: AbstractControl, index: number) {
    this.calculateItemTotal(control, index);
  }

  calculateItemTotal(control: AbstractControl, index: number) {
    const value = control.value;
    const currency = this.findCurrency(value.currency_id);
    const rate = Number(currency?.rate || 1);

    const qty = Number(value.product_quantity || 0);
    const price = Number(value.price_amt || 0);
    const delivery = Number(value.delivery_charges || 0);
    const additional = Number(value.additional_charges || 0);

    const baseAmount = qty * price;

    let gstAmount = 0;

    if (value.gst_Type === 'CGST/SGST') {
      const cgst = (baseAmount * Number(value.cgst || 0)) / 100;
      const sgst = (baseAmount * Number(value.sgst || 0)) / 100;
      gstAmount = cgst + sgst;
    } else {
      gstAmount = (baseAmount * Number(value.igst || 0)) / 100;
    }

    const total = baseAmount + delivery + additional + gstAmount;
    const convertedTotal = total * rate;

    const list = this.itemDetail.at(index);

    list.patchValue({
      totelAmount: convertedTotal.toFixed(2),
    });

    this.updateGrandTotal();
  }

  updateGrandTotal() {
    let total = 0;

    this.itemDetail.value.forEach((item: any) => {
      total += Number(item.totelAmount || 0);
    });

    this.totalAmountPrice = total.toFixed(2);
  }

  currencySele(control: AbstractControl, index: number) {
    this.calculateItemTotal(control, index);
  }

  getCurrency() {
    this.configurationalMasterService.CurrencyList().subscribe((res: any) => {
      this.currencyData = res.data;
      this.currencyData.find(
        (c: any) => c.default_status === 'ACTIVE' && c?.Currency_Type === 'INR',
      );
      res.data?.forEach((cur: any) => {
        if (cur?.Currency_Type === 'MZN') {
          this.curncyMZN = cur;
        }
      });
    });
  }

  seePreview(path: string, imagePath: any) {
    if (!this.imagePath) {
      if (path) {
        Swal.fire({
          imageUrl: path,
          imageHeight: 250,
          imageAlt: 'Uploaded Document',
          confirmButtonColor: '#063178',
          confirmButtonText: 'Ok',
        });
      }
    } else {
      Swal.fire({
        imageUrl: imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: '#063178',
        confirmButtonText: 'Ok',
      });
    }
  }

  onVendorChange(e: any) {
    this.noOfVendor = e.value;

    this.form.controls['invite_no_vendor'].patchValue(this.noOfVendor.length);
  }

  displayFormErrors() {
    this.itemDetail.controls.forEach((itemGroup: any, index: number) => {
      if (itemGroup.invalid) {
        const productName =
          itemGroup.get('product_name')?.value || `Item ${index + 1}`;
        const fields: string[] = [];
        if (itemGroup.get('price_amt')?.invalid) fields.push('Price/Unit');
        if (itemGroup.get('delivery_charges')?.invalid)
          fields.push('Delivery Charges');
        if (itemGroup.get('additional_charges')?.invalid)
          fields.push('Additional Charges');

        if (fields.length > 0) {
          this.toast.error(`${productName}: Please fill ${fields.join(', ')}.`);
        }

        const questionForm = itemGroup.get('questionForm') as FormArray;
        if (questionForm && questionForm.invalid) {
          this.toast.warning(
            `${productName}: Please open the question answer popup to add answers.`,
          );
        }
        console.log(itemGroup.errors);
      }
    });
  }

  fire() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.displayFormErrors();
      return;
    }
    Swal.fire({
      title: 'Are you sure want to Submit The Quotation?',
      // text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#063178',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.sendRfpLink();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
      }
    });
  }

  sendRfpLink() {
    if (this.form.invalid) {
      this.displayFormErrors();
      return;
    }
    this.itemDetail.value?.forEach((value: any, index: number) => {
      if (
        Number(value.additional_charges) < 0 ||
        Number(value.delivery_charges) < 0 ||
        Number(value.igst) < 0 ||
        Number(value.price_amt) < 0 ||
        Number(value.totelAmount) < 0
      ) {
        const productName =
          this.itemDetail.at(index).get('product_name')?.value ||
          `Item ${index + 1}`;
        this.toast.error(`${productName}: Negative values are not allowed.`);
        return;
      }
    });

    const formData = new FormData();
    formData.append('type', this.type_pr);
    formData.append('procurement_id', this.details_pr?.id);
    formData.append('vendors', this.vendor_id);
    formData.append('products_amount', this.totalAmountPrice);
    formData.append('vendor_remarks', this.form.get('vendor_remarks')?.value);

    if (this.type_pr == 'Service') {
      this.itemDetail.value.forEach((item: any) => {
        if (item.price_amt == null) {
          return this.toast.warning('Price Amount is Required..');
        }
      });
      let alld = JSON.stringify(this.itemDetail.value);

      formData.append('product_details', alld);
      this.prService.vendorServiceUpdate(this.vendor_id, formData).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.toast.success('Proposal sent successfully');
            this.proposalSubmit();
          }
        },
        (err: any) => {
          this.toast.error('Something Went To Wrong');
          this.sendProposal = false;
        },
      );
    } else if (this.type_pr == 'Bom') {
      formData.append('rfp_number', this.rfpNo);
      formData.append('procurement_id', this.details_pr?.id);
      formData.append('rfp_number', this.rfpNo);
      this.prService.vendorBomUpdate(this.vendor_id, formData).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.toast.success('Proposal sent successfully');
            this.proposalSubmit();
          }
        },
        (err: any) => {
          this.toast.error('Something Went To Wrong');
        },
      );
    } else {
      this.itemDetail.value.forEach((item: any) => {
        if (item.price_amt == null) {
          this.toast.warning('Price Amount is Required..');
          return;
        }
      });

      formData.append('product_details', JSON.stringify(this.itemDetail.value));
      formData.append('rfp_number', this.rfpNo);

      this.prService.updateVendorData(this.vendor_id, formData).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.toast.success('Proposal sent successfully');
            this.proposalSubmit();
          }
        },
        (err: any) => {
          this.toast.error('Something Went To Wrong');
        },
      );
    }
  }

  gstType(control: any, i: number) {
    const data: any = control.parent.controls[i] as FormGroup;
    let item = control.value;
    if (item.gst_Type === 'CGST/SGST') {
      data.get('igst').disable();
      data.get('cgst').enable();
      data.get('sgst').enable();
      //   const amountSgst = (data?.value.price_amt || 0) * (data?.value.sgst || 0) / 100;
      // const totelSgst = (data?.value.price_amt || 0) + amountSgst;

      // const amountCgst = (data?.value.price_amt || 0) * (data?.value.cgst || 0) / 100;

      // const totalCalAmount = (data?.value.product_quantity || 0) * (data?.value.price_amt || 0) +
      //                        (data?.value.delivery_charges || 0) + (data?.value.additional_charges || 0) +
      //                        (amountSgst || 0) + (amountCgst || 0);

      // const calOutGst = (data?.value.price_amt || 0) + (data?.value.delivery_charges || 0) +
      //                   (data?.value.additional_charges || 0);

      // this.totleCgstIgst = totalCalAmount;

      // list.patchValue({
      //     totelAmount: totalCalAmount
      // });
    } else if (item.gst_Type === 'IGST') {
      data.get('cgst').disable();
      data.get('sgst').disable();
      data.get('igst').enable();
    }
  }

  remove(index: number) {
    this.itemDetail.removeAt(index);
  }

  proposalSubmit() {
    if (this.isSubmited) {
      Swal.fire({
        title: 'Your Proposal Already Send..',
        icon: 'success',
        showConfirmButton: false,
        allowOutsideClick: false,
      }).then((result) => {});
    } else {
      Swal.fire({
        title: 'Your Proposal Send Successfully..',
        icon: 'success',
        showConfirmButton: false,
        allowOutsideClick: false,
      }).then((result) => {});
    }
  }

  stopRfp() {
    if (this.stopRfpEnd == 'CLOSE RFP') {
      Swal.fire({
        title: 'Link Expired..',
        icon: 'warning',
        showConfirmButton: false,
        allowOutsideClick: false,
      }).then((result) => {});
    }
  }

  sevralUrl() {
    return environment.servralUrl + '/uploaded_files/';
  }

  openQuestionModal(name: string, i: number): void {
    const rfpArray = this.itemDetail;
    const itemGroup = rfpArray.at(i) as FormGroup;
    const questionFormArray = itemGroup.get('questionForm') as FormArray;

    const dialogRef = this.dialog.open(QuestionDialogAnswerComponent, {
      width: '600px',
      data: { name, questionFormArray, show: true },
    });

    dialogRef.afterClosed().subscribe((result: any[]) => {
      if (result && result.length) {
        result.forEach((res, idx) => {
          const control = questionFormArray.at(idx);
          if (control) {
            control.patchValue({ answer: res.answer });
          }
        });

        rfpArray.at(i).patchValue({
          questionForm: questionFormArray.value,
        });
      }
    });
  }

  onVendorData(data: any) {
    this.vendorData = data;
    console.log(this.vendorData);
  }
}
