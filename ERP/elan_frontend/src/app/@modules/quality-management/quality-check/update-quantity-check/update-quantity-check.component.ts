import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QualityManagementService } from '../../quantity-management.service';
import { ToastrService } from 'ngx-toastr';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-update-quantity-check',
  templateUrl: './update-quantity-check.component.html',
  styleUrls: ['./update-quantity-check.component.scss']
})
export class UpdateQuantityCheckComponent {
  qualityCheck:FormGroup
  isBatchChecked=true
  minDate: Date;
  maxDate: Date;
  cetegory: any;
  subCetegory: any;
  productData: any;
  product_id: any;
   
constructor(private _fb:FormBuilder,
  private _active:ActivatedRoute,
  private _qualityService:QualityManagementService,
  private toaster:ToastrService,
  private _route:Router,
  private _productionService: ProductionService,
  private activeroute: ActivatedRoute,
  ){
  
    
this.qualityCheck= _fb.group({
  product_category_id: new FormControl(''),
  product_id:new FormControl(''),
  product_variant:new FormControl(''),
  date:new FormControl('',Validators.required),
  generate_label:new FormControl(''),
  total_production:new FormControl(''),
  quality_pass:new FormControl(''),
  NG:new FormControl(''),
  shift_id:new FormControl(''),
  remaning_production:new FormControl(''),
})

}
getDate(start:any, end:any){
  this.minDate = new Date(moment(start).format('MMMM DD, YYYY')); 
  this.maxDate = new Date(moment(end).format('MMMM DD, YYYY')); 
  console.log(this.minDate, this.maxDate);
}
dateFilter = (date: Date | null): boolean => {
  const day = (date || new Date()).getTime();
  return day >= this.minDate?.getTime() && day <= this.maxDate?.getTime();
}
dateSelected(event: MatDatepickerInputEvent<Date>) {
  console.log('Selected date:', event.value);
}
shiftList:any[]=[]
variant_id:any;
 getAllShiftData:any;
variant_name:any;
total_qty:any
quality_id:any
variant_List:any[]=[]
start_date:any;
end_date:any;
product_category_id: any;
product_category_sub_id: any;
product_name: any;
production_qty: any;
entityId:any;
financial_year_id:any
shift_id: any;
ngOnInit(): void {
  this.entityId = localStorage.getItem('selectedEntityId');
  this.financial_year_id = localStorage.getItem('financial_id');
  this.activeroute.queryParams.subscribe((params: any) => {
    this.quality_id = params.Quality_CheckID;
    //this.quality_id = params.productionMapId;
    console.log(params.Quality_CheckID, 'id');

    this._qualityService.getQualityCheckById(this.quality_id).subscribe((res: any) => {
   
      this.start_date = res?.data?.start_date;
      this.end_date = res?.data?.end_date;
      this.production_qty = res?.data?.production_qty;

      this.shiftList = res?.data?.shiftList;

      this.getDate(this.start_date, this.end_date);

      this.product_category_id = res.data?.ADD_PRODUCTION_MST?.MASTER_PRODUCT?.product_category_id;
      this.product_id= res.data?.ADD_PRODUCTION_MST?.product_id,
      this.getAllActiveProduct(this.product_category_id);
      const latestShift = this.shiftList?.[this.shiftList.length - 1]; 
      const latestNgValue = latestShift?.ng; 


      this.qualityCheck.patchValue({
        product_category_id: this.product_category_id,
        product_id: res.data?.ADD_PRODUCTION_MST?.product_id,
        product_variant: res.data?.ADD_PRODUCTION_MST?.MASTER_PRODUCT?.MASTER_PRODUCT_VARIANT?.variant_name,
        total_production: this.production_qty,
        remaning_production: latestNgValue,
      });
    });
  });

  this.getAllCategory();
}

getAllCategory() {
  this._productionService.getAllCetegory(this.entityId).subscribe((res: any) => {
    this.cetegory = res.data;
  })
}
getCetegoryDetail(event: any) {
  
}
getSubCetegoryDetail(event: any) {
  if (!event?.value) return; 
  let cetegory = this.qualityCheck.controls['product_category_id']?.value
  this._productionService.getAllProductOncetegory(cetegory, event?.value).subscribe((res: any) => {
    this.productData = res.data;
  })
}
now = new Date();
year = this.now.getFullYear();
month = this.now.getMonth();  


goBack()
{
 // this.location.back()
}
sum: any;
total_production_val: any;

calculateSum() {
  this.total_production_val = +this.qualityCheck.get('total_production')?.value || 0;
  const qualityPassValue = +this.qualityCheck.get('quality_pass')?.value || 0;
  const ngValue = +this.qualityCheck.get('NG')?.value || 0;

  this.sum = qualityPassValue + ngValue;

  if (this.sum !== this.total_production_val) {
    this.toaster.warning(
      'The sum of Quality Pass and NG must equal Total Production.',
      'Validation Warning'
    );
  }
}

updateQualityCheck(data: any) {
  ;

  const totalProduction = +data.total_production || 0;
  const qualityPass = +data.quality_pass || 0;
  const ng = +data.NG || 0;

  if (qualityPass + ng !== totalProduction) {
    this.toaster.error(
      'The sum of Quality Pass and NG must equal Total Production.',
      'Validation Error'
    );
    return;
  }

  let Qualitydata = {
    product_id:this.product_id,
    date: moment(data.date).format('MM/DD/YYYY'),
    generate_label: data.generate_label,
    total_production: totalProduction,
    quality_passed: qualityPass,
    ng: ng,
    shift_id: data.shift_id,
    remaning_production: data.remaning_production,
    emp_id: data.emp_id,
  };

  if (this.qualityCheck.invalid) {
    this.toaster.error('Mandatory fields should not be empty', 'Error Message');
    return;
  }

  this._qualityService.updateQualityCheck(this.quality_id, Qualitydata).subscribe(
    (res: any) => {
      if (res) {
        this.toaster.success(res.message); 
        this._route.navigate(['/master/quality-management/quality-check']); 
      }
    },
    (err: any) => {
      this.toaster.error(err.error.message); 
    }
  );
}

generateCode(event:any){
  if(event.value=='batch'){
    let data={
      batch_number:true
    }
    this._qualityService.createCode().subscribe((res:any)=>{
      this.qualityCheck.patchValue({
        generate_label:res.data.batch_number
      })
    })
  } 
  else{
    let data={
      s_number:true
    }
    this._qualityService.createCode().subscribe((res:any)=>{
      this.qualityCheck.patchValue({
        generate_label:res.data.SerialNumber
      })
    })
  }  
}


getAllActiveProduct(event: any) {
    
  this._productionService.getAllActiveProduct(event.value??event,this.entityId).subscribe((res: any) => {
    this.productData = res.data
  })
}

}
