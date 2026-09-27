import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { DepreciationService } from 'src/app/@shared/services/depreciation.service';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-depreciation-forecast-create',
  templateUrl: './depreciation-forecast-create.component.html',
  styleUrls: ['./depreciation-forecast-create.component.scss']
})
export class DepreciationForecastCreateComponent {

  myform: FormGroup;
  id: any;
  loginUser: any;
  entity_id: any;
  entityList:any;
  entityIds: any;
  months: any;
  type: any;
  sealList : any;
  fid:any;
  mode:any =  false;
  res:any;
  fYears: any;
  fYearsFiltered:any;
  financial_year: any;
  filter_fy:any;
  fYearsFiltered2: any;
  financeYears: any;
  months2: any;
  monthList: any;
  constructor(private location: Location,
    private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbacMasterService: RbacMasterService,
    private toaster: ToastrService,
    private router: Router,
    private toast: ToastrService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private entityService: EntityMasterService,
    private depreciationService: DepreciationService,
    private finance: FinaceService,
    private _commonService : CommonService
  ) {
    this.myform = this.fb.group({
      depreciation_month: new FormControl('', [Validators.required]),
      depreciation_amount: new FormControl('',[Validators.required]),
      depreciation_type: new FormControl('Forecast',[Validators.required]),
      financial_year_id: new FormControl('',[Validators.required]),
    });
  }
  ngOnInit(): void {
    // this.entity_id = localStorage.getItem('selectedEntityId');
    this.filter_fy = localStorage.getItem('financial_id');
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.id = res.id;
      if ( res.mode == 'view') this.mode = true;
    })

    this.months = [{name:'January',id:1},{name:'February',id:2},{name:'March',id:3},{name:'April',id:4},{name:'May',id:5},{name:'June',id:6},{name:'July',id:7},{name:'August',id:8},{name:'September',id:9},{name:'October',id:10},{name:'November',id:11},{name:'December',id:12}]
    this.months2 = this.months;
    this.monthList = this.months.map((value:any) => value.name)
    let idEntity=localStorage.getItem('selectedEntityId')
    this.entity_id = Number(idEntity);
    let lg: any = localStorage.getItem('signInUser')
    let entityList: any = localStorage.getItem('entityList')
    this.entityList = JSON.parse(entityList);
    this.entityIds = this.entityList.map((entity:any) => entity.entity_id);
    this.loginUser = JSON.parse(lg);
    this.getAllFinancialYear()
    this.getEntity();
  }

  getAllFinancialYear() {
    this.finance.getFinancialYearActive().subscribe((res: any) => {
      this.fYears = res.data;
      this.fYearsFiltered = res.data;
      let year = new Date().getFullYear();
      this.fYearsFiltered = this.fYears.filter((yr:any) => {
        if (Number(yr.financial_year) > Number(year)) {
          return true;
        }
        else {
          return false;
        }
      })
      this.fYearsFiltered2 = this.fYearsFiltered
      this.financeYears = this.fYearsFiltered.map((value:any)=> value.financial_year)
      if (this.id) {
        this.getForecastRevenueById();
      }
    })
  }

  yearFilter(e: any) {
    const aa = e
    let filteredVariable = this.fYearsFiltered2.filter((item: any) => aa.includes(item.financial_year ));
    this.fYearsFiltered = filteredVariable
  }

  getEntity = () => {
    this.entityService.getEntityList().subscribe((res:any)=>{
      this.entityList= res?.data;
    })
  }

  onSelection = (e:any) => {
    let year = new Date().getFullYear();
    if (e.value == 'Actual') {
      this.fYearsFiltered = this.fYears.filter((yr:any) => {
        if (Number(yr.financial_year) >= Number(year)) return true;
        else return false;
      })
      this.fYearsFiltered2 = this.fYearsFiltered
      this.financeYears = this.fYearsFiltered.map((value:any) => value.financial_year)
    }
    if ( e.value == 'Forecast') {
      this.fYearsFiltered = this.fYears.filter((yr:any) => {
        if (Number(yr.financial_year) > Number(year)) {
          return true;
        }
        else {
          return false;
        }
      })
      this.fYearsFiltered2 = this.fYearsFiltered
      this.financeYears = this.fYearsFiltered.map((value:any) => value.financial_year)
    }
  }

  goBack() {
    this.location.back();
  }

  onSubmit(data: any) {
    if (this.myform.invalid) {
      this.myform.markAllAsTouched()
      this.toaster.error('All fields are Mandatory', 'Error Message')
      return
    }
    data['entity_id'] = this.entity_id;
    data['filter_fy'] = this.filter_fy;
    if (this.id) {
      this._commonService?.showLoader()
      this.depreciationService.updateDepreciation(this.id,data).subscribe((response: any) => {
        this._commonService?.hideLoader()
        if (response) {
          this.toaster.success(response.message);
          this.router.navigate(['/master/asset-management/depreciation/list'])
        }
      }, (err: any) => {
        this._commonService?.hideLoader()
        this.toaster.error(err.error.message);
      })
    }
    else {
      data['filter_fy'] = this.filter_fy;
      this._commonService?.showLoader()
      this.depreciationService.createDepreciation(data).subscribe((response: any) => {
        this._commonService?.hideLoader()
        if (response) {
          this.toaster.success(response.message);
          this.router.navigate(['/master/asset-management/depreciation/list'])
        }
      }, (err: any) => {
        this._commonService?.hideLoader()
        this.toaster.error(err.error.message)
      })
    }
  }

  monthsFilter(e: any) {
    const aa = e
    let filteredVariable = this.months2.filter((item: any) => aa.includes(item.name));
    this.months = filteredVariable
  }

  getForecastRevenueById() {
    this._commonService?.showLoader()
    this.depreciationService.getByIdDepreciation(this.id).subscribe((response: any) => {
      this.res = response.data;
      this._commonService?.hideLoader()
      this.financial_year = response.data.financial_year
      let year = new Date().getFullYear();

      if (response.data?.depreciation_type == 'Actual') {
        this.fYearsFiltered = this.fYears.filter((yr:any) => {
          if (Number(yr.financial_year) >= Number(year)) return true;
          else return false;
        })
        this.fYearsFiltered2 = this.fYearsFiltered
      }
      if ( response.data?.depreciation_type == 'Forecast') {
        this.fYearsFiltered = this.fYears.filter((yr:any) => {
          if (Number(yr.financial_year) > Number(year)) {
            return true;
          }
          else {
            return false;
          }
        })
        this.fYearsFiltered2 = this.fYearsFiltered
      }
      this.financeYears = this.fYearsFiltered.map((value:any) => value.financial_year)
    
      this.myform.patchValue({
        depreciation_amount: response.data?.depreciation_amount,
        depreciation_type:response.data?.depreciation_type,
        depreciation_month:response.data?.depreciation_month,
        financial_year_id:response.data?.financial_year_id,
      })
    }, (err: any) => {
      this._commonService?.hideLoader()
      this.toaster.error(err.error.message);
    })
  }

  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any) => {
        const obj = new FormGroup({});
        Object.keys(x).forEach((k) => {
          obj.addControl(k, new FormControl(x[k]));
        });
        return obj;
      })
    );
  };
}
