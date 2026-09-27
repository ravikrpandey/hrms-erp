import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { FGListService } from 'src/app/@shared/services/warehouse/fg-list.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-acknowledgement',
  templateUrl: './stock-acknowledgement.component.html',
  styleUrls: ['./stock-acknowledgement.component.scss'],
})
export class StockAcknowledgementComponent implements OnInit {
  public tab: string;
  selectedIndex = 0;
  subheading: string = 'PO List';
  rowClass: any;
  private gridApi!: GridApi<any>;
  assignAction: ModuleAction;
  filteredData: any[] = [];
  showList: boolean = false;
  public rowData: any = [];
  public columnDefs: ColDef[] = [];
  public actions: any[] = [];

  public allStockColDef: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'grid-cell-centered',
      maxWidth: 100,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Item Code',
      field: 'item_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    // {
    //   headerName: 'Production No',
    //   field: 'Production_order',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    {
      headerName: 'Received Quantity',
      field: 'quantity',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Warehouse Name',
      field: 'warehouse_name',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 180,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Source Type',
      field: 'source_type',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 180,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    // {
    //   headerName: 'Zone Type',
    //   field: 'zone_type',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 180,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    // {
    //   headerName: 'Zone Name',
    //   field: 'zone_name',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 100,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },

    // {
    //   headerName: 'Bay',
    //   field: 'bay_name',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 100,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    // {
    //   headerName: 'Rack',
    //   field: 'rack_name',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 100,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    // {
    //   headerName: 'Bin',
    //   field: 'bin_name',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 100,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    // {
    //   headerName: 'Quality Check',
    //   field: 'qualityCheckDate',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    // {
    //   headerName: 'Manufacture Date',
    //   field: 'manufactureDate',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    // {
    //   headerName: 'Request',
    //   field: 'stock_request',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // }
  ];

  public pendingColDef: ColDef[] = [
    {
      headerName: '',
      field: 'select',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
      maxWidth: 50,
    },
    {
      headerName: 'S. No.',
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'grid-cell-centered',
      maxWidth: 100,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Item Code',
      field: 'item_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Received Quantity',
      field: 'quantity',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Warehouse Name',
      field: 'warehouse_name',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 180,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private fgService: FGListService,
    private toast: ToastrService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.showList = false;
      this.tab = params['tab'];
      this.rowData = [];
      this.filteredData = [];
      if (!this.tab) {
        this.columnDefs = this.allStockColDef;
        this.showList = true;
        this.tab = 'pending-stocks';
        this.selectedIndex = 0;
        this.router.navigate(
          ['master/warehouse-management/stock-acknowledgement'],
          { queryParams: { tab: 'pending-stocks' } },
        );
      }
      if (this.tab == 'all-stocks') {
        this.selectedIndex = 2;
        this.columnDefs = this.allStockColDef;
        this.subheading = 'All Stocks';
        this.showList = true;
        this.getAllStocksByStatus('All');
        this.actions = [];
      } else if (this.tab == 'pending-stocks') {
        this.selectedIndex = 0;
        this.columnDefs = this.pendingColDef;
        this.subheading = 'Pending Stocks';
        this.showList = true;
        this.getAllStocksByStatus('PENDING');
        this.actions = [
          {
            label: 'Approve Selected',
            icon: 'check',
            color: 'primary',
            callback: this.approveSelected.bind(this),
          },
          // {
          //   label: 'Reject Selected',
          //   icon: 'close',
          //   color: 'warn',
          //   callback: this.rejectSelected.bind(this),
          // },
        ];
      } else if (this.tab == 'approved-stocks') {
        this.selectedIndex = 1;
        this.columnDefs = this.allStockColDef;
        this.subheading = 'Approved Stocks';
        this.showList = true;
        this.getAllStocksByStatus('ALLOCATED');
        this.actions = [];
      } else if (this.tab == 'rejected-stocks') {
        this.selectedIndex = 3;
        this.columnDefs = this.allStockColDef;
        this.subheading = 'Rejected / Partial Stocks';
        this.showList = true;
        this.getAllStocksByStatus('REJECTED');
        this.actions = [];
      }
    });
  }

  getAllStocksByStatus(status: 'All' | 'PENDING' | 'ALLOCATED' | 'REJECTED') {
    this.fgService.getAllStocksByStatus(status).subscribe((res: any) => {
      this.rowData = res.data;
      this.filteredData = this.rowData;
    });
  }

  onTabChange(event: MatTabChangeEvent) {
    const tabs = [
      'pending-stocks',
      'approved-stocks',
      'all-stocks',
      'rejected-stocks',
    ];
    this.router.navigate(
      ['master/warehouse-management/stock-acknowledgement'],
      {
        queryParams: { tab: tabs[event.index] },
        queryParamsHandling: 'merge',
      },
    );
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  approveSelected() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    if (selectedData.length === 0) {
      this.toast.warning('Please select at least one row');
      return;
    }
    const ids = selectedData.map((item) => item.id);

    Swal.fire({
      title: 'Do you want to approve the selected requests?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Approve',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.fgService
          .updateStockStatus({ ids, allocation_status: 'ALLOCATED' })
          .subscribe((res: any) => {
            if (res.code == 200) {
              this.toast.success(
                'Selected requests have been approved successfully',
              );
              this.reloadCurrentRoute();
            }
          });
      }
    });
  }

  rejectSelected() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    if (selectedData.length === 0) {
      this.toast.warning('Please select at least one row');
      return;
    }
    const ids = selectedData.map((item) => item.id);

    Swal.fire({
      title: 'Do you want to reject the selected requests?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#3f51b5',
      confirmButtonText: 'Reject',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.fgService
          .updateStockStatus({ ids, allocation_status: 'REJECTED' })
          .subscribe((res: any) => {
            if (res.code == 200) {
              this.toast.success(
                'Selected requests have been rejected successfully',
              );
              this.reloadCurrentRoute();
            }
          });
      }
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }
}
