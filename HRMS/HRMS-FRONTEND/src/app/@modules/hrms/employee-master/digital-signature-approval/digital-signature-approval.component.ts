import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { CommonService } from 'src/app/@shared/services/common.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { DigitalSignatureApprovalActionComponent } from './digital-signature-approval-action/digital-signature-approval-action.component';
import * as moment from 'moment';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-digital-signature-approval',
  templateUrl: './digital-signature-approval.component.html',
  styleUrls: ['./digital-signature-approval.component.scss'],
})
export class DigitalSignatureApprovalComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any[] = [];
  selectedStatus: string = 'All';
  gridOptions: GridOptions = {};

  constructor(
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _empService: EmpRegistrationService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this._empService.getAllSignature().subscribe((res: any) => {
      this.rowData = (res.data || []).filter((item: any) =>
        ['Pending', 'Resubmit'].includes(item.status)
      );
      console.log('@@@@@@@@@@@@@@@@@@@@@@@', this.rowData);
    });
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
      minWidth: 50,
    },
    {
      headerName: 'Department Name',
      field: 'department.department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Employee Code',
      field: 'employee.employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Employee Name',
      field: 'employee_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Digital Signature',
      field: 'digital_signature',
      cellRenderer: (params: any) => {
        const imageUrl = params.value?.replace(/\\/g, '/');
        if (!imageUrl) return '';

        return `
      <a href="${imageUrl}" target="_blank" rel="noopener noreferrer">
        <img src="${imageUrl}" alt="Signature"
          style="width: 60px; height: 40px; object-fit: contain; cursor: pointer;" />
      </a>
    `;
      },
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Action',
      cellRenderer: DigitalSignatureApprovalActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: 'grid-cell-centered',
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

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
