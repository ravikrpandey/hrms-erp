import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { FormControl } from '@angular/forms';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { StoreManagementService } from '../store-management.service';
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
  employee_id: any;
  finance_id: any;
  ItemList: any;
  itemMaster_id: FormControl;
  storeMaster_id: FormControl;
  backupList: any;
  navWidth: number;
  selectedItem: any;
  storeList: any;
  item_d: any;
  store_id: any;
  filterStoreControl = new FormControl();
  filterItemControl = new FormControl();
  filterStore: any;
  filterItem: any;
  loginUserDetails: any;
  role:any;
  constructor(
    public dialog: MatDialog,
    private storeService: StoreManagementService,
    private toast: ToastrService,
    private router:Router,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.itemMaster_id = new FormControl(null);
    this.storeMaster_id = new FormControl(null);
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.employee_id = localStorage.getItem("EmpMainId");
    this.finance_id = localStorage.getItem("financial_id");
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;
    this.getAllGoodsInventory();
    this.getItemMasterList();
    this.getAllStoreList();
    this.searchGoods();
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
      headerName: 'Store Name',
      field: 'store_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
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
      minWidth: 150,
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
    // {
    //   headerName: 'Created By',
    //   field: 'goodInventoryStatus',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    // },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 100,
      cellRenderer: ViewDetailsComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
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

  clearSelectedItem(){
    this.itemMaster_id.setValue(null);
    this.item_d = null;
    this.rowData = this.backupList;
  }

  clearSelectedStore(){
    this.storeMaster_id.setValue(null);
    this.store_id = null;
    this.rowData = this.backupList;
  }

  getItemMasterList(){
    this.storeService.getItemMasterList().subscribe((res:any)=>{
      this.ItemList = res.data;
      this.filterItem = this.ItemList;
    });
  }

  searchGoods(){
    this.filterStoreControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.storeList = this.filterStore.filter((store:any) =>
        store.name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterItemControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.ItemList = this.filterItem.filter((item:any) =>
        item.item_name.toLowerCase().includes(value.toLowerCase())
      );
    });
  }

  getAllStoreList(){
    // this.storeService.getAllStockList(this.entity_id,this.finance_id).subscribe((response: any) => {
    //   this.storeList = response.data;
    //   this.filterStore = this.storeList;
    // })
   
    this.storeService.getAssignedStoreList(this.entity_id,this.finance_id,this.employee_id,this.role).subscribe((response: any) => {
      this.storeList = response.data || [];
      this.filterStore = this.storeList;
    });
   
  }

  filterGoodInventory(event:any) {
    if(event.value) {
      if(this.store_id){
        this.rowData = this.backupList.filter((res: any) => res.item_id === event.value && res.store_id === this.store_id);
      }else{
        this.rowData = this.backupList.filter((res: any) => res.item_id === event.value);
      }
      if(this.rowData.length === 0){
        this.toast.error('Goods inventory item not found!');
        this.item_d = null;
      }
      this.item_d = event.value;
    } else {
      this.toast.error('Goods inventory item not found!');
      this.rowData = [];
      this.item_d = null;
    }
  }

  filterGoodInventoryByStotre(event:any) {
    if(event.value) {
      if(this.item_d){
        this.rowData = this.backupList.filter((res: any) => res.store_id === event.value && res.item_id === this.item_d);
      }else{
        this.rowData = this.backupList.filter((res: any) => res.store_id === event.value);
      }
      if(this.rowData.length === 0){
        this.toast.error('Goods inventory Store not found!');
        this.store_id = null;
      }
      this.store_id = event.value;
    } else {
      this.toast.error('Goods inventory Store not found!');
      this.rowData = [];
      this.store_id = null;
    }
  }

  getAllGoodsInventory() {
    this.storeService.getAllGoodsInventory(this.entity_id,this.employee_id,this.role).subscribe((response: any) => {
      this.rowData = response.data || [];
      this.backupList = this.rowData;
    },
    (err: any) => {
      this.rowData = [];
    }
  );
  }
}
