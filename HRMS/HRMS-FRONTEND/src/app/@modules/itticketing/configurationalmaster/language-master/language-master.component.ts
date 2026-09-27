import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { AssetManagementService } from 'src/app/@shared/services/asset-management.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { LaactionLangComponent } from './laaction-lang/laaction-lang.component';
import { LanguageStatusComponent } from './laaction-lang/language-status/language-status.component';
import { LangDailogComponent } from './lang-dailog/lang-dailog.component';

@Component({
  selector: 'app-language-master',
  templateUrl: './language-master.component.html',
  styleUrls: ['./language-master.component.scss']
})
export class LanguageMasterComponent {
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
    this.getLanguage();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
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
      headerName: 'Language',
      field: 'language_name',
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
      cellRenderer: LanguageStatusComponent,
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
      field: 'language_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: LaactionLangComponent,
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


  getLanguage() {
    this._configurationalMasterService.getAllLanguage().subscribe((res: any) => {
      this.rowData = res.data;
    })
  }


  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.language_id;
    let val = event.newValue;





    //  --------------- change on cell -------------------


    let sta = event.data;


    if (val == event.data.language_name || val == event.data.status || val == event.data.language_id) {
      this._configurationalMasterService.updateLang(id1, sta).subscribe(
        (res: any) => {

          this.toaster.success('Updated Successfully')
          this.reloadCurrentRoute();
        }, (err: any) => {
          // this.toaster.error('Something went wrong please try again', 'Error Message');

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
    const dialogRef = this.dialog.open(LangDailogComponent, {
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

