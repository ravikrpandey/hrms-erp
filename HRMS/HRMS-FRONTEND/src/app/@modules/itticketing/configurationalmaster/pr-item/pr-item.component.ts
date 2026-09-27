import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { PrItemActionComponent } from './pr-item-action/pr-item-action.component';
import { PrItemDilogComponent } from './pr-item-dilog/pr-item-dilog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ItemMasterStatusComponent } from './pr-item-action/item-master-status/item-master-status.component';
import { environment } from 'src/app/environments/environment';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-pr-item',
  templateUrl: './pr-item.component.html',
  styleUrls: ['./pr-item.component.scss']
})
export class PrItemComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  assignAction: any;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private prService: PurchaseRequestService,
    private _commonService: CommonService

  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.getAllItem();

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;


      this.countryss_id = this.id.countryss_id;

    });
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
      headerName: 'Item Code',
      field: 'item_code',
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
      headerName: 'Item Name',
      field: 'item_name',
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
      headerName: 'Asset Category',
      field: 'asset_category.asset_category_name',
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
      cellRenderer: ItemMasterStatusComponent,
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
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: PrItemActionComponent,
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

  getAllItem() {
    this._configurationalMasterService.getAllItem().subscribe((res: any) => {
      this.rowData = res.data;

    })
  }
  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData,"Pr_Item_List.xlsx");
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


}


