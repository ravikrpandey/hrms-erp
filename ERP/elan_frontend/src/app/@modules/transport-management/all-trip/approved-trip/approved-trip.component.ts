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



@Component({
  selector: 'app-approved-trip',
  templateUrl: './approved-trip.component.html',
  styleUrls: ['./approved-trip.component.scss']
})
export class ApprovedTripComponent {

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

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id')
    this.login_id = localStorage.getItem('EmpMainId')
    this.configService.getDepartment(this.entity_id).subscribe((res: any) => {
      this.depData = res.data;
    });
    this.getApprovedTransportData()
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
      field: 'vehical_category_name', // this field can help with sorting/filtering
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        console.log('--------------hi nav', params.data);
        return `${params.data?.vehical_category_name || 'N/A'} ( ${params.data?.vehicle_number || 'N/A'} )`;
      }
    },
    {
      headerName: 'Transported By',
      field: 'transported_by',
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



  getApprovedTransportData() {

    this.transport_service.getApprovedTransportRequest(this.entity_id).subscribe({
      next: (res: any) => {
        this.rowData = res.data.map((item: any) => ({
          ...item,
          priority: item.priority_level,
          status: item.status_type,
          from_location: item.pickup_location,
          to_location: item.delivery_location,
        }));
        console.log(this.transData, "this.transData <<<<<<<<");
      },
      error: (err: any) => {
        console.error("Error fetching transport data", err);
      }
    });
  }



  // openDialog() {
  //   this.route.navigate(['/master/transport-management/transport-request/add-new-request']);
  // }




}
