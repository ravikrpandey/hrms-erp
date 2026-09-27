import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-warranty',
  templateUrl: './warranty.component.html',
  styleUrls: ['./warranty.component.scss']
})
export class WarrantyComponent {
  errorMessage: any;
  id: any;
  rowClass: any;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55};
  private gridApi!: GridApi<any>;
  rowData: any;

   //databaseKey: any = environment.servralUrl;

  assignAction: any;
  constructor(
    private readonly _configurationalMasterService: ConfigurationalmasterService,
    private _commonService : CommonService,
   private activetRoute: ActivatedRoute,
   
    private asset_service:AssetListService,
    private _rbackService: RbacMasterService,
  ) {
      this.activetRoute.queryParams.subscribe((params: any) => {
        this.id = params.id;
      });
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    let lg: any = localStorage.getItem('signInUser')
    let loginUser = JSON.parse(lg);
   
    if(this.id){
      this.getAssetWarranty();
    }
  }

 

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Asset No',
      field: 'asset_tagId',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Invoice / Ref Number',
      field: 'invoiceRefNumber',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Warranty Number',
      field: 'warrantyNumber',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Supplier Name',
      field: 'supplierName',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
   
    {
      headerName: 'Remark',
      field: 'remarks',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Invoice Date',
      field: 'invoiceDate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueFormatter: (params:any) => this.formatDate(params.value)
    },
    {
      headerName: 'From Date',
      field: 'fromDate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,valueFormatter: (params:any) => this.formatDate(params.value)
    },
    {
      headerName: 'To Date',
      field: 'toDate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueFormatter: (params:any) => this.formatDate(params.value)
    },
  ];




  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(e:any){
  }

  agInit(params: ICellRendererParams): void {

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

  getAssetWarranty(){
    this.asset_service.getAssetWarrantiesByIdForAssetView(this.id).subscribe((res:any)=>{
      if(res.data){
        this.rowData=res.data || [];          
      }
    },(err:any)=>{
      this.rowData=[];
    })
  }
  formatDate(dateValue: any): string {
    if (dateValue) {
      const date = new Date(dateValue);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return '';
  }
}



