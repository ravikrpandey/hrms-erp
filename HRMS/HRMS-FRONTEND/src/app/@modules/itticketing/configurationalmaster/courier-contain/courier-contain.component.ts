import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent, CellValueChangedEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { AssetManagementService } from 'src/app/@shared/services/asset-management.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CourierActionComponent } from '../courier-service-name/courier-action/courier-action.component';
import { ContainActionComponent } from './contain-action/contain-action.component';
import { ContainDailogComponent } from './contain-dailog/contain-dailog.component';
import { CourierContainStatusComponent } from './contain-action/courier-contain-status/courier-contain-status.component';

@Component({
  selector: 'app-courier-contain',
  templateUrl: './courier-contain.component.html',
  styleUrls: ['./courier-contain.component.scss']
})
export class CourierContainComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService, private assetService: AssetManagementService,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.getAllContains();

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
      headerName: 'Courier Contains Name',
      field: 'courier_contains_name',
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
      cellRenderer: CourierContainStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
      minWidth: 150,
    },

    {
      headerName: 'Action',
      field: 'courier_contains_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ContainActionComponent,
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
    const rowAlreadyInGrid = !!api.getRowNode(data.id);

    if (rowAlreadyInGrid) {

      return;
    }

    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
  }

  onFactoryButtonClick(e: any) {
    e.stopPropagation();
    this.count++;
    if (this.count === 1) {
      var button = e.currentTarget,
        buttonColor = button.getAttribute('data-color'),
        side = button.getAttribute('data-side'),
        data = createDataItem(buttonColor);
      this.addRecordToGrid(data);
      this.gridApi.paginationGoToLastPage();
    } else {
      this.toaster.warning("can't add without feel");
    }
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }


  getAllContains() {
    this._configurationalMasterService.getAllContains().subscribe((res: any) => {
      this.rowData = res.data;
    },(err: any) => {
      this.rowData = []
    })
  }


  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.courier_contains_id;
    let val = event.newValue;





    //  --------------- change on cell -------------------


    let sta = event.data;


    if (val == event.data.courier_contains_name || val == event.data.status || val == event.data.courier_contains_id) {
      this._configurationalMasterService.updateContains(id1, sta).subscribe(
        (res: any) => {

          this.toaster.success('Updated Successfully')
          this.reloadCurrentRoute();
        }, (err: any) => {

        });
    }

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
    const dialogRef = this.dialog.open(ContainDailogComponent, {
      // data: { id: this.queryParamss },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
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
