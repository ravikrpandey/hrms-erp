import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { SalesManagementService } from '../../sales-management-service/sales-management.service';
import { ProformaActionComponent } from '../../performa/proforma-action/proforma-action.component';
import { SaleInvoiceActionComponent } from '../sale-invoice-action/sale-invoice-action.component';

@Component({
  selector: 'app-rejected-sales-invoice',
  templateUrl: './rejected-sales-invoice.component.html',
  styleUrls: ['./rejected-sales-invoice.component.scss'],
})
export class RejectedSalesInvoiceComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple' };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  productionData: any = [];

  constructor(
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private saleManagement: SalesManagementService
  ) {
    this.rowClass = 'rowClass';
  }
  entityId: any;
  userRole: any;
  EmpMainId: any;
  ngOnInit(): void {
    let token: any = localStorage.getItem('signInUser');
    this.userRole = JSON.parse(token);
    this.EmpMainId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    this.getRejectedSaleInvoice(this.EmpMainId);
  }
  navigateAddNew() {
    this.route.navigate(['master/sales-management/sales/create-sales-invoice']);
  }
  navigatePending() {
    this.route.navigate([
      'master/sales-management/sales/pending-sales-invoice',
    ]);
  }
  navigateApproved() {
    this.route.navigate([
      'master/sales-management/sales/approved-sales-invoice',
    ]);
  }
  navigateRejected() {
    this.route.navigate([
      'master/sales-management/sales/rejected-sales-invoice',
    ]);
  }
  navigateAllQuotations() {
    this.route.navigate(['master/sales-management/sales']);
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Invoice Number',
      field: 'invoice_doc_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Customer',
      field: 'business_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Date',
      field: 'delivery_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Proforma Code',
      field: 'proforma_doc_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Payment Due Days',
      field: 'payment_due_days',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Due Charges',
      field: 'due_charges',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: 'Status',
      field: 'approval_status',
      minWidth: 200,
      // cellRenderer: ProductionStatusComponent,
      // cellRendererParams: {
      //   className: 'mat-blue',
      //   hideRequestButton: true,
      //   hideDetailsButton: false,
      //   hideDownloadIcon: false,
      //   showCustomIcon: false,
      //   someProperty: 'value',
      // },
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Action',
      field: '',
      flex: 1,
      minWidth: 150,
      cellRenderer: SaleInvoiceActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
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

  getRejectedSaleInvoice(empid: any) {
    this.saleManagement
      .getAllInvoiceData(empid, "REJECTED", this.entityId, this.userRole.role)
      .subscribe(
        (response: any) => {
          this.rowData = response.data;
        },
        (error) => {
          this.rowData = [];
        }
      );
  }

  customButtonRenderer() {
    return '<p class="custom-p">View BOM</>';
  }
}
