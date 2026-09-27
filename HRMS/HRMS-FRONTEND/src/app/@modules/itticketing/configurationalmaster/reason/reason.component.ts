import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ReasonDialogComponent } from './reason-dialog/reason-dialog.component';
import { ReasonActionStatusComponent } from './reason-action/reason-action-status/reason-action-status.component';
import { ReasonActionComponent } from './reason-action/reason-action.component';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-reason',
  templateUrl: './reason.component.html',
  styleUrls: ['./reason.component.scss'],
})
export class ReasonComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any;
  count: any = 0;
  assignAction: any;
  entity_Id: any;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private _commonService: CommonService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.localStorage()
    this.assignAction = this._rbackService.accessAssignAction();
    this.getDepartment();

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      

      this.countryss_id = this.id.countryss_id;
      
    });
  }
  localStorage() {
    let entity: any = localStorage.getItem('selectedEntityId');
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
      maxWidth:85,
    },
    {
      headerName: 'Reason Name',
      field: 'reason_for_recruitment',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:150,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: ReasonActionStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
      minWidth:150,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ReasonActionComponent,
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

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }


  getDepartment() {
    this._configurationalMasterService.getall_reasons_nw().subscribe((res: any) => {
      this.rowData = res.data;
      
    },(err:any) => {
      this.rowData = []
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData,"Reason_List.xlsx");
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  openDialog() {
    const dialogRef = this.dialog.open(ReasonDialogComponent, {
      // data: { id: this.queryParamss },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
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
