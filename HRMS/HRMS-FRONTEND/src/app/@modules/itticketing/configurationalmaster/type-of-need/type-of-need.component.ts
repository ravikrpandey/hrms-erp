import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { TypeOfNeedStatusComponent } from './type-of-need-status/type-of-need-status.component';
import { TypeOfNeedActionComponent } from './type-of-need-action/type-of-need-action.component';
import { TypeOfNeedDialogComponent } from './type-of-need-dialog/type-of-need-dialog.component';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-type-of-need',
  templateUrl: './type-of-need.component.html',
  styleUrls: ['./type-of-need.component.scss']
})
export class TypeOfNeedComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  dropVal:any = [{name:'Yes',value:true},{name:'No',value:false}]
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
    this.getNeedType()
  }

  getNeedType = () => {
    this._configurationalMasterService.listTypeOfNeed().subscribe((res: any) => {     
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
      headerName: 'Type Of Need',
      field: 'need_type',
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
      cellRenderer: TypeOfNeedStatusComponent,
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
      cellRenderer: TypeOfNeedActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];
  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData,"Type_of_Need_List.xlsx");
  }
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

  openDialog(){
    const dialogRef = this.dialog.open(TypeOfNeedDialogComponent, {
      width: '500px',
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
    
    });
  }

  onCellClicked(e: any) {
  }
}
