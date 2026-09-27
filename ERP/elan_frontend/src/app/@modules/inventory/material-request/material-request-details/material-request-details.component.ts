import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import {ActionComponent} from 'src/app/@modules/inventory/material-request/action/action.component'
@Component({
  selector: 'app-material-request-details',
  templateUrl: './material-request-details.component.html',
  styleUrls: ['./material-request-details.component.scss']
})
export class MaterialRequestDetailsComponent implements OnInit {
  private gridApi!: GridApi<any>;
  rowData: any[] = [];  
  remark: string = '';  
  rowClass: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,  
    private _configurationalMasterService: ConfigurationalmasterService,
    private dialogRef: MatDialogRef<MaterialRequestDetailsComponent>
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.fetchMaterialRequestDetails(this.data.lead_id);  
  }
  public columnDefs = [
    { 
      headerName: 'S.No', 
      valueGetter: "node.rowIndex + 1", 
      sortable: true, 
      resizable: true, 
      cellClass: "grid-cell-centered", 
      flex: 1, 
      minWidth: 100 
    },
    { 
      headerName: 'Item Category', 
      valueGetter: (params: any) => params.data.asset_category?.asset_category_name || 'N/A', 
      sortable: true, 
      resizable: true, 
      cellClass: "grid-cell-centered", 
      flex: 1, 
      minWidth: 150 
    },
    { 
      headerName: 'Item Name', 
      valueGetter: (params: any) => params.data.ItemMaster?.item_name || 'N/A', 
      sortable: true, 
      resizable: true, 
      cellClass: "grid-cell-centered", 
      flex: 1, 
      minWidth: 150 
    },
    { 
      headerName: 'Item Code', 
      valueGetter: (params: any) => params.data.ItemMaster?.item_code || 'N/A', 
      sortable: true, 
      resizable: true, 
      cellClass: "grid-cell-centered", 
      flex: 1, 
      minWidth: 150 
    },
    { 
      headerName: 'Quantity', 
      field: 'quantity', 
      sortable: true, 
      resizable: true, 
      cellClass: "grid-cell-centered", 
      flex: 1, 
      minWidth: 150 
    },
    // { 
    //   headerName: 'Price', 
    //   valueGetter: (params: any) => params.data.ItemMaster?.B2C_price || 'N/A', 
    //   sortable: true, 
    //   resizable: true, 
    //   cellClass: "grid-cell-centered", 
    //   flex: 1, 
    //   minWidth: 150 
    // },
    { 
      headerName: 'Total', 
      valueGetter: (params: any) => params.data.quantity * (params.data.ItemMaster?.B2C_price || 0), 
      sortable: true, 
      resizable: true, 
      cellClass: "grid-cell-centered", 
      flex: 1, 
      minWidth: 150 
    },
    { 
      headerName: 'Total Inventory', 
      valueGetter: (params: any) => params.data.quantity * (params.data.ItemMaster?.Total_inventory || 0), 
      sortable: true, 
      resizable: true, 
      cellClass: "grid-cell-centered", 
      flex: 1, 
      minWidth: 150,
      hide: true  
    },
    {
      headerName: 'Action',
      field: 'not decided',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        onActionClick: () => {
          this.dialogRef.close();
        }
      },
    },
    
  ];


  

  fetchMaterialRequestDetails(leadId: string) {
    
    this._configurationalMasterService.getMaterialRequestList(leadId).subscribe((res: any) => {
      this.rowData = res.data?.CRMS_MATERIAL_REQUEST_DETAILs || [];
      this.remark = res.data?.remark || '';
    });
  }


  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter((document.getElementById('filter-text-box') as HTMLInputElement).value);
  }

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(e: any) {}
  
  onAllocate(){}
}
