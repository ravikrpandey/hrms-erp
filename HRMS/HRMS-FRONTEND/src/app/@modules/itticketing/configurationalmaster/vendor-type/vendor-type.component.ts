import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { VendorActionComponent } from './vendor-action/vendor-action.component';

@Component({
  selector: 'app-vendor-type',
  templateUrl: './vendor-type.component.html',
  styleUrls: ['./vendor-type.component.scss']
})
export class VendorTypeComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this._configurationalMasterService
      .getVendorType()
      .subscribe((params: any) => {
        this.rowData = params.data;

      });
  }
  public columnDefs:any = [
    {
      headerName: 'S. No',
      field: 'type_of_vendor_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth:150
    },
    {
      headerName: 'Vendor Name',
      field: 'type_of_vendor_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth:150
    },

    {
      headerName: 'Status',
      field: 'type_of_vendor_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth:150,
      //editable: true,
      //cellEditor: 'agSelectCellEditor',
    },

    {
      headerName: 'Action',
      field: 'type_of_vendor_name',
      flex: 1,
      minWidth:150,
      cellRenderer: VendorActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },

    }
  ];
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

  }
  addRecordToGrid(data: any) {
    // if data missing or data has no it, do nothing
    if (!data || data.type_of_vendor_id == null) {
      return;
    }

    const api = this.gridApi;
    // do nothing if row is already in the grid, otherwise we would have duplicates
    const rowAlreadyInGrid = !!api.getRowNode(data.type_of_vendor_id);

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

  getCountry() {
    this._configurationalMasterService.getVendorType().subscribe((res: any) => {
      this.rowData = res.data;

    });
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.type_of_vendor_id;
    let val = event.newValue;



  //  --------------- change on cell -------------------


    let sta = event.data;

    //
    if(val == event.data.type_of_vendor_name || val == event.data.type_of_vendor_status || val == event.data.type_of_vendor_id){
      this._configurationalMasterService.updatevendor(id1, sta).subscribe(
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

  onCellClicked(e: any) {

    const dialogRef = this.dialog.open(VendorActionComponent, {
      width: '400px',
      data: {
        type_of_vendor_id: e.data.type_of_vendor_id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {

    });
  }
}
let rowIdSequence = 100;

function createDataItem(color: string) {
  const obj = {
    type_of_vendor_id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
  };

  return obj;
}
