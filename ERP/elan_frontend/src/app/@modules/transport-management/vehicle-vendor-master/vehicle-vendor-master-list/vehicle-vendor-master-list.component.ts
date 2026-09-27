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
import { VehicleVendorMasterDialogComponent } from '../vehicle-vendor-master-dialog/vehicle-vendor-master-dialog.component';
import { VehicleVendorMasterActionComponent } from '../vehicle-vendor-master-action/vehicle-vendor-master-action.component';

@Component({
  selector: 'app-vehicle-vendor-master-list',
  templateUrl: './vehicle-vendor-master-list.component.html',
  styleUrls: ['./vehicle-vendor-master-list.component.scss']
})
export class VehicleVendorMasterListComponent {

quickFilter: string;
  rowClass: any;
  private gridApi!: GridApi<any>;
  depData: any;
  catData: any;
  assignAction: any;
  filteredData: any;
  entity_id: any;
  userDetails: any;
  financial_year_id: any;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55};
  employee_id: any;
  vendorList: any;
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
    this.financial_year_id = localStorage.getItem('financial_id')
    this.employee_id = localStorage.getItem('EmpMainId')


    this.getAllVehicleVendor()

  }

  ngAfterViewInit(): void {
    setTimeout(() => {}, 0);
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
        headerName: 'Vendor ID',
        field: 'vendor_id',
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Vendor Name ',
        field: 'vendor_name',
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Organization Name',
        field: 'organization_name',
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Vendor Type',
        field: 'vendor_type',
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      // {
      //   headerName: 'Contact Person Name',
      //   field: 'contact_person_name',
      //   cellClass: 'grid-cell-centered',
      //   flex: 1,
      //   minWidth: 150,
      // },
      // {
      //   headerName: 'Contact Number',
      //   field: 'contact_number',
      //   cellClass: 'grid-cell-centered',
      //   flex: 1,
      //   minWidth: 150,
      // },
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
        cellRenderer: VehicleVendorMasterActionComponent,
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



  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  statusCellClicked(e: any) {
    if (this.assignAction.Write) {
      const dialogRef = this.dialog.open(VehicleVendorMasterDialogComponent, {
        width: '500px',
        data: e.data,
      });
      dialogRef.afterClosed().subscribe((result) => {});
    }
  }


getAllVehicleVendor() {
  this.transport_service.getAllVehicleVendor(this.entity_id, this.financial_year_id, this.employee_id)
    .subscribe({
      next: (res:any) => {
        this.vendorList = res?.data;
        console.log('Vendor List:', this.vendorList);

        // Directly assign response to rowData, kyunki data already ready hai
        this.rowData = [...this.vendorList];
      },
      error: (err) => {
        console.error('Error fetching vendors:', err);
      }
    });
}







  openDialog() {
     this.route.navigate(['master/transport-management/vendor-vehicle-master/add-vehicle-vendor-master']);
  }

}
