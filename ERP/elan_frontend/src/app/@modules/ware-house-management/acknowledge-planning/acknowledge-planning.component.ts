import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { DispatchedService } from 'src/app/@shared/services/warehouse/dispatched.service';
import { AcknowledgeActionComponent } from './acknowledge-action/acknowledge-action.component';

@Component({
  selector: 'app-acknowledge-planning',
  templateUrl: './acknowledge-planning.component.html',
  styleUrls: ['./acknowledge-planning.component.scss'],
})
export class AcknowledgePlanningComponent {
  rowClass: string;
  loginUser: any;
  employee_ids: any;
  role_master_id: any;

  constructor(
    private router: Router,
    private dispatchedServices: DispatchedService,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit() {
    this.role_master_id = localStorage.getItem('role_master_id');
    this.getSaleOrderList();
  }

  redirect2() {
    this.router.navigate([
      'master/warehouse-management/dispatched-product/dispatched-product',
    ]);
  }

  rowData: any[] = [];

  getSaleOrderList() {
    this.dispatchedServices.getSOForDispatchAcknowledge().subscribe({
      next: (value) => {
        this.rowData = value.data;
      },
    });
  }

  public columnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: (params: any) => params.node.rowIndex + 1,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 75,
    },
    {
      headerName: 'SO No',
      field: 'sales_order_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'sales_order_no', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'Proposal No',
      field: 'proposal_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'proposal_no', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'SO Date',
      field: 'sales_order_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'sales_order_date', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'Expected Delivery Date',
      field: 'expected_delivery_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'expected_delivery_date', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'Company Name',
      field: 'company_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'company_name', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'Customer Name',
      field: 'contact_person_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'contact_person_name', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'Address',
      field: 'address',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'address', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'Customisation Date',
      field: 'customisationDate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150, // ✅ more space
      tooltipField: 'customisationDate', // ✅ show full on hover
      tooltipValueGetter: (params: any) => params.value,
    },
    {
      headerName: 'Action',
      field: 'id',
      minWidth: 150,
      maxWidth: 200,
      flex: 1,
      cellClass: 'grid-cell-centered',
      pinned: 'right',
      cellRenderer: AcknowledgeActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];
}
