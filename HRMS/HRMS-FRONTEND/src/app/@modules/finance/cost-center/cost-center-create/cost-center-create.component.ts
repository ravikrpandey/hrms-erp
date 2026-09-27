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
import { FinanceCreateComponent } from 'src/app/@modules/itticketing/configurationalmaster/financial-year/finance-create/finance-create.component';


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
  constructor(private fb: FormBuilder, public dialog: MatDialog, private _configurationalMasterService: ConfigurationalmasterService, private prService: PurchaseRequestService, private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    private $common: CommonService,
    private finance: FinaceService,
    private route: Router
  ) {
    this.costCenterForm = this.fb.group({
      department_id: new FormControl(null, [Validators.required]),
      region_id: new FormControl(null, [Validators.required]),
      cost_center_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      cost_center_code: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      type: new FormControl(null, Validators.required),
      amount_bgt: new FormControl(null, Validators.required),
      finacial_year: new FormControl(null, Validators.required)
    })
  }

  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.mode = params.mode;
    });
    this.getDepartments()
    this.getRegions();
    this.getFinceYear();
    if (this.id) {
      this.getByIdCostCenter()
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
    let entity_id = localStorage.getItem('selectedEntityId');
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
        this.department_name = this.getData.department_name;
        this.region_name = this.getData.region_name;
        this.costCenterForm.patchValue({
          department_id: this.getData?.department_id,
          region_id: this.getData?.region_id,
          cost_center_name: this.getData?.cost_center_name,
          cost_center_code: this.getData?.cost_center_code,
          finacial_year: this.getData?.financial_year_id,
          type: this.getData?.cost_center_type,
          // extend_type:val?.type,
          amount_bgt: this.getData?.amount
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
  selectedType(e:any){
    this.typeCloseIcon =true;
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
  clearRegion() {
    this.regionCloseIcon = false;
    this.costCenterForm.controls['region_id'].setValue(null)
  }
  genCode = (e: any) => {


    let body = {
      department_id: this.costCenterForm.controls['department_id'].value,
      region_id: this.costCenterForm.controls['region_id'].value,
      cost_center_name: this.costCenterForm.controls['cost_center_name'].value
    }

    if (body.department_id) {

      this.deptCloseIcon = true;
    }
    if (body.region_id) {
      this.regionCloseIcon = true;
    }
    if (body.department_id && body.region_id && body.cost_center_name) {
      this.finance.genertateCCCode(body).subscribe((res: any) => {
        this.costCenterForm.controls['cost_center_code'].patchValue(res.data)
      }, err => {
        this.toaster.error(err.error.message)
      })
    }
  }
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


    let data = {
      department_id: val?.department_id,
      region_id: val?.region_id,
      cost_center_name: val?.cost_center_name,
      cost_center_code: val?.cost_center_code,
      financial_year_id: val?.finacial_year,
      cost_center_type: val?.type,
      // extend_type:val?.type,
      amount: val?.amount_bgt.replace(/,/g, ''),
      id: this.id || null
    }





    if (this.id) {
      this.finance.updateCostCenter(this.id, data, this.entity_id).subscribe((res: any) => {
        this.toaster.success(res.message)
        this.route.navigate(['master/finance/cost-center'])
      }, err => {
        this.toaster.error(err.error.message)
      })
    } else {
      this.finance.createCostCenter(data, this.entity_id).subscribe((res: any) => {
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
