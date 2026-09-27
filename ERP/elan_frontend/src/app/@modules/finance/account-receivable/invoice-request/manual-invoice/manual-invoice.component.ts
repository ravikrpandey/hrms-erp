import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { calendarFormat } from 'moment';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ConfigurationalmasterService } from '../../../../../@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-manual-invoice',
  templateUrl: './manual-invoice.component.html',
  styleUrls: ['./manual-invoice.component.scss'],
})
export class ManualInvoiceComponent {
  leadForm: FormGroup;
  invoice_list: any;
  jobType: any;
  candidateArray: any;
  interviewGetId: any;
  candidateId: any;
  id: any;
  interview_id: any;
  clicked: boolean = false;
  cutomerType: boolean = false;
  sitAudit: boolean = false;
  expoValue: boolean = false;
  nonCertt: boolean = false;
  lead_id: any;
  val: any;
  // New commit
  value: any;
  public searchResult: any;
  mainId: string | null;
  mainEmployeeData: any;
  allAchievement: any;
  categoryList: any;
  allCompanyList: any;
  allData: any;
  companyData: any;
  myDate = new Date();
  submitted: boolean;
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any;
  countryName: any;
  stateName: any;
  allAchievementt: any;
  allDataOne: any;
  allDataTwo: any;
  allDataMan: any;
  leadNewId: any;
  leadStatus: boolean = false;
  pinCodeList: any;
  standardList: any;
  industryList: any;
  cityName: any;
  singleLeadData: any;
  pinCodeTrue: boolean = false;
  medical: boolean = false;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  // day = this.now.getDay();
  date = this.now.getDate();
  setInr: boolean = false;
  maxDate = moment({
    year: this.year + 100,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');
  minDate = moment({
    year: this.year - 0,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');
  edit_lead_id: any;
  newChildData: any;
  currency: any = [
    {
      currency_name: 'INR',
    },
    {
      currency_name: 'Others',
    },
  ];
  productdata: any;
  currencyData: any;
  manualData: any;
  modify_Data: any;
  add_dynamic_invoice: any;
  qnt_value: any;
  unit_price: any;
  br_no: any;
  singleLeadData1: any;
  sr_no_add: any;
  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private route: Router,
    private recruitService: RecruitService,
    private configService: ConfigurationalmasterService,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toast: ToastrService,
    private _empRegistration: EmpRegistrationService
  ) {
    const urlRegex =
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    this.leadForm = this.fb.group({
      client_name: new FormControl(),
      br_number: new FormControl(),
      ICTDate: new FormControl(),
      associatedCompany: new FormControl(null),
      audit_start_date: new FormControl(),
      audit_end_date: new FormControl(),
      state: new FormControl(null),
      city: new FormControl(null),
      creditDays: new FormControl(),
      email: new FormControl(null),
      firstName: new FormControl(null),
      gst_number: new FormControl(),
      wo_verifyOn: new FormControl(null),
      wo_verifyBy: new FormControl(null),
      wo_verification_status: new FormControl(null),
      export_charges: new FormControl(null),

      customer_type: new FormControl(null),
      child_name: new FormControl(null),
      product: new FormControl(null),
      discription: new FormControl(null),
      currency: new FormControl(null),
      total_amount: new FormControl(null),
      sac_code: new FormControl(null),
      additonal_charges: new FormControl(null),
      gst: new FormControl(null),
      expo_charges: new FormControl(null),
      site_audit: new FormControl(null, Validators.required),
      associated_company: new FormControl(null, Validators.required),
      br_number1: new FormControl(null),
      expo_value: new FormControl(null),
      mobilePhonenumber: new FormControl(null),
      gstNumber: new FormControl(),
      first_name: new FormControl(),
      firstName1: new FormControl(), 
      item_details: new FormArray([
        new FormGroup({
          item_discription: new FormControl(null),
          quantity: new FormControl(null),
          unit: new FormControl(null),
          unitPrice: new FormControl(null),
          net_amount:new FormControl(null),
          br_number: new FormControl(this.br_no),
        })
      ]),


      jobTitle: new FormControl(null),
      streetAddress: new FormControl(null),
      addressLine2: new FormControl(null),
      manual_Invoice_status: new FormControl('Yes'),
      status: new FormControl('Invoice Raised'),
      manual_invoice_status:new FormControl('pending')
    });
  }

  get CF_1(): any {
    return this.leadForm.controls;
  }

  addrow() {
    <FormArray>this.CF_1.item_details.push(
      new FormGroup({
        item_discription: new FormControl(null),
        quantity: new FormControl(null),
        unit: new FormControl(null),
        unitPrice: new FormControl(null),
        net_amount: new FormControl(null),
        br_number: new FormControl(this.br_no),
      })
    );
  }

  deleteRow(i: any, control: any) {
    if (this.CF_1.item_details.length > 1) {
      this.CF_1.item_details.removeAt(i);
    } else {
      this.toast.error("Can't Deleted", 'must be one');
    }
  }

  line_itms_change(e: any, data: any) {
    console.log(e.target.checked, 'eeeee');
    console.log(data, 'eeeee');
    const { lineItem_status, invoice_inline_id } = data;
    if (e.target.checked == true) {
      this.modify_Data.push(
        {
          lineItem_status: true,
          invoice_inline_id: invoice_inline_id,
          statusInvoice: 'Send Finance',
        }
        // invoice_inline_id: data.invoice_inline_id, lineItem_status: true},
      );
      console.log(this.modify_Data, ' <--modify_Data');
    } else {
      this.modify_Data.push(
        { lineItem_status: false, invoice_inline_id: invoice_inline_id }

        // { invoice_inline_id: data.invoice_inline_id, lineItem_status: false},
      );
      console.log(this.modify_Data, ' <--modify_Data');
    }
  }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
      this.lead_id = this.id.lead_id;
      this.leadForm.patchValue({
        expo_value: 'Yes',
        currency: 'INR',
      });
      this.setInr = true;
      this.leadService.getByIdLead(this.lead_id).subscribe((res: any) => {
        this.singleLeadData = res.data;
        this.patchFormvalueTwo();

        this.leadService.getByIdLead(this.lead_id).subscribe((res: any) => {
          this.singleLeadData = res.data;
          this.patchFormvalueThree();
        });
      });

      this.leadService.getByIdLeadId(this.lead_id).subscribe((res: any) => {
        let x = res.data.map((a: any) => {
          return { ...a, checked: false };
        });
        this.singleLeadData1 = x;
      });
      this.sr_no_add = this.invoice_list?.length + 1;
    });
    this.getAchievementList();
    this.patchFormvalue();
    this.getCategory();
    this.getCompanyList();
    this.getCountry();
    this.getCity();
    this.getAchievementListt();
    this.regionalBusiness();
    this.globalManagerales();
    this.getStandardProgram();
    this.mainId = localStorage.getItem('EmpMainId');
    if (this.mainId != undefined) {
      this._empRegistration.getByUserId(this.mainId).subscribe((res) => {
        this.mainEmployeeData = res.data;
        this.getAchievementList();
        this.patchFormvalue();
        // if (!this.id) {
        // }
      });
    }

    this._configurationalMasterService.getProduct().subscribe((res: any) => {
      this.productdata = res.data;
    });

    this._configurationalMasterService.CurrencyList().subscribe((res: any) => {
      this.currencyData = res.data;
    });

    this.InvoiceLineItems(this.br_no);
  }

