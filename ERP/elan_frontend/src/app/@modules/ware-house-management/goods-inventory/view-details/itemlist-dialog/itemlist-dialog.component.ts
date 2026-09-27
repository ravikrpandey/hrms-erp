import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-itemlist-dialog',
  templateUrl: './itemlist-dialog.component.html',
  styleUrls: ['./itemlist-dialog.component.scss']
})
export class ItemlistDialogComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any = [];
  filteredResult: any;
  searchTerm: any;
  constructor( public dialog: MatDialogRef<ItemlistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
  }

  ngOnInit(){
    this.rowData = this.data.data;
    this.filteredResult = this.rowData;
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
      flex: 1,
      minWidth: 70,
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Item Code',
      field: 'item_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Category',
      field: 'asset_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Quantity',
      field: 'itemQty',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'UOM',
      field: 'uom_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Grn number',
      field: 'grn_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Created date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    }
  ];

  onFilterTextBoxChanged() {
    this.rowData = this.filteredResult.filter((data: any) => {
      const searchTermLower = this.searchTerm.toLowerCase();
      if (
        data.item_id.toString().toLowerCase().indexOf(searchTermLower) !== -1 ||
        data.grn_Id.toString().toLowerCase().indexOf(searchTermLower) !== -1 ||
        data.itemQty.toString().toLowerCase().indexOf(searchTermLower) !== -1 ||
        data.item_code.toLowerCase().indexOf(searchTermLower) !== -1 ||
        data.item_name.toLowerCase().indexOf(searchTermLower) !== -1 ||
        data.asset_category_name.toLowerCase().indexOf(searchTermLower) !== -1 ||
        data.uom_name.toLowerCase().indexOf(searchTermLower) !== -1 || data.grn_number.toLowerCase().indexOf(searchTermLower) !== -1 ||
        data.createdAt.toLowerCase().indexOf(searchTermLower) !== -1
      ) {
        return true;
      }
      return false;
    });
  }
  
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  close(){
    this.dialog.close();
  }
}
