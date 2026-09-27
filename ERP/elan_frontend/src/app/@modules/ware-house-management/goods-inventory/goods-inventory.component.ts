import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { InventoryManagementService } from '../inventory-management.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-goods-inventory',
  templateUrl: './goods-inventory.component.html',
  styleUrls: ['./goods-inventory.component.scss']
})
export class GoodsInventoryComponent {
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
  entity_id: any;
  ItemList: any;
  itemMaster_id: FormControl;
  filterItems: any;
  constructor(
    public dialog: MatDialog,
    private inventoryService: InventoryManagementService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.itemMaster_id = new FormControl(null);
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.getAllGoodsInventory();
    this.getItemMasterList();
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
      minWidth: 100,
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
      minWidth: 200,
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
      minWidth: 200,
    },
    {
      headerName: 'Manufacture',
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
      headerName: 'Category',
      field: 'asset_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
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
      minWidth: 200,
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

  clearSelectedItem(){
    this.itemMaster_id.setValue(null);
    this.rowData = this.filterItems;
  }

  getItemMasterList(){
    this.inventoryService.getItemMasterList().subscribe((res:any)=>{
      this.ItemList = res.data;
    });
  }

  filterGoodInventory(event:any) {
    if(event.value) {
      this.rowData = this.filterItems.filter((res: any) => res.item_id === event.value);
      if(this.rowData.length === 0){
        this.toast.error('Goods inventory item not found!');
      }
    } else {
      this.toast.error('Goods inventory item not found!');
      this.rowData = [];
    }
  }

  getAllGoodsInventory() {
    this.inventoryService.getAllGoodsInventory(this.entity_id).subscribe((response: any) => {
      this.rowData = response.data || [];
      this.filterItems = this.rowData;
    },
    (err: any) => {
      this.rowData = [];
    }
  );
  }
}
