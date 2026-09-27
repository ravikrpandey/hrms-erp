import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ItticketingService } from 'src/app/@shared/services/itticketing.service';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-invoice-create',
  templateUrl: './vendor-invoice-create.component.html',
  styleUrls: ['./vendor-invoice-create.component.scss']
})
export class VendorInvoiceCreateComponent {
  expenceForm: any;
  myExpenseInvoiceId: any;
  expenseDataById: any[];
  vendorId: any;
  vendorInvoiceData: any;
  raiseInvoiceForm: any;
  singlePrData: any;
  id: any;
  imageToUpload: string | Blob;
  imagePath: any;
  ammount: number;
  total: any;
  grand_total: any;
  constructor(private fb: FormBuilder,
    private leadService: LeadService,
    private route: Router,
    private recruitService: RecruitService,
    private activeroute: ActivatedRoute,
    private toast: ToastrService,
    private configService: ConfigurationalmasterService,
    private _empRegistration: EmpRegistrationService,
    private _finaceService: FinaceService,
    private prService: PurchaseRequestService,
  ) {
    this.expenceForm = this.fb.group({

      // expense_report_no: new FormControl(null, [Validators.required, Validators.pattern('([0-9]){3}$'),]),
      // br_number:new FormControl(),
      // associated_company:new FormControl(),
      // expense_type: new FormControl(),
      // expense_name: new FormControl(),
      // expense_desc: new FormControl(),
      // expense_advance: new FormControl(),
      // task_order: new FormControl(),
      // travel_tickets: new FormControl(),
      // expense_requestId: new FormControl(),
      // expense_details: new FormControl(),
      vendor_management_id: new FormControl(),
      vendor_name: new FormControl(),
      account_type: new FormControl(),
      bank_account_number: new FormControl(),
      bank_address: new FormControl(),
      branch: new FormControl(),

      contact_number: new FormControl(),
    })
    this.raiseInvoiceForm = this.fb.group({
      name: new FormControl(null),
      department: new FormControl(null),
      emp_id: new FormControl(null),
      alldata: new FormArray([]),
      location: new FormControl(null),
      state: new FormControl(null),
      pin: new FormControl(null),
      delivery_address: new FormControl(null),
      vendors: new FormControl(null),
      raised_by: new FormControl(null),
      po_date: new FormControl(null),
      vendor_name: new FormControl(null),
      remark: new FormControl(null),
      unitPrice: new FormControl(null),
      quantity: new FormControl(null),
      ammount: new FormControl(null),
      sgst: new FormControl(null),
      cgst: new FormControl(null),
      igst: new FormControl(null),
      total: new FormControl(null),
      poNumber: new FormControl(null),
      invoice_date: new FormControl(null, [Validators.required]),
      invoice_remarks: new FormControl(null, [Validators.required]),
      po_status: new FormControl(null),
      additonal_charges:new FormControl(null),
      delivery_charges:new FormControl(null),
      grand_total:new FormControl(null),
      invoice_file:new FormControl(null, [Validators.required])
    });

  }
  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.vendorId = params.vendorId;
      console.log(params, 'params');

