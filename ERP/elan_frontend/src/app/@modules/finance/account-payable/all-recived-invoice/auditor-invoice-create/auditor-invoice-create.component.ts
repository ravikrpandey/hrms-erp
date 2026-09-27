import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ItticketingService } from 'src/app/@shared/services/itticketing.service';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
@Component({
  selector: 'app-auditor-invoice-create',
  templateUrl: './auditor-invoice-create.component.html',
  styleUrls: ['./auditor-invoice-create.component.scss']
})
export class AuditorInvoiceCreateComponent {
  expenceForm: any;
  myExpenseInvoiceId: any;
  expenseDataById: any;
  firstName: any;
  zohodata: any;
  firstNameCondition: any;
  firstNameCond: boolean = false
  singleLeadData: any;
  leadId: number;
  constructor(private fb: FormBuilder,
    private leadService: LeadService,
    private route: Router,
    private recruitService: RecruitService,
    private activeroute: ActivatedRoute,
    private toast: ToastrService,
    private configService: ConfigurationalmasterService,
    private _empRegistration: EmpRegistrationService,
    private _itteketService: ItticketingService,
    private _finaceService: FinaceService
  ) {
    this.expenceForm = this.fb.group({

      expense_report_no: new FormControl(null, [Validators.required, Validators.pattern('([0-9]){3}$'),]),
      br_number: new FormControl(),
      associated_company: new FormControl(),
      expense_type: new FormControl(),
      expense_name: new FormControl(),
      expense_desc: new FormControl(),
      finalAmount: new FormControl(),
      task_order: new FormControl(),
      travel_tickets: new FormControl(),
      expense_requestId: new FormControl(),
      expense_details: new FormControl(),
      first_name: new FormControl(),
      customer_type: new FormControl(),
      mobile_number: new FormControl(),
      contact_owner: new FormControl(),
      customer_category:new FormControl()
    })


  }
  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.myExpenseInvoiceId = params.myExpenseInvoiceId;
      console.log(params, 'params');
this.leadId=Number(params.leadId);
console.log(this.leadId,'this.leadId');

      console.log(this.myExpenseInvoiceId, 'this.myExpenseInvoiceId');

    })
