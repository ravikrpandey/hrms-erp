import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DepartmentDialogComponent } from 'src/app/@modules/itticketing/configurationalmaster/department/department-dialog/department-dialog.component';
import { RegionDialogComponent } from 'src/app/@modules/itticketing/configurationalmaster/region/region-dialog/region-dialog.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { CostCenterDilogComponent } from '../../cost-center/cost-center-dilog/cost-center-dilog.component';
import { FinanceCreateComponent } from '../../financial-year/finance-create/finance-create.component';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import * as moment from 'moment';
import { ShortlistedCandidateService } from 'src/app/@shared/services/service/recruitment/shortlisted-candidate.service';

@Component({
  selector: 'app-add-profit-center',
  templateUrl: './add-profit-center.component.html',
  styleUrls: ['./add-profit-center.component.scss']
})
export class AddProfitCenterComponent {
  profitCenterForm: FormGroup;
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
  reportingManagerList:any=[];
  isEditMode: boolean = false;
  profitCenterData: any = {};

  constructor(private fb: FormBuilder, public dialog: MatDialog, private _configurationalMasterService: ConfigurationalmasterService, private prService: PurchaseRequestService, private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    private $common: CommonService,
    private finance: FinaceService,
    private route: Router,
    private $crm:CrmService,
    private shortlistedCandidate: ShortlistedCandidateService,
  ) {
    this.profitCenterForm = this.fb.group({
      profit_center_id: new FormControl(this.generateProfitCenterId(), [Validators.required]),
      profit_center_name: new FormControl(null, [Validators.required]),
      createdOn: new FormControl(new Date(), [Validators.required ]),
      type: new FormControl(null, [Validators.required ]),
      itemType: new FormControl(null, Validators.required),
      cost_center_id: new FormControl(null, Validators.required),
      manager_id: new FormControl(null, Validators.required),
      currency_id: new FormControl(null),
      fromDate: new FormControl(null, Validators.required),
      toDate: new FormControl(null, Validators.required),
      status: new FormControl('ACTIVE', Validators.required),
      isGroup: new FormControl(null, Validators.required),
      parent_profit_center: new FormControl(null ),
      remarks: new FormControl(null, Validators.required),
      department_id: new FormControl(null),
      employee_id: new FormControl(null),
      cost_profit_center_name:new FormControl(null)
    })
  }
  loginUser:any;
  ngOnInit() {
    this.getNeedType()
    this.getAllProfitCenterIsGroup()
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.mode = params.mode;
      if (this.id) {
        this.isEditMode = true;
        this.getByIdProfitCenter();
      }
    });
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.getDepartments()
    this.getRegions();
    this.getFinceYear();
    this.getEmployee();
    this.getAllCurrency();
    this.getAllCostProfitType()
    this.registrationall();

    if (this.id) {
      this.getByIdProfitCenter()
    }

  }
  getAllIsGroupData:any=[]
  getAllProfitCenterIsGroup(){
    let entity_id = localStorage.getItem('selectedEntityId')
    this.finance.getAllProfitCenterIsGroup(entity_id).subscribe((res:any)=>{
      this.getAllIsGroupData = res.data;
    })
  }
  rowData:any
  getAllCostProfitType() {
    this._configurationalMasterService.getCostProfitType(this.entity_id).subscribe(
      (res: any) => {
        this.rowData = res.data.filter((i:any)=>i.selected_type =='profit_center')
        console.log('==========',this.rowData)
      }, (err: any) => {

        this.toaster.error('data not found');
      }
    )
  };
getAllCurrencyData:any=[]
getAllCurrency(){
  this._configurationalMasterService.CurrencyList().subscribe((res:any)=>{
     if(res){
      this.getAllCurrencyData=res.data;
     }
  })
}


