import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CellValueChangedEvent,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { UnitActionComponent } from './unit-action/unit-action.component';
@Component({
  selector: 'app-unit-master',
  templateUrl: './unit-master.component.html',
  styleUrls: ['./unit-master.component.scss'],
})
export class UnitMasterComponent {
  errorMessage: any;
  id: any;
  unit_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    private activetRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.getAlllUnit();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.unit_id = this.id.unit_id

    })

  }
  public columnDefs = [
    {
      headerName: 'S.NO',
      field: 'unit_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Unit Name',
      field: 'unit_name',
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
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Action',
      field: 'unit_name',
      flex: 1,
      minWidth: 150,
      cellRenderer: UnitActionComponent,
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
  addRecordToGrid(data: any) {
    // if data missing or data has no it, do nothing
    if (!data || data.id == null) {
      return;
    }

    const api = this.gridApi;
    // do nothing if row is already in the grid, otherwise we would have duplicates
    const rowAlreadyInGrid = !!api.getRowNode(data.unit_id);

    if (rowAlreadyInGrid) {
      return;
    }

    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
  }

  onFactoryButtonClick(e: any) {
    this.count++;
    if (this.count === 1) {
      var button = e.currentTarget,
        buttonColor = button.getAttribute('data-color'),
        side = button.getAttribute('data-side'),
        data = createDataItem(buttonColor);
      this.addRecordToGrid(data);
      this.gridApi.paginationGoToLastPage();
    } else {
      this.toaster.warning("can't add without fill!");
    }
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getAlllUnit() {
    this._configurationalMasterService.listUnit().subscribe((params: any) => {
      this.rowData = params.data;
    });
  }
  onCellValueChanged(event: CellValueChangedEvent) {

  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
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
