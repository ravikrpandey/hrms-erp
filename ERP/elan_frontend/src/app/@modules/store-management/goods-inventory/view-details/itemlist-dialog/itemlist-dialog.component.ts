import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { StoreManagementService } from '../../../store-management.service';
import { Location } from '@angular/common';

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
  searchTerm: any;
  item_id: any;
  filteredResult: any;
  itemList: any;
  store_id:any;
  goodInventoryStatus:any;
  cellData:any;
  totalQty:any;
  constructor(private activeroute: ActivatedRoute,private stockServices: StoreManagementService, private location: Location){
    this.activeroute.queryParams.subscribe((params: any) => {
     this.cellData = JSON.parse(params.data);
      this.item_id = this.cellData.item_id;
      this.store_id = this.cellData.store_id;
      this.goodInventoryStatus = this.cellData.goodInventoryStatus;
    });
  }

  ngOnInit(){
    this.stockServices.GrnByItem(this.store_id,this.item_id,this.goodInventoryStatus).subscribe((res:any)=>{
      this.itemList =  res.data[0];
      this.rowData = res.data;
      this.filteredResult = this.rowData;
      this.totalQty = this.rowData.reduce((sum:any, row:any) => {
        return sum + (parseInt(row.itemQty) || 0); 
      }, 0);
    });
  }

  goBack() {
    this.location.back();
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
      valueGetter: (params:any) => params.data.grn_number ? params.data.grn_number : '- - -',
    },
    {
      headerName: 'Created By',
      field: 'goodInventoryStatus',
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
}
