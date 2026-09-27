import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, FormControlName } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { CostCenterDilogComponent } from '../cost-center-dilog/cost-center-dilog.component';
import { DepartmentDialogComponent } from 'src/app/@modules/itticketing/configurationalmaster/department/department-dialog/department-dialog.component';
import { RegionDialogComponent } from 'src/app/@modules/itticketing/configurationalmaster/region/region-dialog/region-dialog.component';
import { FinanceCreateComponent } from '../../financial-year/finance-create/finance-create.component';
import * as moment from 'moment';
import { NonNullAssert } from '@angular/compiler';
import { ShortlistedCandidateService } from 'src/app/@shared/services/service/recruitment/shortlisted-candidate.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-cost-center-create',
  templateUrl: './cost-center-create.component.html',
  styleUrls: ['./cost-center-create.component.scss']
})
export class CostCenterCreateComponent {
  costCenterForm: FormGroup;
  id: any;
  departments: any;
  regions: any;
  getData: any;
  createdData: any;
  mode: any;
  department_name: any;
  region_name: any;
  entity_id: any;
  fianceYear: any;


  selectedDate:any;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  FromDate: string;
  toDate: string;
  noOfDay: any;
  todate: any;
  // day = this.now.getDay();
  date = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minDate = moment({
    year: this.year - 0,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');
  employee_id: string | null;

  Date(e: any) {
    this.selectedDate = moment(e.value).format('YYYY-MM-DD');
    // this.getJournalList();
  }


  constructor(private fb: FormBuilder, public dialog: MatDialog, private _configurationalMasterService: ConfigurationalmasterService, private prService: PurchaseRequestService, private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    private $common: CommonService,
    private finance: FinaceService,
    private route: Router,
    private shortlistedCandidate: ShortlistedCandidateService,
  ) {
   let financial_id= localStorage.getItem('financial_id')

    this.costCenterForm = this.fb.group({
      department_id: new FormControl(null  ),
      
      cost_center_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      cost_center_code: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      
      budget_amount: new FormControl(null, Validators.required),
      financial_year_id: new FormControl(financial_id),
      date: new FormControl(''),
      cost_centre_type: new FormControl(null, [Validators.required]),
      employee_id: new FormControl(null),
      type: new FormControl(null),
      profit_center_id: new FormControl(null),
      currency_id: new FormControl(null),
      manager_id: new FormControl(null),
      valid_from: new FormControl(null),
      valid_to: new FormControl(null),
      status: new FormControl('ACTIVE'),
      is_group: new FormControl('NO'),
      parent_cost_center_id: new FormControl(null),
      budget_utilized: new FormControl(0),
      remaining_budget:new FormControl(0),
      remark:new FormControl(null),
      cost_profit_center_name:new FormControl(null)
    })
  }

  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.employee_id = localStorage.getItem('EmpMainId')
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.mode = params.mode;
    });
    this.getDepartments()
    this.getAllCostCenterIsGroup()
    this.getRegions();
    this.getFinceYear();
    this.registrationall();
    this.getAllCurrency();
    this.generateFinanceCostCenterCode();
    this.getAllCostProfitType();
    
    if (this.id) {
      this.getByIdCostCenter()
    }
  }

  rowData:any
  getAllCostProfitType() {
    this._configurationalMasterService.getCostProfitType(this.entity_id).subscribe(
      (res: any) => {
        this.rowData = res.data.filter((i:any)=>i.selected_type =='cost_center')
      }, (err: any) => {
        
        this.toaster.error('data not found');
      }
    )
  };


  getAllIsGroup:any=[]
  getAllCostCenterIsGroup(){
    this.finance.getAllCostCenterIsGroup(this.entity_id).subscribe((res:any)=>{
      if(res){
    this.getAllIsGroup = res.data;
      }
    })
  }

  generateFinanceCostCenterCode(){
    this.finance.generateFinanceCostCenterCode(this.entity_id).subscribe((res: any) => {
      this.costCenterForm.patchValue({
        cost_center_code:res.data,
      });
    });
  }

  IsGroupData(data:any){
  
    // if(data.value=='YES'){
      this.getAllCostCenterIsGroup();
    // }else{
    //   this.getAllIsGroup = []
    // }
  }

  