      console.log(this.vendorId, 'this.myExpenseInvoiceId');

    })

    this.getByVendorInvoice();




    // PURCHASE ORDER DATA
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.pr_id;
    });
    if (this.id) {
      this.prService.getInvoiceDetailsById(this.id).subscribe((res: any) => {
        this.singlePrData = res.data;

        <FormArray>this.CF_1.alldata.push(
          new FormGroup({
            product_image: new FormControl(this.singlePrData?.product_image),
            item_name: new FormControl(this.singlePrData?.item_name),
            item_code: new FormControl(this.singlePrData?.item_code),
            unit: new FormControl(this.singlePrData?.unit),
            priority: new FormControl(this.singlePrData?.priority),
            mvp: new FormControl(this.singlePrData?.mvp),
          })
        );

        this.raiseInvoiceForm.patchValue({
          location: this.singlePrData?.location,
          state: this.singlePrData?.state,
          pin: this.singlePrData?.pin,
          city: this.singlePrData?.city,
          delivery_address: this.singlePrData?.delivery_address,
          raised_by: this.singlePrData?.raised_by,
          po_date:this.singlePrData?.po_date,
          remark: this.singlePrData?.vendor_remarks,
          vendor_name:this.singlePrData.vendor_name,
          unitPrice: this.singlePrData?.price_amt,
          quantity: this.singlePrData?.unit,
          ammount: this.singlePrData?.price_amt*this.singlePrData?.unit,
          sgst: this.singlePrData?.sgst,
          cgst: this.singlePrData?.cgst,
          igst: this.singlePrData?.igst,
          total:this.singlePrData?.total,
          poNumber:this.singlePrData?.po_details_id,
          delivery_charges:this.singlePrData?.delivery_charges,
          additonal_charges: this.singlePrData?.additional_charges,
          grand_total:this.singlePrData?.grand_total,
        });
      });
    }
  }


  getByVendorInvoice() {
    // this._finaceService.getByVendorinoviceCopy(this.vendorId).subscribe((res: any) => {
    //   this.vendorInvoiceData = res.data;
    //   this.patchData();
    // })
    this._finaceService.getByVendeoNewInvoice(this.vendorId).subscribe((res: any) => {
      this.vendorInvoiceData = res.data;
      this.ammount=this.vendorInvoiceData.price_amt * this.vendorInvoiceData.unit;
      this.total=this.calculateTotalValue(this.vendorInvoiceData?.unit,this.vendorInvoiceData?.price_amt,this.vendorInvoiceData?.sgst,this.vendorInvoiceData?.cgst,this.vendorInvoiceData?.igst),
      this.grand_total=this.calculateTotalValue(this.vendorInvoiceData?.unit,this.vendorInvoiceData?.price_amt,this.vendorInvoiceData?.sgst,this.vendorInvoiceData?.cgst,this.vendorInvoiceData?.igst) + this.vendorInvoiceData?.delivery_charges + this.vendorInvoiceData?.additional_charges,

      this.patchData();
    })
  }
  get CF_1(): any {
    return this.raiseInvoiceForm.controls;
  }
  patchData() {
    this.expenceForm.patchValue({
      vendor_management_id: this.vendorInvoiceData.vendor_management_id,
      vendor_name: this.vendorInvoiceData.vendor_name,
      account_type: this.vendorInvoiceData.account_type,
      bank_account_number: this.vendorInvoiceData.bank_account_number,
      bank_address: this.vendorInvoiceData.bank_address,
      branch: this.vendorInvoiceData.branch,
      contact_number: this.vendorInvoiceData.contact_number,
    })

    this.raiseInvoiceForm.patchValue({
      invoice_date:this.vendorInvoiceData?.invoice_date,
      invoice_remarks:this.vendorInvoiceData?.invoice_remarks,
    })
  }
  CreateExpense() {
    let val = this.expenceForm.value;
    console.log(val, 'vall');

    //     let data={
    //       customer_id: 4142206000000113394,

    //       line_items:[
    //         {
    //           contact_id :this.myExpenseInvoiceId,
    //           // br_number:val.br_number,
    //           // company_name:val.associated_company,
    //           // expense_type:val.expense_type,
    //           // contact_name :val.expense_name,
    //           // expense_desc:val.expense_desc,
    //           // opening_balance_amount:val.finalAmount,
    //           // task_order:val.task_order,
    //           // travel_tickets:val.travel_tickets,
    //           // expense_requestId:val.expense_requestId,
    //           // expense_details:val.expense_details,
    //           vendor_management_id:val.vendor_management_id,
    //           vendor_name:val.vendor_name,
    //           account_type:val.account_type,
    //           bank_account_number:val.bank_account_number,
    //           bank_address:val.bank_address,
    //           branch:val.branch,
    //           contact_number:val.contact_number,
    //         }
    //       ]


    //     }
    //     this._finaceService.createExpenseZoho(data).subscribe((res:any)=>{
    //     console.log(res,'resssss');

    // })


    let dataCreate = {
      customer_id: "4146441000000118001",
      contact_name: val.vendor_name,

      // contact_name: "Bowman kishan Co",
      company_name: "Bowman and Co",
      website: "www.bowmanfurniture.com",
      // customer_id: 4142206000000113000
    }
    this._finaceService.createExpenseZohoCopy(dataCreate).subscribe((res: any) => {
      console.log(res, 'resssss');
      this.toast.success("create Customer");


      if (res) {
        console.log("Data already not exists in zoho")
        this.toast.success("Successfully");
        let dataZoho = {
          customer_id: "4146441000000118001",
          contact_name: val.associated_company,
          br_number: val.br_number,
          category: val.category,
          line_items: [
            {

              name: val.first_name,
              description: "Description of Product 1",
              // item_order: 1,//item id
              rate: 100,
              quantity: 2,
              gst_no: "29AAACU9924E1Z8",
              template_id: val.vendor_management_id,
              vendor_management_id: val.vendor_management_id,
              vendor_name: val.vendor_name,
              account_type: val.account_type,
              bank_account_number: val.bank_account_number,
              bank_address: val.bank_address,
              branch: val.branch,
              contact_number: val.contact_number,
             }
          ]


        }
        this._finaceService.createExpenseZoho(dataZoho).subscribe((res: any) => {
          console.log(res, 'resssss');
          this.toast.success("Data Exiting");
          this.route.navigate(
            ['master/finance/account-receivable/e-invoice'],

          );
        })
      }

    },
      ((err: any) => {
        console.log("Data already exists in zoho");
        this.toast.info("Data already exists in zoho");

        let dataZoho = {
          customer_id: "4146441000000118001",
          contact_name: val.vendor_name,
          br_number: val.br_number,
          category: val.category,
          line_items: [
            {
              name: val.vendor_name,
              description: "Description of Product 1",
              // item_order: 1,//item id
              // item_id:2,
              rate: 100,
              quantity: 2,
              gst_no: "29AAACU9924E1Z8",
              template_id: "29AAACU9924E1Z3",
              vendor_name: val.vendor_name,
              account_type: val.account_type,
              bank_account_number: val.bank_account_number,
              bank_address: val.bank_address,
              branch: val.branch,
              contact_number: val.contact_number,

            }
          ]


        }
        console.log(dataZoho, 'dataZoho__________');

        this._finaceService.createExpenseZoho(dataZoho).subscribe((res: any) => {
          console.log(res, 'resssss');
          this.toast.success("Data Successfully Added In Zoho")
          this.route.navigate(
            ['master/finance/account-receivable/e-invoice'],

          );
        })
      })
    )
}


