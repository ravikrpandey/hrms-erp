import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { TransportRequestActionComponent } from '../transport-request-action/transport-request-action.component';
import { TransportDialogComponent } from '../transport-dialog/transport-dialog.component';

@Component({
  selector: 'app-pending-request',
  templateUrl: './pending-request.component.html',
  styleUrls: ['./pending-request.component.scss']
})
export class PendingRequestComponent {
  quickFilter: string;
  rowClass: any;
  private gridApi!: GridApi<any>;
  depData: any;
  catData: any;
  assignAction: any;
  filteredData: any;
  entity_id: any;
  userDetails: any;
  finacial_id:any;
  login_id :any ;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55};
transData :any;
financial_id:any;
  constructor(
    private route: Router,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    public dialog: MatDialog,
    private configService: ConfigurationalmasterService,
    private prService: PurchaseRequestService,
    private _rbackService: RbacMasterService,
    private _commonService: CommonService,
    private transport_service : TransportManagementService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    this.login_id = localStorage.getItem('EmpMainId');
    this.configService.getDepartment(this.entity_id).subscribe((res: any) => {
      this.depData = res.data;
    });

   this.getTransportData()
  }

  ngAfterViewInit(): void {
    setTimeout(() => {}, 0);
  }
  getClassForPrice(lowThsthresholdStock: any): string {
    return 'low_hershold_stock';
  }
  getClassForPrice2(lowThsthresholdStock: any): string {
    return 'statusAssets2';
  }

  public rowData: any = [];

   public columnDefs = [
      {
        headerName: 'S.NO',
        valueGetter: "node.rowIndex + 1",
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150
      },
      {
        headerName: 'Request ID',
        field: 'request_id',
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'From Location',
        field: 'from_location',
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'To Location',
        field: 'to_location',
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Priority Type',
        field: 'priority',
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
       {
        headerName: 'Vehicle Type',
        field: 'vehicle_master_id',
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        cellRenderer:(params:any)=>{
           return params.data?.TM_VEHICAL_CATEGORY?.vehical_category_name + ' '+ ` ( ${params.data?.TM_VEHICLE_MASTER?.vehicle_number} )`
        }
      },
      {
        headerName: 'Status Type',
        field: 'status',
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Action',
        field: 'id',
        flex: 1,
        minWidth: 150,
        cellRenderer: TransportRequestActionComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,
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

  onFilterByDepartment(event: any) {
    if (event == null || undefined) {
      this.filteredData = this.rowData;
    } else {
      this.filteredData = this.rowData.filter(
        (res: any) => res.department_name == event
      );
    }
  }

  // onFilterAssetCategory(event:any){
  //   if (event == null || undefined){
  //     this.filteredData  = this.rowData;
  //   }else{
  //     this.filteredData  = this.rowData.filter((res:any) => res.asset_category_id == event);
  //   }
  // }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }


    statusCellClicked(e: any) {
      if (this.assignAction.Write) {
        const dialogRef = this.dialog.open(TransportDialogComponent, {
          width: '500px',
          data: e.data,
        });
        dialogRef.afterClosed().subscribe((result) => {});
      }
    }




   getTransportData() {
  this.transport_service.getTransportRequest(this.entity_id,this.financial_id,this.login_id).subscribe((res: any) => {
    this.transData = res.data
      .map((item: any) => ({
        ...item,
        priority: item.priority_level,
        status: item.status_type,
        from_location: item.pickup_location,
        to_location: item.delivery_location,
      }))
      .filter((item: any) => item.status === 'PENDING');

    console.log(this.transData, "Pending Transport Requests");
  });
}


   openDialog() {
    this.route.navigate(['/master/transport-management/transport-request/add-new-request']);
  }
}
