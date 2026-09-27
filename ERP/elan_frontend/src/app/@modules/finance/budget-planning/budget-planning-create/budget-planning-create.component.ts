import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-budget-planning-create',
  templateUrl: './budget-planning-create.component.html',
  styleUrls: ['./budget-planning-create.component.scss']
})
export class BudgetPlanningCreateComponent {
  budgetPlanningForm: FormGroup;
  id: any;
  regions: any;
  budgetCategories: any;
  expenseTypes: any;
  needTypes: any;
  locations: any;
  getData: any;
  createdData: any;
  mode:any;
  type:any;
  currencies: any;
  months: any;
  planning_id: any;
  user_id: any;
  viewMode: any;
  departments: any;
  page: any;
  // mat select disbaled-view value variables
  budgetCategory:any;
  expenseType:any;
  location:any;
  needType:any;
  currency:any;
  region:any;
  monthsValue: any = [];
  entity_id : any;
  valueInMOZ : any;
  costCenters : any;
  workflowList: any = [];
  approvel_status:any;
  workFlowError:any = false;
  costCenterCode: any;
  dept_id:any;
  constructor(private fb: FormBuilder, private _configurationalMasterService: ConfigurationalmasterService, private prService: PurchaseRequestService, private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    private $common: CommonService,
    private finance: FinaceService,
    private route: Router
  ) {
    this.budgetPlanningForm = this.fb.group({
      budgetFinancialYear_id: new FormControl(null,[Validators.required]),
      serial_no: new FormControl(null, [Validators.required]),
      buisness_unit: new FormControl(null, [Validators.required]),
      department_id: new FormControl(null, [Validators.required]),
      nature_need: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      price_without_vat: new FormControl(null, [Validators.required, this.positiveValueValidator]),
      vat: new FormControl(null, [Validators.required, this.positiveValueValidator]),
      estimated_unit_price_with_vat: new FormControl(null, [Validators.required, this.positiveValueValidator]),
      source_of_price: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      flight_insurance_transport: new FormControl(null, [Validators.required, this.positiveValueValidator]),
      custom_duties: new FormControl(null, [Validators.required, this.positiveValueValidator]),
      total_Value: new FormControl(null, [Validators.required, this.positiveValueValidator]),
      total_Value_All: new FormControl(null, [Validators.required, this.positiveValueValidator]),
      quantity: new FormControl(null, [Validators.required, this.positiveValueValidator]),
      justification_need: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      vat_classification: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      month: new FormControl(null, [Validators.required]),
      budgetCategory_id: new FormControl(null, [Validators.required]),
      expenseType_id: new FormControl(null, [Validators.required]),
      needType_id: new FormControl(null, [Validators.required]),
      user_id: new FormControl(null, [Validators.required]),
      location_id: new FormControl(null, [Validators.required]),
      currency_id: new FormControl(null, [Validators.required]),
      region_id: new FormControl(null, [Validators.required]),
      budget_planning_type: new FormControl(null, [Validators.required]),
      // additional form fields depending on active page tab
      value_in_moz: new FormControl(null),
      cost_center_id: new FormControl(null),
      cost_center_code: new FormControl(null),
      pushback: new FormControl(false),
      remark: new FormControl(null),
    })
  }

  positiveValueValidator(control:any) {
    if (control.value < 0) {
      return { positiveValue: true };
    }
    return null;
  }

  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.planning_id = params.planning_id;
      this.mode = params.mode;
      this.type = params.type;
      this.page = params.page;
      this.dept_id = params.dept_id;
      this.updateValidations();
      if ( this.page == 'planning'){
        this.approvel_status='PENDING';
      }
      if ( this.page == 'pending-for-approval'){
        this.approvel_status='PENDING';
      }
      if ( this.page == 'approved-by-me'){
        this.approvel_status='APPROVED';
      }
      if ( this.page == 'draft'){
        this.approvel_status='REJECTED';
      }

