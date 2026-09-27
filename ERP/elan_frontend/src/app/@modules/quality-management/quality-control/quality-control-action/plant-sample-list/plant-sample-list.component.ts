import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { QualityManagementService } from '../../../quantity-management.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import * as moment from 'moment';

@Component({
  selector: 'app-plant-sample-list',
  templateUrl: './plant-sample-list.component.html',
  styleUrls: ['./plant-sample-list.component.scss']
})
export class PlantSampleListComponent {
  samplePlant:FormGroup

  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple', };
  constructor(private _fb:FormBuilder, private _activeRoute:ActivatedRoute,private _productionService:ProductionService,
    private _toaster:ToastrService,private router:Router,private _qualityManagement:QualityManagementService){
  
  this.samplePlant= _fb.group({
    product_id: new FormControl(''),
    product_category_id: new FormControl(''),
    product_variant: new FormControl(''),
    product_code: new FormControl(''),
    plant_name: new FormControl(''),
   start_date : new FormControl(''),
   end_date : new FormControl(''),
   work_station_id : new FormControl(''),
   start_date_filter : new FormControl(''),
   end_date_filter : new FormControl(''),
    
     
  })
  
  }
  plant_id:any
 workStationList:any[]=[];
 entityId:any;
 financial_year_id:any
  ngOnInit(): void {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
 
    let data={
      work_station_id:'',
      start_date:'',
      end_date:''
    }
    this.getAllCategory();
    this._activeRoute.queryParams.subscribe((res: any) => {
      this.plant_id= res.plant_id;
      this.getQualityControlById(this.plant_id,data)
      this._productionService.getTrackingById(this.plant_id).subscribe((res: any) => {
         console.warn(res.data,'data');
         this.workStationList=res.data?.workstationList;
         this.getAllActiveProduct(res?.data?.ADD_PRODUCTION_MST?.MASTER_PRODUCT?.PRODUCT_CATEGORY?.id);
         this.samplePlant.patchValue({
          product_category_id:res?.data?.ADD_PRODUCTION_MST?.MASTER_PRODUCT?.PRODUCT_CATEGORY?.id,
          product_id:res?.data?.ADD_PRODUCTION_MST?.product_id,
          product_variant:res?.data?.ADD_PRODUCTION_MST?.MASTER_PRODUCT?.MASTER_PRODUCT_VARIANT?.variant_name,
          product_code:res?.data?.ADD_PRODUCTION_MST?.MASTER_PRODUCT?.product_code,
          plant_name:res?.data?.MASTER_PLANT?.plant_name,
          start_date:res.data.start_date,
          end_date:res.data.end_date,
         })
         });
        
      });


  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:100 ,
    },
    
    {
      headerName: 'Sample S.No',
      field: 'sample_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 140,
    },
    {
      headerName: 'WorkStation Name',
      field: 'MASTER_WORKSTATION.name_of_workstation',
      cellRenderer: '',
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
    },
    
   
    {
      headerName: 'Shift',
      field: 'MASTER_SHIFT.shift_name',
      cellRenderer: '',
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
    },
    
    {
      headerName: 'Date',
      field: 'date',
      
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
    },
    {
       headerName: 'Total Quality Check',
       field: 'total_quality_check',
     
       cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
    },
    {
      headerName: 'Pased',
      field: 'total_quality_pass',
      flex: 1,
      minWidth: 110,
      // minHeight:100,
       
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
    {
      headerName: 'Fail',
      field: 'total_quality_fail',
      flex: 1,
      minWidth: 100,
      // minHeight:100,
       
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }


  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  
  endDatafilter(endDate:any){
    if(endDate.start_date_filter!=='' || endDate.start_date_filter!=='')
    console.warn('selecteddddd');
    let filterDate={
      work_station_id:this.samplePlant.value.work_station_id?this.samplePlant.value.work_station_id:'',
       start_date:moment(endDate.start_date_filter).format('YYYY-MM-DD'),
       end_date:moment(endDate.end_date_filter).format('YYYY-MM-DD')
      }
      // this.getQualityControlById(this.plant_id,filterDate)
      this._qualityManagement.getQualityControlById(this.plant_id,filterDate).subscribe((response:any)=>{
        this.qualityData=response.data;
        
       },(err:any)=>{
        this.qualityData=err.error.data;
       })
    
  }
  
  
  goBack(){
    window.history.back();
  }
  
  
  navigateAddSample(){
    this.router.navigate(['/master/quality-management/add-sample'],{queryParams:{plant_id:this.plant_id}})
   }

  qualityData:any[]=[]
   getQualityControlById(id:any,data:any){
    
    this._qualityManagement.getQualityControlById(id,data).subscribe((response:any)=>{
     this.qualityData=response.data;
     console.warn( this.qualityData,' this.qualityData');
     
    })
   }
  
   minEndDate: Date;
   setMinEndDate(startDate: Date) { 
    const minEndDate = new Date(startDate);
    minEndDate.setDate(minEndDate.getDate() + 1);
    this.minEndDate = minEndDate;
  }
   

  getWorkstationId(event:any){
     
     let mydate={
      work_station_id:event.value,
       start_date:'',
       end_date:''
      }
      this._qualityManagement.getQualityControlById(this.plant_id,mydate).subscribe((response:any)=>{
        this.qualityData=response.data;
  
        
       },(err:any)=>{

        this.qualityData=err.error.data;
        // this._toaster.error(err.error.message)    
         })
      // this.getQualityControlById(this.plant_id,data)
   }

// search start here

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

