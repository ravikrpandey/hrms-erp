import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseRequestService } from '../@shared/services/purchase-request.service';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from '../@shared/services/configurationalmaster.service';
import moment from 'moment';
import { environment } from '../environments/environment';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-send-negotiate-link',
  templateUrl: './send-negotiate-link.component.html',
  styleUrls: ['./send-negotiate-link.component.scss']
})
export class SendNegotiateLinkComponent {
  createPrForm: any;
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
  vendorId: any;
  role: any;
  previousQuoteData: any
  rfp_no: any;
  details_pr: any
  procurement_requests: any;
  sgstDisabled: boolean = false;
  // CF_3: any;
  someCondition: boolean = false;
  totleCgstIgst: any;
  totelIgst: any;
  totelAmount: any;
  totalAmountPrice: any;
  fileBind: string;
  allArrayData: any;
  rfpNo: any;
  vendor_id: any;
  type_pr: any;
  procureMentId: any;
  procurementItemData: any;
  vendorOtherData: any[] = [];
  newModifyItem: any;
  procureType: any;
  startNego: any;
  endNego: any;
  currentDatess: Date;
  startDate: Date;
  endDate: Date;
  check: any;
  is_submitted: any;
  renogtiate: any;
  constructor(private route: Router,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private prService: PurchaseRequestService,
    private configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.createPrForm = this.fb.group({
      name: new FormControl(null),
      department: new FormControl(null),
      emp_id: new FormControl(null),
      alldata: new FormArray([]),
      location: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      pin: new FormControl(null, [Validators.required]),
      end_date: new FormControl(null, [Validators.required]),
      invite_no_vendor: new FormControl(null, [Validators.required]),
      delivery_address: new FormControl(null, [Validators.required]),
      file: new FormControl(null, [Validators.required]),
      vendors: new FormControl(null, [Validators.required]),

      vendor_remarks: new FormControl(null, [Validators.required]),
      vendor_uploaded_document: new FormControl(null, [Validators.required]),

      rfpArray: new FormArray([
        new FormGroup({

          // CF_3: any;
          price_amt: new FormControl(null),
          gst_Type: new FormControl(null),
          sgst: new FormControl(null),
          cgst: new FormControl(null),
          igst: new FormControl(null),
          delivery_charges: new FormControl(null),
          additional_charges: new FormControl(null),
          currency: new FormControl(null),
          totelAmount: new FormControl(null),
          target_amount: new FormControl(null)
        }),
      ]),

    });
    // this.CF_3 = this.fb.group({
    //   rfpArray: this.fb.array([])
    // });

  }
  expirationDate: Date;
  currentDate: Date = new Date();
  linkExpired: boolean = false;
  get rfpArray(): FormArray {
    return this.createPrForm.get('rfpArray') as FormArray;
  }
  get CF_3(): any {
    return this.createPrForm.controls;
  }
  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      console.log(params, 'paramssss');
      this.rfp_no = `${params.Rfp_no},${params.vendor_id}`;
      this.rfpNo = params.nego_id;
      this.vendor_id = params.vendor_id;
      this.type_pr = params.type;
      this.procureMentId = Number(params?.type);
      this.renogtiate=params?.renego_status;
      console.log(this.renogtiate,'this.renogtiate');
      

      this.vendorId = params.vendor_id;
      this.procureType = params?.procurement_type;

