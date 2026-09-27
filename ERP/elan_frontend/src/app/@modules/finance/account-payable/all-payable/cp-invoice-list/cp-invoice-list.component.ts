import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
// import { ActionComponent } from './action/action.component';
// import { CPProvisionVerifyDilogComponent } from '../cp-provision-details-verify-list/cp-provision-verify-dilog/cp-provision-verify-dilog.component';
import { ChannelPartnerService } from 'src/app/@shared/services/channel-partner.service';
import { ActionPayableComponent } from '../../action-payable/action-payable.component';
import { DialogAccountPayableComponent } from '../../dialog-account-payable/dialog-account-payable.component';

@Component({
  selector: 'app-cp-invoice-list',
  templateUrl: './cp-invoice-list.component.html',
  styleUrls: ['./cp-invoice-list.component.scss'],
})
export class CpInvoicePaybleListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  public rowData: any;

  constructor(
    private route: Router,
    private toast: ToastrService,
    public dialog: MatDialog,
    private _cpService: ChannelPartnerService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.get_All_CP_Payment_List();
  }

  public columnDefs = [
    {
      headerName: 'Sr No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Associated Comapany',
      field: 'associated_company',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'First Name',
      field: 'first_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Last Name ',
      field: 'last_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Email ID',
      field: 'email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'CP Name',
      field: 'CP_Name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
      // cellRenderer: ActiveApprovedStatusComponent,
    },
    {
      headerName: 'CP Registration Approver',
      field: 'Cp_registration_Approver_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Certificate Type',
      field: 'certificate_type_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },

    {
      headerName: 'CP Source',
      field: 'Cp_source_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Work Order',
      field: 'workOrder_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'GST Number',
      field: 'gst_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'MSME Number',
      field: 'msme_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Address',
      field: 'address2',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Service Type',
      field: 'stage',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Product/Program',
      field: 'product_request',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Assessment Fee',
      field: 'Assessment_Fee',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Delivered Month',
      field: 'delivery_month',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Requested Incentive %',
      field: 'requsted_incentive',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Agreed Incentive %',
      field: 'Agreed_prec_incentive',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    // {
    //   headerName: 'Total Incentive Amount',
    //   field: 'special_incentive_amount',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   valueFormatter: 'JSON.parse(value)',
    //   flex:1,
    //   minWidth:250,
    // },
    {
      headerName: 'Special Incentive Amount',
      field: 'special_incentive_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Contact Source/ Assigned SP',
      field: 'sp_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },

    {
      headerName: 'Invoice Submitted By CP',
      field: 'invoice_submitted_By_CP',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Invoice Number',
      field: 'invoice_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Invoice Date',
      field: 'invoice_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Date of Payment to CP',
      field: 'date_of_payment_to_CP',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Total Amount',
      field: 'total_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Total Invoice Amount',
      field: 'total_Invoice_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Remarks',
      field: 'remarks',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Paid Date of Finance',
      field: 'Paid_Date_of_Finance',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Provision Created By',
      field: 'Provision_Created_By',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Provision Created Date',
      field: 'Provision_Created_Date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Provision Verified By',
      field: 'provision_verified_by',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Provision Verified Date',
      field: 'provision_verified_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Action',
      field: 'myexpense_id',
      cellRenderer: ActionPayableComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: 'grid-cell-centered',
    },
  ];

  goToAddCreate(path: any) {
    this.route.navigate([path]);
  }

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

  onCellClicked(e: any) {
    const dialogRef = this.dialog.open(DialogAccountPayableComponent, {
      width: '30%',
      //  maxWidth: '100vw',
      // maxHeight: '100vh',
      // height: '100%',
      panelClass: 'full-screen-modal',
      data: { cpId: e.data.channel_partner_provision_id },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  get_All_CP_Payment_List() {
    this._cpService.get_All_CP_Payment_List().subscribe(
      (res: any) => {
        this.rowData = res.data;
      },
      (err) => {
        if (err.error.code === 405) {
          this.toast.warning(`${err.error.message}`);
        }
      }
    );
  }
}
