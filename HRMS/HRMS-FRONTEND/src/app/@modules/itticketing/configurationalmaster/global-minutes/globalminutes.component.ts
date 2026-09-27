import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { GlobalMinutesStatusComponent } from './global-minutes-status/globalminutes-status.component';
import { GlobalMinutesActionComponent } from './global-minutes-action/globalminutes-action.component';
import { GlobalMinutesDialogComponent } from './global-minutes-dialog/globalminutes-dialog.component';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-globalminutes',
  templateUrl: './globalminutes.component.html',
  styleUrls: ['./globalminutes.component.scss']
})
export class GlobalMinutesComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  loginUser: any;
  entity_Id: any;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private _commonService: CommonService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.localStorage()
    this.global_minutes_list();

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
      headerName: 'Global Minutes',
      field: 'global_minute_value',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Effective From',
      field: 'effective_from',
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
      field:'status',
      cellRenderer: GlobalMinutesStatusComponent

    },

    {
      headerName: 'Action',
      flex: 1,
      minWidth: 150,
      cellRenderer: GlobalMinutesActionComponent,
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
  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData,"Global_Minutes_List.xlsx");
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  global_minutes_list() {
    this._configurationalMasterService.global_minutes_list(this.entity_Id).subscribe((res: any) => {
      this.rowData = res.data;

    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  add_Degsignation: any = 'Add_Designation'
  openDialog(e: any) {
    e.stopPropagation()
    const dialogRef
      = this.dialog.open(GlobalMinutesDialogComponent, {
        width: '30%',
        data: { data: this.add_Degsignation }
      });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
