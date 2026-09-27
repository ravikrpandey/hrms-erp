import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { BuisnessIntelligenceService } from 'src/app/@shared/services/buisness-intelligence.service';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-forecast-revenue-create',
  templateUrl: './forecast-revenue-create.component.html',
  styleUrls: ['./forecast-revenue-create.component.scss']
})
export class ForecastRevenueCreateComponent {

  forecastForm: FormGroup;
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
  filter_fy:any;
  months2: any;
  monthList: any;
  constructor(private location: Location,
    private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toaster: ToastrService,
    private router: Router,
    private toast: ToastrService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private entityService: EntityMasterService,
    private buisnessIntellService: BuisnessIntelligenceService,
    private _commonService : CommonService
  ) {
    this.forecastForm = this.fb.group({
      forcast_month: new FormControl('', [Validators.required]),
      total_amount: new FormControl('',),
      seal_type: new FormArray([
        new FormGroup({
          seal_volume: new FormControl(null, [Validators.required]),
          seal_amount: new FormControl(null, [Validators.required]),
          sealType_id: new FormControl(null, [Validators.required]),
          sealType_name: new FormControl(null,)
        }),
      ]),
    });
  }
  ngOnInit(): void {
    // this.entity_id = localStorage.getItem('selectedEntityId');
    this.filter_fy = localStorage.getItem('financial_id');
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.id = res.id;
      this.fid = res.fid;
      if ( res.mode == 'view') this.mode = true;
    })

    this.months = [{name:'January',id:1},{name:'February',id:2},{name:'March',id:3},{name:'April',id:4},{name:'May',id:5},{name:'June',id:6},{name:'July',id:7},{name:'August',id:8},{name:'September',id:9},{name:'October',id:10},{name:'November',id:11},{name:'December',id:12}]
    this.months2 = this.months
    this.monthList = this.months.map((value:any) => value.name)
    let idEntity=localStorage.getItem('selectedEntityId')
    this.entity_id = Number(idEntity);
    let lg: any = localStorage.getItem('signInUser')
    let entityList: any = localStorage.getItem('entityList')
    this.entityList = JSON.parse(entityList);
    this.entityIds = this.entityList.map((entity:any) => entity.entity_id);
    this.loginUser = JSON.parse(lg);
    this.getEntity();
    this.getSealList();
    if (this.id) {
      this.getForecastRevenueById();
    }
  }

  getEntity = () => {
    this._commonService?.showLoader()
    this.entityService.getEntityList().subscribe((res:any)=>{
      this.entityList= res?.data;
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  getSealList = () => {
    this._commonService?.showLoader()
    this._configurationalMasterService.listSealTypeActive().subscribe((res:any)=>{
      this.sealList= res?.data;
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  get monthsFormArray(): any {
    return this.forecastForm.get('seal_type') as FormArray;
  }

  get CF_3(): any {
    return this.forecastForm.controls;
  }
  addItem() {
    let data = this.fb.group({
      seal_volume: new FormControl('', [Validators.required]),
      seal_amount: new FormControl('', [Validators.required]),
      sealType_id: new FormControl('', [Validators.required]),
      sealType_name:  new FormControl('')
    });
    this.monthsFormArray.push(data);
  }

  removeItem(index: number): void {
    this.monthsFormArray.removeAt(index);
    const formArrayLength = this.monthsFormArray.length;
    let sum = 0;
    for ( let i = 0; i < formArrayLength; i++ ){
      sum +=  Number((this.forecastForm.get('seal_type') as FormArray).at(i).get('seal_amount')?.value)
    }
    this.forecastForm.controls['total_amount'].setValue(sum)
  }
  
  updateAmount(e:any,index:any){
    const formArrayLength = this.monthsFormArray.length;
    let sum = 0;
    for ( let i = 0; i < formArrayLength; i++ ){
      sum +=  Number((this.forecastForm.get('seal_type') as FormArray).at(i).get('seal_amount')?.value)
    }
    this.forecastForm.controls['total_amount'].setValue(sum)
  }

  goBack() {
    this.location.back();
  }

  monthsFilter(e: any) {
    const aa = e
    let filteredVariable = this.months2.filter((item: any) => aa.includes(item.name));
    this.months = filteredVariable
  }

  sealValidation = () => {
    const sealTypeFormArray = this.forecastForm.get('seal_type') as FormArray;
    const formArrayLength = sealTypeFormArray.length;
    for ( let i = 0; i < formArrayLength; i++ ){
      for ( let j = 0; j < formArrayLength; j++ ){
        if ( i != j ){
          if ((this.forecastForm.get('seal_type') as FormArray)?.at(i)?.get('sealType_id')?.value == (this.forecastForm.get('seal_type') as FormArray)?.at(j).get('sealType_id')?.value) return true
        }
      }    
    }
    return false;
  }

  onSubmit(data: any) {
    if ( this.sealValidation() ){
      this.toaster.error('Values can not be duplicated in Seal Type in  Rows','Error')
      return
    }
    if (this.forecastForm.invalid) {
      this.forecastForm.markAllAsTouched()
      Object.keys(this.forecastForm.controls).forEach(controlName => {
        const control = this.forecastForm.get(controlName);
        // Check if the control is invalid
        if (control && control.invalid) {
          // Push the name of the invalid control to the array
        }
      });
      this.toaster.error('All fields are Mandatory', 'Error Message')
      return
    }
    data['entity_id'] = this.entity_id;
    data['financial_year_id'] = this.fid;
    data['filter_fy'] = this.filter_fy;
    if (this.id) {
      this._commonService?.showLoader()
      this.buisnessIntellService.updateForecastRevenue(this.id,data).subscribe((response: any) => {
        if (response) {
          this._commonService?.hideLoader()
          this.toaster.success(response.message);
          this.router.navigate(['/master/business-intelligence/revenue-forecasting/list'],{ queryParams: { fid: this.fid }})
        }
      }, (err: any) => {
        this._commonService?.hideLoader()
        this.toaster.error(err.error.message);
      })
    }
    else {
      data['filter_fy'] = this.filter_fy;
      this._commonService?.showLoader()
      this.buisnessIntellService.createForecastRevenue(data).subscribe((response: any) => {
        if (response) {
          this._commonService?.hideLoader()
          this.toaster.success(response.message);
          this.router.navigate(['/master/business-intelligence/revenue-forecasting/list'],{ queryParams: { fid: this.fid }})
        }
      }, (err: any) => {
        this._commonService?.hideLoader()
        this.toaster.error(err.error.message)
      })
    }
  }

  getForecastRevenueById() {
    this._commonService?.showLoader()
    this.buisnessIntellService.getByIdForecastRevenue(this.id).subscribe((response: any) => {
      this.res = response.data;
      this._commonService?.hideLoader()
      setTimeout(() => {
        this.forecastForm.patchValue({
          forcast_month: response.data[0]?.forcast_month,
          total_amount:response.data[0]?.total_Amount,
        })
      }, 100);

      response.data[0].seal_type?.forEach((item: any, index: number) => {
        const formGroup = this.monthsFormArray.at(index) as FormGroup;
        if (formGroup) {
          setTimeout(() => {
            // this.roleIdData(item.role_master_id, index)
            formGroup.patchValue({
              sealType_id: item.sealType_id,
              seal_volume: item.seal_volume,
              seal_amount: item.seal_amount,
              sealType_name: item.seal_type
            });
          }, 200)
        }
        else {
          this.monthsFormArray.push(
            this.fb.group({
              sealType_id: item.sealType_id,
              seal_volume: item.seal_volume,
              seal_amount: item.seal_amount,
              sealType_name: item.seal_type
            })
          );
        }
      });
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