  medicalFlow() {
    this.medical = true;
  }

  patchFormvalueTwo() {
    // this.cutomerType = true;
    this.leadForm.patchValue({
      customer_type: 'Existing User',
      br_number: this.singleLeadData?.br_number,
    });
    this.leadStatus = true;
  }
  patchFormvalueThree() {
    // this.cutomerType = true;
    this.leadForm.patchValue({
      customer_type: 'Existing User',
      new_location_site: 'No',
      br_number: this.singleLeadData?.br_number,
    });
    this.leadStatus = true;
  }
  getCountryID(e: any) {
    this.leadService.getStateByID(e.value).subscribe((res: any) => {
      this.stateList = res.data;
    });
  }
  getStateID(e: any) {
    this.leadService.getCityByID(e.value).subscribe((res: any) => {
      this.cityList = res.data;
    });
  }
  getPinCode(e: any) {
    this.leadService.getPinCodeNew(e.value).subscribe((res: any) => {
      this.pinCodeList = res.data;

      if (this.pinCodeList.length === 0) {
        this.pinCodeTrue = true;
      } else {
        this.pinCodeTrue = false;
      }
    });
  }
  getStandardProgram() {
    this._configurationalMasterService.listAsses().subscribe((res: any) => {
      this.standardList = res.data;
    });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  scrollTwo(el: HTMLElement) {
    el.scrollIntoView();
  }

  get f(): any {
    return this.leadForm.controls;
  }

  getCountry() {
    this.configService.getCountry().subscribe((res: any) => {
      this.countryList = res.data;
    });
  }

  InvoiceLineItems(br: any) {
    // const data={
    //     br_number: br
    // }
    this.leadService.InvoiceLineItems(br).subscribe((res: any) => {
      this.invoice_list = res.data;
    });
  }

  add_new_invoice() {
    this.sr_no_add = this.invoice_list.length + 1;
    this.add_dynamic_invoice.controls.sr_no_add.setValue(this.sr_no_add);

    const data = {
      sr: this.add_dynamic_invoice.value.sr_no_add,
      items: this.add_dynamic_invoice.value.item_description,
      quentity: this.add_dynamic_invoice.value.qty,
      unit: this.add_dynamic_invoice.value.unit,
      unit_price: this.add_dynamic_invoice.value.unit_price,
      netAmout: this.add_dynamic_invoice.value.net_amount,
    };

    if (this.add_dynamic_invoice.invalid) {
      this.toast.error('Error', 'Please fill correct details');
    } else {
      // this.invoice_list.push(data);
      // this.toast.success("Invoice Create Successfully..");
      //
    }
  }

  onKey_qty(e: any) {
    this.qnt_value = e.target.value;
    const net_amt: any = this.qnt_value * this.unit_price;
    this.add_dynamic_invoice.controls.net_amount.setValue(net_amt);
  }
  onKey_unit_price(e: any) {
    this.unit_price = e.target.value;
    const net_amt: any = this.qnt_value * this.unit_price;
    this.add_dynamic_invoice.controls.net_amount.setValue(net_amt);
  }

  getCity() {
    // this.configService.getCity().subscribe((res: any) => {
    //   this.cityList = res.data;
    //
    // });
  }

  getCategory() {
    this.configService.listCategory().subscribe((res: any) => {
      this.categoryList = res.data;
    });
  }

  fetchSeries(value: String) {
    if (value === '') {
      return (this.searchResult = []);
    }
    this.searchResult = this.allCompanyList.filter_company_name(function (
      series: any
    ) {
      return series.associated_company.toLowerCase().startsWith(value);
    });
  }

  candidateClick(e: any) {
    this.candidateId = e;
    this.recruitService.interViewGetIdBy(e).subscribe((res: any) => {
      this.interviewGetId = res.data;

      this.patchFormvalue();
    });
  }

  patchFormvalue() {
    this.leadForm.patchValue({
      customer_type: 'New User',
      site_audit: 'Yes',
      global_managing_director: 'Dr Murugan',
      contact_owner: this.mainEmployeeData?.first_name,
      lead_created_by_name: this.mainEmployeeData?.first_name,
      lead_created_date: this.myDate,
    });
  }

  getAchievementList() {
    this.recruitService.getAllAchivement().subscribe(
      (res: any) => {
        this.allAchievement = res.data;
      },
      (err) => {}
    );

    this.leadService.getLead().subscribe((res: any) => {
      this.allData = res.result;
    });
  }

  getAchievementListt() {
    this.leadService.regionListGet().subscribe((res: any) => {
      this.allDataOne = res.data;
    });
  }
  regionalBusiness() {
    this.leadService.getListBusiness().subscribe((res: any) => {
      this.allDataTwo = res.data;
    });
  }

  globalManagerales() {
    this.leadService.getGlobalSalesM().subscribe((res: any) => {
      this.allDataMan = res.data;
    });
  }

  checkComp(e: any) {
    for (let item of this.allCompanyList) {
      console.log(item.associated_company, e);
      if (item.associated_company === e) {
        this.companyData = item;

        this.leadNewId = this.companyData?.lead_genration_id;
      }
    }
    this.leadService.getByIdLead(this.leadNewId).subscribe((res: any) => {
      this.newChildData = res.data;
    });
    this.leadForm.patchValue({
      segment: this.companyData?.segment,
      certificate_type: this.companyData?.certificate_type,
      br_number1: this.companyData?.br_number,
      br_number: this.companyData?.br_number,
    });
  }

  childSite() {
    if (this.newChildData?.country != 'undefined || null') {
      this.leadService
        .getStateByID(this.newChildData?.country)
        .subscribe((res: any) => {
          this.stateList = res.data;
        });
    }
    if (this.newChildData?.state != 'undefined || null') {
      this.leadService
        .getCityByID(this.newChildData?.state)
        .subscribe((res: any) => {
          this.cityList = res.data;
        });
    }
    if (this.newChildData?.city != 'undefined || null') {
      this.leadService
        .getPinCodeNew(this.newChildData?.city)
        .subscribe((res: any) => {
          this.pinCodeList = res.data;

          // if (this.pinCodeList.length === 0) {
          //   this.pinCodeTrue = true;
          // } else {
          //   this.pinCodeTrue = false;
          // }
        });
    }
    this.leadForm.patchValue({
      first_name: this.newChildData?.first_name,
      last_name: this.newChildData?.last_name,
      email: this.newChildData?.email,
      job_title: this.newChildData?.job_title,
      street_address: this.newChildData?.street_address,
      address2: this.newChildData?.address2,
      city: this.newChildData?.city,
      state: this.newChildData?.state,
      country: this.newChildData?.country,
      postal_code: this.newChildData?.postal_code,
      region: this.newChildData?.region,
    });
  }

  yesChild() {
    this.leadForm.patchValue({
      first_name: '',
      last_name: '',
      email: '',
      job_title: '',
      street_address: '',
      address2: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      region: '',
    });
    this.leadStatus = true;
  }

  getCompanyList() {
    this.leadService.getCompany().subscribe(
      (res: any) => {
        this.allCompanyList = res.result;
      },
      (err) => {}
    );
  }

  customerType(e: any) {
    this.cutomerType = true;
    if (e.target.defaultValue == 'Existing User') {
      this.leadForm.controls['associated_company'].reset();
      this.leadForm.controls['br_number1'].reset();
      this.leadForm.controls['child_name'].reset();
    }
  }

  customerTypeNew(e: any) {
    console.log('ggg', e.target.defaultValue);

    this.cutomerType = false;
    if (e.target.defaultValue == 'New User') {
      this.leadForm.controls['associated_company'].reset();
      this.leadForm.controls['br_number1'].reset();
      this.leadForm.controls['child_name'].reset();
    }
  }
  nonCert() {
    this.nonCertt = true;
  }
  nonCertNew() {
    this.nonCertt = false;
  }

  siteAudit() {
    this.sitAudit = true;
  }

  siteAuditNew() {
    this.sitAudit = false;
  }

  back() {
    this.route.navigate(['master/lead/lead-management/generate-lead']);
  }

  create_manual_invoice() {
    this.submitted = false;
    let val = this.leadForm.value;
    this.submitted = true;
    this.leadService.create_manual_invoice(val).subscribe(
      (res: any) => {
        this.lead_id = res.data.Manual_Invoice_id;
        this.toast.success('Raise Invoice Successfully..');
        if (res.code == 200) {
          this.leadService.manualById(this.lead_id).subscribe((res: any) => {
            this.manualData = res.data;
            this.br_no = this.manualData.br_number;
            this.InvoiceLineItems(this.br_no);
          });
        }
      },
      (err: any) => {
        this.toast.error(err.error.message);
        // this.clearInput();
      }
    );
  }

  submitForm() {
    this.submitted = false;
    let val = this.leadForm.value;
    this.submitted = true;
    const data = {
      client_type: val.customer_type,
      associated_company: val.associated_company,
      product: val.product || ' ',
      description: val.description || ' ',
      currency: val.currency || ' ',
      sac_code: val.sac_code || ' ',
      additonal_charges: val.additonal_charges || ' ',
      gst_number: val.gst || ' ',
      expo_charges: val.expo_charges || ' ',
      br_number: Number(val.br_number1) || ' ',
      status: 'Invoice Raised',
    };
    console.log('data', data);

    this.leadService.createInvoice(val).subscribe(
      (res: any) => {
        this.lead_id = res.data.lead_genration_id;
        this.toast.success('Raise Invoice Successfully..');
        this.route.navigate([
          'master/finance/account-receivable/invoice-request',
        ]);
      },
      (err: any) => {
        this.toast.error(err.error.message);
        this.clearInput();
      }
    );
  }

  createInvoice() {
    const data = {
      item_description: this.add_dynamic_invoice.value.item_description,
      quantity: this.add_dynamic_invoice.value.qty,
      unit: this.add_dynamic_invoice.value.unit,
      unitPrice: this.add_dynamic_invoice.value.unit_price,
      br_number: this.br_no,
      lead_generation: this.lead_id,
    };

    console.log('data', data);
    this.leadService.inline_create_invoice(data).subscribe((res: any) => {
      console.log(res);
      // window.location.reload();
      this.toast.success('Successfully', 'Create Invoice Line Items');
    });
  }

  reject() {
    const data = {
      status: 'Rejected',
    };
    this.leadService.editLead(this.lead_id, data).subscribe((res: any) => {
      this.toast.success(res.message);
      this.route.navigate(['master/lead/lead-opportunity/opportunity-list'], {
        queryParams: { lead_id: this.lead_id },
      });
    });
  }

  clearInput() {
    // Clear the input field
    this.leadForm.get('associated_company')?.reset();
    this.leadForm.get('email')?.reset();
  }
  Skip() {
    this.route.navigate([], { queryParams: {} });
  }
  contactOwner(e: any) {}
  selectCurrency(e: any) {
    if (e.value === 'INR') {
      this.setInr = true;
    } else {
      this.setInr = false;
    }
  }
  

  createItemDetails(){
    if(!this.lead_id){
     this.toast.error('Pelese Create Invoice First')
     return
    }
   let data = {
    item_details: this.CF_1.item_details.value
   }
   this.leadService.createItemDetails( this.lead_id,data).subscribe((res:any)=>{
    console.log("response", res );
    this.route.navigate(['master/finance/account-receivable/invoice-request/make-manual-invoice/pending-manual-invoice'])
    this.toast.success(res.message)
   },(err)=>{
    this.toast.error(err.error.message)
   })
  }
}
