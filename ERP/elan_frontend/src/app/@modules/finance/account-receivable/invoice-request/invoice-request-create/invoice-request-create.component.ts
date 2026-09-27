import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import { ActivatedRoute, Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
@Component({
  selector: 'app-invoice-request-create',
  templateUrl: './invoice-request-create.component.html',
  styleUrls: ['./invoice-request-create.component.scss']
})
export class InvoiceRequestCreateComponent {
  leadForm: any;
  brNumber: any;
  byData: any;
  leadId: any;
  singleLeadData: any;
  errorMsg: string;

  fileDetails2: { filePath: string | any; file: any } = {
    filePath: '',
    file: null,

  };
  dataInvoice: any;
  cutomerId: any;
  manual_id: any;
  manualData: any;
  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private route: Router,
    private toast: ToastrService,
    // private configService: ConfigurationalmasterService,
    // private recruitService: RecruitService,
    private activeroute: ActivatedRoute,
    private _finaceService: FinaceService
  ) {
    this.leadForm = this.fb.group({
      wo_verified_on: new FormControl(null),
      wo_verify_by: new FormControl(null),
      wo_verification_status: new FormControl(null),
      gst_number: new FormControl(),
      br_number: new FormControl(),
      email_copy: new FormControl(),
      street_address: new FormControl(),
      address2: new FormControl(),
      workOrder_no: new FormControl(),
      audit_start_date: new FormControl(),
      audit_end_date: new FormControl(),
      ICT_Date: new FormControl(),
      invoiceFile: new FormControl(),
      Mob_number: new FormControl(),
      gstNumber: new FormControl(),
      creditDay: new FormControl(),
      associated_company: new FormControl(),
      first_name: new FormControl(),
      last_name: new FormControl(),
      company_logo_cost: new FormControl(),
      job_type:new FormControl(),
      category:new FormControl(),
      duning_details: new FormArray([
        new FormGroup({
          duning_date: new FormControl(null),
          duning_comment: new FormControl(null,),
        }),
      ]),

      IRN : new FormControl(null),
      ack_no: new FormControl(null),
      ack_date: new FormControl(null),
    })


  }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.brNumber = params.br_number;
      this.manual_id = params.id
      console.log('id', this.manual_id);
      
      console.log(this.brNumber, 'brNumber');
      if(this.manual_id){
        this.leadService.manualById(this.manual_id).subscribe((res: any) => {
          this.singleLeadData = res.data;
          console.log('ddd',this.singleLeadData);
          this.patchLeadData();
          this.leadForm.patchValue({
            ICT_Date: moment(this.singleLeadData?.ICT_Date).format('YYYY-MM-DD'),
            jobTitle:this.singleLeadData?.jobTitle
          })
        })
      }
    })

    this.getByRecivable(this.brNumber);
    this.getCutomerId()
  }


  getCutomerId(){
    this._finaceService.getCustomerId().subscribe((res:any)=>{
      console.log(res,'ressss');
      
      this.cutomerId=res.data[0].contact_id;
      console.log(this.cutomerId,'this.cutomerId');
      
    })
  }

  Approved() {
    let val = this.leadForm.value;
    let data = {
      customer_id: this.cutomerId,

      line_items: [
        {
          wo_verified_on: val.wo_verified_on,
          wo_verify_by: val.wo_verify_by,
          wo_verification_status: val.wo_verification_status,
          gst_number: val.gst_number,
          br_number: val.br_number,
          email_copy: val.email_copy,
          street_address: val.street_address,
          address2: val.address2,
          workOrder_no: val.workOrder_no,
          audit_start_date: val.audit_start_date,
          audit_end_date: val.audit_end_date,
          ICT_Date: val.ICT_Date,
          Mob_number: val.Mob_number,
          gstNumber: val.gstNumber,
          creditDay: val.creditDay,
          associated_company: val.associated_company,
          first_name: val.first_name,
          last_name: val.last_name,
          company_logo_cost: val.company_logo_cost,
        }
      ]
}


this._finaceService.createExpenseZoho(data).subscribe((res: any) => {
          console.log(res, 'resssss');
          this.toast.success("create no match ")
        })
       }

  create(){
    let val = this.leadForm.value;

  console.log(val,'val');

    const arrayDue:any=[];
for(let i=0;i<=val.duning_details.length-1;i++){
  arrayDue.push({
    duning_date:  moment(val.duning_details[i]?.duning_date).format('DD-MM-YYYY'),
    duning_comment:val.duning_details[i]?.duning_comment
  });
  // arrayDue.push(val.duning_details[i]?.duning_comment);


}
console.log(arrayDue,'arrayDue');
    let data = {
      customer_id: this.cutomerId,
      contact_name:val.first_name,
     
      // contact_name: "Bowman kishan Co",
      company_name: "Bowman and Co",
      website: "www.bowmanfurniture.com",
      // customer_id: 4142206000000113000
}

console.log(data,'data<<<<<<<<<');
this._finaceService.createExpenseZohoCopy(data).subscribe((res:any)=>{
      console.log(res,'resssss');
      this.toast.success("create Customer");


if(res){
  console.log("Data already not exists in zoho")
this.toast.success("Successfully");



  let dataZoho = {
    customer_id: this.cutomerId,
    contact_name:val.associated_company,
    br_number:val.br_number,
    category:val.category,
    status:"Invoice",
    manual_invoice_id:this.manual_id,
    duning_details:arrayDue,
    IRN:val.IRN,
    ack_no: val.ack_no,
    ack_date: val.ack_date,
    line_items: [
      {

        name: val.first_name,
        description: "Description of Product 1",
        // item_order: 1,//item id
        rate: 100,
        quantity: 2,
        gst_no: "29AAACU9924E1Z8",
        template_id: "29AAACU9924E1Z3"

        // wo_verified_on: val.wo_verified_on,
        // wo_verify_by: val.wo_verify_by,
        // wo_verification_status: val.wo_verification_status,
        // gst_number: val.gst_number,
        // br_number: val.br_number,
        // email_copy: val.email_copy,
        // street_address: val.street_address,
        // address2: val.address2,
        // workOrder_no: val.workOrder_no,
        // audit_start_date: val.audit_start_date,
        // audit_end_date: val.audit_end_date,
        // ICT_Date: val.ICT_Date,
        // Mob_number: val.Mob_number,
        // gstNumber: val.gstNumber,
        // creditDay: val.creditDay,
        // associated_company: val.associated_company,
        // first_name: val.first_name,
        // last_name: val.last_name,
        // company_logo_cost: val.company_logo_cost,
        // customer_name:val.first_name,
        // contact_name:val.associated_company
  
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
    ((err:any)=>{
      console.log("Data already exists in zoho");
this.toast.info("Data already exists in zoho");

      let dataZoho = {
        customer_id:this.cutomerId,
        contact_name: val.first_name,
        br_number:val.br_number,
        category:val.category,
        duning_details:arrayDue,
        IRN:val.IRN,
        ack_no: val.ack_no,
        ack_date: val.ack_date,
        manual_invoice_id:this.manual_id,
        status:"Invoice",

        line_items: [
          {
            name: val.first_name,
            description: "Description of Product 1",
            // item_order: 1,//item id
            // item_id:2,
            rate: 100,
            quantity: 2,
            gst_no: "29AAACU9924E1Z8",
            template_id: "29AAACU9924E1Z3"
            // wo_verified_on: val.wo_verified_on,
            // wo_verify_by: val.wo_verify_by,
            // wo_verification_status: val.wo_verification_status,
            // gst_number: val.gst_number,
            // br_number: val.br_number,
            // email_copy: val.email_copy,
            // street_address: val.street_address,
            // address2: val.address2,
            // workOrder_no: val.workOrder_no,
            // audit_start_date: val.audit_start_date,
            // audit_end_date: val.audit_end_date,
            // ICT_Date: val.ICT_Date,
            // Mob_number: val.Mob_number,
            // gstNumber: val.gstNumber,
            // creditDay: val.creditDay,
            // associated_company: val.associated_company,
            // first_name: val.first_name,
            // last_name: val.last_name,
            // company_logo_cost: val.company_logo_cost,
            // customer_name:val.first_name,
            // contact_name:val.associated_company
      
          }
        ]
      
      
      }
      console.log(dataZoho,'dataZoho__________');
      
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

  rejectCopy() {

  }

  pdfGenerate() {
    const dashboard = document.getElementById('dashboard');
    console.log(dashboard, 'dashboard');

    const dashboardHeight = dashboard!.clientHeight;
    const dashboardWidth = dashboard!.clientWidth;
    const options = { background: 'white', width: dashboardWidth, height: dashboardHeight };

    domtoimage.toPng(dashboard!, options).then((imgData) => {
      const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      // let PDF = new jsPDF('p', 'mm', 'a4');
      console.log(pdfHeight, 'pdfHeight');

      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight - 10);
      window.open(URL.createObjectURL(doc.output("blob")));
    });
  }

  getByRecivable(e: any) {
    this._finaceService.getByRecivable(e).subscribe((res: any) => {
      console.log(res, 'resss');
      this.byData = res.data;
      console.log(this.byData, 'this.byData');
      this.leadId = res.data.lead_genrate_id;
      console.log(this.leadId, 'this.leadId');
      this.dataInvoice=res.data.getData
      this.leadForm.patchValue({
        ICT_Date: moment(this.dataInvoice?.createdAt).format('YYYY-MM-DD'),
        jobTitle:this.dataInvoice?.item_description
      })

      this.getByLead();
    })
  }

  getByLead() {
    console.log(this.leadId, 'getByleadid');

    this.leadService.getByIdLead(this.leadId).subscribe((res: any) => {
      this.singleLeadData = res.data;
      console.log(this.singleLeadData, 'this.singleLeadData ');
      this.patchLeadData();
      //  if(res.data.bill_send_site===true){
      //    this.billingSite=`${this.singleLeadData.br_number}`+`${'/'}`+ `${this.singleLeadData.associated_company}`+`${'/'}`+`${this.singleLeadData?.customer_category}`+`${'/'}`+`${this.singleLeadData?.state}`+`${'/'}`+`${this.singleLeadData?.region}`

      //    console.log(this.billingSite,'this.billingSite');

      //  }

      //  if(res.data.billing_site===true){
      //    this.billingSiteDeliver=`${this.singleLeadData.br_number}`+`${'/'}`+ `${this.singleLeadData.associated_company}`+`${'/'}`+`${this.singleLeadData?.customer_category}`+`${'/'}`+`${this.singleLeadData?.state}`+`${'/'}`+`${this.singleLeadData?.region}`

      //    console.log(this.billingSite,'this.billingSite');

      //  }
    })
  }

  patchLeadData() {
    console.log(this.singleLeadData, 'singleLeadData<<<<');

    this.leadForm.patchValue({
      associated_company: this.singleLeadData.associated_company || this.singleLeadData.associatedCompany,
      first_name: this.singleLeadData.first_name || this.singleLeadData.firstName,
      last_name: this.singleLeadData.first_name,
      gst_number: this.singleLeadData.gst_number || this.singleLeadData.gst,
      email_copy: this.singleLeadData.email,
      br_number: this.singleLeadData.br_number,
      workOrder_no: this.singleLeadData.workOrder_no || this.singleLeadData.work_oder_number,
      street_address: this.singleLeadData.street_address|| this.singleLeadData.streetAddress,
      address2: this.singleLeadData.address2 || this.singleLeadData.addressLine2,
      audit_start_date: this.singleLeadData.training_start_date ||this.singleLeadData.audit_start_date,
      company_logo_cost: this.singleLeadData.company_logo_cost,
      audit_end_date: this.singleLeadData.training_end_date||this.singleLeadData.audit_end_date,
      Mob_number: this.singleLeadData.mobile_number || this.singleLeadData.mobilePhonenumber,
      wo_verified_on:this.singleLeadData.opp_verifier_name_level1 ||this.singleLeadData.wo_verifyOn,
     wo_verify_by:this.singleLeadData.opp_verifier_name_level2||this.singleLeadData.wo_verifyBy,
     wo_verification_status: this.singleLeadData.wo_verification_status  ||this.singleLeadData.wo_verification_status,
     creditDay: this.singleLeadData?.creditDays ||this.singleLeadData?.creditDays,

    })
  }
  expenseApprovalFile(fileInput: File[] | any) {
    this.errorMsg = '';
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      // this.imageToUpload = file.item(0);

      // let file2 = this.imageToUpload.name.split('.');
      // let fileExe = file[file.length - 1].toUpperCase();
      // 

      const reader = new FileReader();

      const fileSizeInMb = file.size / 1024 ** 2;
      if (fileSizeInMb > 30) {
        this.errorMsg = 'File size should be less than 30MB';
        return;
      }
      reader.onload = (e: any) => {
        this.fileDetails2.filePath = reader.result;
      };
      

      reader.readAsDataURL(file);
      this.fileDetails2.file = file;
    } else {
      this.fileDetails2 = { filePath: '', file: null };
    }
    
    
    let file2 = this.fileDetails2.file.name.split('.');
    
    let fileExe = file2[file2.length - 1].toUpperCase();
    
    // if (fileExe === "PDF") {
    //   this.pdfFile = fileExe;
    // }
  }

  get CF_1(): any {
    return this.leadForm.controls;
  }
  addrow() {
    if(this.CF_1.duning_details.length !=3){
      <FormArray>this.CF_1.duning_details.push(
        new FormGroup({
          duning_date: new FormControl(null),
          duning_comment: new FormControl(null),
          
        }),
      )
    }else{
      this.toast.error("Can't Able To Add More item")
    }
  }

  
}
