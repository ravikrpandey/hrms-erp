import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { PrStatusDialogComponent } from '../dialog/pr-status-dialog/pr-status-dialog.component';
import { ShippingAlertActionComponent } from './shipping-alert-action/shipping-alert-action.component';
import { FormControl } from '@angular/forms';
import { ShippingAlertStatusDialogComponent } from './shipping-alert-status-dialog/shipping-alert-status-dialog.component';

@Component({
  selector: 'app-shipping-alert',
  templateUrl: './shipping-alert.component.html',
  styleUrls: ['./shipping-alert.component.scss']
})
export class ShippingAlertComponent {

  rowClass: any;
  private gridApi!: GridApi<any>;
  assignAction: ModuleAction;
  filteredData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple', };
selected = new FormControl(0);
  public rowData: any = [];

  public columnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 80,
    },
    {
      headerName: 'Shipment No',
      field: 'shiped_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: 'PO No.',
      field: 'po_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: 'Vendor',
      field: 'vendor_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Vendor Category',
      field: 'vendor_category',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 110,
    },
    {
      headerName: 'Shipping Status',
      field: 'audit',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Shipment Date',
      field: 'shipment_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 180,
    },
    {
      headerName: 'Expected Arrival Date',
      field: 'expected_arrival',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 180,
    },
    {
      headerName: 'Actions',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // flex: 1,
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      pinned: 'right',
      cellRenderer: ShippingAlertActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered",
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private accessCtrl: AccessControlService,
    private prService: PurchaseRequestService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
  ) {
    this.assignAction = this._rbackService.accessAssignAction();
    this.getsShippingAlert('All');
  }

  getsShippingAlert(status:any) {
    this.prService.getsShippingAlert(status).subscribe((res: any) => {
      this.rowData = res.data;
      this.filteredData = this.rowData;
    },
      ((err: any) => {
         this.rowData = [];
      this.filteredData = this.rowData;
        //this.toast.error(`${err.error.message}`);
      })
    )
  }

  statusCellClicked(e: any) {
    // if (this.assignAction.Write) {
    //   const dialogRef = this.dialog.open(ShippingAlertStatusDialogComponent, { width: '500px', data: { ...e.data, type: 'po' } });
    //   dialogRef.afterClosed().subscribe(result => {
    //   })
    // }
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
      this.filteredData = this.rowData.filter((res: any) => res.department_name == event);
    }
  }

  closeNav(id: string) {
    document.getElementById(id)?.classList.remove("sidebarDialogOpen");
    document.getElementById(id)?.classList.remove("mySidenavPofromRfp");
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  activeTabEvent :any ;
  onTabChange(event: any) {
    this.activeTabEvent = event+1;
    if (event === 0) {
      this.getsShippingAlert('All');
    } else if (event === 1) {
      this.getsShippingAlert('Pending');
    } else if (event === 2) {
      this.getsShippingAlert('Approved');
    } else if (event === 3) {
      this.getsShippingAlert("Rejected");
    
    }
  }

}