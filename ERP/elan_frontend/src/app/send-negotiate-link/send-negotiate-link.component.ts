import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseRequestService } from '../@shared/services/purchase-request.service';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from '../@shared/services/configurationalmaster.service';
import * as moment from 'moment';
import { environment } from '../environments/environment';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { QuestionDialogAnswerComponent } from '../send-rfp/question-dialog-answer/question-dialog-answer.component';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';

@Component({
    selector: 'app-send-negotiate-link',
    templateUrl: './send-negotiate-link.component.html',
    styleUrls: ['./send-negotiate-link.component.scss', '../send-rfp/send-rfp.component.scss']
})
export class SendNegotiateLinkComponent implements OnInit {
    form: FormGroup;
    prData: any;
    currencyData: any[] = [];
    fileView: any[] = [];
    totalAmountPrice: any;
    isSubmited: boolean = false;
    currentDate: Date = new Date();
    nego_id: string = "";
    procurement_type: string = "";
    vendor_id_header: any;
    vendor_id: any;
    nego_status: string = "";
    type_pr: any;
    today: Date = new Date();

    imageToUpload: any;
    imagePath: any;
    editDocData: any;
    noOfVendor: any;
    id: any;
    singlePrData: any;
    sendRfpData: any;
    endData: any;
    role: any;
    totelAmount: any;
    fileBind: string;
    allArrayData: any;
    procureMentId: any;
    procurementItemData: any;
    vendorOtherData: any[] = [];

    startNego: any;
    endNego: any;
    startDate: Date;
    endDate: Date;
    check: any;
    renogtiate: any;
    withoughtChange: any;
    listData: any = [];
    pr_id: any;

    constructor(private route: Router,
        private toast: ToastrService,
        private activeroute: ActivatedRoute,
        public dialog: MatDialog,
        private fb: FormBuilder, private cryptoService: CryptoService,
        private prService: PurchaseRequestService,
        private configurationalMasterService: ConfigurationalmasterService,
    ) {
        this.form = this.fb.group({
            pr_id: [null],
            vendor_remarks: [null],
            negotiation_id: [null],
            item_detail: this.fb.array([]),
        });
    }

    get itemDetail(): FormArray {
        return this.form.get('item_detail') as FormArray;
    }

    addItem(item: any) {
        this.itemDetail.push(this.createItem(item));
        this.calculateGrandTotal();
    }

    createItem(item: any): FormGroup {
        const itemForm = this.fb.group({
            price_amt: [item.price_amt || null, [Validators.required]],
            igst: [item.igst || 0],
            delivery_charges: [item.delivery_charges || 0, [Validators.required]],
            additional_charges: [item.additional_charges || 0, [Validators.required]],
            currency_id: [item?.currency_id || 1],
            item_document: [item.item_document ? (item.item_document.startsWith('http') ? item.item_document : `${environment.servralUrl}/${item.item_document}`) : null],
            product_name: [item.product_name || item.item_name || '-'],
            item_code: [item.item_code || '-'],
            priority: [item.priority || '-'],
            product_quantity: [Number(item.product_quantity || item.quantity) || 0],
            target_amount: [item?.target_amount || item?.target_amount || '-'],
            item_id: [item.item_id],
            totelAmount: [item.grand_total || item.totelAmount || null]
        });
        return itemForm;
    }

    remove(index: number) {
        this.itemDetail.removeAt(index);
        this.calculateGrandTotal();
    }

    keyUpPrice(control: AbstractControl, index: number) {
        this.calculateRow(index);
    }

    currencySele(control: AbstractControl, index: number) {
        this.calculateRow(index);
    }

