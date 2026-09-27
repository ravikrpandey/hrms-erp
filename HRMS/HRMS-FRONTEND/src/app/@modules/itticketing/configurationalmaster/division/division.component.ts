import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { DivisionStatusComponent } from './division-status/division-status.component';
import { DivisionActionComponent } from './division-action/division-action.component';
import { DivisionDialogComponent } from './division-dialog/division-dialog.component';
import { CommonService } from 'src/app/@shared/services/common.service';
// import { GradeActionComponent } from './grade-action/grade-action.component';
// import { GradeDialogComponent } from './grade-dialog/grade-dialog.component';
// import { GradeStatusComponent } from './grade-status/grade-status.component';

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss']
})
export class DivisionComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  entity_Id: any;
  loginUser: any;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _commonService: CommonService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.localStorage()
    this._configurationalMasterService.divisionlist(this.entity_Id).subscribe((params: any) => {
      this.rowData = params.data;

    });
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
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
      minWidth: 150
    },
    {
      headerName: 'Division',
      field: 'division_name',
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
      cellRenderer: DivisionStatusComponent,
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
      // field: 'grade_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: DivisionActionComponent,
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
    this._configurationalMasterService.listGrade(this.entity_Id).subscribe((res: any) => {
      this.rowData = res.data;

    });
  }
  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData,"Division_List.xlsx");
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.grade_id;
    let val = event.newValue;



    //  --------------- change on cell ------------------- 

    let sta = event.data;

    // 
    if (val == event.data.grade_name || val == event.data.status || val == event.data.grade_id) {
      this._configurationalMasterService.editGrade(id1, sta).subscribe(
        (res: any) => {

          this.toaster.success('Updated Successfully')
          this.reloadCurrentRoute();
        }, (err: any) => {
        });
    }

  }
  openDialog() {
    const dialogRef = this.dialog.open(DivisionDialogComponent, {
      data: { grade: 'add_grade' },
      width: '30%',
    })
    dialogRef.afterClosed().subscribe((result) => {
    });
  }


  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  onCellClicked(e: any) {

    // const dialogRef = this.dialog.open(GradeActionComponent, {
    //   width: '400px',
    //   data: {
    //     role_master_id: e.data.role_master_id,
    //   },
    // });
    // dialogRef.afterClosed().subscribe((result) => {

    // });
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
