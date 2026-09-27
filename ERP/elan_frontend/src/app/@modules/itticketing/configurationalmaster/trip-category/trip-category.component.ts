import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { ReasonActionStatusComponent } from '../reason/reason-action/reason-action-status/reason-action-status.component';
import { ReasonDialogComponent } from '../reason/reason-dialog/reason-dialog.component';
import { ReasonActionComponent } from '../reason/reason-action/reason-action.component';
import { AddTripCategoryComponent } from './add-trip-category/add-trip-category.component';
import { ActionTripCategoryComponent } from './action-trip-category/action-trip-category.component';
import { tripCategoryComponent } from './action-trip-category/trip-category-status/trip-category-status.component';
@Component({
  selector: 'app-trip-category',
  templateUrl: './trip-category.component.html',
  styleUrls: ['./trip-category.component.scss']
})
export class TripCategoryComponent {
 errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  // public gridOptions: any = { rowSelection: 'multiple', };
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55};
  rowData: any;
  count: any = 0;
  assignAction: any;
  entity_Id: any;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private _commonService : CommonService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private shortcutService: ShortcutService,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.localStorage()
    this.assignAction = this._rbackService.accessAssignAction();
    this.getAlltripExpenseMaster();

    // this.activetRoute.queryParams.subscribe((params: any) => {
    //   this.id = params;


    //   this.countryss_id = this.id.countryss_id;

    // });
    this.shortcutService.registerShortcut('a', () => {
      this.openDialog()
    });
    this.shortcutService.registerShortcut('c', () => {
      this.downloadCSV()
    });
  }
  localStorage() {
    let entity: any = localStorage.getItem('selectedEntityId');
    this.entity_Id = JSON.parse(entity);
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
      maxWidth:85,
    },
    {
      headerName: 'Trip Expense Category',
      field: 'expense_category',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:150,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: tripCategoryComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
      minWidth:150,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionTripCategoryComponent,
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


  getAlltripExpenseMaster() {
    this._commonService.showLoader()
    this._configurationalMasterService.getAlltripExpenseMaster().subscribe((res: any) => {
      this.rowData = res.data;
      this._commonService.hideLoader()
    },(err:any) => {
      this.rowData = []
      this._commonService.hideLoader()
      // this.reloadCurrentRoute();
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddTripCategoryComponent, {
      // data: { id: this.queryParamss },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.getAlltripExpenseMaster();
        }
    });
  }

  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData);
  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }
}
let rowIdSequence = 100;

function createDataItem(color: string) {
  const obj = {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
  };

  return obj;
}