getIsgroup(data:any){

  this.getAllProfitCenterIsGroup();

}

  employeeList: any = [];
  getEmployee() {
    try {
      this.$crm.registrationall(this.entity_id,this.loginUser?.roles).subscribe((response: any) => {
        if (response) {
          this.employeeList = response.data;
        }
      }, (err:any) => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  generateProfitCenterId() {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `PC-${randomString}${timestamp}`;
  }


  typeOfNeed:any=[]
  getNeedType = () => {

    this._configurationalMasterService.listTypeOfNeed().subscribe((res: any) => {

      this.typeOfNeed = res.data;
     },(err:any) => {
       this.typeOfNeed=[]
     });
  }
  departmentList2: any[] = [];
  departmentList3: any[] = [];
  getDepartments = () => {
    this._configurationalMasterService.getDepartmentAll(this.entity_id).subscribe((res: any) => {
      this.departments = res.data;
      this.departmentList2 = res.data.map((x: any) => x.department_name);
      this.departmentList3 = this.departments
    })
  }

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
    this.profitCenterForm.controls['finacial_year'].setValue(null);
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

  getByIdProfitCenter() {
    this.finance.getProfitCenterById(this.id).subscribe((res: any) => {
      if (res && res.data) {
        this.profitCenterData = res.data;
        this.patchFormValues(res.data);
      }
    });
  }

  patchFormValues(data: any) {
    this.profitCenterForm.patchValue({
      profit_center_id: data.profit_center_id || this.generateProfitCenterId(),
      profit_center_name: data.profit_center_name || null,
      createdOn: data.created_on ? new Date(data.created_on) : new Date(),
      type: data.type || null,
      itemType: data.need_type_id || null,
      cost_center_id: data.cost_center_id || null,
      manager_id: data.manager_id || null,
      currency_id: data.currency_id || null,
      fromDate: data.from_date ? new Date(data.from_date) : null,
      toDate: data.to_date ? new Date(data.to_date) : null,
      status: data.status || 'ACTIVE',
      isGroup: data.is_group || null,
      parent_profit_center: data.parent_profit_center_id || null,
      remarks: data.remark || null,
      department_id: data.department_id || null,
      employee_id: data.employee_id || null,
      cost_profit_center_name: data.cost_profit_center_name || null
    });

    // Set type name based on type value
    if (data.type === 'department') {
      this.typeName = 'department';
      this.isCostCenterActive = 0;
    } else if (data.type === 'employee') {
      this.typeName = 'employee';
      this.isCostCenterActive = 0;
    } else {
      this.typeName = '';
      this.isCostCenterActive = data.type;
    }

    // Set the item type if need_type_id exists
    if (data.need_type_id) {
      this.itemType = data.need_type_id;
    }

    // Set isGroup value
    if (data.is_group) {
      this.isGroupValue = data.is_group;
    }

    // Enable close icons
    if (data.department_id) this.deptCloseIcon = true;
    if (data.type) this.typeCloseIcon = true;

    // Set isEditMode
    this.isEditMode = true;
  }

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
  openDialog() {
    const dialogRef = this.dialog.open(CostCenterDilogComponent, {
      data: { id: this.id, status: "revised" },

      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {

    });
  }

  typeName:any=''
  isCostCenterActive:number;
  isActive:boolean=false;
  isGroupValue:any = null;
  selectedType(e:any){

    this.typeCloseIcon =true;

if(this.typeName=='employee'){
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
if(e=='department' || e=='employee'){
  this.typeName = e
  this.isCostCenterActive=0
   this.profitCenterForm.get('cost_profit_center_name')?.reset()

  }else{
    this.isCostCenterActive = e
    this.typeName=''
   this.profitCenterForm.get('department_id')?.reset()
   this.profitCenterForm.get('employee_id')?.reset()

  }

  }
  itemType:any=''


  deptCloseIcon: boolean = false;
  regionCloseIcon: boolean = false;
  financialCloseIcon: boolean = false;
  typeCloseIcon: boolean = false;
  clearType() {
    this.typeCloseIcon = false;
    this.profitCenterForm.controls['type'].setValue(null)
  }
  clearDept() {
    this.deptCloseIcon = false;
    this.profitCenterForm.controls['department_id'].setValue(null)
  }
  clearRegion() {
    this.regionCloseIcon = false;
    this.profitCenterForm.controls['region_id'].setValue(null)
  }
  genCode = (e: any) => {


    let body = {
      department_id: this.profitCenterForm.controls['department_id'].value,
      region_id: this.profitCenterForm.controls['region_id'].value,
      cost_center_name: this.profitCenterForm.controls['cost_center_name'].value
    }

    if (body.department_id) {

      this.deptCloseIcon = true;
    }
    if (body.region_id) {
      this.regionCloseIcon = true;
    }
    if (body.department_id && body.region_id && body.cost_center_name) {
      this.finance.genertateCCCode(body).subscribe((res: any) => {
        this.profitCenterForm.controls['cost_center_code'].patchValue(res.data)
      }, err => {
        this.toaster.error(err.error.message)
      })
    }
  }
  back() {
    this.route.navigate(['/master/finance/profit-center']);
  }

  onSubmit() {
    let entity_id = localStorage.getItem('selectedEntityId')
    let val2 = this.profitCenterForm.value;
    console.warn(val2,'val2');
    let payload = {
      entity_id: entity_id,
      id: this.id || null,
      profit_center_id: val2.profit_center_id,
      profit_center_name: val2.profit_center_name,
      created_on: moment(val2.createdOn).format('YYYY-MM-DD'),
      type: val2.type,
      from_date: moment(val2.fromDate).format('YYYY-MM-DD'),
      to_date: moment(val2.toDate).format('YYYY-MM-DD'),
      is_group: val2.isGroup,
      remark: val2.remarks,
      need_type_id: val2.itemType,
      manager_id: val2.manager_id,
      currency_id: val2.currency_id,
      cost_center_id: val2.cost_center_id,
      parent_profit_center_id: val2.parent_profit_center,
      department_id: val2.department_id,
      employee_id: val2.employee_id,
      cost_profit_center_name: val2.cost_profit_center_name,
      status: val2.status || 'ACTIVE'
    }

    if (this.id) {
      // Update API
      this.finance.updateProfitCenter(this.id,payload).subscribe((res: any) => {
        if (res) {
          this.toaster.success('Updated Successfully');
          this.route.navigate(['/master/finance/profit-center']);
        }
      }, err => {
        this.toaster.error(err.error.message);
      });
    } else {
      // Create API
      this.finance.createProfitCenter(payload).subscribe((res: any) => {
        if (res) {
          this.toaster.success('Created Successfully');
          this.route.navigate(['/master/finance/profit-center']);
        }
      }, err => {
        this.toaster.error(err.error.message);
      });
    }
  }
}
