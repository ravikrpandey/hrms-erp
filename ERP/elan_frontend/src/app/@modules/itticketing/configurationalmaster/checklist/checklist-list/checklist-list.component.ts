import { Component } from '@angular/core';
import { UomDialogComponent } from '../../uom/uom-dialog/uom-dialog.component';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ActionUomComponent } from '../../uom/action-uom/action-uom.component';
import { ActionStatusUomComponent } from '../../uom/action-uom/action-status-uom/action-status-uom.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmptDialogComponent } from '../../employement-type/empt-dialog/empt-dialog.component';
import { EmptActionComponent } from '../../employement-type/empt-action/empt-action.component';
import { EmploymentStatusComponent } from '../../employement-type/employment-status/employment-status.component';
import { ChecklistDialogComponent } from '../checklist-dialog/checklist-dialog.component';
import { ChecklistStatusComponent } from '../checklist-status/checklist-status.component';
import { ChecklistActionComponent } from '../checklist-action/checklist-action.component';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { CheckPostingPeriod } from 'src/app/@shared/helper/checkPostingPeriod/checkPostingPeriod';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-checklist-list',
  templateUrl: './checklist-list.component.html',
  styleUrls: ['./checklist-list.component.scss']
})
export class ChecklistListComponent {

  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  entity_id: any;
  financial_year_id: any;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    private _commonService: CommonService,
    private shortcutService: ShortcutService,
    public dialog: MatDialog,
    private _finaceservice: FinaceService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.getList()
    this.entity_id = localStorage.getItem('selectedEntityId');

    this.financial_year_id = localStorage.getItem('financial_id');;
    this.shortcutService.registerShortcut('a', () => {
      this.openDialog()
    });
    this.shortcutService.registerShortcut('c', () => {
      this.downloadCSV()
    });
  }

  getList = () => {
    this._commonService?.showLoader()
    this._configurationalMasterService
      .getCHECKLISTList()
      .subscribe((params: any) => {
        this._commonService?.hideLoader()
        this.rowData = params.data;
      }, (err: any) => {
        this.rowData = []
        this._commonService?.hideLoader()
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
      headerName: 'Checklist Name',
      field: 'checklist_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: ChecklistStatusComponent,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      // editable:true
    },
    {
      headerName: 'Action',
      // field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ChecklistActionComponent,
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
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  getCountry() {
    this._configurationalMasterService.listEmployement().subscribe((res: any) => {
      this.rowData = res.data;

    });
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.id;
    let val = event.newValue;



    //  --------------- change on cell ------------------- 

    let sta = event.data;

    // 
    if (val == event.data.emptype_name || val == event.data.status || val == event.data.id) {
      this._configurationalMasterService.editEmployement(id1, sta).subscribe(
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
  onCellClicked(e: any) {

    const dialogRef = this.dialog.open(EmptActionComponent, {
      width: '400px',
      data: {
        role_master_id: e.data.role_master_id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {

    });
  }
  add_Checklist: any = 'Add_Checklist'
  openDialog() {
    
    let checkPostingPeriod = new CheckPostingPeriod(this._finaceservice);
    checkPostingPeriod.returnActiveMonth(this.entity_id, this.financial_year_id)
      .then(isActive => {
        if (isActive) {
          const dialogRef = this.dialog.open(ChecklistDialogComponent, {
            data: { add_checklist: this.add_Checklist },
            width: '30%',
          });

          dialogRef.afterClosed().subscribe((result) => {
          });
        } else {
          this.toaster.warning('This month is not active');
          return;
        }
      })
      .catch(err => {
        console.error('Error occurred:', err);
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
