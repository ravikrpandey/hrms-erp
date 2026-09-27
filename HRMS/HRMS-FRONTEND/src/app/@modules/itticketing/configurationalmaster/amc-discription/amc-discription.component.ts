import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { AssetManagementService } from 'src/app/@shared/services/asset-management.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { LaactionAmcDesComponent } from './laaction-amc-des/laaction-amc-des.component';
import { AmcDailogComponent } from './amc-dailog/amc-dailog.component';
import { AmcDiscriptionStatusComponent } from './laaction-amc-des/amc-discription-status/amc-discription-status.component';

@Component({
  selector: 'app-amc-discription',
  templateUrl: './amc-discription.component.html',
  styleUrls: ['./amc-discription.component.scss']
})
export class AmcDiscriptionComponent {
  errorMessage: any;
  id: any;
  amc_description_id: any;
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
    this.getAllAmcDes();

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;


      this.amc_description_id = this.id.amc_description_id;

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
      headerName: 'Amc Description Name',
      field: 'amc_description',
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
      cellRenderer: AmcDiscriptionStatusComponent,
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
      field: 'amc_description_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: LaactionAmcDesComponent,
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


  getAllAmcDes() {
    this._configurationalMasterService.getAllAmcDes().subscribe((res: any) => {
      this.rowData = res.data;
    })
  }


  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.amc_description_id;
    let val = event.newValue;





    //  --------------- change on cell -------------------


    let sta = event.data;


    if (val == event.data.amc_description || val == event.data.status || val == event.data.amc_description_id) {
      this._configurationalMasterService.updateAmcDes(id1, sta).subscribe(
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
    const dialogRef = this.dialog.open(AmcDailogComponent, {
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