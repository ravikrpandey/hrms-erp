import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { HelpDeskDialogComponent } from '../help-desk-dialog/help-desk-dialog.component';
import { BranchSetupActionComponent } from "../branch-setup-action/branch-setup-action.component";
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import * as moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { BranchSetupStatusComponent } from '../branch-setup-action/branch-setup-status/branch-setup-status.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ToastrService } from 'ngx-toastr';


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
  entity_id:any;
  financial_year_id:any;
  constructor(private empMaster: EmpMasterService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog,
    private _finaceservice: FinaceService,
    private _commonService: CommonService,
    private shortcutService: ShortcutService,
    private toaster: ToastrService,
    private route:Router,
    
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    
    this.financial_year_id = localStorage.getItem('financial_id');;
    this._configurationalMasterService.getListBranchSetup().subscribe((res: any) => {
      this.rowData = res.data
      this.assignAction = this._rbackService.accessAssignAction();
    })
    this.shortcutService.registerShortcut('a', () => {
      this.route.navigate(["/master/configurational-master/branch-setup/create"])
    });
    this.shortcutService.registerShortcut('c', () => {
      this.downloadCSV()
    });
  }
  
  createBranch(){
    
    this._finaceservice.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_year_id).subscribe({
      next: (res: any) => {
        
        let newMonth = this._finaceservice.getCurrentMonth();
        let isExistData = res.data.some((x: any) => x.month === newMonth);
        if (!isExistData && res.code===200) {
          this.toaster.warning(res.message);
          return
        }
        if (!isExistData && res.code===201) {
          this.toaster.warning(res.message);
          return
        }
        
        this.route.navigate(["/master/configurational-master/branch-setup/create"])
    
    
  }, error:(err)=> {
    console.log(err)
    this.toaster.warning(err.error.message);
      return
  },
})

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
      headerName: 'Branch Manager Email',
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
    this._commonService?.downloadCSV(this.rowData);
  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }
}