      if ( this.mode == 'view' || this.page == 'pending-for-approval' || this.page == 'approved-by-me' ) {
        this.viewMode = true;
      }else {
        this.viewMode = false;
      }
      this.budgetPlanningForm.controls['budgetFinancialYear_id'].setValue(this.id)
      this.budgetPlanningForm.controls['budget_planning_type'].setValue(this.type)
      // this.getBudgetPlan(this.id);
    });
    let loginUser: any = localStorage.getItem('signInUser');
    this.user_id = JSON.parse(loginUser).employee_id;
    if ( !this.planning_id ){
      this.budgetPlanningForm.controls['user_id'].setValue(this.user_id)
    }
    this.apiOnLoad()
    if (this.planning_id) {
      this.getBudgetPlanningById()
    }
  }

  updateValidations = () => {
    if (this.page == 'pending-for-approval'){
      this.budgetPlanningForm?.get('cost_center_id')?.setValidators(Validators.required);
      this.budgetPlanningForm?.get('pushback')?.setValidators(Validators.required);
      this.budgetPlanningForm?.get('remark')?.setValidators(Validators.required);
    }else {
      this.budgetPlanningForm?.get('cost_center_id')?.clearValidators();
      this.budgetPlanningForm?.get('pushback')?.clearValidators();
      this.budgetPlanningForm?.get('remark')?.clearValidators();
      this.budgetPlanningForm?.get('cost_center_id')?.updateValueAndValidity();
      this.budgetPlanningForm?.get('pushback')?.updateValueAndValidity();
      this.budgetPlanningForm?.get('remark')?.updateValueAndValidity();
    }
  }

  getBudgetPlanningById = () => {
    setTimeout(() => {
      this.finance.getBudgetPlanningById(this.planning_id).subscribe((res: any) => {
        this.getData = res.data[0];
        this.budgetCategory = this.getData.budget_category;
        this.expenseType = this.getData.expense_type;
        this.location = this.getData.location;
        this.currency = this.getData.currency;
        this.needType = this.getData.need_type;
        this.region = this.getData.region;
        this.monthsValue = this.formatArrayToString(this.getData.month)
        this.budgetPlanningForm.patchValue({
          buisness_unit:this.getData.department_name,
          department_id:this.getData.department_id,
          nature_need: this.getData.nature_need,
          price_without_vat: this.getData.price_without_vat,
          vat: this.getData.vat,
          estimated_unit_price_with_vat: this.getData.estimated_unit_price_with_vat,
          source_of_price: this.getData.source_of_price,
          flight_insurance_transport: this.getData.flight_insurance_transport,
          custom_duties: this.getData.custom_duties,
          total_Value: this.getData.total_Value,
          justification_need: this.getData.justification_need,
          vat_classification: this.getData.vat_classification,
          month: this.getData.month,
          budgetCategory_id:this.getData.budgetCategory_id,
          expenseType_id: this.getData.expenseType_id,
          needType_id: this.getData.needType_id,
          user_id: this.getData.user_id,
          location_id: this.getData.location_id,
          currency_id: this.getData.currency_id,
          region_id: this.getData.region_id,
          budget_planning_type: this.getData.budget_planning_type,
          quantity: this.getData.quantity,
          remark: this.getData.remark 
        })
        this.valueInMOZ = (this.budgetPlanningForm.controls['total_Value'].value)*0.7622;
        this.valueInMOZ = this.valueInMOZ.toFixed(4);
        this.getCostCenter()
        this.budgetPlanningForm.controls['value_in_moz'].setValue(this.valueInMOZ);
        this.onValueChange()
      })
    },500)
  }

  apiOnLoad = () => {
    this.months = [{name:'January',id:1},{name:'February',id:2},{name:'March',id:3},{name:'April',id:4},{name:'May',id:5},{name:'June',id:6},{name:'July',id:7},{name:'August',id:8},{name:'September',id:9},{name:'October',id:10},{name:'November',id:11},{name:'December',id:12}]
    this.getWorkflowList();
    this.getBudgetCategory();
    this.getDepartment();
    this.getExpenseType();
    this.getNeedType();
    this.getLocations();
    this.getRegions();
    this.getCurrency();
    if ( !this.planning_id ){
      this.getBuisnessUnit();
    }
    this.getBudgetPlanningList();
  }

  getBudgetPlan = (id:any) => {
    this.finance.getBudgetPlanById(this.id).subscribe((res:any) => {
    })
  }

  getBudgetCategory = () => {
    this._configurationalMasterService.listBudgetCategoryActive(this.entity_id).subscribe((res: any) => {
      this.budgetCategories = res.data;
    },(err:any) => {
      this.budgetCategories = []
    })
  };
  getExpenseType = () => {
    this._configurationalMasterService.listTypeOfExpenseCategoryActive().subscribe((res: any) => {
      this.expenseTypes = res.data;
    },(err:any)=>{
      this.expenseTypes = [];
    })
  };
  getNeedType = () => {
    this._configurationalMasterService.listTypeOfNeedActive().subscribe((res: any) => {
      this.needTypes = res.data;
    },(err:any) => {
      this.needTypes = [];
    })
  };
  getLocations = () => {
    this._configurationalMasterService.getListActiveBranchSetup().subscribe((res: any) => {
      this.locations = res.data;
    },(err:any) => {
      this.locations = [];
    })
  };
  getRegions = () => {
    this._configurationalMasterService.listRegionActive(this.entity_id).subscribe((res: any) => {
      this.regions = res.data;
    },(err:any) => {
      this.regions = [];
    })
  };

  getCurrency = () => {
    this._configurationalMasterService.CurrencyList().subscribe((res: any) => {
      this.currencies = res.data;
    },(err:any) => {
      this.currencies = [];
    })
  }

  getDepartment = () => {
    this._configurationalMasterService.getAllDepartment_all_active(this.entity_id).subscribe((res: any) => {
      this.departments = res.data;
    },(err: any) => {
      this.departments = [];
    })
  }

  getCostCenter = () => {
    this.finance.getAllCostCenterActiveByDepartment(this.getData.department_id,this.entity_id).subscribe((res:any) => {
      this.costCenters = res.data;
      if ( this.page == 'approved-by-me'){
        this.budgetPlanningForm.controls['cost_center_id'].setValue(this.getData.cost_center_id)
        this.getCode()
      }
    },(err:any) => {
      this.costCenters = [];
    })
  }

  onSelectedCostCenter = () => {
    this.getCode()
  }

  getCode = () => {
    this.costCenters.map((costCenter:any) => {
      if (costCenter.id == this.budgetPlanningForm.controls['cost_center_id'].value) {
        this.budgetPlanningForm.controls['cost_center_code'].setValue(costCenter.cost_center_code)
      }
    })
  }

  back(){
    if ( this.page == 'pending-for-approval' ) {
      this.route.navigate([`master/finance/budget-planning/budget-planning-list/${this.page}`], { queryParams: { id: this.id, type: this.type, page: this.page, dept_id: this.dept_id },skipLocationChange: true})
    } else {
      this.route.navigate([`master/finance/budget-planning/budget-planning-list/${this.page}`], { queryParams: { id: this.id, type: this.type, page: this.page },skipLocationChange: true})
    }
  }

  formatArrayToString(arr: string[]): string {
    return arr.join(', '); // Join array elements with comma and space
  }

  getBuisnessUnit = () => {
    let check = false;
    setTimeout(() => {
      this.finance.getBuisnessUnit( this.user_id).subscribe((res: any) => {
        this.departments.map((department:any) => {
          if ( department.dept_id == res.data.department_id ) {
            this.budgetPlanningForm.controls['department_id'].setValue(res.data.department_id)
            this.workflowList.map((workflow:any) => {
              if ( workflow.job_name == 'Budget Planning'){
                if (workflow.department_name == department.department_name && workflow.budget_planning_type == this.type) check = true;
              }
            })
            this.budgetPlanningForm.controls['buisness_unit'].setValue(department.department_name)
          }
        })
        if (!check) {
          this.workFlowError = true;
          this.toaster.warning(`Workflow is not created for this department`)
        }
      }
    )},500)
  }

  getWorkflowList() {
    this._configurationalMasterService.getAllWorkFlowJob(this.entity_id).subscribe((res: any) => {
      this.workflowList = res.data;
      if (!this.planning_id){
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

  getBudgetPlanningList = () => {
    this.finance.getAllBudgetPlanning(this.type,this.id,this.entity_id,this.approvel_status,this.user_id).subscribe((res:any) => {
      let x = res.data.length;
      this.budgetPlanningForm.controls['serial_no'].setValue(x+1)
    },(err:any) => {
      this.budgetPlanningForm.controls['serial_no'].setValue(1)
    })
  }

  onValueChange = () => {
    let x = Number(this.budgetPlanningForm.controls['price_without_vat'].value)
    let y = Number(this.budgetPlanningForm.controls['vat'].value)
    this.budgetPlanningForm.controls['estimated_unit_price_with_vat'].setValue(x+y);
    let a = Number(this.budgetPlanningForm.controls['flight_insurance_transport'].value)
    let b = Number(this.budgetPlanningForm.controls['custom_duties'].value)
    this.budgetPlanningForm.controls['total_Value'].setValue(x+y+a+b);
    let z = Number(this.budgetPlanningForm.controls['quantity'].value)*(this.budgetPlanningForm.controls['total_Value'].value)
    this.budgetPlanningForm.controls['total_Value_All'].setValue(z);
    this.valueInMOZ = (this.budgetPlanningForm.controls['total_Value'].value)*0.7622;
    this.valueInMOZ = this.valueInMOZ.toFixed(4);
    // if ( this.getData.Currency_Type != 'USD' ) {
    //   this.valueInMOZ = (this.budgetPlanningForm.controls['total_Value'].value)/83.44;
    //   this.valueInMOZ = this.valueInMOZ.toFixed(4);
    // } else {
    //   this.valueInMOZ = this.budgetPlanningForm.controls['total_Value'].value.toFixed(4)
    // }
    this.budgetPlanningForm.controls['value_in_moz'].setValue(this.valueInMOZ);
  }

  onSubmit() {
    if (  this.workFlowError ) {
      this.toaster.warning(`Workflow is not created for this department`)
      return;
    }
    Object.keys(this.budgetPlanningForm.controls).forEach(controlName => {
      const control = this.budgetPlanningForm.get(controlName);
      // Check if the control is invalid and not touched (inactive)
      if (control && control.invalid && !control.touched) {
      }
    });
    if (this.budgetPlanningForm.invalid) {
      this.toaster.error('Required fields should not be empty', 'Fields Error');
      return;
    }

    let val = this.budgetPlanningForm.value;
    if (this.planning_id) {
      this.finance.updateBudgetPlanning(this.planning_id, val).subscribe((res: any) => {
        if ( res.code == 200 ){
          this.toaster.success(res.message)
          this.route.navigate([`master/finance/budget-planning/budget-planning-list/${this.page}`], { queryParams: { id: this.id , type:this.type, page: this.page },skipLocationChange: true})
        }
        }, err => {
        this.toaster.error(err.error.message)
      })
    } else {
      this.finance.createBudgetPlanning(val,this.entity_id).subscribe((res: any) => {
        this.createdData = res.data
        if (res.code == 200) {
          this.toaster.success(res.message)
          this.route.navigate([`master/finance/budget-planning/budget-planning-list/${this.page}`], { queryParams: { id: this.id, type: this.type , page: this.page },skipLocationChange: true})
        }
      }, err => {
        this.toaster.error(err.error.message)
      })
    }
  }

  onCheckboxChange = (e:any) => {
    if ( e.checked ) {
      this.budgetPlanningForm?.get('cost_center_id')?.clearValidators();
      this.budgetPlanningForm?.get('cost_center_id')?.updateValueAndValidity();
    }
    if ( !e.checked) {
      this.budgetPlanningForm?.get('cost_center_id')?.setValidators(Validators.required);
    }
  }

  onSubmit3(){
    this.route.navigate([`master/finance/budget-planning/budget-planning-list/${this.page}`], { queryParams: { id: this.id, type: this.type , page: this.page },skipLocationChange: true})
  }

  onSubmit2() {
    let val = this.budgetPlanningForm.value;
    this.budgetPlanningForm.markAllAsTouched();
    if (  this.workFlowError ) {
      this.toaster.warning(`Workflow is not created for this department`)
      return;
    }
    Object.keys(this.budgetPlanningForm.controls).forEach(controlName => {
      const control = this.budgetPlanningForm.get(controlName);
      // Check if the control is invalid and not touched (inactive)
      if (control && control.invalid && !control.touched) {
      }
    });
    if (this.budgetPlanningForm.invalid) {
      this.toaster.error('Required fields should not be empty', 'Fields Error');
      return;
    }
   
    // return;
    if (this.planning_id) {
      this.finance.mapBudgetPlanningCC(this.planning_id, val).subscribe((res: any) => {
        if ( res.code == 200 ){
          this.toaster.success(res.message)
          if (this.budgetPlanningForm.controls['pushback'].value){
            this.route.navigate([`master/finance/budget-planning/budget-planning-list/draft`], { queryParams: { id: this.id , type:this.type, page: 'draft' },skipLocationChange: true})
          }else {
            this.route.navigate([`master/finance/budget-planning/budget-planning-list/approved-by-me`], { queryParams: { id: this.id , type:this.type, page: 'approved-by-me' },skipLocationChange: true})
          }
          }
      }, err => {
        this.toaster.error(err.error.message)
      })
    }
  }

  cancel = () => {

  }
}
