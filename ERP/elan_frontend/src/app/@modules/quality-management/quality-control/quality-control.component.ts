import { Component } from '@angular/core';
import { QualityControlActionComponent } from './quality-control-action/quality-control-action.component';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-quality-control',
  templateUrl: './quality-control.component.html',
  styleUrls: ['./quality-control.component.scss']
})
export class QualityControlComponent {
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
    private _productionService:ProductionService,
    private _empService: EmpRegistrationService,
  ) {
    this.rowClass = 'rowClass';
  }
  signUpId:any
getAllVerifiedData:any[]=[]
getEmpPlant:any;
filteredEmp:any[]=[];
entityId:any;
financial_year_id:any
ngOnInit(): void {
  this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
  this.getAllProductionData()
  // this.getAllPlantMaster()
  // this.getAllProduct()
  // const empId = localStorage.getItem('signInUser');
  // if (empId != null) {
  //   const signupUser = JSON.parse(empId);
  //   this.signUpId = signupUser.employee_id; 
  // }
  
  // this._empService.getByUserId(this.signUpId).subscribe((res: any) => {
  //   this.getEmpPlant = res.data?.reporting_plant_location;
  //   console.log(this.getEmpPlant, 'this.getAllData');
  
  //   this._productionService.getAllVerifyData().subscribe((res: any) => {
  //     this.rowData = res.data;
  //     this.getAllVerifiedData = this.rowData.filter((item:any) => item.plantName === this.getEmpPlant && item.status=="START");
  //     console.warn(this.getAllVerifiedData, 'this.getAllVerifiedData');
  //   });
  // });
   
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
      cellRenderer:QualityControlActionComponent,
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
  productionData:any;
  signUpEmpId:any;
  userRole:any
  getAllProductionData(){
    const empId = localStorage.getItem('signInUser');
    if (empId != null) {
      const signupUser = JSON.parse(empId);
      this.signUpEmpId = signupUser.employee_id;
      this.userRole= signupUser.role
    }
    let data={
      role:this.userRole,
      employee_id:this.signUpEmpId,
      entity_id:this.entityId,
      financial_year_id:this.financial_year_id
    }
    this._productionService.getAllVerifyScheduleData(data).subscribe((res:any)=>{
      this.rowData=res.data
      this.filteredData=this.rowData
    })
  }
  // getAllPlantsData:any[]=[];
  // getAllPlantMaster() {
  //   this._configurationalMasterService.getPlantMasterList().subscribe((res: any) => {
  //     this.getAllPlantsData = res.data;
  //   });
    
  // }
  // getAllProductData:any[]=[]
  // getAllProduct(){
  //     this._configurationalMasterService.getProductMasterList().subscribe((res: any) => {
  //       this.getAllProductData = res.data
  //     }) 
      
  // }
}
