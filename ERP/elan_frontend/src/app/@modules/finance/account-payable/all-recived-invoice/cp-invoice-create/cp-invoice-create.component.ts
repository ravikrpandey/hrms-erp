import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ChannelPartnerService } from 'src/app/@shared/services/channel-partner.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
@Component({
  selector: 'app-cp-invoice-create',
  templateUrl: './cp-invoice-create.component.html',
  styleUrls: ['./cp-invoice-create.component.scss']
})
export class CpInvoiceCreateComponent {
  provisionForm: FormGroup;
  provisionId: any;
  loginUser: any;
  singleProvision: any;
  cpId: number;
  cpSingleData: any;
  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private route: Router,
    private recruitService: RecruitService,
    private configService: ConfigurationalmasterService,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toast: ToastrService,
    private _cpService: ChannelPartnerService,
    private _finaceService:FinaceService
  ) {
    this.provisionForm = this.fb.group({
      associated_company: new FormControl(null, Validators.required),
      cp_name: new FormControl(null, Validators.required),
      certificate_type: new FormControl(null, Validators.required),
      s1_wo: new FormControl(null, Validators.required),
      s2_wo: new FormControl(null, Validators.required),
      service_type: new FormControl(null, Validators.required),
      product: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      GST_number: new FormControl(null, Validators.required),
      MSME_number: new FormControl(null, Validators.required),
      assessment_fee: new FormControl(null, Validators.required),
      delivered_month: new FormControl(null, Validators.required),
      SP_name: new FormControl(null, Validators.required),
      requested_incentive: new FormControl(null, Validators.required),
      special_incentive_amount: new FormControl(null, Validators.required),
      agreed_incentive: new FormControl(null, Validators.required),
      invoice_number: new FormControl(null, Validators.required),
      invoice_date: new FormControl(null, Validators.required),
      invoice_submitted_by_CP: new FormControl(null, Validators.required),
      remarks: new FormControl(null, Validators.required),
      comments: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.provisionId = params.provision_id;
      console.log(params.provision_id);
console.log(params,'params');

this.cpId=Number(params.CPId);
console.log(this.cpId,'this.cpId');

      // if (params.provision_id) {
      //   this.get_ById_RBH_Provision(params.provision_id)
      // };
    });
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    // this.provisionForm.disable();
    // this.provisionForm.controls['comments'].enable()
    this.getByCp()
  }

  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  FromDate: string;
  toDate: string;
  // day = this.now.getDay();
  date = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minDate = moment({ year: this.year - 0, month: this.month, date: this.date }).format('YYYY-MM-DD');
  fromDate(e: any) {
    this.FromDate = moment(e.value).format('YYYY-MM-DD');
  }
  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
    console.log(this.toDate, "to date");
  }


getByCp(){
  this._finaceService.getByChannelPartner(this.cpId).subscribe((res:any)=>{
console.log(res,'resss cp');
this.cpSingleData=res.data;
this.patchDataCp()
  })
}


patchDataCp(){
 this.provisionForm.patchValue({
  associated_company:this.cpSingleData?.associated_company,
  cp_name:this.cpSingleData?.CP_Name,
  certificate_type:this.cpSingleData?.certificate_type_name,
  s1_wo:this.cpSingleData?.s1_wo,
  s2_wo:this.cpSingleData?.s2_wo,
  service_type:this.cpSingleData?.stage,
  product:this.cpSingleData?.product_request,
  address:this.cpSingleData?.address,
  GST_number:this.cpSingleData?.gst_number,
  MSME_number:this.cpSingleData?.msme_number,
  assessment_fee:this.cpSingleData?.Assessment_Fee,
  delivered_month:this.cpSingleData?.delivery_month,
  SP_name:this.cpSingleData?.sp_name,
  requested_incentive:this.cpSingleData?.requsted_incentive,
  special_incentive_amount:this.cpSingleData?.special_incentive_amount,
  agreed_incentive:this.cpSingleData?.agreed_incentive,
  invoice_number:this.cpSingleData?.invoice_number,
  invoice_date:this.cpSingleData?.invoice_date,
  invoice_submitted_by_CP:this.cpSingleData?.invoice_submitted_By_CP,
  remarks:this.cpSingleData?.remarks,
  comments:this.cpSingleData?.comments,
 })
}

  // patchData(data: any) {
  //   let patchData = {
  //     associated_company: data.associated_company,
  //     cp_name: data.CP_Name,
  //     certificate_type: data.certificate_type_name,
  //     s1_wo: data.s1_wo,
  //     s2_wo: data.s2_wo,
  //     service_type: data.stage,
  //     product: data.product_request,
  //     address: data.address2,
  //     GST_number: data.gst_number,
  //     MSME_number: Number(data.msme_number),
  //     assessment_fee: data.Assessment_Fee,
  //     delivered_month: data.delivery_month,
  //     SP_name: data.sp_name,
  //     requested_incentive: data.requsted_incentive,
  //     special_incentive_amount: data.special_incentive_amount,
  //     agreed_incentive: data.Agreed_prec_incentive,
  //     invoice_number: data.invoice_number,
  //     invoice_date: data.invoice_date,
  //     invoice_submitted_by_CP: data.invoice_submitted_By_CP,
  //     remarks: data.remarks,
  //   };
  //   this.provisionForm.patchValue(patchData);
  // }

  OnAction() {
    // if (this.provisionForm.invalid) {
    //   this.toast.error('Please write the comments')
    //   return;
    // }
    let formVal = this.provisionForm.value;
    let data = {
      lead_genration_id: this.singleProvision.lead_genration_id,
      rbh_id: this.loginUser.employee_id,
      rbh_name: this.loginUser.first_name,
      comments: formVal.comments,
      // status: action
    }
    this.provision_RBH_Approval(this.singleProvision.provision_rbh_approval_id, data)
  };

  
  // get_ById_RBH_Provision(id: any) {
  //   this._cpService.get_ById_RBH_Provision(id).subscribe(
  //     (res: any) => {
  //       this.singleProvision = res.data;
  //       // this.patchData(res.data)
  //     }, (err) => {
  //       if (err.error.code === 405) {
  //         this.toast.warning(`${err.error.message}`)
  //       }
  //     })
  // };

  provision_RBH_Approval(id: any, data: any) {
    this._cpService.provision_RBH_Approval(id, data).subscribe(
      (res: any) => {
        this.toast.success(`Provision ${data.status} Successfully`)
        this.route.navigate(['master/channel-partner/cp-list/rbh-approver'])
        console.log(res);
      }, (err) => {
        if (err.error.code === 405) {
          this.toast.warning(`${err.error.message}`)
        }
      })
    };
    
  cancel() {
    this.route.navigate(['master/channel-partner/cp-list/rbh-approver'])
  }
}
