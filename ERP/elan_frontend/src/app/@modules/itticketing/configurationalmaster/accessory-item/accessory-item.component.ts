import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { AccessoryItemActionComponent } from './accessory-item-action/accessory-item-action.component';

@Component({
  selector: 'app-accessory-item',
  templateUrl: './accessory-item.component.html',
  styleUrls: ['./accessory-item.component.scss']
})
export class AccessoryItemComponent {
  errorMessage: any;
  id: any;
  item_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  assignAction: any;
  entity_id: any;
  financial_year_id: any;
  pageNo: number = 1;
  pageSize: number = 10;

  gridParams: any;
  gridColumnApi: any;
  searchText: any;
  public gridOptions: any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private prService: PurchaseRequestService,
    private shortcutService: ShortcutService,

  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');

    this.financial_year_id = localStorage.getItem('financial_id');;
    this.assignAction = this._rbackService.accessAssignAction();


    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.item_id = this.id.item_id;

    });
    this.shortcutService.registerShortcut('a', () => {
      this.route.navigate(["/master/configurational-master/pr-item/create-item"])
    });
    this.getAllItem()
  }
  createItem() {

    this._finaceservice.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_year_id).subscribe({
      next: (res: any) => {

        let newMonth = this._finaceservice.getCurrentMonth();
        let isExistData = res.data.some((x: any) => x.month === newMonth);
        if (!isExistData && res.code === 200) {
          this.toaster.warning(res.message);
          return
        }
        if (!isExistData && res.code === 201) {
          this.toaster.warning(res.message);
          return
        }


        this.route.navigate(["/master/configurational-master/accessory-item/create-accessory"])

      }, error: (err) => {
        console.log(err)
        this.toaster.warning(err.error.message);
        return
      },
    })

  }
  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .5,
      minWidth: 50
    },
    // {
    //   headerName: 'Item Code',
    //   field: 'item_code',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    //   //editable: true,
    // },
    // {
    //   headerName: 'Accessory Name',
    //   field: 'accessories_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    //   //editable: true,
    // },

    {
      headerName: 'Item Category',
      field: 'asset_category_name',
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
      headerName: 'Item Sub-Category',
      field: 'sub_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },
    // {
    //   headerName: 'Threshold stock',
    //   field: 'minimum_level',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    //   //editable: true,
    // },
    // {
    //   headerName: 'Status',
    //   field: 'status',
    //   // cellRenderer: AccessoryMasterStatusComponent,
    //   cellRendererParams: {
    //     className: 'mat-blue',
    //     hideRequestButton: true,
    //     hideDetailsButton: false,
    //     hideDownloadIcon: false,
    //     showCustomIcon: false,
    //   },
    //   cellClass: "grid-cell-centered",
    // },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: AccessoryItemActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

  // onGridReady(params: GridReadyEvent) {
  //   this.gridApi = params.api;

  // }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const dataSource = {
      getRows: (params: any) => {
        let pageNo = params.startRow / this.pageSize + 1;
        this.fetchPaginatedData(pageNo, this.pageSize, params);
      }
    };

    this.gridApi.setDatasource(dataSource);
  }
  fetchPaginatedData(pageNo: number, pageSize: number, gridParams: any) {
    this.pageNo = pageNo;
    this.pageSize = pageSize;
    this.gridParams = gridParams;
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<1");

    this.getAllItem();
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

  getAllItem() {
    // let data={
    //   page: this.pageNo,
    //     pageSize: this.pageSize,
    //     search: this.searchText
    // }
    this._configurationalMasterService.getAllAccessory(this.financial_year_id, this.entity_id
    ).subscribe((res: any) => {
      this.rowData = res.data.reverse();
      // let rows = res.data || [];
      // let totalRows = res.pagination?.totalItems || 0;
      // setTimeout(() => {
      //   if (this.gridParams) {
      //     this.gridParams.successCallback(rows, totalRows);
      //   }
      // })
    })
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
  exportExcel() {
    this._configurationalMasterService.exportExcel(this.rowData, 'download');
  }
}


