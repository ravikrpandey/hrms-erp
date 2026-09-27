import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { CommonService } from 'src/app/@shared/services/common.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { EmpDigitalActionComponent } from './emp-digital-action/emp-digital-action.component';
import { SignatureApproverRemarkDialogComponent } from './signature-approver-remark-dialog/signature-approver-remark-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-emp-digital-signature',
  templateUrl: './emp-digital-signature.component.html',
  styleUrls: ['./emp-digital-signature.component.scss'],
})
export class EmpDigitalSignatureComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any[] = [];
  rowDataOriginal: any[] = [];
  selectedStatus: string = 'All';
  assignAction: any;
  constructor(
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _empService: EmpRegistrationService,
    private _rbackService: RbacMasterService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    (window as any)['onEdit'] = this.onEdit.bind(this);
    this._empService.getAllSignature().subscribe((res: any) => {
      this.rowDataOriginal = res.data || [];
      this.rowData = [...this.rowDataOriginal];
    });
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;

    if (status === 'All') {
      this.rowData = [...this.rowDataOriginal];
    } else if (status === 'Pending+Resubmit') {
      this.rowData = this.rowDataOriginal.filter(
        (item) => item.status === 'Pending' || item.status === 'Resubmit'
      );
    } else {
      this.rowData = this.rowDataOriginal.filter(
        (item) => item.status === status
      );
    }
  }

  onEdit(id: any) {
    console.log('Edit clicked for ID:', id);
  }

  frameworkComponents = {
    empDigitalAction: EmpDigitalActionComponent,
  };

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
        const imageUrl = params.value?.replace(/\\/g, '/'); // Fix backslash in path
        return `<img src="${imageUrl}" alt="Signature" style="width: 60px; height: 40px; object-fit: contain; cursor: pointer;" onclick="window.open('${imageUrl}', '_blank')"/>`;
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
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: 'empDigitalAction',
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  // statusCellClicked(e: any) {
  //   const isIconClick =
  //     e.event?.target?.getAttribute('data-action') === 'view-remark';
  //   if (
  //     isIconClick ||
  //     (e.data?.status !== 'Pending' && this.assignAction.Write)
  //   ) {
  //     const dialogRef = this.dialog.open(
  //       SignatureApproverRemarkDialogComponent,
  //       {
  //         width: '500px',
  //         data: e.data,
  //       }
  //     );
  //     dialogRef.afterClosed().subscribe((result) => {});
  //   }
  // }

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