getAllCurrencyData:any=[]
getAllCurrency(){
  this._configurationalMasterService.CurrencyList().subscribe((res:any)=>{
     if(res){
      this.getAllCurrencyData=res.data;
     }
  })
}

getDataValues(data:any){
  this.costCenterForm.patchValue({
    remaining_budget:data.target.value
  })
 
  
}
  reportingManagerList:any=[]
  registrationall() {

    let entity_id = localStorage.getItem("selectedEntityId");
    let financial_id = localStorage.getItem("financial_id");
    let loginUserDetails: any = localStorage.getItem("signInUser");
    loginUserDetails = JSON.parse(loginUserDetails)
    let query = {
      entity_id: entity_id,
      role_master_name: loginUserDetails?.roles,
    }
    this.shortlistedCandidate.registrationall(query).subscribe((res: any) => {
      console.log(res);
      this.reportingManagerList = res?.data;
     
    })
  }

  
    clearDate(control:any) {
      this.costCenterForm.get(control)?.reset();
      // this.getJournalList();
      if(control == 'from_date'){
        const from_date = this.costCenterForm.get(control)?.value;
        this.FromDate = moment(from_date).format('YYYY-MM-DD');
        // this.bankClearanceForm.patchValue({ to_date: '' });
      }
    }
  getDepartments = () => {
    this._configurationalMasterService.getDepartmentAll(this.entity_id).subscribe((res: any) => {
      this.departments = res.data;
      this.departmentList2 = res.data.map((x: any) => x.department_name);
      this.departmentList3 = this.departments
    })
  }
  departmentList2: any[] = [];
  departmentList3: any[] = [];
  deptSearch(e: any) {
    const tempVal = e;

    let filteredVariable = this.departmentList3.filter((item: any) =>
      tempVal.includes(item.department_name)
    );
    this.departments = filteredVariable;
  }
  openDeptDialog() {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
      width: '500px',
      data: { isOpenDialog: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDepartments();
      }
    });
  }
  getRegions = () => {
    this._configurationalMasterService.listRegion(this.entity_id).subscribe((res: any) => {
      this.regions = res.data;
      this.regions2 = res?.data.map((x: any) => x.region_name);
      this.regions3 = this.regions
    })
  }

  regions2: any[] = [];
  regions3: any[] = [];
  regionSearch(e: any) {
    const tempVal = e;

    let filteredVariable = this.regions3.filter((item: any) =>
      tempVal.includes(item.region_name)
    );
    this.regions = filteredVariable;
  }
  openRegionDialog() {
    const dialogRef = this.dialog.open(RegionDialogComponent, {
      width: '500px',
      data: { isOpenDialog: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getRegions();
      }
    });
  }




  getFinceYear() {
    this.finance.getFinancialYear().subscribe((res: any) => {
      this.fianceYear = res?.data;
      this.fianceYear2 = res?.data.map((x: any) => x.financial_year);
      this.fianceYear3 = this.fianceYear;
    })
  }

  fianceYear2: any[] = [];
  fianceYear3: any[] = [];
  fianceYearSearch(e: any) {
    const tempVal = e;

    let filteredVariable = this.fianceYear3.filter((item: any) =>
      tempVal.includes(item.financial_year)
    );
    this.fianceYear = filteredVariable;

  }
  selectedFinancialYear(e:any){
    this.financialCloseIcon=true;
  }
  clearFinancial(){
    this.financialCloseIcon=false;
    this.costCenterForm.controls['finacial_year'].setValue(null);
  }
  openfianceYearDialog() {
    const dialogRef = this.dialog.open(FinanceCreateComponent, {
      width: '500px',
      data: { isOpenDialog: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getFinceYear();
      }
    });
  }
  getByIdCostCenter = () => {
    setTimeout(() => {
      this.finance.getCostCenterById(this.id).subscribe((res: any) => {
      
        this.getData = res.data;
        if(this.getData.type==='department'){
          this.typeName= this.getData.type
          
        }else if(this.getData.type==='employee'){
          this.typeName= this.getData.type
        }
        else if(this.getData.cost_profit_center_name){
          this.isCostCenterActive= 1
        }
       
        this.department_name = this.getData.department_name;
        this.region_name = this.getData.region_name;
        this.costCenterForm.patchValue({
          department_id: this.getData?.department_id,
          // region_id: this.getData?.region_id,
          cost_center_name: this.getData?.cost_center_name,
          cost_center_code: this.getData.cost_center_code,
          finacial_year: this.getData?.financial_year_id,
          cost_centre_type: this.getData?.cost_center_type?.toString().toLowerCase(),
          manager_id:this.getData?.manager_id,
          employee_id:this.getData?.employee_id,
          budget_amount: this.getData?.amount,
          remark:this.getData?.remark,
          valid_from:this.getData?.valid_from,
          valid_to:this.getData?.valid_to,
          remaining_budget:this.getData?.remainingAmount,
          currency_id:this.getData?.currency_id,
          date:this.getData?.createdAt,
          budget_utilized:this.getData?.used_budget_amount,
          is_group:this.getData?.is_group,
          type:this.getData.cost_profit_center_name?+this.getData?.type:this.getData?.type,
          cost_profit_center_name:this.getData?.cost_profit_center_name,
        })
      })
    }, 500)
  }
  openDialog() {
    const dialogRef = this.dialog.open(CostCenterDilogComponent, {
      data: { id: this.id, status: "revised" },

      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {

    });
  }
  typeName:any="";
  isCostCenterActive:number;
  isActive:boolean=false;
  selectedType(e:any){
    this.typeCloseIcon =true;
    if(e=='department' || e=='employee'){
    this.typeName = e
    this.isCostCenterActive=0
     this.costCenterForm.get('cost_profit_center_name')?.reset()

    }else{
      this.isCostCenterActive = e
      this.typeName=''
     this.costCenterForm.get('department_id')?.reset()
     this.costCenterForm.get('employee_id')?.reset()

    }
    

  }
  deptCloseIcon: boolean = false;
  regionCloseIcon: boolean = false;
  financialCloseIcon: boolean = false;
  typeCloseIcon: boolean = false;
  clearType() {
    this.typeCloseIcon = false;
    this.costCenterForm.controls['type'].setValue(null)
  }
  clearDept() {
    this.deptCloseIcon = false;
    this.costCenterForm.controls['department_id'].setValue(null)
  }
  
  // genCode = (e: any) => {


  //   let body = {
  //     department_id: this.costCenterForm.controls['department_id'].value,
  //     region_id: this.costCenterForm.controls['region_id'].value,
  //     cost_center_name: this.costCenterForm.controls['cost_center_name'].value
  //   }

  //   if (body.department_id) {

  //     this.deptCloseIcon = true;
  //   }
  //   if (body.region_id) {
  //     this.regionCloseIcon = true;
  //   }
  //   if (body.department_id && body.region_id && body.cost_center_name) {
  //     this.finance.genertateCCCode(body).subscribe((res: any) => {
  //       this.costCenterForm.controls['cost_center_code'].patchValue(res.data)
  //     }, err => {
  //       this.toaster.error(err.error.message)
  //     })
  //   }
  // }
  back() { }

  onSubmit() {

    let val2 = this.costCenterForm.value;
    

    if (this.costCenterForm.invalid) {
      this.toaster.error('Required fields should not be empty', 'Fields Error');
      return;
    }
 
    function noLeadingSpaces(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value && control.value.trimLeft() !== control.value) {
          return { leadingSpaces: true };
        }
        return null;
      };
    }
    
    let val = this.costCenterForm.value;
    
    if (this.id) {
      this.finance.updateCostCenter(this.id, val, this.entity_id).subscribe((res: any) => {
        this.toaster.success(res.message)
        this.route.navigate(['master/finance/cost-center'])
      }, err => {
        this.toaster.error(err.error.message)
      })
    } else {
      this.finance.createCostCenter(val, this.entity_id).subscribe((res: any) => {
        this.createdData = res.data
        if (res.code == 200) {
          this.toaster.success(res.message)
          this.route.navigate(['master/finance/cost-center'])
        }
      }, err => {
        this.toaster.error(err.error.message)
      })
    }
  }

}
