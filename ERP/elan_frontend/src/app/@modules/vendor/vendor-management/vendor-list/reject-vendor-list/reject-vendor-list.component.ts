import { Component } from '@angular/core';
import { RejectActionComponent } from './reject-action/reject-action.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { RejectDailogComponent } from './reject-dailog/reject-dailog.component';

@Component({
  selector: 'app-reject-vendor-list',
  templateUrl: './reject-vendor-list.component.html',
  styleUrls: ['./reject-vendor-list.component.scss'],
})
export class RejectVendorListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  public rowData: any;
  public columnDefs = [
    {
      headerName: 'Sr No.',
      field: 'vendor_management_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Vendor Code',
      field: 'vendor_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Vendor Name ',
      field: 'vendor_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Location ',
      field: 'address',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    // {
    //   headerName: 'Type of Vendor',
    //   field: 'type_of_vendor',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   valueFormatter: 'JSON.parse(value)',
    //   flex: 1,
    //   minWidth: 150,
    // },
    {
      headerName: 'Status',
      field: 'vendor_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellStyle: (params: any) => {
        if (params.value === 'REJECTED') {
          //mark police cells as red
          return { color: 'red' };
        }
      },
    },
    // {
    //   headerName: 'Sub Type',
    //   field: 'sub_type',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   valueFormatter: 'JSON.parse(value)',
    //   flex: 1,
    //   minWidth: 150,
    // },
    {
      headerName: 'Actions',
      field: 'vendor_management_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 150,
      cellRenderer: RejectActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: 'grid-cell-centered',
    },
  ];

  constructor(
    private route: Router,
    private vendorService: VendorManagementService,
    private toast: ToastrService,
    public dialog: MatDialog
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.getRejectAppVendor();
  }

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

  getRejectAppVendor() {
    this.vendorService.getAllReject().subscribe((res: any) => {
      this.rowData = res.data;
    });
  }

  onCellClicked(e: any) {
    const dialogRef = this.dialog.open(RejectDailogComponent, {
      width: '450px',
      data: { id: e.data.vendor_management_id },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
