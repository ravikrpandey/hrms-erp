import { Component } from '@angular/core';
import { ProductDilogComponent } from './product-dilog/product-dilog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { AssetManagementService } from 'src/app/@shared/services/asset-management.service';
import { ProductActionComponent } from './product-action/product-action.component';

@Component({
  selector: 'app-product-asset-master',
  templateUrl: './product-asset-master.component.html',
  styleUrls: ['./product-asset-master.component.scss']
})
export class ProductAssetMasterComponent {
  rowClass: any;
  filter:boolean=false;
  private gridApi!: GridApi<any>;
  public rowData:any;

  constructor(private route: Router,
    public dialog: MatDialog, private assetService: AssetManagementService) {
    this.rowClass = 'rowClass'
  }

  ngOnInit (){
    this.getAllList();
    // 
  }

  public columnDefs = [
    {
      headerName: 'Sr No.',
      field: 'asset_management_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: ' Asset Name',
      field: 'asset_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueFormatter: 'JSON.parse(value)',
      flex:1,
      minWidth:160,
    },
    {
      headerName: 'Asset Category',
      field: 'select_category', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:250,
    },
    {
      headerName: 'Asset ID',
      field: 'asset_ID', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Asset Description',
      field: 'asset_description', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Serial Number',
      field: 'serial_number', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
      // valueFormatter:(params:any)=>{
      //   return moment(new Date(params.value)).format('LL')
      // },
    },
    {
      headerName: 'Purchased Date',
      field: 'purchased_date', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
      // valueFormatter:(params:any)=>{
      //   return moment(new Date(params.value)).format('LL')
      // },Vendor Name
    },
    {
      headerName: 'Purchased Cost',
      field: 'purchased_cost', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Vendor Name ',
      field: 'vendor_name', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Status',
      field: 'asset_status', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },

    {
      headerName: 'Assigned to',
      field: 'assigned_to', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Assigned Date',
      field: 'assigned_date', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Actions',
      field: 'id', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellRenderer: ProductActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, 
      },
      cellClass: "grid-cell-centered",
     
    },
    
  ];



  goToHolidayCreate(path:any) {
    this.route.navigate([path]);
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  openFIlterMenu(){
   this.filter = !this.filter;
  } 

  getAllList (){
    this.assetService.getAllAsset().subscribe((res: any) => {
      this.rowData = res.data;
      console.log(this.rowData,"rowData");
      
    }); 
  }

  onCellClicked(e: any) {
    
    const dialogRef = this.dialog.open(ProductDilogComponent, { width: '400px', data: e.data});
    dialogRef.afterClosed().subscribe(result => {
      
    })
  }

  addProductAsset(path:any){
    this.route.navigate([path]);
  }
}
