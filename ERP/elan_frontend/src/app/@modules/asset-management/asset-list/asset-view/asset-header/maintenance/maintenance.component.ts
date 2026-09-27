import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent {
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55};
  
  constructor(private asset_service:AssetListService,
    private toster: ToastrService,
    private activeroute:ActivatedRoute,private router:Router  ) {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
    });
  }
  ngOnInit(): void {
    this.getMaintenanceListByIdForAssetView();
  }

  getMaintenanceListByIdForAssetView(){
  if(this.id){
    this.asset_service.getMaintenanceListByIdForAssetView(this.id).subscribe((res:any)=>{
      if(res.data){
        this.rowData = res.data?.map((item:any) => ({
          id: item.id,
          entity_id: item.entity_id,
          isUnderAmc: item.isUnderAmc,
          expireAmc: item.expireAmc,
          maintenanceBy: item.maintenanceBy,
          repairDetails: item.repairDetails,
          completionDate: item.completionDate,
          scheduledDate: item.scheduledDate,
          amount: item.amount,
          maintenanceStatus: item.maintenanceStatus,
          isDeleted: item.isDeleted,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          asset_tagIds: item.asset_tagIds[0],
          ASSETMAINTENANCE_MAPPING_asset_tagId: item.ASSETMAINTENANCE_MAPPINGs[0]?.asset_tagIds
        }
      )
    );
    }
    },(err:any)=>{
      this.rowData=[];
      // this.toster.error(err.message || 'Internal server error');
    })
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
    field: 'asset_tagIds',
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
    headerName: 'Maintenance BY',
    field: 'maintenanceBy',
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
    headerName: 'Repair Detail',
    field: 'repairDetails',
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
    headerName: 'Scheduled Date',
    field: 'scheduledDate',
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
    headerName: 'Completion Date',
    field: 'completionDate',
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
    headerName: 'Amount',
    field: 'amount',
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
    headerName: 'Status',
    field: 'maintenanceStatus',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: "grid-cell-centered",
    flex: 1,
    //editable: true,
    minWidth: 150
  },
];

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
}

