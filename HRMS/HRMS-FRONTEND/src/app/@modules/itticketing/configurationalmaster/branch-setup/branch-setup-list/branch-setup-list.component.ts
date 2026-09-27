import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { HelpDeskDialogComponent } from '../help-desk-dialog/help-desk-dialog.component';
import { BranchSetupActionComponent } from "../branch-setup-action/branch-setup-action.component";
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { BranchSetupStatusComponent } from '../branch-setup-action/branch-setup-status/branch-setup-status.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';


@Component({
  selector: 'app-branch-setup-list',
  templateUrl: './branch-setup-list.component.html',
  styleUrls: ['./branch-setup-list.component.scss']
})
export class BranchSetupListComponent {


  private gridApi!: GridApi<any>
  rowData: any;
  rowClass: any;
  assignAction: any;
  getLocal: any;

  constructor(private empMaster: EmpMasterService,private _configurationalMasterService: ConfigurationalmasterService, private _rbackService: RbacMasterService,    private _commonService: CommonService,
    public dialog: MatDialog) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    let getLocal:any=localStorage.getItem("selectedEntityId")
    this.getLocal = JSON.parse(getLocal);
    // console.log(this.getLocal[0]?.entity_id,'getLocal');

    let data={
      entity_id:this.getLocal
    }
    this._configurationalMasterService.getListBranchSetup(data).subscribe((res: any) => {
      this.rowData = res.data
      this.assignAction = this._rbackService.accessAssignAction();
    })

  }
  
  public columnDefs = [

    {
      headerName: 'S.No',
      valueGetter: "node.rowIndex + 1",
      // field: 'i',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      // valueGetter: 'node.rowIndex+1',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Branch Code',
      field: 'branch_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Branch Name',
      field: 'branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    // {
    //   headerName: 'Type',
    //   field: 'type_of_document',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex:1,
    //   minWidth:150  
    // },
    {
      headerName: 'Branch Email',
      field: 'branch_email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    // {
    //   headerName: ' Date',
    //   field: 'createdAt',
    //   valueFormatter: function (params: any) {
    //     return moment.utc(params.value).format('DD/MM/YYYY');
    //   },
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   flex:1,
    //   minWidth:150  
    // },
    {
      headerName: 'Geofence',
      field: 'latitude',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 140,
      cellRenderer: (params: any) => {
        if (params.data?.latitude && params.data?.longitude) {
          const active = params.data?.is_geofence_active !== false && params.data?.is_geofence_active !== 0;
          const radius = params.data?.geofence_radius_meters || 150;
          return `<span title="Lat: ${params.data.latitude}, Lng: ${params.data.longitude}" style="display:inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; ${active ? 'background:#e8f5e9; color:#2e7d32; border:1px solid #c8e6c9;' : 'background:#ffebee; color:#c62828; border:1px solid #ffcdd2;'}">📍 ${radius}m (${active ? 'Active' : 'Disabled'})</span>`;
        }
        return `<span style="color:#9e9e9e; font-size:11px;">Not Configured</span>`;
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 150,
      cellRenderer: BranchSetupStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: BranchSetupActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    }
  ];


  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;


  }
  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData,"Branch_Setup_List.xlsx");
  }
  onCellClicked(e: any) {

    const dialogRef = this.dialog.open(AppListDialogComponent, { width: '500px', data: { branchSetupViewId: e.data.id, index: e.data.index } });
    dialogRef.afterClosed().subscribe(result => {

    })
  }


}
