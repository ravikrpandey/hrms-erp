import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CountrymasterdialogComponent } from '../countrymaster/countrymasterdialog/countrymasterdialog.component';
import { DesignationActionComponent } from './designation-action/designation-action.component';
import { DesignationDialogComponent } from './designation-dialog/designation-dialog.component';
import { DesignationStatusComponent } from './designation-status/designation-status.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss']
})
export class DesignationComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  entity_id:any
  financial_year_id:any
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _commonService : CommonService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private _finaceservice: FinaceService,
    private shortcutService: ShortcutService,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.getDesignation();
    this.entity_id = localStorage.getItem('selectedEntityId');
 
    this.financial_year_id = localStorage.getItem('financial_id');;
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;


      this.countryss_id = this.id.countryss_id;

    });
    this.shortcutService.registerShortcut('a', () => {
      this.openDialog()
    });
    this.shortcutService.registerShortcut('c', () => {
      this.downloadCSV()
    });
    

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
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Designation Name',
      field: 'designation_name',
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
      cellRenderer: DesignationStatusComponent

    },

    {
      headerName: 'Action',
      // field: 'designation_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: DesignationActionComponent,
      // cellRendererParams: {
      //   className: 'mat-blue',
      //   hideRequestButton: true,
      //   hideDetailsButton: false,
      //   hideDownloadIcon: false,
      //   showCustomIcon: false, // Hide attachment icon
      // },
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
      this.toaster.warning("can't add Designation");
    }
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

  getDesignation() {
    this._commonService.showLoader()
    this._configurationalMasterService.getDesignation().subscribe((res: any) => {
      this.rowData = res.data;
      this._commonService?.hideLoader()
    },(err:any) => {
      this.rowData = [];
      this._commonService?.hideLoader()
    })
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.designation_id;
    let val = event.newValue;



    //  --------------- change on cell ------------------- 


    let sta = event.data;

    // 
    if (val == event.data.designation_name || val == event.data.status || val == event.data.designation_id) {
      this._configurationalMasterService.updateDesignation(id1, sta).subscribe(
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

    const dialogRef = this.dialog.open(DesignationDialogComponent, {
      width: '400px',
      data: {
        role_master_id: e.data.role_master_id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {

    });
  }
  add_Degsignation: any = 'Add_Designation'
  openDialog(e?: any) {
    if (e) {
      e.stopPropagation();  // Only stop propagation if event is passed
    }


       
        const dialogRef
        = this.dialog.open(DesignationDialogComponent, {
          width: '30%',
          data: { data: this.add_Degsignation }
        });
  
      dialogRef.afterClosed().subscribe(result => {
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


