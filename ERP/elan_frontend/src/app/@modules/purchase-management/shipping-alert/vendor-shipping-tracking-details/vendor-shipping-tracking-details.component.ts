import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';

@Component({
  selector: 'app-vendor-shipping-tracking-details',
  templateUrl: './vendor-shipping-tracking-details.component.html',
  styleUrls: ['./vendor-shipping-tracking-details.component.scss'],
})
export class VendorShippingTrackingDetailsComponent implements OnInit {
  rowClass: any;
  private gridApi!: GridApi<any>;
  assignAction: ModuleAction;
  filteredData: any[] = [];
  isRollingBack = false;
  public gridOptions: any = { rowSelection: 'multiple' };
  @Input() po_id_header!: string;
  @Input() vendor_id_header!: string;
  po_id!: string;
  vendor_id!: string;
  public rowData: any = [];

  public columnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 80,
    },
    {
      headerName: 'Shipment No.',
      field: 'shiped_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
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
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: 'Mode',
      field: 'mode',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 110,
    },
    {
      headerName: 'Buyer Status',
      field: 'buyer_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
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
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 180,

      // 🔹 Editable only when audit = IN_TRANSIT
      editable: (params: any) =>
        params?.data?.audit === 'IN_TRANSIT' &&
        params?.data?.buyer_status == 'APPROVED',

      cellEditor: 'agSelectCellEditor',

      cellEditorParams: (params: any) => {
        const category = params?.data?.vendor_category;

        let values = ['IN_TRANSIT'];

        if (category === 'Domestic' || params?.data?.mode === 'COURIER') {
          values.push('OUT_FOR_DELIVERY');
        } else {
          values.push('FORWARDER_ARRIVED');
        }

        return {
          values: values,
        };
      },
      cellRenderer: (params: any) => {
        const status = params.value;

        const isEditable =
          params.data.audit === 'IN_TRANSIT' &&
          params.data.buyer_status == 'APPROVED';

        const colors: any = {
          IN_TRANSIT: '#17a2b8',
          CLEARANCE: '#6f42c1',
          ARRIVED: '#007bff',
          GRN_PENDING: '#ffc107',
          OUT_FOR_DELIVERY: '#fd7e14',
          RECEIVED: '#28a745',
        };

        return `
      <span style="
        padding:4px 10px;
        border-radius:12px;
        font-weight:600;
        color:white;
        background:${colors[status] || '#6c757d'};
        opacity:${isEditable ? '1' : '0.6'};
        cursor:${isEditable ? 'pointer' : 'not-allowed'};
      ">
        ${!isEditable ? '🔒 ' : ''}
        ${status === 'RECEIVED' ? 'VEHICLE REACHED' : status.replace(/_/g, ' ')}
      </span>
    `;
      },

      onCellValueChanged: (params: any) => {
        if (this.isRollingBack) {
          this.isRollingBack = false;
          return;
        }

        if (params.newValue === params.oldValue) return;

        this.confirmAuditStatusChange(params);
      },
    },
    {
      headerName: 'Shipment Date',
      field: 'shipment_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
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
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 180,
    },
  ];
  confirmAuditStatusChange(params: any) {
    Swal.fire({
      title: 'Confirm Shipping Status Change',
      text: `Change shipping status to "${params.newValue}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Update',
      cancelButtonText: 'Cancel',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.updateAuditStatus(params);
      } else {
        this.isRollingBack = true;
        params.node.setDataValue('audit', params.oldValue);
      }
    });
  }

  updateAuditStatus(params: any) {
    const payload = {
      id: params.data.id,
      status: params.newValue,
    };

    this.poService.updateShippingAlertStatus(payload).subscribe({
      next: () => {
        this.toast.success('Vendor status updated successfully');
        // this.getsTransAdminApprovel(params.data.vehicle_planing_id)
      },
      error: () => {
        this.toast.error('Failed to update admin status');
      },
    });
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private poService: PurchaseRequestService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private cryptoService: CryptoService,
  ) {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe({
      next: (res: any) => {
        this.vendor_id_header = res?.vendor_id;
        this.po_id_header = res?.po_id;
        this.vendor_id = this.cryptoService.decrypt(this.vendor_id_header);
        this.po_id = this.cryptoService.decrypt(this.po_id_header);
        this.getsShippingAlertHistory(this.po_id, this.vendor_id);
      },
      error: (err) => {
        console.log('error==>', err);
      },
    });
  }

  getsShippingAlertHistory(po_id: any, vendor_id: any) {
    this.poService.getsShippingAlertHistory(po_id, vendor_id).subscribe(
      (res: any) => {
        this.rowData = res.data;
        this.filteredData = this.rowData;
      },
      (err: any) => {
        this.filteredData = [];
        //this.toast.error(`${err.error.message}`);
      },
    );
  }

  statusCellClicked(e: any) {
    // if (this.assignAction.Write) {
    //   const dialogRef = this.dialog.open(PrStatusDialogComponent, { width: '500px', data: { ...e.data, type: 'po' } });
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
      (document.getElementById('filter-text-box') as HTMLInputElement).value,
    );
  }

  onFilterByDepartment(event: any) {
    if (event == null || undefined) {
      this.filteredData = this.rowData;
    } else {
      this.filteredData = this.rowData.filter(
        (res: any) => res.department_name == event,
      );
    }
  }

  closeNav(id: string) {
    document.getElementById(id)?.classList.remove('sidebarDialogOpen');
    document.getElementById(id)?.classList.remove('mySidenavPofromRfp');
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
