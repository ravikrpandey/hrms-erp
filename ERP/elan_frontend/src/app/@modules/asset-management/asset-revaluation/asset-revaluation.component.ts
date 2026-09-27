import { Component } from '@angular/core';
import { AssetRevaluationFormComponent } from '../asset-revaluation-form/asset-revaluation-form.component';
import { GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { AssetLogoComponent } from '../asset-list/asset-logo/asset-logo.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-asset-revaluation',
  templateUrl: './asset-revaluation.component.html',
  styleUrls: ['./asset-revaluation.component.scss']
})
export class AssetRevaluationComponent {

  rowData: any;
  entity_id:any;
  emp_id: any;
  public gridOptions: any = {    rowSelection: 'multiple', rowHeight: 55};
  private gridApi!: GridApi<any>;
  rowClass: string = 'rowClass';
  selectedIndex: number = 0;
  tabsList: any[] = ['All Assets', 'Revalued Assets'];

  selectedTabIndex: any;
  rowData_RA:any;
  assignAction: any;


  rowSelection:any = {
    mode: "multiRow",
  };

  constructor(private asset_service:AssetListService,
    private dialog: MatDialog,
    private _rbackService : RbacMasterService,

  ){
    this.assignAction = this._rbackService.accessAssignAction();

  }
  ngOnInit(){

    let lg: any = localStorage.getItem('signInUser')
    let loginUser = JSON.parse(lg);
    this.emp_id= loginUser?.employee_id
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.getAssetList();

  }

  getAssetList(){
    this.asset_service.getAllAsset(this.emp_id,this.entity_id).subscribe((res:any)=>{
        if(res.data){
         this.rowData=res.data;
        }
    },(err:any)=>{
      this.rowData=[]
    })
  }
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
  public columnDefs = [
    {
      headerName: '',
      headerCheckboxSelection: true,
      width: 30,
      checkboxSelection: (params: any) => {
        return true;
      },
    },
    {
      headerName: 'S No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 75
    },
    {
      headerName: 'Asset No',
      field: 'asset_tagId',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.asset_tagId ? params.data.asset_tagId : '-----------';
      }
    },
    {
      headerName: 'Po No',
      field: 'po_number',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.po_number ? params.data.po_number : 'NA';
      }
    },
    {
      headerName: 'Serial No',
      field: 'itemSerialNo',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.itemSerialNo ? params.data.itemSerialNo : '-----------';
      }
    },
    {
      headerName: 'Batch No',
      field: 'batchNo',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.batchNo ? params.data.batchNo : 'NA';
      }
    },
    {
      headerName: 'Image',
      field: 'item_document',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
      // minHeight: 150,
      cellRenderer: AssetLogoComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      filter: 'agTextColumnFilter',
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
      headerName: 'Item Status',
      field: 'status_name',
      filter: 'agTextColumnFilter',
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
      headerName: 'Item Category',
      field: 'asset_category_name',
      filter: 'agSetColumnFilter',
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
      headerName: 'Total Amount',
      field: 'total_amount',
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
      headerName: 'Billing Address',
      field: 'branch_address',
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
      headerName: 'PO Date',
      field: 'po_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.po_date ? params.data.po_date : 'NA';
      }
    },
    {
      headerName: 'Allocated To',
      field: 'allocation_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      valueGetter: (params:any) => {
        if (params.data.allocation_type === null || params.data.asset_loc_status =='DEALLOCATED') {
          return 'NA';
        } else if (params.data.allocation_type === 'transfer to other location' && params.data.asset_loc_status =='ALLOCATED') {
          return params.data.allocated_branch;
        } else {
          return params.data.asset_allocated_emp;
        }
      }
    },
    // {
    //   headerName: 'Action',
    //   field: 'id',
    //   flex: 1,
    //   minWidth: 150,
    //   cellRenderer: AssetActionComponent,
    //   cellRendererParams: (params: any) => {
    //     return {
    //       className: 'mat-blue',
    //       hideRequestButton: true,
    //       hideDetailsButton: false,
    //       hideDownloadIcon: false,
    //       showCustomIcon: false,
    //       selectedTab: this.selectedIndex
    //     };
    //   }      
    // }
  ];
  public columnDefs_RA = [
    {
      headerName: 'S No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 75
    },
    {
      headerName: 'Asset No',
      field: 'asset_tagId',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.asset_tagId ? params.data.asset_tagId : '-----------';
      }
    },
    {
      headerName: 'Image',
      field: 'image',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
      // minHeight: 150,
      cellRenderer: AssetLogoComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      filter: 'agTextColumnFilter',
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
      headerName: 'Revalued Date',
      field: 'revaluation_date',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.revaluation_date ? params.data.revaluation_date : 'NA';
      }
    },
    {
      headerName: 'Old Value',
      field: 'old_value',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.old_value ? params.data.old_value : 'NA';
      }
    },
    {
      headerName: 'New Value',
      field: 'total_amount',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,

    },


    {
      headerName: 'Billing Address',
      field: 'branch_address',
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
      headerName: 'Reason / Notes',
      field: 'reason_notes',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    // {
    //   headerName: 'Action',
    //   field: 'id',
    //   flex: 1,
    //   minWidth: 150,
    //   cellRenderer: AssetActionComponent,
    //   cellRendererParams: (params: any) => {
    //     return {
    //       className: 'mat-blue',
    //       hideRequestButton: true,
    //       hideDetailsButton: false,
    //       hideDownloadIcon: false,
    //       showCustomIcon: false,
    //       selectedTab: this.selectedIndex
    //     };
    //   }      
    // }
  ];

  openRevalueForm() {
    const selectedAssets = this.gridApi.getSelectedRows(); 
  
    if (selectedAssets.length === 0) {
      alert("Please select at least one asset.");
      return;
    }
  
    this.dialog.open(AssetRevaluationFormComponent, {
      width: '900px',
      data: {
        assets: selectedAssets,
      }
    });
  }

  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
    if (this.tabsList[event.index] == 'All Assets') {
      this.getAssetList();
    } else if (this.tabsList[event.index] == 'Revalued Assets') {
      this.getRevaluedAssets();
    } 
  }
  getRevaluedAssets(){
    console.log('aditya')
    this.asset_service.getRevaluedAssets().subscribe((res:any)=>{
      if(res.data){
       this.rowData_RA=res.data;
      }
  },(err:any)=>{
    this.rowData_RA=[]
  })
  }
}
