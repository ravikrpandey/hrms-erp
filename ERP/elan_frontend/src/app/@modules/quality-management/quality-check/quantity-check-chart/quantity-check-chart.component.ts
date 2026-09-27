import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { QualityManagementService } from '../../quantity-management.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';

@Component({
  selector: 'app-quantity-check-chart',
  templateUrl: './quantity-check-chart.component.html',
  styleUrls: ['./quantity-check-chart.component.scss']
})
export class QuantityCheckChartComponent {
  QualityChartform:FormGroup;
  chartData:any;
  start_date:any;
  end_date:any;
  @ViewChild('pieChart') private pieChartRef: any;
 
  public pieChart:any;
   constructor(private _qualityCheckService:QualityManagementService,
  private _activeRoute:ActivatedRoute,private _fb:FormBuilder,
  private _productionService:ProductionService
  ){
this.QualityChartform=_fb.group({
  product_category_id:new FormControl(''),
  product_id:new FormControl(''),
  product_variant:new FormControl(''),
  total_qty:new FormControl(''),
  All_production:new FormControl(''),
  All_quality_passed:new FormControl(''),
  All_ng:new FormControl(''),
  qualityPass:new FormControl(''),
  NG:new FormControl(''),
  shift_id:new FormControl(''),
})
 
  }
productVariant:any;
quality_id:any;
getAllShift:any[]=[]
getAllDateShiftData:any
startEndDate:any;
totalProductionChartData:any[]=[]
morningShiftData:any[]=[];
nightShiftData:any[]=[];
eveningShiftData:any[]=[];
morning_shiftData:any[]=[];
evening_shiftData:any[]=[];
night_shiftData:any[]=[];
All_shift_data:any[]=[];
entityId:any;
financial_year_id:any

ngOnInit(): void {

  this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');

this.getAllCategory();
  
 this._activeRoute.queryParams.subscribe((res:any)=>{
  
     if(res.qualityChart){
      this._qualityCheckService.getQualityChartData(res.qualityChart).subscribe((res:any)=>{
        
         console.log(res.data,'response');
                const start_date =moment(res.data.start_date).format('YYYY-MM-DD');
                const end_date = moment(res.data.end_date).format('YYYY-MM-DD');
                const datesBetween = [];
                let currentDate = moment(start_date);
                while (currentDate.isSameOrBefore(end_date, 'day')) {
                  datesBetween.push(currentDate.format('DDMMM'));
                  currentDate.add(1, 'day');
                }
                this.chartData=datesBetween
                // console.warn( datesBetween,'this.chartData')
              this.createPieChart()
                this.startEndDate=res.data;
                this.quality_id= res.qualityChart;
                  this.getAllShift=res.data?.shiftList;
                  this.getAllDateShiftData=res.sortedShiftDataByDate
            
           const totalProduction = this.getAllShift.reduce((sum, item) => sum + item.total_production, 0); 
           const total_passed = this.getAllShift.reduce((sum, item) => sum + item. quality_passed, 0); 
           const total_ng = this.getAllShift.reduce((sum, item) => sum + item.ng, 0); 
           this.getAllActiveProduct(res.data?.ADD_PRODUCTION_MST?.MASTER_PRODUCT?.product_category_id);
        this.QualityChartform.patchValue({
          product_id:res.data?.ADD_PRODUCTION_MST?.MASTER_PRODUCT?.id,
          product_category_id:res.data?.ADD_PRODUCTION_MST?.MASTER_PRODUCT?.product_category_id,
          product_variant:this.productVariant,
          total_qty:res.data.plantList.total_qty,
          qualityPass:res.data.quality_passed,
          NG:res.data.ng,
          All_production:totalProduction,
          All_quality_passed:total_passed,
          All_ng:total_ng,
        })
      })

     }

     this._qualityCheckService.getGraphDataById(res.qualityChart).subscribe((res:any)=>{
      
      console.warn(res,'response');
      res.data.morning?.morning_shift_data.map((item:any) =>{
        this.morningShiftData.push(item.total_production)
      });
      res.data.evening?.evening_shift_data.map((item:any) =>{
      this.eveningShiftData.push(item.total_production)
      });
     res.data.night?.night_shift_data.map((item:any) =>{
        this.nightShiftData.push(item.total_production)
      });
      res.data?.prod_total.map((res:any)=>{
        this.totalProductionChartData.push(res.total_production)
      })
     
            let totalProductionSum = 0;
           let qualityPassedSum = 0;
           let ngSum = 0;
 
      res.data.prod_total.forEach((item:any) => {
        totalProductionSum += parseInt(item.total_production);
        qualityPassedSum += parseInt(item.quality_passed);
        ngSum += parseInt(item.ng);
      });
     this.QualityChartform.patchValue({
      All_production:totalProductionSum,
      All_quality_passed:qualityPassedSum,
      All_ng:ngSum
     }) 
     this.morning_shiftData=res.data.morning?.morning_shift_data;
     this.evening_shiftData=res.data.evening?.evening_shift_data;
     this.night_shiftData=res.data.night?.night_shift_data;
     console.log(this.morning_shiftData,this.evening_shiftData,this.night_shiftData);
     this.All_shift_data=[...this.morning_shiftData,...this.evening_shiftData,...this.night_shiftData]
  });


 })
  
}

ngAfterViewInit() {
 
}

createPieChart(){
  const ctx = this.pieChartRef.nativeElement.getContext('2d');
  this.pieChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: this.chartData,
      datasets: [{
        data: this.totalProductionChartData,
         label:'Total Production',
        fill: false,
        borderColor: 'rgb(229, 241, 210)',
        tension: 0.1
      },
      {
        data: this.morningShiftData,
        label:'Morning Shift', 
        fill: false,
        borderColor: 'rgb(118, 202, 236)',
        tension: 0.1
      },
      {
        data:this.eveningShiftData,
        label:'Evening Shift', 
         
        fill: false,
        borderColor: 'rgb(253, 224, 167)',
        tension: 0.1
      },
      {
        data: this.nightShiftData,
        label:'Night Shift', 
         
        fill: false,
        borderColor: 'rgb(185, 185, 185)',
        tension: 0.1
      }
    ]
    
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'category',
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
goBack(){
 // this._location.back()
}
getAllShiftById:any[]=[];
getShiftId(data:any,i:any){
  console.log(data,'data',i);
   console.warn(data,'dateststetst');
   const mydata=this.All_shift_data.filter(res=>res.shift_name==data.shift_name)
   console.log(mydata,'mydata');
   let totalProductionSum = 0;
   let qualityPassedSum = 0;
   let ngSum = 0;
   let shift_name=''
   mydata.forEach((item:any) => {
totalProductionSum += parseInt(item.total_production);
qualityPassedSum += parseInt(item.quality_passed);
ngSum += parseInt(item.ng);
shift_name+=item.shift_name
});
 console.log(totalProductionSum,qualityPassedSum,ngSum,'sdgsdgsdsdg');
 let total_shift={
  total_production:totalProductionSum,
  quality_passed:qualityPassedSum,
  ng_values:ngSum,
  shift_name:shift_name
 }
 this.getAllShiftById.push(total_shift)
   console.log(this.getAllShiftById,'this.getAllShiftById');
   
   
 
 
  
}


productData:any=[];
cetegory:any=[];
getAllCategory() {
  this._productionService.getAllCetegory(this.entityId).subscribe((res: any) => {
    this.cetegory = res.data;

  })
}
getAllActiveProduct(event: any) {
  
  this._productionService.getAllActiveProduct(event.value??event,this.entityId).subscribe((res: any) => {
    this.productData = res.data
  })
}


}


