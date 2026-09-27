import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Location } from '@angular/common';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-allocated-details',
  templateUrl: './allocated-details.component.html',
  styleUrls: ['./allocated-details.component.scss']
})
export class AllocatedDetailsComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any = [];
  searchTerm: any;
  item_id: any;
  filteredResult: any;
  itemList: any;
  store_id: any;
  goodInventoryStatus: any;
  cellData: any;
  asset_allocation_id: any;
  selectedIndex: any = 0;
  allocationDetails: any;
  grn_item_status_id: any;
  entity_id: any;
  AssetAssignList: any;
  selectedRows: any[];
  AllAssetHistory: any;
  employee_id: any;
  constructor(private activeroute: ActivatedRoute, private location: Location, private asset_service: AssetListService, private toaster: ToastrService, private route: Router) {
  }

  ngOnInit() {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.activeroute.queryParams.subscribe((params: any) => {
      this.employee_id = params?.id ? JSON.parse(params?.id) : null;
      this.asset_allocation_id = params?.allocated_id ? JSON.parse(params?.allocated_id) : null;
      this.grn_item_status_id = params?.item_status_id ? JSON.parse(params?.item_status_id) : null;

      if (this.employee_id) {
        this.getAssetEmployeeById();
        this.getAllAssetHistory();
        this.getAssetAssignList();
      }
    });
  }

  onTabChange(event: any) {
    this.selectedIndex = event.index;
  }

  getAssetEmployeeById() {
    this.asset_service.getAssetEmployeeById(this.employee_id).subscribe((res: any) => {
      this.allocationDetails = res.data[0];
    }, (err: any) => {

    })
  }

  getAssetAssignList() {
    this.asset_service.getAssetAssignList(this.entity_id, this.employee_id).subscribe((res: any) => {
      this.AssetAssignList = res.data || [];
      console.log("getAssetAssignListgetAssetAssignList", this.AssetAssignList);

    }, (err: any) => {
      this.AssetAssignList = [];
    })
  }

  getAllAssetHistory() {
    this.asset_service.getAllAssetHistory(this.entity_id, this.employee_id).subscribe((res: any) => {
      this.AllAssetHistory = res.data || [];
    }, (err: any) => {
      this.AllAssetHistory = [];
    })
  }

  goBack() {
    this.location.back();
  }

  public columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      sortable: false,
      resizable: false,
      width: 50,
      suppressMenu: true,
      pinned: 'left' as const,
    },
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 50,
    },
    {
      headerName: 'Item Name',
      field: 'Item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Department',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Branch Name',
      field: 'branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
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
      valueGetter: (params: any) => {
        return params.data.asset_tagId ? params.data.asset_tagId : '-----------';
      }
    },
    {
      headerName: 'Serial No',
      field: 'itemSerialNo',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Assigned To',
      field: 'assigned_to',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Assigned From',
      field: 'assigned_from',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: any) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      }
    }
  ];

  public historyColumnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 50,
    },
    {
      headerName: 'Item Name',
      field: 'Item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Department',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Branch Name',
      field: 'branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
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


    },
    {
      headerName: 'Serial No',
      field: 'itemSerialNo',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Status',
      field: 'assign_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Assigned To',
      field: 'assigned_to',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Assigned From',
      field: 'assigned_from',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: any) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      }
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


  async getSelectedRows() {
    return this.selectedRows = this.gridApi.getSelectedRows();
  }

  async onSubmitForm() {
    let data: any = await this.getSelectedRows();
    if (data && data.length > 0) {
      this.asset_service.deallocateAsset(data).subscribe((res: any) => {
        this.toaster.success(res.message || 'Asset deallocated Successfully');
        this.ngOnInit();
      }, (err: any) => {
      })
    } else {
      return this.toaster.warning('Please select at least one row !');
    }
  }

}