this.getById_audit();
    this.getByExpenseDetails();
    this.getListExpense()
  }

  getByExpenseDetails() {
    this._itteketService.getByExpense(this.myExpenseInvoiceId).subscribe((res: any) => {
      this.expenseDataById = res.data;
      console.log(this.expenseDataById, 'this.expenseDataById');

      this.firstName = res.data?.first_name;
      // this.leadId=res.data?.l
      console.log(this.firstName, 'this.firstName');

      this.patchData();
    });
  }

  patchData() {
    this.expenceForm.patchValue({
      br_number: this.expenseDataById.br_number,
      associated_company: this.expenseDataById.associated_company,
      expense_type: this.expenseDataById.expense_type,
      expense_name: this.expenseDataById.expense_name,
      expense_desc: this.expenseDataById.expense_desc,
      finalAmount: this.expenseDataById.finalAmount,
      task_order: this.expenseDataById.task_order,
      travel_tickets: this.expenseDataById.travel_tickets,
      expense_requestId: this.expenseDataById.expense_requestId,
      expense_details: this.expenseDataById.expense_details,
      first_name: this.expenseDataById?.first_name
    })
  }



  getById_audit() {
    this.leadService.getByIdLead(this.leadId).subscribe((res: any) => {
      this.singleLeadData = res.data;
      console.log(this.singleLeadData,'this.singleLeadData');
      this.patchLeadDate();
       })
  }
  
  patchLeadDate(){
    this.expenceForm.patchValue({
      customer_type: this.singleLeadData?.customer_type,
      site_audit: this.singleLeadData?.multiple_site_audit,
      associated_company: this.singleLeadData?.associated_company,
      segment: this.singleLeadData?.segment,
      br_number: this.singleLeadData?.br_number,
      assignedManager: this.singleLeadData?.assigned_hiring_manager,
      certificate_type: this.singleLeadData?.certificate_type,
      first_name: this.singleLeadData?.first_name,
      last_name: this.singleLeadData?.last_name,
      categories: this.singleLeadData?.categories,
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
      regional_bussiness_lead: this.singleLeadData?.regional_bussiness_lead,
      global_managing_director: this.singleLeadData?.global_managing_director,
      global_manager_sales: this.singleLeadData?.global_manager_sales,
      website_url: this.singleLeadData?.website_url,
      phone_number: this.singleLeadData?.phone_number,
      mobile_number: this.singleLeadData?.mobile_number,
      dqs_contact_source: this.singleLeadData?.dqs_contact_source,
      contact_owner:this.singleLeadData?.contact_owner,
      lead_created_date: this.singleLeadData?.lead_created_date,
      standard_program_assement: this.singleLeadData?.standard_program_assement,
      remarks: this.singleLeadData?.remarks,
      lead_validated_date: this.singleLeadData?.lead_validated_date,
      lead_validate_remarks: this.singleLeadData?.lead_validate_remarks,
      industry: this.singleLeadData?.industry,
      lead_created_by_name:
        // this.mainEmployeeData?.first_name ||
        this.singleLeadData?.lead_created_by_name,
      // validated_by:
        // this.mainEmployeeData?.first_name || this.singleLeadData?.validated_by,
      customer_category: this.singleLeadData?.customer_category,
      employee_count: this.singleLeadData?.employee_count,
      company_remarks: this.singleLeadData?.company_remarks,
      gst_applicable: this.singleLeadData?.gst_applicable,
      gst_number: this.singleLeadData?.gst_number,
      pan_number: this.singleLeadData?.pan_number,
      tan_number: this.singleLeadData?.tan_number,
      assessment_period: this.singleLeadData?.assessment_period,
      ea_code: this.singleLeadData?.ea_code,
      add_cert_copy: this.singleLeadData?.add_cert_copy,
      accredition_logo_details: this.singleLeadData?.accredition_logo_details,
      auditorName: this.singleLeadData?.auditorName,
      // auditorName2: auditGetByData.auditorName2,
      // auditorName3: auditGetByData.auditorName3,
      CGCMNeeded: this.singleLeadData?.CGCMNeeded,
      // eaCode:auditGetByData.eacode ,
      // eaCode2: auditGetByData.eaCode2,
      // eaCode3: auditGetByData.eaCode3
      auditor_name2: this.singleLeadData?.auditor_name,

      auditorType:"Co-Auditor",
      // auditor_name:auditGetByData.auditor_name,
      auditorType2:"Lead Auditor",
      auditorName2:this.singleLeadData?.auditorName2,
      eaCode:this.singleLeadData?.ea_code,
      eaCode2:this.singleLeadData?.ea_code,
      finalAmount:this.singleLeadData?.totalAmount_inInr
    });
  }

  CreateExpense() {
    let val = this.expenceForm.value;
    console.log(val, 'vall');

    //   let data = {
    //     customer_id: 4142206000000113394,

    //     line_items: [
    //       {
    //         contact_id: this.myExpenseInvoiceId,
    //         br_number: val.br_number,
    //         company_name: val.associated_company,
    //         expense_type: val.expense_type,
    //         contact_name: val.expense_name,
    //         expense_desc: val.expense_desc,
    //         opening_balance_amount: val.finalAmount,
    //         task_order: val.task_order,
    //         travel_tickets: val.travel_tickets,
    //         expense_requestId: val.expense_requestId,
    //         expense_details: val.expense_details,
    //         first_name: val.first_name
    //       }
    //     ]


    //   }

    //   if(this.firstNameCond=true){

    //   this._finaceService.createExpenseZohoCopy(data).subscribe((res:any)=>{
    //     console.log(res,'resssss');
    //     this.toast.success("create ")
    //   })
    //   }else if(this.firstNameCond=false){
    //     this._finaceService.createExpenseZoho(data).subscribe((res: any) => {
    //       console.log(res, 'resssss');
    // this.toast.success("create no match ")
    //     })
    //   }



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
              expense_type: val.expense_type,
              contact_name: val.expense_name,
              expense_desc: val.expense_desc,
              opening_balance_amount: val.finalAmount,
              task_order: val.task_order,
              travel_tickets: val.travel_tickets,
              expense_requestId: val.expense_requestId,
              expense_details: val.expense_details,
              first_name: val.first_name
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
              expense_type: val.expense_type,
              contact_name: val.expense_name,
              expense_desc: val.expense_desc,
              opening_balance_amount: val.finalAmount,
              task_order: val.task_order,
              travel_tickets: val.travel_tickets,
              expense_requestId: val.expense_requestId,
              expense_details: val.expense_details,
              first_name: val.first_name

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

  getListExpense() {
    let val = this.expenceForm.value;
    this._finaceService.getAllDataExpenseZoho().subscribe((res: any) => {
      this.zohodata = res.data;
      console.log(this.zohodata, 'this.zohodata');


      const empName: any = []
      for (let i = 0; i < res.data.length; i++) {
        //  this.rowData=res.data[i].first_name
        empName.push(res.data[i].first_name)

        // empName.map((item:any)=>{
        //   item===this.expenseDataById?.first_name;
        //   console.log(item,'item');

        // })

      }
      console.log(this.expenseDataById?.first_name, 'this.expenseDataById?.first_name');
      console.log(empName, 'empName');


      for (let a = 0; a <= empName.length; a++) {
        if (empName[a] === "Dell") {
          console.log(true, 'true');
          this.firstNameCond = true;
          return
        } else {
          console.log(false, 'fasle');
          this.firstNameCond = false;

        }

      }

      // if(empName===this.expenseDataById?.first_name){
      //   console.log(true,'true');

      //         }else{
      //           console.log(false,'false');

      //         }
      // this.rowData=res.data;
      this.firstNameCondition = empName

    })
  }
}
