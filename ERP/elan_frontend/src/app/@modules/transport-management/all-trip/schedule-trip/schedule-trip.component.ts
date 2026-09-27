import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { AllTripActionComponent } from '../all-trip-action/all-trip-action.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-schedule-trip',
  templateUrl: './schedule-trip.component.html',
  styleUrls: ['./schedule-trip.component.scss']
})
export class ScheduleTripComponent {
  quickFilter: string;
  rowClass: any;
  private gridApi!: GridApi<any>;
  depData: any;
  catData: any;
  assignAction: any;
  filteredData: any;
  entity_id: any;
  userDetails: any;
  financial_id: any;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55 };
  transData: any
  login_id: any;
  constructor(
    private route: Router,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    public dialog: MatDialog,
    private configService: ConfigurationalmasterService,
    private prService: PurchaseRequestService,
    private _rbackService: RbacMasterService,
    private _commonService: CommonService,
    private transport_service: TransportManagementService
  ) {
    this.rowClass = 'rowClass';
  }
private subscription: Subscription = new Subscription();
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id')
    this.login_id = localStorage.getItem('EmpMainId')
    this.configService.getDepartment(this.entity_id).subscribe((res: any) => {
      this.depData = res.data;
    });
        this.getScheduleTrip();

    // subscribe to refresh event
    const sub = this.transport_service.tripRefresh$.subscribe(() => {
      this.getScheduleTrip();
    });

    this.subscription.add(sub);
  }

  ngAfterViewInit(): void {
    setTimeout(() => { }, 0);
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
      headerName: 'Trip ID',
      field: 'trip_id',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Trip Type',
      field: 'trip_type',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Distance',
      field: 'distance',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'LR Number',
      field: 'lr_number',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Vehicle Type',
      field: 'TM_VEHICAL_CATEGORY.vehical_category_name',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const category = params.data?.TM_VEHICAL_CATEGORY?.vehical_category_name || 'N/A';
        const vehicleNumber = params.data?.TM_VEHICLE_MASTER?.vehicle_number || 'N/A';
        return `${category} (${vehicleNumber})`;
      }
    },
    {
      headerName: 'Transported By',
      field: 'modeOfTransport',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Status',
      field: 'status_type',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 250,
      cellRenderer: AllTripActionComponent,
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
  navigate() {
    this.route.navigate(['master/purchase-main/purchase-request/create-pr']);
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

    //   if (this.assignAction.Write) {
    //     const dialogRef = this.dialog.open(TransportDialogComponent, {
    //       width: '500px',
    //       data: e.data,
    //     });
    //     dialogRef.afterClosed().subscribe((result) => { });
    //   }
  }



  getScheduleTrip() {

    this.transport_service.getScheduleTrip(this.entity_id).subscribe({
      next: (res: any) => {
        this.rowData = res?.getData.map((item: any) => ({
          ...item,
          // priority: item.priority_level,
          // status: item.status_type,
          // from_location: item.pickup_location,
          // to_location: item.delivery_location,
        }));
        console.log(this.rowData, "this.transData <<<<<<<<");
      },
      error: (err: any) => {
        console.error("Error fetching transport data", err);
      }
    });
  }
ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
