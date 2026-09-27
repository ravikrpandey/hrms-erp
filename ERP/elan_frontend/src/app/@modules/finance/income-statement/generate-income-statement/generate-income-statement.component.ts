import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray,AbstractControl,ValidatorFn } from '@angular/forms';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { environment } from 'src/app/environments/environment';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { IncomeStatementService } from 'src/app/@shared/services/income-statement.service';

const databaseKey: any = environment.servralUrl;
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      // Return an error object to indicate validation failure
      return { leadingSpaces: true };
    }
    // Return null if validation passes
    return null;
  };
}
@Component({
  selector: 'app-generate-income-statement',
  templateUrl: './generate-income-statement.component.html',
  styleUrls: ['./generate-income-statement.component.scss']
})
export class GenerateIncomeStatementComponent {
  incomeStatementForm: any;
  generateForm:any;
  viewMode: any = false;
  file: any;
  id: any;
  data: any;
  img:any;
  mode:any;
  fYears: any = [];
  fYearsFiltered:any = [];
  entity_id:any;
  getData: any;
  filter_fy:any;
  isGenerated:any = false;
  type:any;
  fid:any;
  user_id:any;
  departments :any = [];
  workflowList : any = [];
  workFlowError: boolean;
  createdData: any;
  name : any;
  approveMode : any = false;
  constructor(private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private toast: ToastrService,
    private locatin: Location,
    private location: Location,
    private _rbackMasterService : RbacMasterService,
    private config: ConfigurationalmasterService,
    private toaster:ToastrService,
    private entityService: EntityMasterService,
    private incomeService: IncomeStatementService,
    private finace : FinaceService
  ) {
    // incomeStatementForm
    this.generateForm = this.fb.group({
      financial_year_id: new FormControl(null, [Validators.required]),
      entity_id: new FormControl(null, [Validators.required]),
      income_type: new FormControl("Forecast", [Validators.required]),
      department_id: new FormControl(null, [Validators.required]),
      user_id: new FormControl(null, [Validators.required]),
      buisness_unit: new FormControl(null,[Validators.required]),
      filter_fy: new FormControl(null, [Validators.required]),
    })

    this.incomeStatementForm = this.fb.group({
        financial_year_id: new FormControl(null, [Validators.required]),
        entity_id: new FormControl(null, [Validators.required]),
        income_type: new FormControl("Forecast", [Validators.required]),
        filter_fy: new FormControl(null, [Validators.required]),
        department_id: new FormControl(null, [Validators.required]),
        user_id: new FormControl(null, [Validators.required]),
      buisness_unit: new FormControl(null,[Validators.required]),
        total_revenue: new FormControl(null, [Validators.required]),
        gross_profit_loss: new FormControl(null, [Validators.required]),
        operating_expense: new FormControl(null, [Validators.required]),
        variable_cost: new FormControl(null, [Validators.required]),
        ebitda: new FormControl(null, [Validators.required]),
        depreciation_and_amortization: new FormControl(null, [Validators.required]),
        operating_profit_loss: new FormControl(null, [Validators.required]),
        investment_income: new FormControl(null, [Validators.required]),
        interest_paid_and_finance_charges: new FormControl(null, [Validators.required]),
        net_income_loss_before_tax: new FormControl(null, [Validators.required]),
        attributable_earning: new FormControl(null, [Validators.required]),
        remarks: new FormControl(null,[Validators.required]),
    })
  }
  // income_type, total_revenue, operating_expense, variable_cost, ebitda, gross_profit_loss, depreciation_and_amortization, operating_profit_loss, investment_income, interest_paid_and_finance_charges, net_income_loss_before_tax, attributable_earning, remark,  financial_year_id, user_id, department_id, entity_id, filter_fy
  ngOnInit(): void {
    this.filter_fy = localStorage.getItem('financial_id');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.generateForm.controls['filter_fy'].setValue(this.filter_fy)
    this.incomeStatementForm.controls['filter_fy'].setValue(this.filter_fy)
    this.generateForm.controls['entity_id'].setValue(this.entity_id)
    this.incomeStatementForm.controls['entity_id'].setValue(this.entity_id)

    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.mode  = params.mode;
      if ( params.type && params.fid ) {
        this.type = params.type;
        this.fid = params.fid;
      }
      if ( params.mode == "view"){
        this.viewMode = true;
      }
      if ( params.page == "approve"){
        this.approveMode = true;  
      }
    })
    let loginUser: any = localStorage.getItem('signInUser');
    this.user_id = JSON.parse(loginUser).employee_id;
    if ( !this.id ){
      this.generateForm.controls['user_id'].setValue(this.user_id)
      this.incomeStatementForm.controls['user_id'].setValue(this.user_id)
    }
    this.apiOnLoad();
    if (this.id) {
      this.getIncomeStatement2()
    }
  }
  apiOnLoad(){
    this.getAllFinancialYear()
    this.getDepartment()
    // /api/v1/getAllRoleMaster/Super%20Admin
  }

  onFinancialYearChange = (e:any) => {
    this.incomeStatementForm.controls['financial_year_id'].setValue(e.value)
  }

  getAllFinancialYear() {
    this.finace.getFinancialYearActive().subscribe((res: any) => {
      this.fYears = res.data;
      this.fYearsFiltered = res.data;
      let currentYear:any = new Date().getFullYear();
      this.fYearsFiltered = this.fYearsFiltered.filter((yr:any) => {
        if (yr.financial_year > currentYear ){
          return true;
        }else {
          return false;
        }
      })
      if ( this.fid ) {
        this.fid = Number(this.fid)
        this.generateForm.patchValue( {financial_year_id: this.fid} )
        this.generateForm.patchValue( {income_type: this.type} )
        this.getIncomeStatement()
      }
    })
  }

  onSelection = (e:any) => {
    let currentYear:any = new Date().getFullYear();
    if ( this.generateForm.controls['income_type'].value == 'Forecast') {
      this.fYearsFiltered = this.fYears.filter((yr:any) => {
        if (yr.financial_year > currentYear ){
          return true;
        }else {
          return false;
        }
      })
    }else if (this.generateForm.controls['income_type'].value == 'Actual' ){
      this.fYearsFiltered = this.fYears.filter((yr:any) => {
        if (yr.financial_year >= currentYear ){
          return true;
        }else {
          return false;
        }
      })
    }
  }

  getDepartment = () => {
    this.config.getAllDepartment_all_active(this.entity_id).subscribe((res: any) => {
      this.departments = res.data;
      this.getWorkflowList()
    },(err: any) => {
      this.departments = [];
    })
  }
    
  getWorkflowList() {
    this.config.getAllWorkFlowJob(this.entity_id).subscribe((res: any) => {
      this.workflowList = res.data;
      if (!this.id){
        console.log("function definitelu readcjhed herer")
        this.getBuisnessUnit()
      }
      // this.rowData = res.data.filter((item:any)=>item?.status == "ACTIVE")
    },
    ((err:any)=>{
      this.workflowList=[]
      this.toaster.error(`${err.error.message}`)
    })
    )
  }


  getBuisnessUnit = () => {
    let check = false;
    setTimeout(() => {
      this.finace.getBuisnessUnit( this.user_id).subscribe((res: any) => {
        this.departments.map((department:any) => {
          if ( department.dept_id == res.data.department_id ) {
            this.generateForm.controls['department_id'].setValue(res.data.department_id)
            this.incomeStatementForm.controls['department_id'].setValue(res.data.department_id)
            this.name = department.department_name
            this.workflowList.map((workflow:any) => {
              if ( workflow.job_name == 'Income Statement'){
                if (workflow.department_name == department.department_name) {
                  check = true;
                }
              }
            })
            this.generateForm.controls['buisness_unit'].setValue(department.department_name)
            this.incomeStatementForm.controls['buisness_unit'].setValue(department.department_name)
          }
        })
        if (!check) {
          this.workFlowError = true;
          // this.toaster.warning(`Workflow is not created for this department`)
        }
      }
    )},500)
  }

  getIncomeStatement2 = () => {
    this.incomeService.getIncomeStatement2(this.id).subscribe((res: any) => {
      this.getData = res.data;
      this.isGenerated = true;
      let currentYear:any = new Date().getFullYear();
      if ( this.getData.income_type == 'Forecast'){
        this.fYearsFiltered = this.fYears.filter((yr:any) => {
          if (yr.financial_year > currentYear ){
            return true;
          }else {
            return false;
          }
        })
      }
      if ( this.getData.income_type == 'Actual'){
        this.fYearsFiltered = this.fYears.filter((yr:any) => {
          if (yr.financial_year >= currentYear ){
            return true;
          }else {
            return false;
          }
        })
      }
      // this.getData.gross_profit_loss = this.getData.total_revenue - this.getData.variable_cost;
      // this.getData.ebitda = this.getData.gross_profit_loss - this.getData.operating_expense;
      // this.getData.operating_profit_loss = this.getData.ebitda - this.getData.depreciation;
      // this.getData.net_income_loss_before_tax = this.getData.operating_profit_loss + this.getData.investment_income + this.getData.interest_paid_and_finance_charges;
      

      
      // taking math.floor of all values






      this.getData.gross_profit_loss = Math.floor(this.getData.gross_profit_loss);
      this.getData.total_revenue = Math.floor(this.getData.total_revenue);
      this.getData.operating_expense = Math.floor(this.getData.operating_expense);
      this.getData.variable_cost = Math.floor(this.getData.variable_cost);
      this.getData.ebitda = Math.floor(this.getData.ebitda);
      this.getData.depreciation_and_amortization = Math.floor(this.getData.depreciation_and_amortization);
      this.getData.operating_profit_loss = Math.floor(this.getData.operating_profit_loss);
      this.getData.investment_income = Math.floor(this.getData.investment_income);
      this.getData.interest_paid_and_finance_charges = Math.floor(this.getData.interest_paid_and_finance_charges);
      this.getData.net_income_loss_before_tax = Math.floor(this.getData.net_income_loss_before_tax);
      this.getData.attributable_earning = Math.floor(this.getData.attributable_earning);

      //-----*------//
      // for testing purpose dummy data
      //  this.getData.total_revenue = -2;
      //  this.getData.gross_profit_loss = -3;
      // this.getData.operating_expense = -3;
      //   this.getData.variable_cost = -4;
      //   this.getData.ebitda = -4;
      //   this.getData.depreciation_and_amortization = -3;
      //   this.getData.operating_profit_loss = -2;
      //   this.getData.investment_income = -3;
      //   this.getData.interest_paid_and_finance_charges = -3;
      //   this.getData.net_income_loss_before_tax = -2;
      //   this.getData.attributable_earning = -3;
      
    
      let total_revenue:any;
      if ( this.getData.total_revenue < 0 ) {
        this.getData.total_revenue *= -1;
        total_revenue = '(' + String(this.getData.total_revenue) + ')'
      }else {
        total_revenue = this.getData.total_revenue
      }

      let gross_profit_loss:any;
      if ( this.getData.gross_profit_loss < 0 ) {
        this.getData.gross_profit_loss *= -1;
        gross_profit_loss = '(' + String(this.getData.gross_profit_loss) + ')'
      }else {
        gross_profit_loss = this.getData.gross_profit_loss
      }

      let operating_expense:any;
      if ( this.getData.operating_expense < 0 ) {
        this.getData.operating_expense *= -1;
        operating_expense = '(' + String(this.getData.operating_expense) + ')'
      }else {
        operating_expense = this.getData.operating_expense
      }

      let variable_cost:any;
      if ( this.getData.variable_cost < 0 ) {
        this.getData.variable_cost *= -1;
        variable_cost = '(' + String(this.getData.variable_cost) + ')'
      }else {
        variable_cost = this.getData.variable_cost
      }

      let ebitda:any;
      if ( this.getData.ebitda < 0 ) {
        this.getData.ebitda *= -1;
        ebitda = '(' + String(this.getData.ebitda) + ')'
      }else {
        ebitda = this.getData.ebitda
      }

      let  depreciation_and_amortization:any;
      if ( this.getData.depreciation_and_amortization < 0 ) {
        this.getData.depreciation_and_amortization *= -1;
        depreciation_and_amortization = '(' + String(this.getData.depreciation_and_amortization) + ')'
      }else {
        depreciation_and_amortization = this.getData.depreciation_and_amortization
      }

      let  investment_income:any;
      if ( this.getData.investment_income < 0 ) {
        this.getData.investment_income *= -1;
        investment_income = '(' + String(this.getData.investment_income) + ')'
      }else {
        investment_income = this.getData.investment_income
      }

      let  interest_paid_and_finance_charges:any;
      if ( this.getData.interest_paid_and_finance_charges < 0 ) {
        this.getData.interest_paid_and_finance_charges *= -1;
        interest_paid_and_finance_charges = '(' + String(this.getData.interest_paid_and_finance_charges) + ')'
      }else {
        interest_paid_and_finance_charges = this.getData.interest_paid_and_finance_charges
      }

      let  operating_profit_loss:any;
      if ( this.getData.operating_profit_loss < 0 ) {
        this.getData.operating_profit_loss *= -1;
        operating_profit_loss = '(' + String(this.getData.operating_profit_loss) + ')'
      }else {
        operating_profit_loss = this.getData.operating_profit_loss
      }

      let  net_income_loss_before_tax:any;
      if ( this.getData.net_income < 0 ) {
        this.getData.net_income_loss_before_tax *= -1;
        net_income_loss_before_tax = '(' + String(this.getData.net_income_loss_before_tax) + ')'
      }else {
        net_income_loss_before_tax = this.getData.net_income_loss_before_tax
      }

      let  attribute_earning:any;
      if ( this.getData.attributable_earning < 0 ) {
        this.getData.attributable_earning *= -1;
        attribute_earning = '(' + String(this.getData.attributable_earning) + ')'
      }else {
        attribute_earning = this.getData.attributable_earning
      }

      this.incomeStatementForm.patchValue({
        total_revenue: total_revenue,
        gross_profit_loss: gross_profit_loss,
        operating_expense: operating_expense,
        variable_cost: variable_cost,
        ebitda: ebitda,
        depreciation_and_amortization: depreciation_and_amortization,
        operating_profit_loss: operating_profit_loss,
        investment_income:  investment_income,
        interest_paid_and_finance_charges: interest_paid_and_finance_charges,
        net_income_loss_before_tax: net_income_loss_before_tax,
        attributable_earning: attribute_earning,
        remarks: this.getData.remarks,
        entity_id: this.getData.entity_id,
      })

      this.generateForm.patchValue({
        financial_year_id: this.getData.financial_year_id,
        income_type: this.getData.income_type
      })
    })
  }
  

  getIncomeStatement = () => {
    this.incomeService.getIncomeStatement(this.entity_id,this.generateForm.controls['financial_year_id'].value,this.filter_fy,this.generateForm.controls['income_type'].value).subscribe((res: any) => {
      this.getData = res.data;
      this.isGenerated = true;
      // this.getData.gross_profit_loss = this.getData.total_revenue - this.getData.variable_cost;
      // this.getData.ebitda = this.getData.gross_profit_loss - this.getData.operating_expense;
      // this.getData.operating_profit_loss = this.getData.ebitda - this.getData.depreciation;
      // this.getData.net_income_loss_before_tax = this.getData.operating_profit_loss + this.getData.investment_income + this.getData.interest_paid_and_finance_charges;
      

      
      // taking math.floor of all values
      this.getData.gross_profit_loss = Math.floor(this.getData.gross_profit_loss);
      this.getData.total_revenue = Math.floor(this.getData.total_revenue);
      this.getData.operating_expense = Math.floor(this.getData.operating_expense);
      this.getData.variable_cost = Math.floor(this.getData.variable_cost);
      this.getData.ebitda = Math.floor(this.getData.ebitda);
      this.getData.depreciation_amortization = Math.floor(this.getData.depreciation_amortization);
      this.getData.operating_profit_loss = Math.floor(this.getData.operating_profit_loss);
      this.getData.investment_income = Math.floor(this.getData.investment_income);
      this.getData.interest_paid_and_finance_charges = Math.floor(this.getData.interest_paid_and_finance_charges);
      this.getData.net_income = Math.floor(this.getData.net_income);
      this.getData.attribute_earning = Math.floor(this.getData.attribute_earning);

      //-----*------//
      // for testing purpose dummy data
      //  this.getData.total_revenue = -2;
      //  this.getData.gross_profit_loss = -3;
      // this.getData.operating_expense = -3;
      //   this.getData.variable_cost = -4;
      //   this.getData.ebitda = -4;
      //   this.getData.depreciation_and_amortization = -3;
      //   this.getData.operating_profit_loss = -2;
      //   this.getData.investment_income = -3;
      //   this.getData.interest_paid_and_finance_charges = -3;
      //   this.getData.net_income_loss_before_tax = -2;
      //   this.getData.attributable_earning = -3;
      
    
      let total_revenue:any;
      if ( this.getData.total_revenue < 0 ) {
        this.getData.total_revenue *= -1;
        total_revenue = '(' + String(this.getData.total_revenue) + ')'
      }else {
        total_revenue = this.getData.total_revenue
      }

      let gross_profit_loss:any;
      if ( this.getData.gross_profit_loss < 0 ) {
        this.getData.gross_profit_loss *= -1;
        gross_profit_loss = '(' + String(this.getData.gross_profit_loss) + ')'
      }else {
        gross_profit_loss = this.getData.gross_profit_loss
      }

      let operating_expense:any;
      if ( this.getData.operating_expense < 0 ) {
        this.getData.operating_expense *= -1;
        operating_expense = '(' + String(this.getData.operating_expense) + ')'
      }else {
        operating_expense = this.getData.operating_expense
      }

      let variable_cost:any;
      if ( this.getData.variable_cost < 0 ) {
        this.getData.variable_cost *= -1;
        variable_cost = '(' + String(this.getData.variable_cost) + ')'
      }else {
        variable_cost = this.getData.variable_cost
      }

      let ebitda:any;
      if ( this.getData.ebitda < 0 ) {
        this.getData.ebitda *= -1;
        ebitda = '(' + String(this.getData.ebitda) + ')'
      }else {
        ebitda = this.getData.ebitda
      }

      let  depreciation_and_amortization:any;
      if ( this.getData.depreciation_amortization < 0 ) {
        this.getData.depreciation_amortization *= -1;
        depreciation_and_amortization = '(' + String(this.getData.depreciation_amortization) + ')'
      }else {
        depreciation_and_amortization = this.getData.depreciation_amortization
      }

      let  investment_income:any;
      if ( this.getData.investment_income < 0 ) {
        this.getData.investment_income *= -1;
        investment_income = '(' + String(this.getData.investment_income) + ')'
      }else {
        investment_income = this.getData.investment_income
      }

      let  interest_paid_and_finance_charges:any;
      if ( this.getData.interest_paid_and_finance_charges < 0 ) {
        this.getData.interest_paid_and_finance_charges *= -1;
        interest_paid_and_finance_charges = '(' + String(this.getData.interest_paid_and_finance_charges) + ')'
      }else {
        interest_paid_and_finance_charges = this.getData.interest_paid_and_finance_charges
      }

      let  operating_profit_loss:any;
      if ( this.getData.operating_profit_loss < 0 ) {
        this.getData.operating_profit_loss *= -1;
        operating_profit_loss = '(' + String(this.getData.operating_profit_loss) + ')'
      }else {
        operating_profit_loss = this.getData.operating_profit_loss
      }

      let  net_income_loss_before_tax:any;
      if ( this.getData.net_income < 0 ) {
        this.getData.net_income *= -1;
        net_income_loss_before_tax = '(' + String(this.getData.net_income) + ')'
      }else {
        net_income_loss_before_tax = this.getData.net_income
      }

      let  attribute_earning:any;
      if ( this.getData.attribute_earning < 0 ) {
        this.getData.attribute_earning *= -1;
        attribute_earning = '(' + String(this.getData.attribute_earning) + ')'
      }else {
        attribute_earning = this.getData.attribute_earning
      }

      this.incomeStatementForm.patchValue({
        total_revenue: total_revenue,
        gross_profit_loss: gross_profit_loss,
        operating_expense: operating_expense,
        variable_cost: variable_cost,
        ebitda: ebitda,
        depreciation_and_amortization: depreciation_and_amortization,
        operating_profit_loss: operating_profit_loss,
        investment_income:  investment_income,
        interest_paid_and_finance_charges: interest_paid_and_finance_charges,
        net_income_loss_before_tax: net_income_loss_before_tax,
        attributable_earning: attribute_earning,
        remarks: this.getData.remark,
        entity_id: this.getData.entity_id,
      })
    })
  }

  generate = () => {
    // this.generateForm.patchValue( {financial_year_id: this.fid} )
    if (this.generateForm.controls['financial_year_id'].value){
      this.getIncomeStatement();
    }else {
      this.toaster.error("Please select financial year first")
    }
    // this.incomeStatementForm.controls['financial_year_id'].setValue(this.fid)
  }

  updateAmount = (e:any) => {
  }

  redirect1 = () => {
    if ( this.isGenerated ){  
      this.router.navigate([`/master/finance/income-statement/total-revenue`],{queryParams:{entity_id:this.entity_id,fid:this.generateForm.controls['financial_year_id'].value,type:this.generateForm.controls['income_type'].value}});
    }
  }

  redirect2 = () => {
    if ( this.isGenerated ){
      this.router.navigate(["/master/finance/income-statement/operating-expense"],{queryParams:{entity_id:this.entity_id,fid:this.generateForm.controls['financial_year_id'].value,type:this.generateForm.controls['income_type'].value}});
    }
  }

  redirect3 = () => {
    if ( this.isGenerated ){
      this.router.navigate(["/master/finance/income-statement/variable-cost"],{queryParams:{entity_id:this.entity_id,fid:this.generateForm.controls['financial_year_id'].value,type:this.generateForm.controls['income_type'].value}});
    }
  }
  redirect4 = () => {
    // if ( this.isGenerated ){
    //   this.router.navigate(["/master/finance/income-statement/ebitda"],{queryParams:{entity_id:this.entity_id,fid:this.generateForm.controls['financial_year_id'].value,type:this.generateForm.controls['income_type'].value}});
    // }
  }
  redirect5 = () => {
    if ( this.isGenerated ){
      this.router.navigate(["/master/finance/income-statement/depreciation-amortization"],{queryParams:{entity_id:this.entity_id,fid:this.generateForm.controls['financial_year_id'].value,type:this.generateForm.controls['income_type'].value}});
    }
  }
  redirect6 = () => {
    // if ( this.isGenerated ){
    //   this.router.navigate(["/master/finance/income-statement/total-revenue"]);
    // }
  }
  redirect7 = () => {
    // if ( this.isGenerated ){
    //   this.router.navigate(["/master/finance/income-statement/total-revenue"]);
    // }
  }
  redirect8 = () => {
    // if ( this.isGenerated ){
    //   this.router.navigate(["/master/finance/income-statement/total-revenue"]);
    // }
  }
  redirect9 = () => {
    // this.router.navigate(["/master/finance/income-statement/total-revenue"]);
  }
  redirect10 = () => {
    // if ( this.isGenerated ){
    //   this.router.navigate(["/master/finance/income-statement/total-revenue"]);
    // }
  }
  
  goBack() {
    this.router.navigate(["master/finance/income-statement/list"])
  }

  onSubmit() {
    this.incomeStatementForm.markAllAsTouched();
    this.incomeStatementForm.controls['filter_fy'].setValue(this.filter_fy)
    this.incomeStatementForm.controls['entity_id'].setValue(this.entity_id)
    this.incomeStatementForm.controls['financial_year_id'].setValue(this.generateForm.controls['financial_year_id'].value)
    this.incomeStatementForm.controls['income_type'].setValue(this.generateForm.controls['income_type'].value)
    if (  this.workFlowError ) {
      this.toaster.warning(`Workflow is not created for this department ${this.name ? this.name : ""}`)
      return;
    }
    Object.keys(this.incomeStatementForm.controls).forEach(controlName => {
      const control = this.incomeStatementForm.get(controlName);
      // Check if the control is invalid and not touched (inactive)
      if (control && control.invalid && !control.touched) {
      }
    });
    if (this.incomeStatementForm.invalid) {
      this.toaster.error('Required fields should not be empty', 'Fields Error');
      return;
    }

    let val = this.incomeStatementForm.value;
    if (this.id) {
      this.incomeService.submitIncomeStatement(val).subscribe((res: any) => {
        if ( res.code == 200 ){
          this.toaster.success(res.message)
          // this.route.navigate([`master/finance/budget-planning/budget-planning-list/${this.page}`], { queryParams: { id: this.id , type:this.type, page: this.page },skipLocationChange: true})
        }
        }, err => {
        this.toaster.error(err.error.message)
      })
    } else {
      this.incomeService.submitIncomeStatement(val).subscribe((res: any) => {
        this.createdData = res.data
        if (res.code == 200) {
          this.toaster.success(res.message)
          // this.route.navigate([`master/finance/budget-planning/budget-planning-list/${this.page}`], { queryParams: { id: this.id, type: this.type , page: this.page },skipLocationChange: true})
        }
      }, err => {
        this.toaster.error(err.error.message)
      })
    }
  }

  approve = () => {
    this.incomeStatementForm.controls['filter_fy'].setValue(this.filter_fy)
    this.incomeStatementForm.controls['entity_id'].setValue(this.entity_id)
    this.incomeStatementForm.controls['financial_year_id'].setValue(this.generateForm.controls['financial_year_id'].value)
    this.incomeStatementForm.controls['income_type'].setValue(this.generateForm.controls['income_type'].value)
    let val = this.incomeStatementForm?.value
    // this.incomeService.submitIncomeStatement(val).subscribe((res: any) => {
    //   this.createdData = res.data
    //   if (res.code == 200) {
    //     this.toaster.success(res.message)
    //     // this.route.navigate([`master/finance/budget-planning/budget-planning-list/${this.page}`], { queryParams: { id: this.id, type: this.type , page: this.page },skipLocationChange: true})
    //   }
    // }, err => {
    //   this.toaster.error(err.error.message)
    // })
  }

  reject = () => {
    this.incomeStatementForm.controls['filter_fy'].setValue(this.filter_fy)
    this.incomeStatementForm.controls['entity_id'].setValue(this.entity_id)
    this.incomeStatementForm.controls['financial_year_id'].setValue(this.generateForm.controls['financial_year_id'].value)
    this.incomeStatementForm.controls['income_type'].setValue(this.generateForm.controls['income_type'].value)
    let val = this.incomeStatementForm.value
    // this.incomeService.submitIncomeStatement(val).subscribe((res: any) => {
    //   this.createdData = res.data
    //   if (res.code == 200) {
    //     this.toaster.success(res.message)
    //     // this.route.navigate([`master/finance/budget-planning/budget-planning-list/${this.page}`], { queryParams: { id: this.id, type: this.type , page: this.page },skipLocationChange: true})
    //   }
    // }, err => {
    //   this.toaster.error(err.error.message)
    // })
  }
  
  
}
