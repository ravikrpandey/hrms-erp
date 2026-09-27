import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { ProductionStatusComponent } from '../production-status/production-status.component';
import { ActionProductionComponent } from '../action-production/action-production.component';

@Component({
  selector: 'app-production-list',
  templateUrl: './production-list.component.html',
  styleUrls: ['./production-list.component.scss',],
})
export class ProductionListComponent {
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

ngOnInit(): void {
  this.  getAllProductionData()
  
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
      field: 'product_master.product_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'No. Of Plant',
      field: 'plantList.length',
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
      headerName: 'QTY',
      field: 'total_qty',
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
      field: '',
      cellRenderer:ProductionStatusComponent,
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
       headerName: 'BOM',
       field: '',
       cellRenderer:this.customButtonRenderer,
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
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 350,
      // minHeight:100,
      cellRenderer:ActionProductionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

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
    this._productionService.getAllProductionData().subscribe((response:any)=>{
this.productionData=[];
    })
  }
 
  customButtonRenderer()  {
    return '<p class="custom-p">View BOM</>';
  }

  

}