// PURCHASE ORDER

// onChange(e: any) {
//   if (e.target.files && e.target.files[0]) {
//     const data: FileList = e.target.files;
//     this.imageToUpload = data.item(0) || null;

//     const reader = new FileReader();
//     reader.onload = (e: any) => {
//       this.imagePath = e.target.result;
      

//     };
//     reader.readAsDataURL(this.imageToUpload);
//   }
// }
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
genrateInvoice() {
  let val = this.raiseInvoiceForm.value;
  let invoice_date  = moment(this.raiseInvoiceForm.value.invoice_date).format("YYYY-MM-DD");
  // this.raiseInvoiceForm.patchValue({
  //   invoice_date: invoice_date,
  //   po_status: 'ISSUED INVOICE',
  //   // invoice_file: this.imageToUpload
  // })
  let formData =new FormData();
  formData.append("invoice_remarks", val.invoice_remarks);
  formData.append("invoice_date", invoice_date);
  formData.append("invoice_file", this.imageToUpload);
  formData.append( "po_status", 'ISSUED INVOICE')
  if (this.raiseInvoiceForm.invalid) {
  this.toast.error('Required fields should not be empty', 'Fields Error');
  return;
}


this.prService.genrateInvoice(this.id, formData).subscribe((res: any) => {
  if (res.code == 200) {
    this.toast.success('Invoice Raised Successfully');
    this.route.navigateByUrl('/master/finance/account-payable/all-recived-invoice/vendor-invoice-list')
  }
},err => {
  this.toast.error('Something Went Wrong');
})
}

calculateTotalValue( unit:number,amount: number, sgst: number, cgst: number, igst: number): number {
  let totalAmount = unit*amount
  const totalSGST = (totalAmount * sgst) / 100;
  const totalCGST = (totalAmount * cgst) / 100;
  const totalIGST = (totalAmount * igst) / 100;

  const totalValue = totalAmount + totalSGST + totalCGST + totalIGST;
  return totalValue;
}
}
