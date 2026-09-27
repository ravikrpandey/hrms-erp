
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { HelpDeskDialogComponent } from '../help-desk-dialog/help-desk-dialog.component';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import * as moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { HsnSacActionComponent } from '../hsn-sac-action/hsn-sac-action.component';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-hsn-sac-list',
  templateUrl: './hsn-sac-list.component.html',
  styleUrls: ['./hsn-sac-list.component.scss']
})
export class HsnSacListComponent {


  private gridApi!: GridApi<any>
  rowData: any;
  rowClass: any;
  assignAction: any;


  entity_id: any;
  financial_year_id: any;
  constructor(private empMaster: EmpMasterService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private _finaceservice: FinaceService,
    public dialog: MatDialog,
    private toast : ToastrService,
    private _commonService: CommonService,
    private shortcutService: ShortcutService,
    private route :Router
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    
    this.financial_year_id = localStorage.getItem('financial_id');;
    this._configurationalMasterService.getHsnSacList().subscribe((res: any) => {
      this.rowData = res?.data
      this.assignAction = this._rbackService.accessAssignAction();
    })
    this.shortcutService.registerShortcut('a', () => {
      this.route.navigate(["/master/configurational-master/hsn-sac-master/create-hsn"])
    });
    
  }
  
  createHSN(){
        this.route.navigate(["/master/configurational-master/hsn-sac-master/create-hsn"])
  }

  public columnDefs = [

    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      // field: 'i',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      // valueGetter: 'node.rowIndex+1',
      // flex: 1,
      maxWidth: 80,
    },
    {
      headerName: 'Type',
      field: 'code_type',
      sortable: true,
      suppressSizeToFit:true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      maxWidth: 100,
    },
    {
      headerName: 'HSN/SAC Code',
      field: 'hsn_sac_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      maxWidth: 200,
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
      headerName: 'GST Rate',
      field: 'gst_rate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      maxWidth: 150,
    },
    {
      headerName: 'Exemption',
      field: 'exemption',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      maxWidth: 100,
    },
    {
      headerName: 'Description',
      field: 'description',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      tooltipValueGetter: (params:any) => params.value
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
    // {
    //   headerName: 'Status',
    //   field: 'status',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   flex: 1,
    //   minWidth: 150,
    //   cellRenderer: BranchSetupStatusComponent,
    //   cellRendererParams: {
    //     className: 'mat-blue',
    //     hideRequestButton: true,
    //     hideDetailsButton: false,
    //     hideDownloadIcon: false,
    //     showCustomIcon: false, // Hide attachment icon
    //   },
    // },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      maxWidth: 150,
      width:150,
      cellRenderer: HsnSacActionComponent,
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

    params.api.sizeColumnsToFit();
  }
  onCellClicked(e: any) {

    const dialogRef = this.dialog.open(AppListDialogComponent, { width: '500px', data: { branchSetupViewId: e.data.id, index: e.data.index } });
    dialogRef.afterClosed().subscribe(result => {

    })
  }

  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData);
  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }
}
