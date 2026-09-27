import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rfp-details',
  templateUrl: './rfp-details.component.html',
  styleUrls: ['./rfp-details.component.scss']
})
export class RfpDetailsComponent {
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
  role: any;
  previousQuoteData: any
  rfp_no: any;
  details_pr: any
  procurement_requests: any;
  sgstDisabled: boolean = false;
  CF_3: any;
  someCondition: boolean = false;
  totleCgstIgst: any = [];
  totelIgst: any = [];
  totelAmount: any;
  totalAmountPrice: any;
  fileBind: string;
  allArrayData: any;
  rfpNo: any;
  vendor_id: any;
  type_pr: any;
  startDate: Date;
  endDate: Date;
  alertActive: boolean = false;
  star: Date;
  end: Date;
  currentDatess: Date;
  check: any;
  sendProposal: boolean;
  isSubmited: any;
  stopRfpEnd: any;
  fileView: any;
  curncyMZN: any;
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

    });
    this.CF_3 = this.fb.group({
      rfpArray: this.fb.array([])
    });

  }
  expirationDate: Date;
  currentDate: Date = new Date();
  linkExpired: boolean = false;
  get rfpArray(): FormArray {
    return this.createPrForm.get('rfpArray') as FormArray;
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      
      console.log(params, 'paramssss');
      this.rfp_no = params.Rfp_Number;
      this.rfpNo = params.Rfp_Number;
      this.type_pr=params.type;
      const storedData = localStorage.getItem('signInUser') ?? "{}";
    const userDetails = JSON.parse(storedData);
    if (userDetails ) {
      this.vendor_id = userDetails.id;
    }

      if (params.type == "Bom") {
        this.getByBomLink();
      } else if (params.type == "Service") {
        this.getByRfpServiceLink();
      }
      else {
        this.getByRfpLink();
      }

    });

    this.getCurrency()


    const control = this.createPrForm?.get('rfpArray') as FormArray;
    console.log(control, 'control data');
  }

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
    console.log(item,'item<<<<<<<<<<<<<');

    return this.fb.group({
      item_document: [item.item_document],
      product_name: [item.product_name || item.item_name || "-"],
      item_code: [item.item_code || "-"],
      product_quantity: [item.product_quantity || "-"],
      priority: [item.priority || "-"],
      mvp_product: [item.mvp_product || item.mvp || "-"],
      price_amt: [null],
      gst_Type: [''],
      sgst: [''],
      cgst: [''],
      igst: [''],
      delivery_charges: [''],
      additional_charges: [''],
      currency_id: [1],
      item_id: [item.item_id],
      index: [item.index],
      totelAmount: [null],
      calOutGst:['']

    });
  }


  //  item getBy
  getByRfpLink() {
    this.prService.getByRfpLink(this.vendor_id, this.rfpNo, this.type_pr).subscribe((res: any) => {
      console.log(res, 'ressssss');
      this.details_pr = res.data;
      this.procurement_requests = res.data?.procurement_Item_requests;
      const newFileView: any[] = [];

   res?.data?.PROCUREMENT_PURCHASE_REQUEST_IMAGEs?.forEach((file: any) => {
    if (!file?.uploade_image) {
      return; // Skip this iteration
    }
    const parts = file?.uploade_image?.split('.');

    const fileNameWithoutExtension = parts.slice(0, -1).join('.');

    newFileView.push({ img_name: fileNameWithoutExtension, uploade_image: file?.uploade_image });
  });

  console.log(newFileView, 'newFileView');
  this.fileView = newFileView;
      console.log(this.procurement_requests, 'this.procurement_requests');
      this.fileBind =  this.details_pr?.file || null;
      console.log(this.fileBind, 'this.fileBind');
      this.isSubmited=res?.item_Data.is_submitted;
      this.stopRfpEnd=res?.item_Data?.rfp_status;
      this.dateExpire()
      this.checkDateRange()
      const data = [];
      console.log(this.curncyMZN,'this.curncyMZN==========');


      for (let a = 0; a <= this.procurement_requests.length - 1; a++) {

        data.push({
          PR_category: this.procurement_requests[a]?.PR_category,
          product_name: this.procurement_requests[a]?.product_name || this.procurement_requests[a]?.item_name,
          product_varient: this.procurement_requests[a]?.product_varient,
          item_quantity: this.procurement_requests[a]?.item_quantity,
          mvp: this.procurement_requests[a]?.mvp,
          mvp_product: this.procurement_requests[a]?.mvp_product,
          product_quantity: Number(this.procurement_requests[a]?.quantity),
          item_code: this.procurement_requests[a]?.item_code,
          item_document: `${environment.servralUrl + '/' + this.procurement_requests[a]?.item_document}`,
          item_name: this.procurement_requests[a]?.ItemMaster?.item_name,
          item_id: this.procurement_requests[a]?.item_id,
          priority: this.procurement_requests[a]?.priority,
          currency_id:1,
          index: a
        }
        )
      }

      console.log(data, 'data patch');
      this.procurement_requests = data;
      this.initForm();

    })
  }
  // bom GteBy
  getByBomLink() {
    this.prService.getByRfpBomLink(this.vendor_id, this.rfpNo, this.type_pr).subscribe((res: any) => {
      console.log(res, 'ressssss');
      this.details_pr = res.data;
      this.procurement_requests = res.data?.procurement_BomItem_requests;
      this.isSubmited=res?.vendor_data?.is_submitted;


      this.dateExpire()
      this.checkDateRange()
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
          item_document: `${environment.servralUrl + '/' + this.procurement_requests[a]?.item_document}`,
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
      const newFileView: any[] = [];

   res?.data?.PROCUREMENT_PURCHASE_REQUEST_IMAGEs?.forEach((file: any) => {

    const parts = file?.uploade_image?.split('.');

    const fileNameWithoutExtension = parts.slice(0, -1).join('.');

    newFileView.push({ img_name: fileNameWithoutExtension, uploade_image: file?.uploade_image });
  });

  console.log(newFileView, 'newFileView');
  this.fileView = newFileView;
      console.log(this.procurement_requests, 'this.procurement_requests service');
      this.isSubmited=res?.serviceData?.is_submitted;
      this.fileBind =  this.details_pr?.file || null;

      this.stopRfpEnd=res?.serviceData?.rfp_status;
      this.dateExpire()
      this.checkDateRange()

      const data = [];
      for (let a = 0; a <= this.procurement_requests.length - 1; a++) {
        data.push({
          PR_category: this.procurement_requests[a]?.PR_category,
          product_name: this.procurement_requests[a]?.service_name,
          product_varient: this.procurement_requests[a]?.product_varient,
          item_quantity: this.procurement_requests[a]?.service_quantity,
          mvp: this.procurement_requests[a]?.mvp,
          mvp_product: this.procurement_requests[a]?.mvp_product,
          product_quantity: Number(this.procurement_requests[a]?.quantity),
          item_code: this.procurement_requests[a]?.service_code,
          item_document: `${environment.servralUrl + '/' + this.procurement_requests[a]?.service_document}`,
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
    },
    ((error:any)=>{
      console.log(error,'errr');

      this.toast.error(`${error?.error?.message}`)
    })
    )
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

    this.check = currentTimestamp >= startTimestamp && currentTimestamp <= endTimestamp;
    return this.check;


  }

  checkDateRange() {

    if (this.check == false) {
      Swal.fire({
        title: `Your RFP Link Open Only This Date: ${moment(this.startDate).format("DD-MM-YYYY")} To ${moment(this.endDate).format("DD-MM-YYYY")}`,
        // text: 'You will not be able to recover this file!',
        icon: 'warning',
        // showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false
        // cancelButtonColor: '#063178',
        // confirmButtonColor: '#f44336',
        // confirmButtonText: 'Delete!',
        // cancelButtonText: 'Skip',
      }).then((result) => {

      });
    }

  }

  findCurrency(id : any ) {
    let i = 0
    this.currencyData.forEach((value:any,j:any) => {
      if ( value.Currency_Convert_id == id ) {
        i = j;
      }
    })
    return this.currencyData[i];
  }
  // calculartion items
  keyUpPrice(control: any, id: any) {
    console.log(control?.value, 'controlll');
    console.log(id, 'iddd');
    const data: any = control.parent.controls[id] as FormGroup;
    console.log(data, 'dataaa');
    let curr = this.findCurrency(data?.value?.currency_id)
    let item = control?.value;
    const rfpData = this.CF_3?.get('rfpArray') as FormArray;
    let list =rfpData.at(id)
    if (control?.value.gst_Type == "CGST/SGST") {

 const totleChangeSgst =(data?.value.product_quantity || 0) * (data?.value.price_amt || 0)
    const amountSgst = (totleChangeSgst || 0) * (data?.value.sgst || 0) / 100;
    // const totelSgst = (data?.value.price_amt || 0) + amountSgst;

    const amountCgst = (totleChangeSgst || 0) * (data?.value.cgst || 0) / 100;

  console.log(Number(curr?.rate),'Number(data?.value?.currency?.rate');

    const totalCalAmount = (data?.value.product_quantity || 0) * (data?.value.price_amt || 0) +
                           (data?.value.delivery_charges || 0) + (data?.value.additional_charges || 0) +
                           (amountSgst || 0) + (amountCgst || 0);


    const calOutGst = (data?.value.price_amt || 0) + (data?.value.delivery_charges || 0) +
                      (data?.value.additional_charges || 0);
console.log(totalCalAmount,'totalCalAmount<<<<<<<<<');
console.log(totalCalAmount * Number(curr?.rate),"totalCalAmount");
const finalCalculate=totalCalAmount * Number(curr?.rate)
    this.totleCgstIgst[id] = totalCalAmount;

    list.patchValue({
        totelAmount:finalCalculate.toFixed(2)
    });
    } else {
 const totleChangeSgst =(data?.value.product_quantity || 0) * (data?.value.price_amt || 0)

      const amountIgst = (totleChangeSgst || 0) * (data?.value.igst || 0) / 100;

      const allAmountIgst = (data?.value.price_amt || 0) + amountIgst;

      const totalAmountPrice = (data?.value.product_quantity || 0) * (data?.value.price_amt || 0) +
                              ((data?.value.delivery_charges || 0) + (data?.value.additional_charges || 0) +
                              (amountIgst || 0));
const finalCalculate=totalAmountPrice * Number(curr?.rate)

  this.totelIgst[id] =totalAmountPrice

      list.patchValue({
          totelAmount: finalCalculate.toFixed(2)
      });
    }
    console.log(list, 'list<<<<<<<<');

    const data2 = this.CF_3?.get('rfpArray') as FormArray;
    console.log(control.value, 'control1');
    console.log(data2, 'data');

    let totalAmountPrice = 0;
    for (let a = 0; a <= data2.value.length - 1; a++) {
      console.log(data2.value[a], 'control.value[a]');

      totalAmountPrice += Number(data2.value[a]?.totelAmount)
    }
    console.log(totalAmountPrice, 'this.totalAmountPrice');
    this.totalAmountPrice = totalAmountPrice.toFixed(2);
    this.currencySele({value:curr.Currency_Convert_id},id,control)
    // this.allArrayData[id] = data2.value;
  }

  currencySele(cur: any, id: any, control: any) {
    let obj:any = {value:null}
    this.currencyData.forEach((value:any) => {
      if ( value.Currency_Convert_id == cur.value ) {
        obj.value = value;
      }
    })
    ;
    console.log(cur, 'currrr');
    cur = obj;
    ;
    console.log(this.totleCgstIgst, 'this.totleCgstIgst');
    console.log(this.totelIgst, 'this.totelIgst');
    console.log(id, 'id', control, "control");
    const data = this.CF_3?.get('rfpArray') as FormArray;
    console.log(control.value, 'control');
    console.log(data, '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    let list = data.at(id);

    if (control.value.gst_Type == "CGST/SGST") {
      const newTotalAmount = this.totleCgstIgst[id] * Number(obj?.value?.rate);
      list.patchValue({
        totelAmount: newTotalAmount.toFixed(2)
      })
    } else if (control.value.gst_Type == "IGST") {
      const newTotalAmount = this.totelIgst[id] * Number(obj?.value?.rate);
      list.patchValue({
        totelAmount: newTotalAmount.toFixed(2)
      })
    }
    // console.log(newTotalAmount,'newTotalAmount');

    console.log(list, 'list');


    let totalAmountPrice = 0;

    for (let a = 0; a <= data.value.length - 1; a++) {
      console.log(data.value[a], 'control.value[a]');

      totalAmountPrice += Number(data.value[a]?.totelAmount)
    }
    console.log(totalAmountPrice, 'this.totalAmountPrice');
    this.totalAmountPrice = totalAmountPrice.toFixed(2);

    this.allArrayData = data.value;
    console.log(this.allArrayData, 'this.allArrayData');

    this.allArrayData.map((items: any) => {
      items.currency_id = items?.currency_id
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
        currency_id: this.allArrayData[a]?.currency_id,
        procurement_service_id: this.allArrayData[a]?.item_id,
        //  vendor_uploaded_docthis.allArrayData[a]?.price_amtment: vendor_uploaded,
        procurement_product_id: this.allArrayData[a]?.item_id,
        totelAmount:this.allArrayData[a]?.totelAmount,
      })
    }
    console.log(editAllData, 'editAllData');
    this.allArrayData = editAllData
  }

  get CF_1(): any {
    return this.createPrForm.controls;
  }

  getCurrency() {
    this.configurationalMasterService.CurrencyList().subscribe((res: any) => {
      this.currencyData = res.data;
      res.data?.forEach((cur:any)=>{
        if(cur?.Currency_Type === 'MZN'){
         this.curncyMZN=cur

        }

      })
      console.log(this.currencyData,'this.curncyMZN=');

    })
  }
  deleteRow(i: number) {
    <FormArray>this.CF_1.alldata.removeAt(i);
  }

 seePreview(path: string, imagePath: any) {
    if (!this.imagePath) {
      if (path) {
        Swal.fire({
          imageUrl: path,
          imageHeight: 250,
          imageAlt: 'Uploaded Document',
          confirmButtonColor: "#063178",
          confirmButtonText: 'Ok',
        })
      }
    } else {
      Swal.fire({
        imageUrl: imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: "#063178",
        confirmButtonText: 'Ok',
      })
    }
  };

  onVendorChange(e: any) {
    this.noOfVendor = e.value;

    this.createPrForm.controls['invite_no_vendor'].patchValue(this.noOfVendor.length)

  }

  fire() {
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
        this.sendRfpLink()
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

    this.allArrayData.forEach((value:any) => {
      if ( Number(value.additional_charges) < 0 || Number(value.cgst) < 0 || Number(value.delivery_charges) < 0 || Number(value.igst) < 0 || Number(value.price_amt) < 0 || Number(value.sgst) < 0 || Number(value.totelAmount) < 0 ) {
        this.toast.error('Form fields are invalid.', );
        return;
      }
    })
    if(this.allArrayData == undefined){
      return this.toast.warning("Pls Filed The Quotation")
    }
    let val = this.createPrForm.value;
    const data: any = {
      price_amt: Number(val.price_amt),
      additional_charges: Number(val.additional_charges),
      cgst: Number(val.cgst),
      sgst: Number(val.sgst),
      igst: Number(val.igst),
      delivery_charges: Number(val.delivery_charges),
    }

    let formData = new FormData();
    formData.append("procurement_id", this.details_pr?.id);
    formData.append("vendors", this.vendor_id);
    formData.append("rfp_number", this.rfpNo);
    formData.append("type", this.type_pr);

    formData.append("products_amount", this.totalAmountPrice);
    formData.append("is_submitted", 'TRUE');


    if (this.type_pr == 'Service') {
      this.allArrayData.forEach((item:any)=>{
        if(item.price_amt==null){
          return this.toast.warning("Price Amount is Required..")
      }
      console.log(item?.price_amt,'item?.list');

      })
      let alld = JSON.stringify(this.allArrayData);
    console.log(alld, 'alldalld');
    formData.append("product_details", alld);
      this.prService.vendorServiceUpdate(this.vendor_id, formData).subscribe((res: any) => {
        if (res.code == 200) {
          this.toast.success('Proposal sent successfully');
          window.history.back()
        }
      },
        ((err: any) => {
          this.toast.error("Something Went To Wrong")
          this.sendProposal = false;
        })
      )
    } else if (this.type_pr == 'Bom') {
      formData.append("rfp_number", this.rfpNo);
      formData.append("procurement_id", this.details_pr?.id);
      formData.append("rfp_number", this.rfpNo);
      this.prService.vendorBomUpdate(this.vendor_id, formData).subscribe((res: any) => {
        if (res.code == 200) {
          this.toast.success('Proposal sent successfully');
          window.history.back()
       }
      },
        ((err: any) => {
          this.toast.error("Something Went To Wrong")
        })
      )
    } else {

      let hasNullPriceAmt = false;
      ;
      this.allArrayData.forEach((item:any)=>{
        if(item.price_amt==null){
           this.toast.warning("Price Amount is Required..")
          hasNullPriceAmt = true;
      }
     console.log(item?.price_amt,'item?.list');

      })
      if(hasNullPriceAmt){
        return;
      }
      let alld = JSON.stringify(this.allArrayData);
    console.log(alld, 'alldalld');
    formData.append("product_details", alld);
      formData.append("rfp_number", this.rfpNo);
      formData.append("procurement_id", this.details_pr?.id);
      formData.append("rfp_number", this.rfpNo);
      this.prService.updateVendorData(this.vendor_id, formData).subscribe((res: any) => {
        if (res.code == 200) {
          this.toast.success('Proposal sent successfully');
         window.history.back()

        }
      },
        ((err: any) => {
          this.toast.error("Something Went To Wrong")
        })
      )
    }



  }

  getType(event: any) {
    console.log(event, 'event');

  }
  gstType(control: any, i: number) {
    const data: any = control.parent.controls[i] as FormGroup;
    console.log(data, 'dataaa');
    let item = control.value
    const rfpData = this.CF_3?.get('rfpArray') as FormArray;

    let list =rfpData.at(i)

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
    this.CF_3.get('igst')?.reset();
    const data = this.CF_3.get('rfpArray') as FormArray;
    const item = data.at(i);
    const igstControl: any = item.get('igst');
    const cgstControl: any = item.get('cgst');
    const sgstControl: any = item.get('sgst');
    const deleveryCharge: any = item.get('delivery_charges');
    const aditionalCharge: any = item.get('additional_charges');
    const currency: any = item.get('currency');
    const totalAmount: any = item.get('totelAmount');


    igstControl.setValue(null);
    cgstControl.setValue(null);
    sgstControl.setValue(null);
    deleveryCharge.setValue(null);
    aditionalCharge.setValue(null);
    totalAmount.setValue(null);
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
  generateImageUrl() {
    return environment.servralUrl + '/'
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


 sevralUrl() {
  return environment.servralUrl + '/uploaded_files/';
}
goBack(){
  window.history.back();
}
}



