import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { environment } from 'src/app/environments/environment';
import { CostCenterActionComponent } from './cost-center-action/cost-center-action.component';
import { CostCenterStatusComponent } from './cost-center-action/cost-center-status/cost-center-status.component';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';

@Component({
  selector: 'app-cost-center',
  templateUrl: './cost-center.component.html',
  styleUrls: ['./cost-center.component.scss']
})
export class CostCenterComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = {
    rowSelection: 'multiple', enableRangeSelection: true,
    enableClipboard: true,
  };
  rowData: any;
  count: any = 0;
  assignAction: any;
  entity_id: any;
  
  financial_id: any;
  selectedView: string = 'list'; // list or tree
  
  
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private finance: FinaceService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private prService: PurchaseRequestService,
    private shortcutService: ShortcutService,
    
    
  ) {
    this.rowClass = 'rowClass';
  }
  
  ngOnInit(): void {
    this.financial_id = localStorage.getItem("financial_id");
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.assignAction = this._rbackService.accessAssignAction();
    this.getAllCostCenter();
    this.shortcutService.registerShortcut('a', () => {
      this.route.navigate(["/master/finance/cost-center/create-cost"])
    });

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
    });

  }

  addCostCenter() {

    // this.finance.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_id).subscribe({
    //   next: (res: any) => {

    //     let newMonth = this.finance.getCurrentMonth();
    //     let isExistData = res.data.some((x: any) => x.month === newMonth);

    //     if (isExistData) {
    //       this.route.navigate(["/master/finance/cost-center/create-cost"])

    //     } else {

    //       if (!isExistData && res.code===200) {
    //         this.toaster.warning(res.message);
    //         return
    //       }
    //       if (!isExistData && res.code===201) {
    //         this.toaster.warning(res.message);
    //         return
    //       }
    //     }
    //   }, error: (err) => {

    //     if (err.error.code === 404) {
    //       this.toaster.warning(err.error.message);
    //     }

    //   },
    // })
    this.route.navigate(["/master/finance/cost-center/create-cost"])
  }
  getClassForPrice(lowThsthresholdStock: any): string {
    return 'low_hershold_stock';
  }

  public columnDefs = [
    {
      headerName: 'S.NO',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'CC Code',
      field: 'cost_center_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
      cellClass: (params: { value: any; }) => this.getClassForPrice(params)
    },
    {
      headerName: 'Name of Cost Center',
      field: 'cost_center_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },

    {
      headerName: 'Type',
      field: 'cost_center_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },
    {
      headerName: 'Department',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1,
      minWidth: 150,
      cellRenderer: CostCenterStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered",
    },
    {
      headerName: 'Take Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: CostCenterActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
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

  getAllCostCenter() {
    this.finance.getAllCostCenter(this.entity_id).subscribe((res: any) => {
      this.rowData = res.data;
    },
      ((err: any) => {
        this.toaster.error(`${err?.error.message}`);
        this.rowData = []
      })
    )
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  cellClicked(e: any) {

    // const dialogRef = this.dialog.open(PrItemDilogComponent, { width: '400px', data: { cellData: e.data } });
    // dialogRef.afterClosed().subscribe(result => {

    // })

  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }


}


