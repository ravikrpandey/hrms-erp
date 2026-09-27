import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ActionComponent } from './action/action.component';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';

@Component({
  selector: 'app-asset-write-off-approval',
  templateUrl: './asset-write-off-approval.component.html',
  styleUrls: ['./asset-write-off-approval.component.scss']
})
export class AssetWriteOffApprovalComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 50};
  rowData: any;
  entity_id:any;
  selectedTabIndex: number = 0;
  pendingAssets:any = [];
  approvedAssets:any = [];
  rejectedAssets:any = [];
  AllAssets:any = [];
  constructor(
    private asset_service:AssetListService,
    private route: Router,
    private toaster: ToastrService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getWriteOffAssetList()
  }

  // getWriteOffAssetList = () => {
  //   this.asset_service.getWriteOffAssetList(this.entity_id).subscribe((res: any) => {  
  //     this.rowData = res.data;
  //   },(err: any) => {
  //     this.rowData = []
  //   });
  // }

   getWriteOffAssetList = () => {
    this.asset_service.getWriteOffAssetList(this.entity_id).subscribe(
      (res: any) => {
        const data = res.data;
        if (this.selectedTabIndex === 0) {
            this.AllAssets = data;
        }else if (this.selectedTabIndex === 1) {
          this.pendingAssets = data.filter(
            (asset: any) => asset.approval_status === 'Pending'
          );
        }
         else if (this.selectedTabIndex === 2) {
          this.approvedAssets = data.filter(
            (asset: any) => asset.approval_status === 'Approved'
          );
        }
        else if (this.selectedTabIndex === 3) {
          this.rejectedAssets = data.filter(
            (asset: any) => asset.approval_status === 'Rejected'
          );
        }
      },
      (err: any) => {
        this.pendingAssets = [];
        this.approvedAssets = [];
        this.rejectedAssets = [];
      }
    );
  };

  public columnDefs = [
    {
      headerName: 'S.NO',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100
    },
   
    {
      headerName: 'Write Off',
      field: 'asset_tagIds',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Name',
      field: 'owner_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
     {
      headerName: 'Price',
      field: 'sell_price',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Action',
      field: 'leave_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

   public columnDefs_1 = [
    {
      headerName: 'S.NO',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100
    },
   
    {
      headerName: 'Write Off',
      field: 'asset_tagIds',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Name',
      field: 'owner_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
     {
      headerName: 'Price',
      field: 'sell_price',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Approval Status',
      field: 'approval_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Action',
      field: 'leave_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];


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

 
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

    onTabChange(event: any) {
    this.selectedTabIndex = event.index;
    this.pendingAssets = [];
    this.approvedAssets = [];
    this.rejectedAssets = [];
    this.getWriteOffAssetList();
  }
}
