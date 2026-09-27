import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActionComponent } from './action/action.component';
import { TotalInventoryService } from 'src/app/@shared/services/inventory/total-inventory.service';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-total-inventory-list',
  templateUrl: './total-inventory-list.component.html',
  styleUrls: ['./total-inventory-list.component.scss']
})
export class TotalInventoryListComponent {
  rowClass: string;
  rowData :any[]=[];
  selectedBranch: any;
  selectedAssetCategory: any;
  selectedItem: any;
  searchText: any;
  allInventoryData :any;
  private gridApi!: GridApi<any>;
  signInUserData: any = localStorage.getItem('signInUser');
  loginUserId: any = JSON.parse(this.signInUserData).employee_id
  branchNames: any;
  assetCategoryName: any;
  itemName: any;

  constructor(
    private router: Router,
    private toast: ToastrService,
    private total_Inventory_Service : TotalInventoryService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit() {
    this.apicallonload()
  }

  apicallonload() {
this.getAllInventory()
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onSelectedBranch(event: any) {
    this.gridApi.setQuickFilter(
      event.value
    );
  }

  onSelectedAssetCategory(event: any) {
    this.gridApi.setQuickFilter(
      event.value
    );
  }
  
  onSelectedItem(event: any) {
    this.gridApi.setQuickFilter(
      event.value
    );
  }

  getBranch() {
    try {
    } catch (error) {
      console.log(error);
    }
  }

  getAssets() {
    try {
    } catch (error) {
      console.log(error);
    }
  }

  getItems() {
    try {
    } catch (error) {
      console.log(error);
    }
  }

  getAllInventory() {
    this.total_Inventory_Service.getAllInventory(this.loginUserId).subscribe((res:any)=>{
      this.allInventoryData = res.data
      this.rowData = this.allInventoryData
        
      const branchName = this.allInventoryData.map((item:any) => item.delivery_branch).filter((value:any, index:any, self:any) => self.indexOf(value) === index);
      const assetCategoryName = this.allInventoryData.map((item:any) => item.asset_category_name).filter((value:any, index:any, self:any) => self.indexOf(value) === index);
      const itemName = this.allInventoryData.map((item:any) => item.item_name).filter((value:any, index:any, self:any) => self.indexOf(value) === index);
      this.branchNames = branchName; 
      this.assetCategoryName = assetCategoryName;
      this.itemName = itemName ;                    
      
    },(err:any)=>{
         
      this.rowData=[]
    })
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
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Asset Category',
      field: 'asset_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
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
    },
    {
      headerName: 'Branch Name',
      field: 'delivery_branch',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Managed By',
      field: 'manage_by',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    // {
    //   headerName: 'Available Inventory',
    //   field: 'selection_item',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    {
      headerName: 'Available Inventory',
      field: 'selection_item',
      valueGetter: function (params: any) {
        if (params.data.Total_inventory === null) {
          return params.data.selection_item
        } 
        else if (params.data.Total_inventory != null){
          return params.data.Total_inventory;
        }
        else {
            return params.data.selection_item;
          }
      },
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Updated On',
      field: 'updatedAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
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
      },
    },
  ];

}