    openQuestionModal(name: string, i: number): void {
        const rfpArray = this.itemDetail;
        const itemGroup = rfpArray.at(i) as FormGroup;
        const questionFormArray = itemGroup.get('questionForm') as FormArray;

        const dialogRef = this.dialog.open(QuestionDialogAnswerComponent, {
            width: '600px',
            data: { name, questionFormArray, show: true }
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
                    questionForm: questionFormArray.value
                });
            }
        });
    }

    fire() {
        this.onSubmitNegotiate();
    }

    ngOnInit(): void {
        this.activeroute.queryParams.subscribe((params: any) => {
            // this.nego_id = params.nego_id;
            // this.vendor_id = params.vendor_id;
            // this.procurement_type = params?.procurement_type;
            // this.type_pr = params?.procurement_type;
            // this.renogtiate = params?.renego_status;

            this.vendor_id_header = params?.vendor_id;
            this.nego_id = this.cryptoService.decrypt(params.nego_id);
            this.vendor_id = this.cryptoService.decrypt(this.vendor_id_header);
            this.renogtiate = this.cryptoService.decrypt(params.renego_status);
            this.type_pr = this.cryptoService.decrypt(params.procurement_type);
        });
        this.getCurrency();
        if (this.type_pr == "Item") {
            this.getVendorNegotiation();
        } else if (this.type_pr == "Service") {
            this.getByService();
        }
    }

    getVendorNegotiation() {
        const fetchData$ = this.renogtiate === "true"
            ? this.prService.getByRenogatiateItem(this.nego_id, this.renogtiate, this.vendor_id)
            : this.prService.getVendorData(this.nego_id, this.vendor_id);

        fetchData$.subscribe(
            (res: any) => {
                if (res && res.data) {
                    this.vendorOtherData = res.data;
                    this.prData = res.data.prData;
                    this.pr_id = this.prData?.id;
                    const newFileView: any[] = [];

                    this.prData?.PROCUREMENT_PURCHASE_REQUEST_IMAGEs?.forEach((file: any) => {
                        const parts = file?.uploade_image?.split('.');
                        const fileNameWithoutExtension = parts.slice(0, -1).join('.');
                        if (file?.uploade_image) {
                            newFileView.push({ img_name: fileNameWithoutExtension, uploade_image: file?.uploade_image });
                        }
                    });

                    this.fileView = newFileView;
                    const itemData = res.data.itemData;
                    if (itemData && itemData.length > 0) {
                        this.isSubmited = itemData[0].vendor_responded;
                        this.procurementItemData = itemData || [];
                        this.nego_status = itemData[0]?.nego_status || '';
                    }

                    if (this.isSubmited === true) this.proposalSubmit();
                    if (this.nego_status === "CLOSE NEGO") this.checkLinkStatus();

                    this.procurementItemData.forEach((item: any) => {
                        if (item.igst) {
                            item.gst_Type = "IGST";
                        } else if (item.cgst && item.sgst) {
                            item.gst_Type = "CGST + SGST";
                        }
                        this.addItem(item);
                    });

                    this.startNego = this.procurementItemData[0]?.start_date_nego;
                    this.endNego = this.procurementItemData[0]?.end_date_nego;
                    this.checkDateRange();
                }
            },
            (err: HttpErrorResponse) => {
                this.toast.error(err.error.message || "Something Went Wrong");
            }
        );
    }

    getByService() {
        if (this.renogtiate == 'true') {
            this.prService.getByRenogatiateService(this.nego_id, this.renogtiate, this.vendor_id).subscribe((res: any) => {
                console.log(res, 'resss vendor');

                this.procurementItemData = res.data[0]?.PROCUREMENT_PR_REQUEST_SERVICEs;

                console.log(this.procurementItemData, 'this.procurementItemData');
                const newFileView: any[] = [];

                res?.data[0]?.PROCUREMENT_PURCHASE_REQUEST_IMAGEs?.forEach((file: any) => {

                    const parts = file?.uploade_image?.split('.');

                    const fileNameWithoutExtension = parts.slice(0, -1).join('.');
                    if (file?.uploade_image) {
                        newFileView.push({ img_name: fileNameWithoutExtension, uploade_image: file?.uploade_image });
                    }
                });

                console.log(newFileView, 'newFileView');
                this.fileView = newFileView;
                this.vendorOtherData = res.data;
                this.prData = res.data[0];
                this.pr_id = this.prData?.id;
                this.nego_status = res?.data[1]?.nego_status;

                const copyData = [];

                for (let b = 0; b <= this.vendorOtherData.length; b++) {
                    if (this.vendorOtherData[b]?.service_id) {
                        copyData.push(this.vendorOtherData[b])
                    }
                }

                this.isSubmited = copyData[0]?.is_submitted;
                if (this.isSubmited === true) {
                    this.proposalSubmit();
                }
                if (this.nego_status == "CLOSE NEGO") {
                    this.checkLinkStatus();
                }
                const finalVendors = []
                for (let c = 0; c < this.procurementItemData.length; c++) {
                    for (let d = 0; d < copyData.length; d++) {
                        if (this.procurementItemData[c]?.service_master_id === copyData[d]?.service_id) {
                            finalVendors.push({
                                ...this.procurementItemData[c],
                                ...copyData[d]
                            });
                        }
                    }
                }
                console.log(finalVendors, 'finalVendors');


                const newArrayList: any = [];
                const newArraySend: any = [];

                for (let a = 0; a <= finalVendors.length - 1; a++) {

                    let tempList = [...finalVendors];

                    let temp = ""

                    this.currencyData.forEach((value: any) => {
                        if (value.Currency_Convert_id == tempList[a]?.currency_id) {
                            temp = value.Currency_Convert_id
                        }
                    })

                    let newItem: any = {
                        PR_category: tempList[a]?.PR_category,
                        product_name: tempList[a]?.product_name,
                        product_varient: tempList[a]?.product_varient,
                        item_quantity: tempList[a]?.item_quantity,
                        mvp: tempList[a]?.mvp,
                        mvp_product: tempList[a]?.total_mvp,
                        product_quantity: tempList[a]?.product_quantity || tempList[a]?.quantity,
                        item_code: tempList[a]?.MASTER_SERVICE?.service_code,
                        item_document: `${environment.servralUrl + '/' + tempList[a]?.MASTER_SERVICE?.service_document}`,
                        item_name: tempList[a]?.MASTER_SERVICE?.service_name,
                        item_id: tempList[a]?.item_id,
                        priority: tempList[a]?.priority,
                        index: a,
                        price_amt: tempList[a]?.price_amt,
                        gst_Type: tempList[a]?.gst_Type,
                        sgst: tempList[a]?.sgst || null,
                        cgst: tempList[a]?.cgst || null,
                        igst: tempList[a]?.igst || null,
                        delivery_charges: tempList[a]?.delivery_charges,
                        additional_charges: tempList[a]?.additional_charges,
                        currency_id: temp,
                        service_id: tempList[a]?.service_id,
                        target_amount: tempList[a]?.target_amount,
                        start_date_nego: tempList[a]?.start_date_nego,
                        end_date_nego: tempList[a]?.end_date_nego,
                        grand_total: tempList[a]?.grand_total

                    };
                    let newItemSend: any = {

                        price_amt: tempList[a]?.price_amt,
                        gst_Type: tempList[a]?.gst_Type,
                        sgst: tempList[a]?.sgst || null,
                        cgst: tempList[a]?.cgst || null,
                        igst: tempList[a]?.igst || null,
                        delivery_charges: tempList[a]?.delivery_charges,
                        additional_charges: tempList[a]?.additional_charges,
                        currency_id: temp,
                        target_amount: tempList[a]?.target_amount,
                        item_id: Number(tempList[a]?.item_id)

                    }
                    if (tempList[a]?.igst == null) {
                        for (let b = 0; b <= this.currencyData.length; b++) {
                            if (this.currencyData[b]?.Currency_Convert_id === temp) {
                                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.cgst / 100) + (tempList[a]?.price_amt * tempList[a]?.sgst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[a]?.rate);
                            }
                        }
                        // newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.cgst / 100) + (tempList[a]?.price_amt * tempList[a]?.sgst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges;
                    } else if (tempList[a]?.cgst == null) {
                        for (let b = 0; b <= this.currencyData.length; b++) {
                            if (this.currencyData[b]?.Currency_Convert_id === temp) {
                                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.igst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[b]?.rate);
                            }
                        }
                        // newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.igst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges;
                    }

                    if (tempList[a]?.cgst == null) {
                        newItem.gst_Type = "IGST"
                    } else if (tempList[a]?.igst == null) {
                        newItem.gst_Type = "CGST/SGST"
                    }

                    newArrayList.push(newItem);
                    newArraySend.push(newItemSend);
                    this.withoughtChange = newArraySend;
                    this.addItem(newItem);
                }
                this.startNego = res.data[0]?.start_date_nego;
                this.endNego = res.data[0]?.end_date_nego;
                this.checkDateRange();
                for (let i = 0; i < newArrayList.length; i++) {
                    let rate: any = Number(1).toFixed(5)
                    this.currencyData.forEach((value: any) => {
                        if (value.Currency_Convert_id == newArrayList[i].currency_id) {
                            rate = Number(value.rate).toFixed(5);
                        }
                    })
                    this.listData[i] = Number(Number(newArrayList[i].totelAmount) / rate).toFixed(5)
                }
            },
                ((err: any) => {
                    this.toast.error("Something Went To Wrong")
                })
            )
        } else {
            this.prService.getByIdServiceVendor(this.nego_id, this.vendor_id).subscribe((res: any) => {
                console.log(res, 'resss vendor');

                this.procurementItemData = res.data[0]?.PROCUREMENT_PR_REQUEST_SERVICEs;
                const newFileView: any[] = [];

                res?.data[0]?.PROCUREMENT_PURCHASE_REQUEST_IMAGEs?.forEach((file: any) => {

                    const parts = file?.uploade_image?.split('.');

                    const fileNameWithoutExtension = parts.slice(0, -1).join('.');
                    if (file?.uploade_image) {
                        newFileView.push({ img_name: fileNameWithoutExtension, uploade_image: file?.uploade_image });
                    }
                });

                console.log(newFileView, 'newFileView');
                this.fileView = newFileView;
                console.log(this.procurementItemData, 'this.procurementItemData');
                this.vendorOtherData = res.data;
                this.prData = res.data[0];
                this.pr_id = this.prData?.id;
                this.nego_status = res?.data[1]?.nego_status;

                const copyData = [];

                for (let b = 0; b <= this.vendorOtherData.length; b++) {
                    if (this.vendorOtherData[b]?.service_id) {
                        copyData.push(this.vendorOtherData[b])
                    }
                }
                console.log(copyData, ' copyData');
                this.isSubmited = copyData[0]?.is_submitted;
                if (this.isSubmited === true) {
                    this.proposalSubmit();
                }
                if (this.nego_status == "CLOSE NEGO") {
                    this.checkLinkStatus();
                }
                const finalVendors = []
                for (let c = 0; c < this.procurementItemData.length; c++) {
                    for (let d = 0; d < copyData.length; d++) {
                        if (this.procurementItemData[c]?.service_master_id === copyData[d]?.service_id) {
                            finalVendors.push({
                                ...this.procurementItemData[c],
                                ...copyData[d]
                            });
                        }
                    }
                }
                console.log(finalVendors, 'finalVendors');


                const newArrayList: any = [];
                const newArraySend: any = [];

                for (let a = 0; a <= finalVendors.length - 1; a++) {

                    let tempList = [...finalVendors];

                    let temp = ""

                    this.currencyData.forEach((value: any) => {
                        if (value.Currency_Convert_id == tempList[a]?.currency_id) {
                            temp = value.Currency_Convert_id
                        }
                    })

                    let newItem: any = {
                        PR_category: tempList[a]?.PR_category,
                        product_name: tempList[a]?.product_name,
                        product_varient: tempList[a]?.product_varient,
                        item_quantity: tempList[a]?.item_quantity,
                        mvp: tempList[a]?.mvp,
                        mvp_product: tempList[a]?.total_mvp,
                        product_quantity: tempList[a]?.product_quantity || tempList[a]?.quantity,
                        item_code: tempList[a]?.MASTER_SERVICE?.service_code,
                        item_document: `${environment.servralUrl + '/' + tempList[a]?.MASTER_SERVICE?.service_document}`,
                        item_name: tempList[a]?.MASTER_SERVICE?.service_name,
                        item_id: tempList[a]?.item_id,
                        priority: tempList[a]?.priority,
                        index: a,
                        price_amt: tempList[a]?.price_amt,
                        gst_Type: tempList[a]?.gst_Type,
                        sgst: tempList[a]?.sgst || null,
                        cgst: tempList[a]?.cgst || null,
                        igst: tempList[a]?.igst || null,
                        delivery_charges: tempList[a]?.delivery_charges,
                        additional_charges: tempList[a]?.additional_charges,
                        currency_id: temp,
                        service_id: tempList[a]?.service_id,
                        target_amount: tempList[a]?.target_amount,
                        start_date_nego: tempList[a]?.start_date_nego,
                        end_date_nego: tempList[a]?.end_date_nego,
                        grand_total: tempList[a]?.grand_total


                    };
                    let newItemSend: any = {

                        price_amt: tempList[a]?.price_amt,
                        gst_Type: tempList[a]?.gst_Type,
                        sgst: tempList[a]?.sgst || null,
                        cgst: tempList[a]?.cgst || null,
                        igst: tempList[a]?.igst || null,
                        delivery_charges: tempList[a]?.delivery_charges,
                        additional_charges: tempList[a]?.additional_charges,
                        currency_id: temp,
                        target_amount: tempList[a]?.target_amount,
                        item_id: Number(tempList[a]?.item_id),
                        grand_total: tempList[a]?.grand_total


                    }
                    if (tempList[a]?.igst == null) {
                        for (let b = 0; b <= this.currencyData.length; b++) {
                            if (this.currencyData[b]?.Currency_Convert_id === temp) {
                                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.cgst / 100) + (tempList[a]?.price_amt * tempList[a]?.sgst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[b]?.rate);
                            }
                        }
                        // newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.cgst / 100) + (tempList[a]?.price_amt * tempList[a]?.sgst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges;
                    } else if (tempList[a]?.cgst == null) {
                        for (let b = 0; b <= this.currencyData.length; b++) {
                            if (this.currencyData[b]?.Currency_Convert_id === temp) {
                                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.igst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[b]?.rate);
                            }
                        }
                        // newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.igst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges;
                    }

                    if (tempList[a]?.cgst == null) {
                        newItem.gst_Type = "IGST"
                    } else if (tempList[a]?.igst == null) {
                        newItem.gst_Type = "CGST/SGST"
                    }

                    newArrayList.push(newItem);
                    newArraySend.push(newItemSend);
                    this.withoughtChange = newArraySend
                    this.addItem(newItem);
                }
                let totalAmountPrice = 0;
                for (let a = 0; a <= newArrayList.length - 1; a++) {

                    totalAmountPrice += newArrayList[a]?.totelAmount
                }
                this.totalAmountPrice = totalAmountPrice;
                this.startNego = newArrayList[0]?.start_date_nego
                this.endNego = newArrayList[0]?.end_date_nego
                this.checkDateRange();
                for (let i = 0; i < newArrayList.length; i++) {
                    let rate: any = Number(1).toFixed(5)
                    this.currencyData.forEach((value: any) => {
                        if (value.Currency_Convert_id == newArrayList[i].currency_id) {
                            rate = Number(value.rate).toFixed(5);
                        }
                    })
                    this.listData[i] = Number(Number(newArrayList[i]?.totelAmount) / rate).toFixed(5)
                }

            },
                ((err: any) => {
                    this.toast.error("Something Went To Wrong")
                })
            )
        }

    }

    checkDateRange() {
        this.startDate = moment(this.startNego, 'YYYY-MM-DD').startOf('day').toDate();
        this.endDate = moment(this.endNego, 'YYYY-MM-DD').endOf('day').toDate(); // end of same day = 23:59:59
        this.currentDate = moment().toDate(); // current date & time

        if (!this.startDate || !this.endDate || isNaN(this.startDate.getTime()) || isNaN(this.endDate.getTime())) {
            console.warn('Invalid start or end date');
            return;
        }

        const currentTime = this.currentDate.getTime();
        const startTime = this.startDate.getTime();
        const endTime = this.endDate.getTime();

        const isSameDay = startTime === endTime;
        const isTodayOrFuture = startTime >= currentTime;
        const isWithinRange = currentTime >= startTime && currentTime <= endTime;

        if (!isWithinRange && !(isSameDay && isTodayOrFuture)) {
            this.check = true;
            Swal.fire({
                title: `Your Negotiation Link Open Only This Date: ${moment(this.startDate).format("DD-MM-YYYY")} To ${moment(this.endDate).format("DD-MM-YYYY")}`,
                icon: 'warning',
                showConfirmButton: false,
                allowOutsideClick: false
            });
        }
    }

    getCurrentCurrency() {
        const control = this.itemDetail.controls.at(0);
        if (control == null || !this.currencyData || this.currencyData.length === 0) {
            return null;
        }
        return this.currencyData.find((c: any) => c.Currency_Convert_id === control.value?.currency_id);
    }

    getCurrency() {
        this.configurationalMasterService.CurrencyList().subscribe((res: any) => {
            if (res && res.data) {
                this.currencyData = res.data;
            }
        })
    }

    onSubmitNegotiate() {
        Swal.fire({
            title: 'Are you sure want to Submit The Quotation?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#858586',
            confirmButtonColor: '#f44336',
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.value) {
                this.submitQuotation()
            } else if (result.dismiss === Swal.DismissReason.cancel) {

            }
        });
    }

    submitQuotation() {
        if (this.form.invalid) {
            this.toast.error('Required fields should not be empty', 'Fields Error');
            return;
        }

        let flag = false;
        this.itemDetail.value.forEach((value: any) => {
            value.purchase_request_id = this.pr_id;
            if (Number(value.additional_charges) < 0 ||
                Number(value.delivery_charges) < 0 ||
                Number(value.price_amt) < 0 ||
                Number(value.totelAmount) < 0
            ) {
                flag = true;
            }
        })
        if (flag) {
            this.toast.error('Please Enter Valid Amount.');
            return;
        }

        if (this.type_pr == "Service") {
            this.itemDetail.value?.forEach((value: any) => {
                value.purchase_request_id = this.pr_id;
            })
            this.withoughtChange?.forEach((value: any) => {
                value.purchase_request_id = this.pr_id;
            })
            let newData = {
                item_details: this.itemDetail.value || this.withoughtChange,
                is_submitted: true,
                purchase_request_id: this.pr_id
            }
            this.prService.updateNegotiateServiceVendor(this.vendor_id, newData).subscribe((res: any) => {
                this.proposalSubmit();
                this.toast.success("Vendor Negotiate Updated Successfully..")
            },
                ((err: any) => {
                    this.toast.error("Something Went To Wrong")
                })
            )
        } else {
            const newData = {
                procure_id: this.prData?.id,
                item_details: this.itemDetail.value || this.withoughtChange,
                is_submitted: true,
                purchase_request_id: this.pr_id,
                vendor_remarks: this.form.value.vendor_remarks,
                negotiation_id: this.prData?.negotiation_id
            }
            this.prService.updateNegotiateVendor(this.vendor_id, newData).subscribe((res: any) => {
                this.proposalSubmit();
                this.toast.success("Vendor Negotiate Updated Successfully..")
            },
                ((err: any) => {
                    this.toast.error("Something Went To Wrong")
                })
            )
        }
    }

    proposalSubmit() {
        if (this.isSubmited == false) {
            Swal.fire({
                title: "Your Proposal Updated Successfully..",
                icon: 'success',
                showConfirmButton: false,
                allowOutsideClick: false
            }).then((result) => {

            });
        } else {
            Swal.fire({
                title: "Your Proposal Already Sent..",
                icon: 'warning',
                showConfirmButton: false,
                allowOutsideClick: false
            }).then((result) => {
            });
        }
    }

    sevralUrl() {
        return environment.servralUrl + '/uploaded_files/';
    }

    checkLinkStatus() {
        if (this.nego_status == "CLOSE NEGO") {
            Swal.fire({
                title: "Link Expired..",
                icon: 'warning',
                showConfirmButton: false,
                allowOutsideClick: false
            }).then((result) => {
            });
        }
    }

    calculateRow(index: number) {

        const control = this.itemDetail.at(index);
        const item = control.value;

        const qty = Number(item.product_quantity || 0);
        const price = Number(item.price_amt || 0);
        const delivery = Number(item.delivery_charges || 0);
        const additional = Number(item.additional_charges || 0);

        let taxAmount = 0;

        const baseAmount = qty * price;

        if (item.gst_Type === 'CGST/SGST') {

            const cgst = (baseAmount * Number(item.cgst || 0)) / 100;
            const sgst = (baseAmount * Number(item.sgst || 0)) / 100;

            taxAmount = cgst + sgst;

        } else {

            taxAmount = (baseAmount * Number(item.igst || 0)) / 100;

        }

        const total = baseAmount + taxAmount + delivery + additional;

        const currency = this.currencyData.find(
            (c: any) => c.Currency_Convert_id === item.currency_id
        );

        const rate = Number(currency?.rate || 1);

        const convertedTotal = total * rate;

        control.patchValue(
            { totelAmount: convertedTotal.toFixed(2) },
            { emitEvent: false }
        );

        this.calculateGrandTotal();
    }

    calculateGrandTotal() {

        let total = 0;

        this.itemDetail.controls.forEach((ctrl: any) => {

            const val = Number(ctrl.get('totelAmount')?.value || 0);

            total += val;

        });

        this.totalAmountPrice = total.toFixed(2);

    }
}
