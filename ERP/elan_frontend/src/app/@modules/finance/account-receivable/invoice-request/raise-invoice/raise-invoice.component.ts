import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import * as moment from 'moment';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ConfigurationalmasterService } from '../../../../../@shared/services/configurationalmaster.service';
import Swal from 'sweetalert2';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ItticketingService } from 'src/app/@shared/services/itticketing.service';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';


// declare var require: any;

// const FileSaver = require('file-saver');

// export interface PeriodicElement {
//   br_number: string;
//   account_name: string;

// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   { account_name: "S1", br_number: "1" },
//   { account_name: "S2", br_number: "1" },
//   { account_name: "CA1", br_number: "2" }
// ];

@Component({
  selector: 'app-raise-invoice',
  templateUrl: './raise-invoice.component.html',
  styleUrls: ['./raise-invoice.component.scss']
})

export class RaiseInvoiceComponent {
  toDate: any;
  id: any;
  @ViewChild('eacodeselect') eacodeselect: MatSelect;
  Login_user_id: any = localStorage.getItem('signInUser');
  loginUserId: any = JSON.parse(this.Login_user_id).employee_id
  loginUserName: any = JSON.parse(this.Login_user_id).first_name
  displayedColumns: string[] = ['stage', 'noOfMandays'];
  // dataSource = ELEMENT_DATA;
  leadForm: FormGroup;
  jobType: any;
  candidateArray: any;
  interviewGetId: any;
  candidateId: any;
  interview_id: any;
  unreg: boolean = false;
  gstreg: boolean = false;
  clicked: boolean = false;
  cutomerType: boolean = false;
  sitAudit: boolean = false;
  lead_id: any;
  allSelectedCode = false;
  singleLeadData: any;
  myFiles: any;
  fileList: any;
  errorMsg: string = '';
  stateList: any[] = [];
  countryList: any[] = [];
  pinCodeList: any;
  pinCodeTrue: boolean = true;
  cityList: any;
  allDataOne: any;
  allDataTwo: any;
  allDataMan: any;
  fileDetails: { filePath: string | any; file: any } = {
    filePath: '',
    file: null,
  };
  fileDetailsOne: { filePath: string | any; file: any } = {
    filePath: '',
    file: null,
  };
  fileDetailsTwo: { filePath: string | any; file: any } = {
    filePath: '',
    file: null,
  };
  fileDetailsThree: { filePath: string | any; file: any } = {
    filePath: '',
    file: null,
  };
  fileDetailsFour: { filePath: string | any; file: any } = {
    filePath: '',
    file: null,
  };
  allAchievement: any;
  categoryList: any;
  stageData: any[] = [];
  submitted: boolean;
  nonCertt: boolean = false;
  eaCodeList: any;
  rowData: any;
  loginUser: any;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  // day = this.now.getDay();
  date = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minDate = moment({ year: this.year - 0, month: this.month, date: this.date }).format('YYYY-MM-DD');
  employee_id: any;
  employee_name: any;
  leadUpdate: any;
  semiAnnual: boolean = false;
  segmentList: any;
  certificateList: any;
  regionSList: any;
  CategorySList: any;
  regionalbheadList: any;
  globalMsalesList: any;
  assesmentList: any;
  singleLeadData1: any;
  br2: any;
  parentSide: any;
  br1: any;
  gstvalidation: boolean;
  add_dynamic_invoice: any
  brNumber: any;
  brNumberData: any[] = [];
  get_invoice_details: any;
  br_numbers: any;
  billing_address: any;
  states: any;
  names: any;
  designations: any;
  comments1: any;
  comments2: any;
  comments3: any;
  comments6: any;
  comments5: any;
  comments4: any;
  mobiles: any;
  emails: any;
  gstn: any;
  byData: any;
  totalNetAmount: number = 0;
  rowDataExpense: any[] = [];
  getListExpenseList: any[] = [];
  brNumberCopy: number;
  getDataCopy: any;
  leadId: any;
  billingSite: any;
  resonFiled: boolean = false;
  billingSiteDeliver: string;
  noExpenseData: boolean = false;
  splitTaskOrder: any;
  dataInvoice: any;
  manual_id: any;
  item_details: any;
  total_amount: number =0;
  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private route: Router,
    private toast: ToastrService,
    private configService: ConfigurationalmasterService,
    private recruitService: RecruitService,
    private activeroute: ActivatedRoute,
    private _finaceService: FinaceService,
    private _itteketService: ItticketingService
  ) {
    this.leadForm = this.fb.group({

      wo_verified_on: new FormControl(null),
      wo_verification_status: new FormControl(null),
      comment1: new FormControl(null),
      comment2: new FormControl(null),
      comment3: new FormControl(null),
      comment4: new FormControl(null),
      comment5: new FormControl(null),
      comment6: new FormControl(null),
      audit_start_date: new FormControl(null),
      audit_end_date: new FormControl(null),
      ICT_Date: new FormControl(null),
      br_lists: new FormControl(null),
      addressLine: new FormControl(null),
      streetAddress: new FormControl(null),
      gstNumber: new FormControl(null),
      creditDay: new FormControl(null),
      Mob_number: new FormControl(null),
      state: new FormControl(null),
      city: new FormControl(null),
      firstName: new FormControl(null),
      jobTitle: new FormControl(null),
      email: new FormControl(null),
      associatedCompany: new FormControl(null),
      wo_verification_comment: new FormControl(null),
      wo_verify_by: new FormControl(null),
      BrNumber: new FormControl(null),
      reason: new FormControl(null),
      gst_number: new FormControl(null),
      email_copy: new FormControl(null),
      br_number: new FormControl(null),
      workOrder_no: new FormControl(null),
      street_address: new FormControl(null),
      address2: new FormControl(null),
      first_name: new FormControl(null)


    })
    this.add_dynamic_invoice = this.fb.group({
      item_description: new FormControl(null),
      qty: new FormControl(null),
      unit: new FormControl(null),
      unit_price: new FormControl(null),
      net_amount: new FormControl(null),
      // net_amount: new FormControl(null),
      // net_amount: new FormControl(null),

    })
    this.get_invoice_verification();

  }
  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.manual_id = params.id;
      console.log('id' ,this.manual_id);
      

      this.lead_id = this.id?.lead_genration_id;
      this.brNumber = params.br_number;
      console.log(params, 'params');

      if(this.manual_id)
      this.leadService.manualById(this.manual_id).subscribe((res:any)=>{
        this.singleLeadData = res.data;
        this.item_details = this.singleLeadData.item_details;
        console.log('data', this.item_details);

        for (let item of this.item_details) {
            this.total_amount += Number(item.net_amount)
          }
        
        this.patchLeadData();
      })

      this.leadService.getByIdLead(this.lead_id).subscribe((res: any) => {
        this.singleLeadData = res.data;
        console.log(this.singleLeadData, 'this.singleLeadData..........');

        this.patchLeadData();
        if (this.singleLeadData?.export === "Export Wise") {
          this.gstvalidation = false;
        }
        // this.nonCertFunc();
        this.patchFormvalue();
        let x = res.data.map((a: any) => {
          return { ...a, checked: false }
        })
        this.singleLeadData1 = x;
      })
    });
    this.verificationTable();
    this.getByRecivable(this.brNumber)

    this.getListExpense();
    this.get_invoice_verification();


  }


  patchLeadData() {
    console.log(this.singleLeadData, 'singleLeadData<<<<');

    this.leadForm.patchValue({
      gst_number: this.singleLeadData.gst_number || this.singleLeadData.gst,
      email_copy: this.singleLeadData.email|| this.singleLeadData.gst,
      br_number: this.singleLeadData.br_number, 
      workOrder_no: this.singleLeadData.workOrder_no || this.singleLeadData.work_oder_number,
      street_address: this.singleLeadData.street_address || this.singleLeadData.streetAddress,
      address2: this.singleLeadData.address2 || this.singleLeadData.addressLine2,
      first_name: this.singleLeadData.first_name || this.singleLeadData.firstName,
      wo_verified_on: this.singleLeadData.opp_verifier_name_level1 ||this.singleLeadData.wo_verifyOn,
      wo_verify_by: this.singleLeadData.opp_verifier_name_level2 ||this.singleLeadData.wo_verifyBy,
      wo_verification_status: this.singleLeadData.wo_verification_status  ||this.singleLeadData.wo_verification_status,
      wo_verification_comment: this.singleLeadData.wo_verifier_comments ||this.singleLeadData.gst,
      audit_start_date: this.singleLeadData?.training_start_date  ||this.singleLeadData.audit_start_date,
      audit_end_date: this.singleLeadData?.training_end_date ||this.singleLeadData.audit_end_date,
   
      br_lists: this.singleLeadData?.billingAddress,
      associatedCompany: this.singleLeadData?.associated_company|| this.singleLeadData.associatedCompany,
      BrNumber: this.singleLeadData?.br_number,
      email: this.singleLeadData?.email,
      jobTitle: this.singleLeadData?.jobTitle,
      firstName: this.singleLeadData?.first_name ||this.singleLeadData?.firstName ,
      gstNumber: this.singleLeadData?.GSTNumber,
      creditDay: this.singleLeadData?.creditDays ||this.get_invoice_details?.creditDays,
      // jobTitle: this.singleLeadData?.discription,
      // firstName: this.singleLeadData?.first_name,
      city: this.singleLeadData?.city_name || this.singleLeadData.city,
      state: this.singleLeadData?.state_name|| this.singleLeadData.state,
      Mob_number: this.singleLeadData?.mobile_number || this.singleLeadData.mobilePhonenumber,


      
    })
    if(this.manual_id){
     this.leadForm.patchValue({
      ICT_Date: this.singleLeadData?.ICTDate,
     })
    }
  }

  verificationTable() {
    this.leadService.get_invoice_list().subscribe((res: any) => {
      this.rowData = res.data
      console.log(this.rowData, 'this.rowData');
      for (let item of this.rowData) {
        // console.log(item,"items");
        if (item.br_number === this.brNumber) {
          this.brNumberData.push(item)
          console.log(item.netAmount, 'item.netAmount');

          this.totalNetAmount += Number(item.netAmount)
        }
      }
      console.log(this.totalNetAmount, 'this.totalNetAmount');
      console.log(this.brNumberData, 'this.brNumberData');

    })
  }

  get_invoice_verification() {
    this.leadService.get_invoice_verification(this.brNumber).subscribe((res: any) => {


      this.get_invoice_details = res.data
       console.log(res,'ressss');

      this.br_numbers = res.data.br_number
      this.billing_address = res.data.billingAddress
      this.states = res.data.state
      this.gstn = res.data.GSTNumber
      this.names = res.data.firstName,
        this.designations = res.data.designation
      this.emails = res.data.email
      this.mobiles = res.data.mobilePhonenumber
      this.comments1 = res.data.CI_assessment_fee_comment1
      this.comments2 = res.data.digitallySignedSoftcopy_comment2
      this.comments3 = res.data.travelLivingClaim_comment3
      this.comments4 = res.data.TL_supportingNotSent_comment4
      this.comments5 = res.data.invoiceIsWithGST_comment5
      this.comments6 = res.data.ClientNamePO_comment6


      this.leadForm.patchValue({
        wo_verified_on: this.get_invoice_details?.opp_verifier_name_level1,
        wo_verify_by: this.get_invoice_details?.opp_verifier_name_level2,
        wo_verification_status: this.get_invoice_details?.wo_verification_status,
        wo_verification_comment: this.get_invoice_details?.wo_verifier_comments,
        comment1: this.get_invoice_details?.CI_assessment_fee_comment1,
        comment2: this.get_invoice_details?.digitallySignedSoftcopy_comment2,
        comment3: this.get_invoice_details?.travelLivingClaim_comment3,
        comment4: this.get_invoice_details?.TL_supportingNotSent_comment4,
        comment5: this.get_invoice_details?.invoiceIsWithGST_comment5,
        comment6: this.get_invoice_details?.ClientNamePO_comment6,
        audit_start_date: this.get_invoice_details?.audit_start_date,
        audit_end_date: this.get_invoice_details?.audit_end_date,
        br_lists: this.get_invoice_details?.billingAddress  ||this.singleLeadData.gst,
        associatedCompany: this.get_invoice_details?.associated_company  ||this.singleLeadData.gst,
        BrNumber: this.get_invoice_details?.br_number,
        email: this.get_invoice_details?.email ||this.singleLeadData.gst,
        // jobTitle: this.get_invoice_details?.discription,
        firstName: this.get_invoice_details?.first_name,
        city: this.get_invoice_details?.city,
        state: this.get_invoice_details?.state,
        Mob_number: this.get_invoice_details?.mobilePhonenumber,
        streetAddress: this.get_invoice_details?.streetAddress,
        addressLine: this.get_invoice_details?.addressLine2,
        gstNumber: this.get_invoice_details?.GSTNumber,
        creditDay: this.get_invoice_details?.creditDays,
        first_name: this.get_invoice_details?.first_name
      })
    }
    )
  }

  getByRecivable(e: any) {
    this._finaceService.getByRecivable(e).subscribe((res: any) => {
      console.log(res, 'resss');
      this.byData = res.data;
      this.dataInvoice=res.data.getData;
      console.log( this.dataInvoice,' this.dataInvoice');
      
      console.log(this.byData, 'this.byData');
      this.leadId = res.data?.lead_genrate_id;
      console.log(this.leadId, 'this.leadId');

      this.leadForm.patchValue({
        ICT_Date: moment(this.dataInvoice?.createdAt ||  this.singleLeadData?.ICTDate).format('YYYY-MM-DD'),
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
      if (res.data.bill_send_site === true) {
        this.billingSite = `${this.singleLeadData.br_number}` + `${'/'}` + `${this.singleLeadData.associated_company}` + `${'/'}` + `${this.singleLeadData?.customer_category}` + `${'/'}` + `${this.singleLeadData?.state}` + `${'/'}` + `${this.singleLeadData?.region}`

        console.log(this.billingSite, 'this.billingSite');

      }

      if (res.data.billing_site === true) {
        this.billingSiteDeliver = `${this.singleLeadData.br_number}` + `${'/'}` + `${this.singleLeadData.associated_company}` + `${'/'}` + `${this.singleLeadData?.customer_category}` + `${'/'}` + `${this.singleLeadData?.state}` + `${'/'}` + `${this.singleLeadData?.region}`

        console.log(this.billingSite, 'this.billingSite');

      }
    })
  }

  // typeChange(e1: any, e: any) {
  //   let  br3 = []
  //   this.br1 = e.br_number;
  //   let br4 = '';
  //   this.singleLeadData1.map((data:any)=>{

  //     // if(data.new_location_id===1){
  //       this.getStage(this.br1);
  //     // }

  //   })
  //   let br5 = br4+br3.push(this.br2);



  //   for (let x of this.singleLeadData1) {
  //     if (x.new_location_id === e.new_location_id) {
  //       x.checked = e1.target.checked
  //     }
  //   }
  //   // if(!e1.target.checked){
  //   //   let x = this.arr.filter((a:any)=> a.brNo !== e.br_number)
  //   //   this.arr = x
  //   // }else{
  //   //   this.arr.push({brNo:e.br_number})
  //   // }

  //   // this.br = e.br_number;
  //   // this.br1 = e.br_number;
  //   // this.br3 = e1.target.checked;
  //   // this.br4 = e1.target.checked;
  //   // 
  //   // 
  //   // 
  //   // 
  // }

  // typeChange1(e: any, event: any) {
  // let  br3 = []
  // this.br2 = e.br_number;
  // let br4 = br3.push(this.br2);





  // this.getStage1(this.br2);
  //   if (e.lead_genration_id === this.singleLeadData.lead_genration_id) {
  //     this.parentSide = event.target.checked;

  //   }
  // }
  // getStage(br1: any) {
  //   this.leadService.getStage(br1).subscribe((res: any) => {

  //     this.stageData = res.data;
  //   })
  // }

  // getStage1(br1: any) {
  //   this.leadService.getStage(br1).subscribe((res: any) => {

  //     this.stageData = res.data;
  //   })
  // }
  checkUnreg() {

    if (this.singleLeadData?.gst_applicable === "Unregistered Dealer") {
      this.unreg = true;
      this.gstreg = false;
    } else {
      this.gstreg = true;
      this.unreg = false;
    }
  }
  annualFunc() {
    this.semiAnnual = true;
  }
  annualSemiFunc() {
    this.semiAnnual = false;
  }
  unregisteredDealer() {
    this.unreg = true;
    this.gstreg = false;
  }
  gstDealer() {
    this.gstreg = true;
    this.unreg = false;
  }
  // getApprover() {
  //   this.configService.listApprover().subscribe((params: any) => {
  //     this.rowData = params.data;

  //   });
  // }
  // getEACode() {
  //   this.configService.getEacode().subscribe((res: any) => {
  //     this.eaCodeList = res.data;

  //   });
  // }

  // nonCertFunc() {
  //   if (this.singleLeadData?.certificate_type == "Non Cert") {
  //     this.nonCertt = true
  //   }
  // }
  // getAchievementList() {
  //   this.recruitService.getAllAchivement().subscribe(
  //     (res: any) => {

  //       this.allAchievement = res.data;


  //     },
  //     (err) => {

  //     }
  //   );

  // }

  // addStage(br1: any) {
  //   let val = this.leadForm.value;
  //   let data = {
  //     stage: val.stage,
  //     noOfMandays: Number(val.no_of_mandays),
  //     lead_genration_id: this.lead_id,
  //     br_number: br1,

  //   }


  //   this.leadService.addStage(data).subscribe((res: any) => {

  //     this.toast.success("Stage Added Successfully..");
  //     if(res.code===200){
  //       this.getStage(this.br1);
  //       this.toast.success("Stage Added Successfully..");
  //     }
  //     if(res.code===405){
  //       this.toast.error(res.message);
  //     }

  //   })
  // }
  // addStage1(br2: any){
  //   let val = this.leadForm.value;
  //   let data = {
  //     stage: val.stage,
  //     noOfMandays: Number(val.no_of_mandays),
  //     lead_genration_id: this.lead_id,
  //     br_number: br2.br_number,

  //   }


  //   this.leadService.addStage(data).subscribe((res: any) => {

  //     if(res.code===200){
  //       this.getStage1(br2.br_number);
  //       this.toast.success("Stage Added Successfully..");
  //     }
  //     if(res.code===405){
  //       this.toast.error(res.message);
  //     }
  //   })
  // }
  // deleteDays(e: any) {


  //   Swal.fire({
  //     title: 'Are you sure you want to Remove it?',
  //     // text: 'You will not be able to recover this file!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     cancelButtonColor: '#5d6c7c',
  //     confirmButtonColor: '#f44336',
  //     confirmButtonText: 'Delete!',
  //     cancelButtonText: 'Skip',
  //   }).then((result) => {
  //     if (result.value) {
  //       this.leadService
  //         .deleteMandays(e)
  //         .subscribe((res) => {
  //           this.reloadCurrentRoute();
  //           // window.location.reload();
  //         });
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //     }
  //   });

  //   // this.leadService.deleteMandays(e)
  // }


  // getCategory() {
  //   this.configService.listCategory().subscribe((res: any) => {
  //     this.categoryList = res.data;

  //   })
  // }


  // downloadGst(e: any) {
  //   const pdfUrl = this.singleLeadData?.gst_file;
  //   const pdfName = this.singleLeadData?.gst_applicable;
  //   FileSaver.saveAs(pdfUrl, pdfName);
  //   e.stopPropagation();
  // }
  // downloadContact(e: any) {
  //   const pdfUrl = this.singleLeadData?.contact_review_form;
  //   const pdfName = this.singleLeadData?.contact_owner;
  //   FileSaver.saveAs(pdfUrl, pdfName);
  //   e.stopPropagation();
  // }
  // downloadLogo(e: any) {
  //   const pdfUrl = this.singleLeadData?.company_logo;
  //   const pdfName = this.singleLeadData?.associated_company;
  //   FileSaver.saveAs(pdfUrl, pdfName);
  //   e.stopPropagation();
  // }
  // downloadOther(e: any) {
  //   const pdfUrl = this.singleLeadData?.other_file;
  //   const pdfName = this.singleLeadData?.document_remark;
  //   FileSaver.saveAs(pdfUrl, pdfName);
  //   e.stopPropagation();
  // }
  // downloadBasic(e: any) {
  //   const pdfUrl = this.singleLeadData?.basic_form;
  //   const pdfName = this.singleLeadData?.first_name;
  //   FileSaver.saveAs(pdfUrl, pdfName);
  //   e.stopPropagation();
  // }
  // value(value: any) {
  //   throw new Error('Method not implemented.');
  // }

  // candidateClick(e: any) {

  //   this.candidateId = e;
  //   this.recruitService.interViewGetIdBy(e).subscribe((res: any) => {
  //     this.interviewGetId = res.data;

  //     this.patchFormvalue();
  //   })
  // }

  // viewDocLogo() {
  //   window.open(this.singleLeadData.company_logo, '_blank');
  // }
  // viewDocOther() {
  //   window.open(this.singleLeadData.other_file, '_blank');
  // }
  // viewDocReview() {
  //   window.open(this.singleLeadData.contact_review_form, '_blank');
  // }
  // viewDocGST() {
  //   window.open(this.singleLeadData.gst_file, '_blank');
  // }
  // viewDocBasic() {
  //   window.open(this.singleLeadData.basic_form, '_blank');
  // }


  // fileInputChange(fileInput: File[] | any) {
  //   this.errorMsg = '';

  //   if (fileInput.target.files && fileInput.target.files[0]) {
  //     const file = fileInput.target.files[0];

  //     const reader = new FileReader();
  //     const fileSizeInMb = file.size / 1024 ** 2;
  //     if (fileSizeInMb > 30) {
  //       this.errorMsg = 'File size should be less than 30MB';
  //       return;
  //     }
  //     reader.onload = (e: any) => {
  //       this.fileDetails.filePath = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //     this.fileDetails.file = file;
  //   } else {
  //     this.fileDetails = { filePath: '', file: null };
  //   }
  // }

  // fileInputChangeOne(fileInput: File[] | any) {
  //   this.errorMsg = '';

  //   if (fileInput.target.files && fileInput.target.files[0]) {
  //     const file = fileInput.target.files[0];
  //     const reader = new FileReader();
  //     const fileSizeInMb = file.size / 1024 ** 2;
  //     if (fileSizeInMb > 30) {
  //       this.errorMsg = 'File size should be less than 30MB';
  //       return;
  //     }
  //     reader.onload = (e: any) => {
  //       this.fileDetailsOne.filePath = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //     this.fileDetailsOne.file = file;
  //   } else {
  //     this.fileDetailsOne = { filePath: '', file: null };
  //   }
  // }

  // fileInputChangeTwo(fileInput: File[] | any) {
  //   this.errorMsg = '';

  //   if (fileInput.target.files && fileInput.target.files[0]) {
  //     const file = fileInput.target.files[0];
  //     const reader = new FileReader();
  //     const fileSizeInMb = file.size / 1024 ** 2;
  //     if (fileSizeInMb > 30) {
  //       this.errorMsg = 'File size should be less than 30MB';
  //       return;
  //     }
  //     reader.onload = (e: any) => {
  //       this.fileDetailsTwo.filePath = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //     this.fileDetailsTwo.file = file;
  //   } else {
  //     this.fileDetailsTwo = { filePath: '', file: null };
  //   }
  // }
  // fileInputChangeThree(fileInput: File[] | any) {
  //   this.errorMsg = '';

  //   if (fileInput.target.files && fileInput.target.files[0]) {
  //     const file = fileInput.target.files[0];
  //     const reader = new FileReader();
  //     const fileSizeInMb = file.size / 1024 ** 2;
  //     if (fileSizeInMb > 30) {
  //       this.errorMsg = 'File size should be less than 30MB';
  //       return;
  //     }
  //     reader.onload = (e: any) => {
  //       this.fileDetailsThree.filePath = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //     this.fileDetailsThree.file = file;
  //   } else {
  //     this.fileDetailsThree = { filePath: '', file: null };
  //   }
  // }

  // fileInputChangeFour(fileInput: File[] | any) {
  //   this.errorMsg = '';

  //   if (fileInput.target.files && fileInput.target.files[0]) {
  //     const file = fileInput.target.files[0];
  //     const reader = new FileReader();
  //     const fileSizeInMb = file.size / 1024 ** 2;
  //     if (fileSizeInMb > 30) {
  //       this.errorMsg = 'File size should be less than 30MB';
  //       return;
  //     }
  //     reader.onload = (e: any) => {
  //       this.fileDetailsFour.filePath = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //     this.fileDetailsFour.file = file;
  //   } else {
  //     this.fileDetailsFour = { filePath: '', file: null };
  //   }
  // }


  patchFormvalue() {
    this.checkUnreg();
    if (this.singleLeadData?.segment != 'null || undefined') {
      this.leadService.getCertificateByID(this.singleLeadData?.segment).subscribe((res: any) => {
        this.certificateList = res.data.new_certificate_types;
      });
      this.leadService.getRegionByID(this.singleLeadData?.segment).subscribe((res: any) => {
        this.regionSList = res.data.new_regions;
      });
      this.leadService.getCategoryBySegID(this.singleLeadData?.segment).subscribe((res: any) => {
        this.CategorySList = res.data.new_category_masters;

      });
    }

    if (this.singleLeadData?.region != 'null || undefined') {
      this.leadService.getRBuisnessHead(this.singleLeadData?.region).subscribe((res: any) => {
        this.regionalbheadList = res.data;

      });
      this.leadService.getGlobalManagerSales(this.singleLeadData?.region).subscribe((res: any) => {
        this.globalMsalesList = res.data;

      });
    }


    if (this.singleLeadData?.country != 'undefined || null') {
      this.leadService.getStateByID(this.singleLeadData?.country).subscribe((res: any) => {

        this.stateList = res.data;
      });
    }
    if (this.singleLeadData?.state != 'undefined || null') {
      this.leadService.getCityByID(this.singleLeadData?.state).subscribe((res: any) => {

        this.cityList = res.data;
      });
    }
    if (this.singleLeadData?.city != 'undefined || null') {
      this.leadService.getPinCodeNew(this.singleLeadData?.city).subscribe((res: any) => {
        this.pinCodeList = res.data;


      });
    }
    if (this.singleLeadData?.certificate_type != 'undefined || null') {
      this.leadService.getAssesmentByID(this.singleLeadData?.certificate_type).subscribe((res: any) => {

        this.assesmentList = res.data[0].newitemlist;

      });
    }
    this.leadForm.patchValue({
      customer_type: this.singleLeadData?.customer_type,
      site_audit: this.singleLeadData?.multiple_site_audit,
      associated_company: this.singleLeadData?.associated_company,
      segment: this.singleLeadData?.segment,
      br_number: this.singleLeadData?.br_number,
      assignedManager: this.singleLeadData?.assigned_hiring_manager,
      certificate_type: this.singleLeadData?.certificate_type,
      first_name: this.singleLeadData?.first_name,
      last_name: this.singleLeadData?.last_name,
      email: this.singleLeadData?.email,
      emplyoment_type: this.singleLeadData?.emplyoment_type,
      street_address: this.singleLeadData?.street_address,
      job_title: this.singleLeadData?.job_title,
      address2: this.singleLeadData?.address2,
      city: this.singleLeadData?.city,
      state: this.singleLeadData?.state,
      country: this.singleLeadData?.country,
      postal_code: this.singleLeadData?.postal_code,
      region: this.singleLeadData?.region,
      urd_number: this.singleLeadData?.urd_number,
      categories: this.singleLeadData?.categories,
      regional_bussiness_lead: this.singleLeadData?.regional_bussiness_lead,
      global_managing_director: this.singleLeadData?.global_managing_director,
      global_manager_sales: this.singleLeadData?.global_manager_sales,
      website_url: this.singleLeadData?.website_url,
      phone_number: this.singleLeadData?.phone_number,
      mobile_number: this.singleLeadData?.mobile_number,
      lead_created_by_name: this.singleLeadData?.lead_created_by_name,
      dqs_contact_source: this.singleLeadData?.dqs_contact_source,
      contact_owner: this.singleLeadData?.contact_owner,
      lead_created_date: this.singleLeadData?.lead_created_date,
      assigned_to: this.singleLeadData?.assigned_to,
      assessment_period: this.singleLeadData?.assessment_period,
      standard_program_assement: this.singleLeadData?.standard_program_assement,
      remarks: this.singleLeadData?.remarks,
      lead_validated_date: this.singleLeadData?.lead_validated_date,
      validated_by: this.singleLeadData?.validated_by,
      lead_validate_remarks: this.singleLeadData?.lead_validate_remarks,
      industry_sector: this.singleLeadData?.industry_sector,
      customer_category: this.singleLeadData?.customer_category,
      employee_count: this.singleLeadData?.employee_count,
      company_remarks: this.singleLeadData?.company_remarks,
      gst_applicable: this.singleLeadData?.gst_applicable,
      gst_number: this.singleLeadData?.gst_number,
      pan_number: this.singleLeadData?.pan_number,
      tan_number: this.singleLeadData?.tan_number,
      product_request: this.singleLeadData?.product_request,
      customer_sales_executive: this.singleLeadData?.customer_sales_executive,
      opportunity_type: this.singleLeadData.opportunity_type,
      opportunity_ref: this.singleLeadData.OpportunityRef_no,
      no_of_mandays: this.singleLeadData.no_of_mandays,
      ea_code: this.singleLeadData.ea_code,
      billing_site: this.singleLeadData.billing_site,
      non_cert_type: this.singleLeadData?.non_cert_type,
      document_remark: this.singleLeadData?.document_remark,
      lead_genration_id: this.singleLeadData?.lead_genration_id,
      // approver_name_l1Id:this.singleLeadData?. lead_created_by_name,
      approver_name_l1Id: Number(this.employee_id)

    })
  }

  // customerType() {
  //   this.cutomerType = true;
  // }
  // siteAudit() {
  //   this.sitAudit = true;
  // }

  // siteAuditNew() {
  //   this.sitAudit = false;
  // }

  // customerTypeNew() {
  //   this.cutomerType = false;
  // }

  // getCountryID(e: any) {

  //   this.leadService.getStateByID(e.value).subscribe((res:any) => {

  //     this.stateList = res.data;
  //   });
  // }
  // getAllSegment() {
  //   this.configService.getAllSegment().subscribe((res: any) => {
  //     this.segmentList = res.data;

  //   });
  // }

  // getCountry() {
  //   this.configService.getCountry().subscribe((res: any) => {
  //     this.countryList = res.data;

  //   });
  // }
  // getStateID(e: any) {

  //   this.leadService.getCityByID(e.value).subscribe((res:any) => {

  //     this.cityList = res.data;
  //   });
  // }
  // reloadCurrentRoute() {
  //   let currentUrl = this.route.url;
  //   let newVal = currentUrl.split("?")
  //   let prm = newVal[1].split('=')
  //   let val = newVal[1].slice(8)
  //   // alert(`${newVal[0]}?${prm[0]}=${val}`)



  //   this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //     this.route.navigate([newVal[0]],{queryParams:{[prm[0]]:val}});
  //   });

  // }
  // getPinCode(e: any) {

  //   this.leadService.getPinCodeNew(e.value).subscribe((res:any) => {
  //     this.pinCodeList = res.data;

  //     if (this.pinCodeList.length === 0) {
  //       this.pinCodeTrue = true;
  //     } else {
  //       this.pinCodeTrue = false;
  //     }
  //   });
  // }

  // getAchievementListt() {
  //   this.leadService.regionListGet().subscribe((res: any) => {

  //     this.allDataOne = res.data;
  //   });
  // }
  // regionalBusiness() {
  //   this.leadService.getListBusiness().subscribe((res: any) => {

  //     this.allDataTwo = res.data;
  //   });
  // }
  // globalManagerales() {
  //   this.leadService.getGlobalSalesM().subscribe((res: any) => {

  //     this.allDataMan = res.data;
  //   });
  // }

  submitForm() {
    this.submitted = false;

    // if (this.leadForm.invalid) {
    //   this.toast.error(
    //     'Required fields should not be empty.',
    //     'Error Occurred!'
    //   );
    //   return;
    // }
    let val = this.leadForm.value;


    this.submitted = true;

    const dataMain = {
      customer_type: val.customer_type,
      multiple_site_audit: val.site_audit || " ",
      associated_company: val.associated_company,
      segment: val.segment,
      non_cert_type: val.non_cert_type,
      certificate_type: val.certificate_type,
      first_name: val.first_name,
      last_name: val.last_name,
      email: val.email,
      emplyoment_type: val.emplyoment_type,
      job_title: val.job_title,
      street_address: val.street_address,
      address2: val.address2,
      city: val.city,
      state: val.state,
      assigned_to: val.assigned_to,
      country: val.country,
      postal_code: val.postal_code,
      region: val.region,
      regional_bussiness_lead: val.regional_bussiness_lead,
      global_managing_director: val.global_managing_director,
      global_manager_sales: val.global_manager_sales,
      website_url: val.website_url,
      phone_number: val.phone_number,
      lead_created_by_name: val.lead_created_by_name,
      mobile_number: val.mobile_number,
      dqs_contact_source: val.dqs_contact_source,
      contact_owner: val.contact_owner,
      lead_created_date: moment(val.lead_created_date).format('YYYY-MM-DD'),
      standard_program_assement: val.standard_program_assement,
      remarks: val.remarks,
      categories: val.categories,
      lead_validate_stage: val.lead_validate_stage,
      validated_by: val.validated_by,
      lead_validated_date: moment(val.lead_validated_date).format('YYYY-MM-DD'),
      lead_validate_remarks: val.lead_validate_remarks,
      lead_assgn_contact_owner: val.lead_assgn_contact_owner,
      assigned_by: val.assigned_by,
      stage: val.stage,
      lead_assgn_remark: val.lead_assgn_remark,
      customer_category: val.customer_category,
      product_request: val.product_request,
      customer_sales_executive: val.customer_sales_executive,
      opportunity_type: val.opportunity_type,
      opportunity_ref: val.opportunity_ref,
      billing_site: val.billing_site,
      no_of_mandays: val.no_of_mandays,
      ea_code: val.ea_code,
      assessment_period: val.assessment_period,
      industry_sector: val.industry_sector,
      employee_count: val.employee_count,
      company_remarks: val.company_remarks,
      gst_applicable: val.gst_applicable,
      gst_number: val.gst_number,
      pan_number: val.pan_number,
      tan_number: val.tan_number,
      approver_name_l1Id: Number(this.employee_id),
      approver_name_l1: this.loginUserName,
      travel_expence: val.travel_expence,
      other_expence: val.other_expence,
      status: "Invoice Raised"
    }
    const data = {
      contact_review_form: this.fileDetails.file,
      gst_file: this.fileDetailsOne.file,
      basic_form: this.fileDetailsTwo.file,
      company_logo: this.fileDetailsThree.file,
      other_file: this.fileDetailsFour.file,
      document_remark: val.document_remark,
    }

    if (data.contact_review_form) {

      this.leadService.editLeadDoc(this.lead_id, data).subscribe((res: any) => {

      });
    }
    this.leadService.editLead(this.lead_id, dataMain).subscribe((res: any) => {

      this.toast.success("Raise Invoice Successfully..")
      this.route.navigate(['master/finance/account-receivable/invoice-request']);
    })

  }
  updateForm() {
    this.submitted = false;
    if (this.leadForm.invalid) {

      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    const data = this.leadForm.value;

    this.leadService.editLead(this.lead_id, data).subscribe((res: any) => {


      this.toast.success("Invoice sent to Finance Successfully..")
      this.route.navigate(['master/lead/post-audit/generate-invoice']);
    })

  }
  reject() {
    const data = {
      status: "Rejected"
    }
    this.leadService.editLead(this.lead_id, data).subscribe((res: any) => {

      this.toast.success(res.message);
      this.route.navigate(['master/lead/lead-opportunity/opportunity-list'],
        { queryParams: { lead_id: this.lead_id } }
      );
    })
  }
  toggleAllCodeSelect() {
    if (this.allSelectedCode) {
      this.eacodeselect.options.forEach((item: MatOption) => item.select());
    } else {
      this.eacodeselect.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionEaCode() {
    let newStatus = true;
    this.eacodeselect.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedCode = newStatus;
  }
  cancel() {
    window.location.reload()
  }
  selectApprover(e: any) {

    this.employee_id = e.value
    let filterUserName = this.allAchievement.find((res: any) => res.employee_id == this.employee_id)

    this.loginUserName = filterUserName.first_name
  }

  Approved() {
    let val = this.leadForm.value;
    console.log(val, 'vall');

    let data = {
      wo_verified_on: val.wo_verified_on,
      wo_verification_status: val.wo_verification_status,
      comment1: val.comment1,
      comment2: val.comment2,
      comment3: val.comment3,
      comment4: val.comment4,
      comment5: val.comment5,
      comment6: val.comment6,
      audit_start_date: val.audit_start_date,
      audit_end_date: val.audit_end_date,
      ICT_Date: val.ICT_Date,
      br_lists: val.br_lists,
      addressLine: val.addressLine,
      streetAddress: val.streetAddress,
      gstNumber: val.gstNumber,
      creditDay: val.creditDay,
      Mob_number: val.Mob_number,
      state: val.state,
      city: val.city,
      firstName: val.firstName,
      jobTitle: val.jobTitle,
      email: val.email,
      associatedCompany: val.associatedCompany,
      wo_verification_comment: val.wo_verification_comment,
      wo_verify_by: val.wo_verify_by,
      br_number: val.BrNumber,
      totleNetAmount:this.totalNetAmount,
      status: 'Approved'
    }

    if(this.manual_id){
      this.leadService.aprovedManual_invoice(this.manual_id).subscribe((res:any)=>{
        if(res){
          this.toast.success(res.message);
          this.route.navigate(['master/finance/account-receivable/invoice-request/make-manual-invoice/approved-manual-invoice'])
        }
      },(err)=>{
        this.toast.error(err.error.message);
      })
    }else{
      this._finaceService.updateInvoiceRecivable(this.brNumber, data).subscribe((res: any) => {

        this.toast.success("Successfully", "Create Invoice Line Items")
        this.route.navigate(['master/finance/account-receivable/invoice-request/approved-invoice-list'],
          { queryParams: { brNumber: this.brNumber } }
        );
      })
    }

   

  }

  rejectCopy() {
    this.resonFiled = true;
  }
  rejectRecivable() {

    Swal.fire({
      title: 'Are you sure to Reject this Invoice ?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        let val = this.leadForm.value;
        console.log(val, 'vall');
        let data = {
          wo_verified_on: val.wo_verified_on,
          wo_verification_status: val.wo_verification_status,
          comment1: val.comment1,
          comment2: val.comment2,
          comment3: val.comment3,
          comment4: val.comment4,
          comment5: val.comment5,
          comment6: val.comment6,
          audit_start_date: val.audit_start_date,
          audit_end_date: val.audit_end_date,
          ICT_Date: val.ICT_Date,
          br_lists: val.br_lists,
          addressLine: val.addressLine,
          streetAddress: val.streetAddress,
          gstNumber: val.gstNumber,
          creditDay: val.creditDay,
          Mob_number: val.Mob_number,
          state: val.state,
          city: val.city,
          firstName: val.firstName,
          jobTitle: val.jobTitle,
          email: val.email,
          associatedCompany: val.associatedCompany,
          wo_verification_comment: val.wo_verification_comment,
          wo_verify_by: val.wo_verify_by,
          BrNumber: val.BrNumber,
          status: 'Reject'
        }
        if(this.manual_id){
          let data ={
            reason: this.leadForm.value.reason,
          }
          this.leadService.rejectManual_invoice(this.manual_id,data ).subscribe((res:any)=>{
            if(res){
              this.toast.success(res.message);
              this.route.navigate(['master/finance/account-receivable/invoice-request/make-manual-invoice/approved-manual-invoice'])
            }
          },(err)=>{
            this.toast.error(err.error.message);
          })
        }else{
          this._finaceService.updateInvoiceRecivable(this.brNumber, data).subscribe((res: any) => {

            this.toast.success("Successfully", "Reject Invoice")
            this.route.navigate(['master/finance/account-receivable/invoice-request/reject-invoice-list'],
              { queryParams: { brNumber: this.brNumber } }
            );
          })
        }
      };
    });

  }
  createInvoice() {
    let val = this.leadForm.value;
    console.log(val, 'vall');
  }

  getListExpense() {
    this._itteketService.getPaid().subscribe((res: any) => {
      this.rowDataExpense = res.result;
      console.log(this.rowDataExpense, 'this.rowDataExpense.brNumber');
      console.log(this.brNumber,'this.brNumber');

      const abc = [];
      for (let item of this.rowDataExpense) {
        console.log(item.brNumber,'item.brNumber');
        this.brNumberCopy = Number(item.brNumber);
        console.log(this.brNumberCopy,'this.brNumberCopy');
        
        if (this.brNumberCopy ===this.brNumber) {
          this.getListExpenseList.push(item)
        }

        console.log(item, 'item');
        this.splitTaskOrder = item.task_order.split('/');
        console.log(this.splitTaskOrder[0], 'this.splitTaskOrder');
        abc.push(this.splitTaskOrder[0])
        console.log(abc, 'abc');

      }
        console.log(this.getListExpenseList,'getListExpenseList');

      this.rowDataExpense.push(this.splitTaskOrder)
      console.log(this.rowDataExpense, 'rowDataExpense');

      for (let i = 0; i <= this.getListExpenseList.length; i++) {
        if (this.getListExpenseList.length > 0) {
          this.noExpenseData = true;

        }

      }
    })
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

      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      window.open(URL.createObjectURL(doc.output("blob")));
    });
  }
}