      // this.id = params.pr_id;
      // this.role = params.role;
      // let expDate = params.validDate
      // let decode = atob(expDate);
      // this.expirationDate = new Date(decode);
      // this.expirationDate.setHours(23, 59, 59, 59)
      // if (this.currentDate > this.expirationDate) {
      //   this.linkExpired = true
      //   this.toast.error('Link has expired')
      //   this.route.ngOnDestroy();
      //   setTimeout(() => {
      //     window.close();
      //   }, 5000);
      //   return;
      // } else {
      //   this.toast.clear();
      // }
    });

    this.configurationalMasterService.getVendorType().subscribe((params: any) => {
      this.vendorData = params.data;
    });

    this.getCurrency()


    // if (this.id) {
    //   this.prService.getByIdPR(this.id).subscribe((res: any) => {
    //     this.singlePrData = res.data;
    //     this.CF_1['file'].setErrors(null);

    //     this.endData = moment(new Date(this.singlePrData.end_date)).format('LL');
    //     <FormArray>this.CF_1.alldata.push(
    //       new FormGroup({
    //         product_image: new FormControl(this.singlePrData?.product_image),
    //         item_name: new FormControl(this.singlePrData?.item_name),
    //         item_code: new FormControl(this.singlePrData?.item_code),
    //         unit: new FormControl(this.singlePrData?.unit),
    //         priority: new FormControl(this.singlePrData?.priority),
    //         mvp: new FormControl(this.singlePrData?.mvp),
    //       })
    //     );

    //     this.createPrForm.patchValue({
    //       location: this.singlePrData?.location,
    //       state: this.singlePrData?.state,
    //       pin: this.singlePrData?.pin,
    //       city: this.singlePrData?.city,
    //       delivery_address: this.singlePrData?.delivery_address,
    //     });
    //   });
    // }
    // this.getPreviousQuotationDetailsbyVendor()

    if (this.procureType == "Item PR") {
      this.getVendorNegotiation();

    } else if (this.procureType == "Service PR") {
      this.getByService();

    } else if (this.procureType == "BOM PR") {
      this.getByBom();

    }
  }

  // get NegotiateId


  // new start
  initForm() {
    console.log(this.procurement_requests, 'procurement_requests');

    const rfpArray = this.CF_3.get('rfpArray') as FormArray;
    this.procurement_requests?.forEach((item: any) => {
      rfpArray.push(this.createItem(item));
    });

    console.log(rfpArray, 'rfpArrayrfpArrayrfpArray');

  }
  createItem(item: any): FormGroup {
    return this.fb.group({
      item_document: [item.item_document],
      product_name: [item.product_name || item.item_name || "-"],
      item_code: [item.item_code || "-"],
      product_quantity: [item.product_quantity || "-"],
      priority: [item.priority || "-"],
      mvp_product: [item.mvp_product || item.mvp || "-"],
      price_amt: [''],
      gst_Type: [''],
      sgst: [''],
      cgst: [''],
      igst: [''],
      delivery_charges: [''],
      additional_charges: [''],
      currency: [''],
      item_id: [item.item_id],
      index: [item.index],
      totelAmount: [''],
      service_id: [item.service_id]

    });
  }

  // item Nego
  getVendorNegotiation() {

    if(this.renogtiate == "true"){
      this.prService.getByRenogatiateItem(this.rfpNo, this.renogtiate, this.vendor_id).subscribe((res: any) => {
        console.log(res, 'resss vendor');
        // 
        this.procurementItemData = res.data[0]?.procurement_item_requests;
  
        console.log(this.procurementItemData, 'this.procurementItemData');
        this.vendorOtherData = res.data;
        this.details_pr = res.data[0];
        const copyData = [];
  
        for (let b = 0; b <= this.vendorOtherData.length; b++) {
          if (this.vendorOtherData[b]?.item_id) {
            copyData.push(this.vendorOtherData[b])
          }
        }
        console.log(copyData, ' copyData');
        this.is_submitted = copyData[0]?.is_submitted;
        if (this.is_submitted === "true") {
          this.proposalSubmit();
        }
        const finalVendors = []
        for (let c = 0; c < this.procurementItemData.length; c++) {
          for (let d = 0; d < copyData.length; d++) {
            if (this.procurementItemData[c]?.item_id === Number(copyData[d]?.item_id)) {
              finalVendors.push({
                ...this.procurementItemData[c],
                ...copyData[d]
              });
            }
          }
        }
        console.log(finalVendors, 'finalVendors');
  
  
  
        const newArrayList: any = [];
        for (let a = 0; a <= finalVendors.length - 1; a++) {
  
          let tempList = [...finalVendors];
  
          let newItem: any = {
            PR_category: tempList[a]?.PR_category,
            product_name: tempList[a]?.product_name,
            product_varient: tempList[a]?.product_varient,
            item_quantity: tempList[a]?.item_quantity,
            mvp: tempList[a]?.mvp,
            mvp_product: tempList[a]?.mvp_product,
            product_quantity: tempList[a]?.product_quantity || tempList[a]?.item_quantity,
            item_code: tempList[a]?.ItemMaster?.item_code,
            item_document: `${environment.serverUrl + '/' + tempList[a]?.ItemMaster?.item_document}`,
            item_name: tempList[a]?.ItemMaster?.item_name,
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
            currency: tempList[a]?.currency,
            target_amount: tempList[a]?.target_amount,
            start_date_nego: tempList[a]?.start_date_nego,
            end_date_nego: tempList[a]?.end_date_nego
  
          };
          if (tempList[a]?.igst == null) {
            for (let b = 0; b <= this.currencyData.length; b++) {
              if (this.currencyData[b]?.Currency_Type === tempList[a]?.currency) {
                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.cgst / 100) + (tempList[a]?.price_amt * tempList[a]?.sgst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[a]?.rate);
              }
            }
          } else if (tempList[a]?.cgst == null) {
            for (let b = 0; b <= this.currencyData.length; b++) {
              if (this.currencyData[b]?.Currency_Type === tempList[a]?.currency) {
                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.igst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[a]?.rate);
              }
            }
            // newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.igst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges;
          }
  
          if (tempList[a]?.cgst == null) {
            newItem.gst_Type = "IGST"
          } else if (tempList[a]?.igst == null) {
            newItem.gst_Type = "CGST/SGST"
          }
  
          for (let b = 0; b <= this.currencyData.length; b++) {
            if (this.currencyData[a]?.Currency_Type === tempList[a]?.currency) {
  
            }
          }
          newArrayList.push(newItem);
          console.log(finalVendors, 'finalVendors outer');
        }
        console.log(newArrayList, 'newArrayList');
        this.startNego = newArrayList[0]?.start_date_nego
        this.endNego = newArrayList[0]?.end_date_nego
        this.dateExpire()
        this.checkDateRange()
        this.CF_3.rfpArray = this.patchData(newArrayList);
      },
        ((err: any) => {
          this.toast.error("Something To Wrong")
        })
      )
    }else{
      this.prService.getVendorData(this.rfpNo, this.vendor_id).subscribe((res: any) => {
        console.log(res, 'resss vendor');
        // 
        this.procurementItemData = res.data[0]?.procurement_item_requests;
  
        console.log(this.procurementItemData, 'this.procurementItemData');
        this.vendorOtherData = res.data;
        this.details_pr = res.data[0];
        const copyData = [];
  
        for (let b = 0; b <= this.vendorOtherData.length; b++) {
          if (this.vendorOtherData[b]?.item_id) {
            copyData.push(this.vendorOtherData[b])
          }
        }
        console.log(copyData, ' copyData');
        this.is_submitted = copyData[0]?.is_submitted;
        if (this.is_submitted === "true") {
          this.proposalSubmit();
        }
        const finalVendors = []
        for (let c = 0; c < this.procurementItemData.length; c++) {
          for (let d = 0; d < copyData.length; d++) {
            if (this.procurementItemData[c]?.item_id === Number(copyData[d]?.item_id)) {
              finalVendors.push({
                ...this.procurementItemData[c],
                ...copyData[d]
              });
            }
          }
        }
        console.log(finalVendors, 'finalVendors');
  
  
  
        const newArrayList: any = [];
        for (let a = 0; a <= finalVendors.length - 1; a++) {
  
          let tempList = [...finalVendors];
  
          let newItem: any = {
            PR_category: tempList[a]?.PR_category,
            product_name: tempList[a]?.product_name,
            product_varient: tempList[a]?.product_varient,
            item_quantity: tempList[a]?.item_quantity,
            mvp: tempList[a]?.mvp,
            mvp_product: tempList[a]?.mvp_product,
            product_quantity: tempList[a]?.product_quantity || tempList[a]?.item_quantity,
            item_code: tempList[a]?.ItemMaster?.item_code,
            item_document: `${environment.serverUrl + '/' + tempList[a]?.ItemMaster?.item_document}`,
            item_name: tempList[a]?.ItemMaster?.item_name,
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
            currency: tempList[a]?.currency,
            target_amount: tempList[a]?.target_amount,
            start_date_nego: tempList[a]?.start_date_nego,
            end_date_nego: tempList[a]?.end_date_nego
  
          };
          if (tempList[a]?.igst == null) {
            for (let b = 0; b <= this.currencyData.length; b++) {
              if (this.currencyData[b]?.Currency_Type === tempList[a]?.currency) {
                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.cgst / 100) + (tempList[a]?.price_amt * tempList[a]?.sgst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[a]?.rate);
              }
            }
          } else if (tempList[a]?.cgst == null) {
            for (let b = 0; b <= this.currencyData.length; b++) {
              if (this.currencyData[b]?.Currency_Type === tempList[a]?.currency) {
                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.igst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[a]?.rate);
              }
            }
            // newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.igst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges;
          }
  
          if (tempList[a]?.cgst == null) {
            newItem.gst_Type = "IGST"
          } else if (tempList[a]?.igst == null) {
            newItem.gst_Type = "CGST/SGST"
          }
  
          for (let b = 0; b <= this.currencyData.length; b++) {
            if (this.currencyData[a]?.Currency_Type === tempList[a]?.currency) {
  
            }
          }
          newArrayList.push(newItem);
          console.log(finalVendors, 'finalVendors outer');
        }
        console.log(newArrayList, 'newArrayList');
        this.startNego = newArrayList[0]?.start_date_nego
        this.endNego = newArrayList[0]?.end_date_nego
        this.dateExpire()
        this.checkDateRange()
        this.CF_3.rfpArray = this.patchData(newArrayList);
      },
        ((err: any) => {
          this.toast.error("Something To Wrong")
        })
      )
    }
   


  }

  // get By Service Nego;

  getByService() {
    
    

    if(this.renogtiate == 'true'){
      this.prService.getByRenogatiateService(this.rfpNo,this.renogtiate,this.vendor_id).subscribe((res: any) => {
        console.log(res, 'resss vendor');
        // 
        this.procurementItemData = res.data[0]?.procurement_service_requests;
  
        console.log(this.procurementItemData, 'this.procurementItemData');
        this.vendorOtherData = res.data;
        this.details_pr = res.data[0];
        const copyData = [];
  
        for (let b = 0; b <= this.vendorOtherData.length; b++) {
          if (this.vendorOtherData[b]?.service_id) {
            copyData.push(this.vendorOtherData[b])
          }
        }
        console.log(copyData, ' copyData');
        this.is_submitted = copyData[0]?.is_submitted;
        if (this.is_submitted === "true") {
          this.proposalSubmit();
        }
        const finalVendors = []
        for (let c = 0; c < this.procurementItemData.length; c++) {
          for (let d = 0; d < copyData.length; d++) {
            if (this.procurementItemData[c]?.service_id === copyData[d]?.service_id) {
              finalVendors.push({
                ...this.procurementItemData[c],
                ...copyData[d]
              });
            }
          }
        }
        console.log(finalVendors, 'finalVendors');
  
  
  
        const newArrayList: any = [];
        for (let a = 0; a <= finalVendors.length - 1; a++) {
  
          let tempList = [...finalVendors];
  
          let newItem: any = {
            PR_category: tempList[a]?.PR_category,
            product_name: tempList[a]?.product_name,
            product_varient: tempList[a]?.product_varient,
            item_quantity: tempList[a]?.item_quantity,
            mvp: tempList[a]?.mvp,
            mvp_product: tempList[a]?.mvp_product,
            product_quantity: tempList[a]?.product_quantity || tempList[a]?.item_quantity,
            item_code: tempList[a]?.ItemMaster?.item_code,
            item_document: `${environment.serverUrl + '/' + tempList[a]?.ItemMaster?.item_document}`,
            item_name: tempList[a]?.ItemMaster?.item_name,
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
            currency: tempList[a]?.currency,
            service_id: tempList[a]?.service_id,
            target_amount: tempList[a]?.target_amount,
            start_date_nego:tempList[a]?.start_date_nego,
            end_date_nego:tempList[a]?.end_date_nego
  
          };
          if (tempList[a]?.igst == null) {
            for (let b = 0; b <= this.currencyData.length; b++) {
              if (this.currencyData[b]?.Currency_Type === tempList[a]?.currency) {
                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.cgst / 100) + (tempList[a]?.price_amt * tempList[a]?.sgst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[a]?.rate);
              }
            }
            // newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.cgst / 100) + (tempList[a]?.price_amt * tempList[a]?.sgst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges;
          } else if (tempList[a]?.cgst == null) {
            for (let b = 0; b <= this.currencyData.length; b++) {
              if (this.currencyData[b]?.Currency_Type === tempList[a]?.currency) {
                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.igst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[a]?.rate);
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
          console.log(finalVendors, 'finalVendors outer');
        }
        console.log(newArrayList, 'newArrayList');
        this.startNego = newArrayList[0]?.start_date_nego
        this.endNego = newArrayList[0]?.end_date_nego
        this.dateExpire()
        this.checkDateRange()
        this.CF_3.rfpArray = this.patchData(newArrayList);
      },
        ((err: any) => {
          this.toast.error("Something Went To Wrong")
        })
      )
    }else{
      this.prService.getByIdServiceVendor(this.rfpNo, this.vendor_id).subscribe((res: any) => {
        console.log(res, 'resss vendor');
        // 
        this.procurementItemData = res.data[0]?.procurement_service_requests;
  
        console.log(this.procurementItemData, 'this.procurementItemData');
        this.vendorOtherData = res.data;
        this.details_pr = res.data[0];
        const copyData = [];
  
        for (let b = 0; b <= this.vendorOtherData.length; b++) {
          if (this.vendorOtherData[b]?.service_id) {
            copyData.push(this.vendorOtherData[b])
          }
        }
        console.log(copyData, ' copyData');
        this.is_submitted = copyData[0]?.is_submitted;
        if (this.is_submitted === "true") {
          this.proposalSubmit();
        }
        const finalVendors = []
        for (let c = 0; c < this.procurementItemData.length; c++) {
          for (let d = 0; d < copyData.length; d++) {
            if (this.procurementItemData[c]?.service_id === copyData[d]?.service_id) {
              finalVendors.push({
                ...this.procurementItemData[c],
                ...copyData[d]
              });
            }
          }
        }
        console.log(finalVendors, 'finalVendors');
  
  
  
        const newArrayList: any = [];
        for (let a = 0; a <= finalVendors.length - 1; a++) {
  
          let tempList = [...finalVendors];
  
          let newItem: any = {
            PR_category: tempList[a]?.PR_category,
            product_name: tempList[a]?.product_name,
            product_varient: tempList[a]?.product_varient,
            item_quantity: tempList[a]?.item_quantity,
            mvp: tempList[a]?.mvp,
            mvp_product: tempList[a]?.mvp_product,
            product_quantity: tempList[a]?.product_quantity || tempList[a]?.item_quantity,
            item_code: tempList[a]?.ItemMaster?.item_code,
            item_document: `${environment.serverUrl + '/' + tempList[a]?.ItemMaster?.item_document}`,
            item_name: tempList[a]?.ItemMaster?.item_name,
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
            currency: tempList[a]?.currency,
            service_id: tempList[a]?.service_id,
            target_amount: tempList[a]?.target_amount,
            start_date_nego:tempList[a]?.start_date_nego,
            end_date_nego:tempList[a]?.end_date_nego
  
          };
          if (tempList[a]?.igst == null) {
            for (let b = 0; b <= this.currencyData.length; b++) {
              if (this.currencyData[b]?.Currency_Type === tempList[a]?.currency) {
                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.cgst / 100) + (tempList[a]?.price_amt * tempList[a]?.sgst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[a]?.rate);
              }
            }
            // newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.cgst / 100) + (tempList[a]?.price_amt * tempList[a]?.sgst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges;
          } else if (tempList[a]?.cgst == null) {
            for (let b = 0; b <= this.currencyData.length; b++) {
              if (this.currencyData[b]?.Currency_Type === tempList[a]?.currency) {
                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.igst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[a]?.rate);
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
          console.log(finalVendors, 'finalVendors outer');
        }
        console.log(newArrayList, 'newArrayList');
        this.startNego = newArrayList[0]?.start_date_nego
        this.endNego = newArrayList[0]?.end_date_nego
        this.dateExpire()
        this.checkDateRange()
        this.CF_3.rfpArray = this.patchData(newArrayList);
      },
        ((err: any) => {
          this.toast.error("Something Went To Wrong")
        })
      )
    }
    
  }

  // bom by get Nego  
  getByBom() {
    
    
    if(this.renogtiate == 'true'){
      this.prService.getByRenogatiateBom(this.rfpNo,this.renogtiate,this.vendor_id).subscribe((res: any) => {
        console.log(res, 'resss vendor');
        // 
        this.procurementItemData = res.data[0]?.procurement_BomItem_requests;
  
        console.log(this.procurementItemData, 'this.procurementItemData');
        this.vendorOtherData = res.data;
        this.details_pr = res.data[0];
        const copyData = [];
  
        for (let b = 0; b <= this.vendorOtherData.length; b++) {
          if (this.vendorOtherData[b]?.item_id) {
            copyData.push(this.vendorOtherData[b])
          }
        }
        console.log(copyData, ' copyData');
        this.is_submitted = copyData[0]?.is_submitted;
        if (this.is_submitted === "true") {
          this.proposalSubmit();
        }
        const finalVendors = []
        for (let c = 0; c < this.procurementItemData.length; c++) {
          for (let d = 0; d < copyData.length; d++) {
            if (this.procurementItemData[c]?.item_id === Number(copyData[d]?.item_id)) {
              finalVendors.push({
                ...this.procurementItemData[c],
                ...copyData[d]
              });
            }
          }
        }
        console.log(finalVendors, 'finalVendors');
  
  
  
        const newArrayList: any = [];
        for (let a = 0; a <= finalVendors.length - 1; a++) {
  
          let tempList = [...finalVendors];
  
          let newItem: any = {
            PR_category: tempList[a]?.PR_category,
            product_name: tempList[a]?.product_name,
            product_varient: tempList[a]?.product_varient,
            item_quantity: tempList[a]?.item_quantity,
            mvp: tempList[a]?.mvp,
            mvp_product: tempList[a]?.mvp_product,
            product_quantity: tempList[a]?.product_quantity || tempList[a]?.item_quantity,
            item_code: tempList[a]?.ItemMaster?.item_code,
            item_document: `${environment.serverUrl + '/' + tempList[a]?.ItemMaster?.item_document}`,
            item_name: tempList[a]?.product_name,
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
            currency: tempList[a]?.currency,
            service_id: tempList[a]?.service_id,
            target_amount: tempList[a]?.target_amount,
            start_date_nego:tempList[a]?.start_date_nego,
            end_date_nego:tempList[a]?.end_date_nego
  
          };
          if (tempList[a]?.igst == null) {
            for (let b = 0; b <= this.currencyData.length; b++) {
              if (this.currencyData[b]?.Currency_Type === tempList[a]?.currency) {
                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.cgst / 100) + (tempList[a]?.price_amt * tempList[a]?.sgst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[a]?.rate);
              }
            }
            // newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.cgst / 100) + (tempList[a]?.price_amt * tempList[a]?.sgst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges;
          } else if (tempList[a]?.cgst == null) {
            for (let b = 0; b <= this.currencyData.length; b++) {
              if (this.currencyData[b]?.Currency_Type === tempList[a]?.currency) {
                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.igst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[a]?.rate);
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
          console.log(finalVendors, 'finalVendors outer');
        }
        console.log(newArrayList, 'newArrayList');
        this.startNego = newArrayList[0]?.start_date_nego
        this.endNego = newArrayList[0]?.end_date_nego
        this.dateExpire()
        this.checkDateRange()
        this.CF_3.rfpArray = this.patchData(newArrayList);
      },
        ((err: any) => {
          this.toast.error("Something Went To Wrong")
        })
      )
    }else{
      this.prService.getByNegotiateBomVendor(this.rfpNo, this.vendor_id).subscribe((res: any) => {
        console.log(res, 'resss vendor');
        // 
        this.procurementItemData = res.data[0]?.procurement_BomItem_requests;
  
        console.log(this.procurementItemData, 'this.procurementItemData');
        this.vendorOtherData = res.data;
        this.details_pr = res.data[0];
        const copyData = [];
  
        for (let b = 0; b <= this.vendorOtherData.length; b++) {
          if (this.vendorOtherData[b]?.item_id) {
            copyData.push(this.vendorOtherData[b])
          }
        }
        console.log(copyData, ' copyData');
        this.is_submitted = copyData[0]?.is_submitted;
        if (this.is_submitted === "true") {
          this.proposalSubmit();
        }
        const finalVendors = []
        for (let c = 0; c < this.procurementItemData.length; c++) {
          for (let d = 0; d < copyData.length; d++) {
            if (this.procurementItemData[c]?.item_id === Number(copyData[d]?.item_id)) {
              finalVendors.push({
                ...this.procurementItemData[c],
                ...copyData[d]
              });
            }
          }
        }
        console.log(finalVendors, 'finalVendors');
  
  
  
        const newArrayList: any = [];
        for (let a = 0; a <= finalVendors.length - 1; a++) {
  
          let tempList = [...finalVendors];
  
          let newItem: any = {
            PR_category: tempList[a]?.PR_category,
            product_name: tempList[a]?.product_name,
            product_varient: tempList[a]?.product_varient,
            item_quantity: tempList[a]?.item_quantity,
            mvp: tempList[a]?.mvp,
            mvp_product: tempList[a]?.mvp_product,
            product_quantity: tempList[a]?.product_quantity || tempList[a]?.item_quantity,
            item_code: tempList[a]?.ItemMaster?.item_code,
            item_document: `${environment.serverUrl + '/' + tempList[a]?.ItemMaster?.item_document}`,
            item_name: tempList[a]?.product_name,
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
            currency: tempList[a]?.currency,
            service_id: tempList[a]?.service_id,
            target_amount: tempList[a]?.target_amount,
            start_date_nego:tempList[a]?.start_date_nego,
            end_date_nego:tempList[a]?.end_date_nego
  
          };
          if (tempList[a]?.igst == null) {
            for (let b = 0; b <= this.currencyData.length; b++) {
              if (this.currencyData[b]?.Currency_Type === tempList[a]?.currency) {
                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.cgst / 100) + (tempList[a]?.price_amt * tempList[a]?.sgst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[a]?.rate);
              }
            }
            // newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.cgst / 100) + (tempList[a]?.price_amt * tempList[a]?.sgst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges;
          } else if (tempList[a]?.cgst == null) {
            for (let b = 0; b <= this.currencyData.length; b++) {
              if (this.currencyData[b]?.Currency_Type === tempList[a]?.currency) {
                newItem.totelAmount = tempList[a]?.price_amt + (tempList[a]?.price_amt * tempList[a]?.igst / 100) + tempList[a]?.delivery_charges + tempList[a]?.additional_charges + Number(this.currencyData[a]?.rate);
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
          console.log(finalVendors, 'finalVendors outer');
        }
        console.log(newArrayList, 'newArrayList');
        this.startNego = newArrayList[0]?.start_date_nego
        this.endNego = newArrayList[0]?.end_date_nego
        this.dateExpire()
        this.checkDateRange()
        this.CF_3.rfpArray = this.patchData(newArrayList);
      },
        ((err: any) => {
          this.toast.error("Something Went To Wrong")
        })
      )
    }
   
  }

  dateExpire() {
    // 
    console.log(this.startNego,'this.startNego');
    console.log(this.endNego,'this.endNego');

    
    this.startDate = new Date(this.startNego);
    this.endDate = new Date(this.endNego);
    this.currentDatess = new Date();

    let decode = this.startDate.getTime();
    let decode2 = this.endDate.getTime();
    let currentDate = this.currentDatess.getTime()
    // this.star = new Date(decode);
    //     this.end =new Date(decode2)
    this.check = currentDate >= decode && currentDate <= decode2;
    return this.check;


  }

  checkDateRange() {

    if (this.check == false) {
      Swal.fire({
        title: `Your Negotiation Link Open Only This Date: ${moment(this.startDate).format("DD-MM-YYYY")} To ${moment(this.endDate).format("DD-MM-YYYY")}`,
        // text: 'You will not be able to recover this file!',
        icon: 'warning',
        // showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false
        // cancelButtonColor: '#5d6c7c',
        // confirmButtonColor: '#f44336',
        // confirmButtonText: 'Delete!',
        // cancelButtonText: 'Skip',
      }).then((result) => {

      });
    }

  }
  //  item getBy
  getByRfpLink() {
    this.prService.getByRfpLink(this.rfp_no).subscribe((res: any) => {
      console.log(res, 'ressssss');
      // this.details_pr = res.data[0];
      this.procurement_requests = res.data[0]?.procurement_item_requests || res.data[0]?.procurement_service_requests || res.data[0]?.procurement_BomItem_requests;


      console.log(this.procurement_requests, 'this.procurement_requests');
      this.fileBind = `${environment.serverUrl + '/' + this.details_pr?.file}`;
      console.log(this.fileBind, 'this.fileBind');
      const data = [];

      for (let a = 0; a <= this.procurement_requests.length - 1; a++) {

        data.push({
          PR_category: this.procurement_requests[a]?.PR_category,
          product_name: this.procurement_requests[a]?.product_name,
          product_varient: this.procurement_requests[a]?.product_varient,
          item_quantity: this.procurement_requests[a]?.item_quantity,
          mvp: this.procurement_requests[a]?.mvp,
          mvp_product: this.procurement_requests[a]?.mvp_product,
          product_quantity: this.procurement_requests[a]?.product_quantity || this.procurement_requests[a]?.item_quantity,
          item_code: this.procurement_requests[a]?.ItemMaster?.item_code,
          item_document: `${environment.serverUrl + '/' + this.procurement_requests[a]?.ItemMaster?.item_document}`,
          item_name: this.procurement_requests[a]?.ItemMaster?.item_name,
          item_id: this.procurement_requests[a]?.item_id,
          priority: this.procurement_requests[a]?.priority,
          index: a
        }
        )
      }

      console.log(data, 'data patch');
      // this.procurement_requests = data;
      // this.initForm();

    })
  }
  // bom GteBy
  getByBomLink() {
    this.prService.getByRfpBomLink(this.vendor_id, this.rfpNo, this.type_pr).subscribe((res: any) => {
      console.log(res, 'ressssss');
      // this.details_pr = res.data;
      this.procurement_requests = res.data?.procurement_BomItem_requests;

      const data = [];

      for (let a = 0; a <= this.procurement_requests.length - 1; a++) {

        data.push({
          PR_category: this.procurement_requests[a]?.PR_category,
          product_name: this.procurement_requests[a]?.product_name,
          product_varient: this.procurement_requests[a]?.product_varient,
          item_quantity: this.procurement_requests[a]?.item_quantity,
          mvp: this.procurement_requests[a]?.mvp,
          mvp_product: this.procurement_requests[a]?.mvp_product,
          product_quantity: this.procurement_requests[a]?.product_quantity || this.procurement_requests[a]?.item_quantity,
          item_code: this.procurement_requests[a]?.item_code,
          item_document: `${environment.serverUrl + '/' + this.procurement_requests[a]?.ItemMaster?.item_document}`,
          item_name: this.procurement_requests[a]?.ItemMaster?.item_name,
          item_id: this.procurement_requests[a]?.item_id,
          priority: this.procurement_requests[a]?.priority,
          index: a
        })
      }
      console.log(data, 'data patch');
      // console.log(this.CF_3.rfpArray,' this.CF_3.rfpArray ');  

      this.procurement_requests = data;
      //  this.CF_3.rfpArray = data;
      this.initForm();

    },
      ((err: any) => {
        this.toast.error("Something Went To Wrong")
      })
    )
  }
  // service getBy
  getByRfpServiceLink() {
    this.prService.getByRfpServiceLink(this.vendor_id, this.rfpNo, this.type_pr).subscribe((res: any) => {
      console.log(res, 'ressssss');
      this.details_pr = res.data;
      this.procurement_requests = res.data?.procurement_serviceItem_requests;
      console.log(this.procurement_requests, 'this.procurement_requests service');

      const data = [];

      for (let a = 0; a <= this.procurement_requests.length - 1; a++) {
        data.push({
          PR_category: this.procurement_requests[a]?.PR_category,
          product_name: this.procurement_requests[a]?.service_name,
          product_varient: this.procurement_requests[a]?.product_varient,
          item_quantity: this.procurement_requests[a]?.service_quantity,
          mvp: this.procurement_requests[a]?.mvp,
          mvp_product: this.procurement_requests[a]?.mvp_product,
          product_quantity: this.procurement_requests[a]?.service_quantity,
          item_code: this.procurement_requests[a]?.service_code,
          item_document: `${environment.serverUrl + '/' + this.procurement_requests[a]?.service_document}`,
          item_name: this.procurement_requests[a]?.service_name,
          item_id: this.procurement_requests[a]?.service_id,
          priority: this.procurement_requests[a]?.priority,
          index: a
        }
        )
      }

      console.log(data, 'data patch');
      this.procurement_requests = data;
      this.initForm();

    })
  }

  // calculartion items
  keyUpPrice(e: any, dataControl: any, index: any) {
    console.log(e, 'evnt');
    console.log(dataControl, 'datacontrol');
    console.log(index, 'index');

    const control = this.createPrForm?.get('rfpArray') as FormArray;
    console.log(control.value, 'control');
    let list = control.value;

    if (dataControl?.value?.cgst == null) {
      // alert("1");
      for (let a = 0; a <= index; a++) {
        // console.log(list[index].totelAmount = list[index]?.igst,'list[index]?.totelAmount');
        list[index].totelAmount = (list[index]?.price_amt * list[index]?.igst / 100) + list[index]?.delivery_charges + list[index]?.additional_charges;
      }
    } else if (dataControl?.value?.igst == null) {
      // alert("2")
      let cgstAmount = list[index]?.price_amt * list[index]?.cgst / 100;
      let sgstAmount = list[index]?.price_amt * list[index]?.sgst / 100
      list[index].totelAmount = list[index]?.price_amt + cgstAmount + sgstAmount + list[index]?.delivery_charges + list[index]?.additional_charges;


    }
    console.log(list, 'list');
    this.createPrForm.patchValue({
      rfpArray: list,
    })

    // this.newModifyItem=list;

    const updateNewModify = [];
    for (let p = 0; p <= list.length - 1 ; p++) {
      updateNewModify.push({
        price_amt: list[p]?.price_amt,
        gst_Type: list[p]?.gst_Type,
        sgst: list[p]?.sgst,
        cgst: list[p]?.cgst,
        igst: list[p]?.igst,
        delivery_charges: list[p]?.delivery_charges,
        additional_charges: list[p]?.additional_charges,
        currency: list[p]?.currency,
        totelAmount: list[p]?.totelAmount,
        item_id: Number(list[p]?.item_id),
        service_id: list[p]?.service_id
      })
    }
    console.log(updateNewModify, 'updateNewModify');

    this.newModifyItem = updateNewModify;

    // for(let a=0; a<= id; a++){
    //   list[id]?.totelAmount= list[id]?.
    // }

    //  const data: any = control.parent.controls[id] as FormGroup;
    //  let item = control?.value;
    //     if (control?.value.gst_Type == "CGST/SGST") {
    //       let amountSgst = data?.value.price_amt * data?.value.sgst / 100;
    //       let totelSgst = data?.value.price_amt + amountSgst;
    //       // console.log(totelSgst,'totleSgst');

    //       let amountCgst = data?.value.price_amt * data?.value.cgst / 100;
    //       // let totelCgst = amountCgst + totelSgst;
    //       // console.log(totelCgst,'totelCgst');

    //       this.totleCgstIgst = totelSgst + amountCgst + data?.value.delivery_charges + data?.value.additional_charges;

    //       // console.log(this.totleCgstIgst,'totleCgstIgst');
    //     const dataAmount = this.createPrForm?.get('rfpArray') as FormArray;
    // console.log(dataAmount,'dataAmount');

    //       let totalAmountPrice = 0;
    //     for (let a = 0; a <= dataAmount.value.length - 1; a++) {
    //       console.log(dataAmount.value[a], 'control.value[a]');

    //       totalAmountPrice += dataAmount.value[a]?.totelAmount
    //     }
    //     console.log(totalAmountPrice, 'this.totalAmountPrice');
    //     this.totalAmountPrice = totalAmountPrice;

    //     } else {
    //       let amountIgst = data?.value.price_amt * data?.value.igst / 100;
    //       let allAmountIgst = data?.value.price_amt + amountIgst;
    //       console.log(allAmountIgst, 'alligst');

    //       this.totelIgst = allAmountIgst + data?.value.delivery_charges + data?.value.additional_charges;

    //       console.log(this.totelIgst, 'totelIgst');
    //     const dataAmount = this.createPrForm?.get('rfpArray') as FormArray;

    //       let totalAmountPrice = 0;
    //       for (let a = 0; a <= dataAmount.value.length - 1; a++) {
    //         console.log(dataAmount.value[a], 'control.value[a]');

    //         totalAmountPrice += dataAmount.value[a]?.totelAmount
    //       }
    //       console.log(totalAmountPrice, 'this.totalAmountPrice');
    //       this.totalAmountPrice = totalAmountPrice;
    //     }

  }

  currencySele(cur: any, id: any, control: any) {
    console.log(cur, 'currrr');
    console.log(this.totleCgstIgst, 'this.totleCgstIgst');
    console.log(this.totelIgst, 'this.totelIgst');
    console.log(id, 'id', control, "control");
    // const data = this.CF_3.get('rfpArray') as FormArray;
    const data = this.createPrForm?.get('rfpArray') as FormArray;
    console.log(control.value, 'control');
    console.log(control.value, 'control');
    console.log(data, 'data');
    let list = data.at(id);

    if (control.value.gst_Type == "CGST/SGST") {
      const newTotalAmount = this.totleCgstIgst * Number(cur.value.rate);
      list.patchValue({
        totelAmount: newTotalAmount
      })
    } else if (control.value.gst_Type == "IGST") {
      const newTotalAmount = this.totelIgst * Number(cur.value.rate);
      list.patchValue({
        totelAmount: newTotalAmount
      })
    }
    // console.log(newTotalAmount,'newTotalAmount');

    console.log(list, 'list');


    let totalAmountPrice = 0;
    for (let a = 0; a <= data.value.length - 1; a++) {
      console.log(data.value[a], 'control.value[a]');

      totalAmountPrice += data.value[a]?.totelAmount
    }
    console.log(totalAmountPrice, 'this.totalAmountPrice');
    this.totalAmountPrice = totalAmountPrice;

    this.allArrayData = data.value;
    console.log(this.allArrayData, 'this.allArrayData');

    this.allArrayData.map((items: any) => {
      items.currency_type = items?.currency?.Currency_Type
    })

    const editAllData = [];

    for (let a = 0; a <= this.allArrayData.length - 1; a++) {
      editAllData.push({
        price_amt: this.allArrayData[a]?.price_amt,
        sgst: this.allArrayData[a]?.sgst,
        cgst: this.allArrayData[a]?.cgst,
        igst: this.allArrayData[a]?.igst,
        delivery_charges: this.allArrayData[a]?.delivery_charges,
        additional_charges: this.allArrayData[a]?.additional_charges,
        currency: this.allArrayData[a]?.currency_type,
        procurement_service_id: this.allArrayData[a]?.item_id,
        //  vendor_uploaded_docthis.allArrayData[a]?.price_amtment: vendor_uploaded,
        procurement_product_id: this.allArrayData[a]?.item_id
      })
    }
    console.log(editAllData, 'editAllData');
    this.allArrayData = editAllData
  }
  getPreviousQuotationDetailsbyVendor() {
    this.prService.getPreviousQuotationDetails(this.id, this.vendorId).subscribe((res: any) => {
      console.log(res, 'Resssssssssssssssss');
      if (res && res.data) {
        this.previousQuoteData = res.data
      }
    }, (err => {
      this.toast.error(err)
    }))
  }

  get CF_1(): any {
    return this.createPrForm.controls;
  }

  getCurrency() {
    this.configurationalMasterService.CurrencyList().subscribe((res: any) => {
      this.currencyData = res.data;
    })
  }
  deleteRow(i: number) {
    <FormArray>this.CF_1.alldata.removeAt(i);
  }

  onChange(e: any) {


    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;


      };
      reader.readAsDataURL(this.imageToUpload);
    }

  }


  seePreview(path: string, imagePath: any) {
    if (!this.imagePath) {
      if (path) {
        Swal.fire({
          imageUrl: path,
          imageHeight: 250,
          imageAlt: 'Uploaded Document',
          confirmButtonColor: "#5d6c7c",
          confirmButtonText: 'Ok',
        })
      }
    } else {
      Swal.fire({
        imageUrl: imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: "#5d6c7c",
        confirmButtonText: 'Ok',
      })
    }
  };

  onVendorChange(e: any) {
    this.noOfVendor = e.value;

    this.createPrForm.controls['invite_no_vendor'].patchValue(this.noOfVendor.length)

  }
  fireNegotiate() {
    Swal.fire({
      title: 'Are you sure want to Submit The Quotation?',
      // text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#5d6c7c',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.sendRfpLink()
      } 
      // else if (result.dismiss === Swal.DismissReason.cancel as any) {
      //   // Swal.fire(
      //   //   'Cancelled',
      //   //   'Your imaginary file is safe :)',
      //   //   'error'
      //   // )
      // }
    });
  }

  sendRfpLink() {

    // if (this.createPrForm.invalid) {
    //   this.toast.error('Required fields should not be empty', 'Fields Error');

    //   return;
    // }

    let val = this.createPrForm.value;
    const data: any = {
      price_amt: Number(val.price_amt),
      additional_charges: Number(val.additional_charges),
      cgst: Number(val.cgst),
      sgst: Number(val.sgst),
      igst: Number(val.igst),
      delivery_charges: Number(val.delivery_charges),
    }
    console.log(this.allArrayData, 'this.allArrayData');


    if (this.procureType == "Service PR") {
      let newData = {
        procure_id: this.details_pr?.procurement_id,
        item_details: this.newModifyItem,
        is_submitted: "true"
      }
      console.log(newData, 'newData');
      this.prService.updateNegotiateServiceVendor(this.vendorId, newData).subscribe((res: any) => {
        console.log(res, 'resss');
        this.proposalSubmit();
        this.toast.success("Vendor Negotiate Updated Successfully..")
      },
        ((err: any) => {
          this.toast.error("Something Went To Wrong")
        })
      )
    } else if (this.procureType == "BOM PR") {
      let newData = {
        procure_id: this.details_pr?.procurement_id,
        item_details: this.newModifyItem,
        is_submitted: "true"
      }
      console.log(newData, 'newData');
      this.prService.updateNegotiateBomVenfor(this.vendorId, newData).subscribe((res: any) => {
        console.log(res, 'resss');
        this.proposalSubmit();

        this.toast.success("Vendor Negotiate Updated Successfully..")
      },
        ((err: any) => {
          this.toast.error("Something Went To Wrong")
        })
      )
    } else {
      let newData = {
        procure_id: this.details_pr?.procurement_id,
        item_details: this.newModifyItem,
        is_submitted: "true"
      }
      console.log(newData, 'newData');
      this.prService.updateNegotiateVendor(this.vendorId, newData).subscribe((res: any) => {
        console.log(res, 'resss');
        this.proposalSubmit();

        this.toast.success("Vendor Negotiate Updated Successfully..")
      },
        ((err: any) => {
          this.toast.error("Something Went To Wrong")
        })
      )
    }





    // let formData = new FormData();
    // formData.append("procurement_id", this.details_pr?.procurement_id);
    // formData.append("vendors", this.vendor_id);
    // formData.append("rfp_number", this.rfpNo);
    // formData.append("type", this.type_pr);
    // let alld = JSON.stringify(this.allArrayData);
    // console.log(alld, 'alldalld');
    // formData.append("product_details", alld);
    // formData.append("products_amount", this.totalAmountPrice);



    // if (this.type_pr == 'Service') {
    //   this.prService.vendorServiceUpdate(this.vendorId, formData).subscribe((res: any) => {
    //     if (res.code == 200) {
    //       this.toast.success('Proposal sent successfully');
    //       this.route.navigate(['master/itticket/purchase-inventory/rfp/live-rfp',]);
    //     }
    //   },
    //     ((err: any) => {
    //       this.toast.error("Something Went To Wrong")
    //     })
    //   )
    // } else if (this.type_pr == 'Bom') {
    //   formData.append("rfp_number", this.rfpNo);
    //   formData.append("procurement_id", this.details_pr?.procurement_id);
    //   formData.append("rfp_number", this.rfpNo);
    //   this.prService.vendorBomUpdate(this.vendorId, formData).subscribe((res: any) => {
    //     if (res.code == 200) {
    //       this.toast.success('Proposal sent successfully');
    //       this.route.navigate(['master/itticket/purchase-inventory/rfp/live-rfp',]);
    //     }
    //   },
    //     ((err: any) => {
    //       this.toast.error("Something Went To Wrong")
    //     })
    //   )
    // } else {
    //   formData.append("rfp_number", this.rfpNo);
    //   formData.append("procurement_id", this.details_pr?.procurement_id);
    //   formData.append("rfp_number", this.rfpNo);

    //   this.prService.updateVendorData(this.vendorId, formData).subscribe((res: any) => {
    //     if (res.code == 200) {
    //       this.toast.success('Proposal sent successfully');
    //       this.route.navigate(['master/itticket/purchase-inventory/rfp/live-rfp',]);
    //     }
    //   },
    //     ((err: any) => {
    //       this.toast.error("Something Went To Wrong")
    //     })
    //   )
    // }



  }

  getType(event: any) {
    console.log(event, 'event');

  }
  gstType(control: any, i: number) {
    console.log(control, 'control');
    console.log(i, 'ii');

    const data: any = control?.parent.controls[i] as FormGroup;
    console.log(data, 'dataaa');
    let item = control.value
    this.cleanInput(i);
    if (item.gst_Type === "CGST/SGST") {
      data.get('igst').disable();
      data.get('cgst').enable();
      data.get('sgst').enable();
    } else if (item.gst_Type === "IGST") {
      data.get('cgst').disable();
      data.get('sgst').disable();
      data.get('igst').enable();

    }
  }

  remove(i: any) {
    this.cleanInput(i);
    this.CF_3.get('igst')?.reset();
    const data = this.CF_3.get('rfpArray') as FormArray;
    const item = data.at(i);
    const price: any = item.get('price_amt');
    const gstType: any = item.get('gst_Type');
    price.setValue(null);
    gstType.setValue(null);
    let totalAmountPrice = 0;
    for (let a = 0; a <= data.value.length - 1; a++) {
      console.log(data.value[a], 'control.value[a]');

      totalAmountPrice += data.value[a]?.totelAmount
    }
    console.log(totalAmountPrice, 'this.totalAmountPrice');
    this.totalAmountPrice = totalAmountPrice
  }
  cleanInput(i: any) {
    // this.CF_3.get('igst')?.reset();
    // const data = this.CF_3.get('rfpArray') as FormArray;
    // const item = data.at(i);
    // const igstControl: any = item.get('igst');
    // const cgstControl: any = item.get('cgst');
    // const sgstControl: any = item.get('sgst');
    // const deleveryCharge: any = item.get('delivery_charges');
    // const aditionalCharge: any = item.get('additional_charges');
    // const currency: any = item.get('currency');
    // const totalAmount: any = item.get('totelAmount');


    // igstControl.setValue(null);
    // cgstControl.setValue(null);
    // sgstControl.setValue(null);
    // deleveryCharge.setValue(null);
    // aditionalCharge.setValue(null);
    // currency.setValue(null);
    // totalAmount.setValue(null);
  }
  getGstTypeControl(i: number) {
    console.log(i, 'iiii');

    return this.createPrForm.get('rfpArray')?.at(i)?.get('gst_Type');
  }
  disableFields(itemId: any, index: any) {
    console.log(itemId, 'item id');
    console.log(index, 'index');

    //   const igstValue = this.createPrForm.get('igst')?.value;
    //   const sgstValue = this.createPrForm.get('sgst')?.value;
    //   const cgstValue = this.createPrForm.get('cgst')?.value;
    // console.log(igstValue,'igstValue');
    // console.log(sgstValue,'sgstValue');
    // console.log(cgstValue,'cgstValue');
    //  
    const control = this.createPrForm?.get('rfpArray') as FormArray;
    console.log(control, 'control');
    if (control.value[0]?.igst) {

    }

  }
  isCGST_SGST(i: number): boolean {
    console.log(i, 'iii cgst');

    const control = this.createPrForm.get('rfpArray')?.at(i)?.get('gst_Type');
    console.log(control, 'control cgst');

    return control?.value === 'CGST/SGST';
  }

  isIGST(i: number): boolean {
    console.log(i, 'igst');

    const control = this.createPrForm.get('rfpArray')?.at(i)?.get('gst_Type');
    console.log(control, 'control igst');

    return control?.value === 'IGST';
  }
  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any) => {
        const obj = new FormGroup({});
        Object.keys(x).forEach((k) => {
          obj.addControl(k, new FormControl(x[k]));
        });
        return obj;
      })
    );
  };

  proposalSubmit() {
    if (this.is_submitted == true) {
      Swal.fire({
        title: "Your Proposal Updated Successfully..",
        // text: 'You will not be able to recover this file!',
        icon: 'warning',
        // showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false
        // cancelButtonColor: '#5d6c7c',
        // confirmButtonColor: '#f44336',
        // confirmButtonText: 'Delete!',
        // cancelButtonText: 'Skip',
      }).then((result) => {

      });
    } else {
      Swal.fire({
        title: "Your Proposal Already Send..",
        // text: 'You will not be able to recover this file!',
        icon: 'warning',
        // showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false
        // cancelButtonColor: '#5d6c7c',
        // confirmButtonColor: '#f44336',
        // confirmButtonText: 'Delete!',
        // cancelButtonText: 'Skip',
      }).then((result) => {

      });
    }
}

isFieldDisabled(control:any, fieldName:any) {
  console.log(control,"control input");
  console.log(fieldName,'fieldName');
  
  const gstType = control.get('gst_Type').value;
  if (gstType === 'IGST' && (fieldName === 'sgst' || fieldName === 'cgst')) {
    return true;
  }
  if (gstType === 'CGST/SGST' && fieldName === 'igst') {
    return true;
  }
  return false;
}
}
