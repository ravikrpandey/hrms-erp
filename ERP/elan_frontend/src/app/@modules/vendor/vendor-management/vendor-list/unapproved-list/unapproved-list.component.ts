import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { ActionComponent } from './action/action.component';
import { ActiveStatusComponent } from './active-status/active-status.component';
import { VendorDilogComponent } from './vendor-dilog/vendor-dilog.component';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';

@Component({
  selector: 'app-unapproved-list',
  templateUrl: './unapproved-list.component.html',
  styleUrls: ['./unapproved-list.component.scss']
})
export class UnapprovedListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  entity_id: any;
  financial_year_id: any;

  constructor(
   private route: Router,
   public dialog: MatDialog,
   private vendorService: VendorManagementService,
   private accessData: AccessControlService,
   private toast:ToastrService,
   private _commonService : CommonService

   ) {
   this.rowClass = 'rowClass'
 }

 ngOnInit(): void {
  this.entity_id = this.accessData.getEntityId(); 
  this.financial_year_id = this.accessData.getFinancialId();
  this.getUnAppVendor();
 }
 
  public rowData:any;
  public columnDefs = [
    {
      headerName: 'S.No',
      field: 'serialNumber',
      sortable: false, // Serial numbers typically shouldn't be sortable
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: .5,
      minWidth: 50,
      valueGetter: (params:any) => params.node.rowIndex + 1
    },
    {
      headerName: 'Company Code',
      field: 'vendor_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Company Name ',
      field: 'vendor_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Vendor Category',
      field: 'vendor_category',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Vendor Type',
      field: 'vendor_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Email ID',
      field: 'vendor_email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'PAN Number',
      field: 'pan_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Action',
      field: 'id', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellRenderer: ActionComponent,
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

  goToAddCreate(path:any) {
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

  addVendor(path:any){
    this.route.navigate([path]);
  }

  getUnAppVendor(){
    this._commonService?.showLoader()
    this.vendorService.getAllVendorList(this.entity_id).subscribe((res:any)=>{
      this._commonService?.hideLoader()
      this.rowData =res.data;
    },
    ((err:any)=>{
      this._commonService?.hideLoader()
      this.rowData=[]
    }))
  }
}