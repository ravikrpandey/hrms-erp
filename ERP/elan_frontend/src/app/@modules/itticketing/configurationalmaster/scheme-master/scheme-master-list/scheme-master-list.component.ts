import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
// import { RegionActionComponent } from './region-action/region-action.component';
// import { RegionDialogComponent } from './region-dialog/region-dialog.component';
// import { RegionStatusComponent } from './region-status/region-status.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { SchemeMasterComponent } from '../scheme-master.component';
import { SchemeActionComponent } from '../scheme-action/scheme-action.component';
import { RegionStatusComponent } from '../../region/region-status/region-status.component';
import { SchemeStatusComponent } from '../scheme-status/scheme-status.component';
@Component({
  selector: 'app-scheme-master-list',
  templateUrl: './scheme-master-list.component.html',
  styleUrls: ['./scheme-master-list.component.scss']
})
export class SchemeMasterListComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  dropVal:any = [{name:'Yes',value:true},{name:'No',value:false}]
  entity_id: any;
  
  financial_year_id:any;
  
  
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private toaster: ToastrService,
    private _finaceservice: FinaceService,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _commonService: CommonService,
    private shortcutService: ShortcutService,
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.financial_year_id = localStorage.getItem('financial_id');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getAllScheme()
    this.shortcutService.registerShortcut('a', () => {
      // this.openDialog()
    });
    this.shortcutService.registerShortcut('c', () => {
      this.downloadCSV()
    });
  } 

  getAllScheme = () => {
    this._configurationalMasterService.getAllScheme().subscribe((res: any) => {
      this.rowData = res.data;
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
      headerName: 'Scheme',
      field: 'scheme_name',
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
      headerName: 'Start Date',
      field: 'start_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },{
      headerName: 'End Date',
      field: 'end_date',
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
      headerName: 'Description',
      field: 'description',
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
      cellRenderer: SchemeStatusComponent,
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
      field: 'leave_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: SchemeActionComponent,
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

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  openDialogselect(){
  this.route.navigate(['/master/configurational-master/scheme-master/scheme-create'])
    
// this._finaceservice.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_year_id).subscribe({
//   next: (res: any) => {

//     let newMonth = this._finaceservice.getCurrentMonth();
//     let isExistData = res.data.some((x: any) => x.month === newMonth);
//     if (!isExistData && res.code===200) {
//       this.toaster.warning(res.message);
//       return
//     }
//     if (!isExistData && res.code===201) {
//       this.toaster.warning(res.message);
//       return
//     }
    
    
    // const dialogRef = this.dialog.open(SchemeMasterComponent, {
    //   width: '35%',
    //   data: { mode: 'add' },
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    // });
  // }, error:(err)=> {
  //   console.log(err)
  //   this.toaster.warning(err.error.message);
  //     return
  // },
 }

  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData);
  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }
}
