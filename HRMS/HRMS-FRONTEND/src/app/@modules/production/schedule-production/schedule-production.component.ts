import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ProductionStatusComponent } from '../production-status/production-status.component';
import { ScheduleProductionActionComponent } from './schedule-production-action/schedule-production-action.component';
@Component({
  selector: 'app-schedule-production',
  templateUrl: './schedule-production.component.html',
  styleUrls: ['./schedule-production.component.scss']
})
export class ScheduleProductionComponent implements OnInit {
  
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple', };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  quickFilter: string;
  filteredData:any
  constructor(
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _productionService:ProductionService
  ) {
    this.rowClass = 'rowClass';
  }
  userRole:any;
  signUpId:any;
ngOnInit(): void {
  this.getAllProductionData()
  this.getAllPlantMaster()
  this.getAllProduct()

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
      headerName: 'Product Order No',
      field: 'production_order_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Product Name',
      field: 'product_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Start Date',
      field: 'startDate',
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
      headerName: 'End Date',
      field: 'endDate',
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
      headerName: 'Status',
      field: 'status',
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
       headerName: 'Production QTY',
       field: 'productionQty',
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
      headerName: 'Plant Name',
      field: 'plantName',
      cellRenderer: '',
      cellRendererParams: {
       className: 'mat-blue',
       hideRequestButton: true,
       sortable: true,
       hideDetailsButton: false,
       hideDownloadIcon: false,
       showCustomIcon: false,
       
       valueFormatter: 'JSON.parse(value)',
     },
     cellClass: "grid-cell-centered",
   },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 200,
      // minHeight:100,
      cellRenderer:ScheduleProductionActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
        onActionPerform: (data: any) => this.handleActionData(data),
      },
    },
  ];

  handleActionData(data: any) {
    console.log('Data received from action component:', data);
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  productionData:any
   
  getAllProductionData(){
    const empId = localStorage.getItem('signInUser');
    if (empId != null) {
      const signupUser = JSON.parse(empId);
      this.signUpId = signupUser.employee_id;
      this.userRole= signupUser.role
      
      
    }
    let data={
      role:this.userRole,
      employee_id:this.signUpId,
    }
    this._productionService.getAllVerifyScheduleData(data).subscribe((res:any)=>{
      this.rowData=res.data
      this.filteredData=this.rowData
    },(err:any)=>{
      this.filteredData=[]
    })
  }
  getAllPlantsData:any[]=[];
  getAllPlantMaster() {
    this._configurationalMasterService.getPlantMasterList().subscribe((res: any) => {
      this.getAllPlantsData = res.data;
    });
    
  }
  getAllProductData:any[]=[]
  getAllProduct(){
      this._configurationalMasterService.getProductMasterList().subscribe((res: any) => {
        this.getAllProductData = res.data
      }) 
      
  }
  onFilterByPlantName(event:any) {
    if (event == null || undefined){
      this.filteredData  = this.rowData;
    }else{
      this.filteredData  = this.rowData.filter((res:any) => res.plantName == event);
    } 
  }
  onFilterByProductName(event:any) {
    if (event == null || undefined){
      this.filteredData  = this.rowData;
    }else{
      this.filteredData  = this.rowData.filter((res:any) => res.product_name == event);
    } 
  }


 



  
}
