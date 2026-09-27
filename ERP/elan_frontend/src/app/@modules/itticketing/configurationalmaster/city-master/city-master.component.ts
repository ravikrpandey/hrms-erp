import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CityMasterDialogComponent } from './city-master-dialog/city-master-dialog.component';
import { CityMasterActionComponent } from './city-master-action/city-master-action.component';

@Component({
  selector: 'app-city-master',
  templateUrl: './city-master.component.html',
  styleUrls: ['./city-master.component.scss'],
})
export class CityMasterComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  subscription: Subscription;
  columnDefs: any[] = [
    {
      headerName: 'S.No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.5,
    },
    {
      headerName: 'State Name',
      field: 'states_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'City Name',
      field: 'city_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Action',
      field: 'city_name',
      flex: 1,
      minWidth: 150,
      cellRenderer: CityMasterActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];

  entity_id: any;
  financial_year_id: any;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog,
    private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.getCity();
    this.entity_id = localStorage.getItem('selectedEntityId');

    this.financial_year_id = localStorage.getItem('financial_id');

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id;
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  actions = [
    {
      label: 'Add City',
      icon: 'add',
      color: 'primary',
      callback: this.openDialog.bind(this),
    },
  ];

  agInit(params: ICellRendererParams): void {}

  openDialog() {
    const dialogRef = this.dialog.open(CityMasterDialogComponent, {
      width: '30%',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.countryss_id;
    let val = event.newValue;
    let sta = event.data;

    if (val == event.data.status) {
      this._configurationalMasterService
        .updateSingleCountry(id1, sta)
        .subscribe(
          (res: any) => {
            this.toaster.success('Status Updated Successfully');
          },
          (err: any) => {},
        );
    }
  }

  addRecordToGrid(data: any) {
    // if data missing or data has no it, do nothing
    if (!data || data.id == null) {
      return;
    }

    const api = this.gridApi;
    // do nothing if row is already in the grid, otherwise we would have duplicates
    const rowAlreadyInGrid = !!api.getRowNode(data.id);

    if (rowAlreadyInGrid) {
      return;
    }

    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
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
  getCity() {
    this._configurationalMasterService.getCity().subscribe((res: any) => {
      this.rowData = res.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
