import { Component } from '@angular/core';
import { KtMasterCreateDialog } from '../kt-master-create-dialog/kt-master-create-dialog';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { KtMasterAction } from '../kt-master-action/kt-master-action';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { KtMasterStatus } from '../kt-master-status/kt-master-status';

@Component({
  selector: 'app-kt-master-list',
  templateUrl: './kt-master-list.html',
  styleUrls: ['./kt-master-list.scss']
})
export class KtMasterList {

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
    public dialog: MatDialog
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.localStorage();

    this._configurationalMasterService.KtCategoryList(this.entity_Id)
      .subscribe((params: any) => {
        this.rowData = params?.data || [];
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
      headerName: 'Category Name',
      field: 'category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
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
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: KtMasterStatus,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Action',
      // field: 'grade_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: KtMasterAction
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
  
  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.grade_id;
    let val = event.newValue;
    //  --------------- change on cell ------------------- 

    let sta = event.data;

    // 
    if (val == event.data.businessunit_name || val == event.data.status || val == event.data.grade_id) {
      this._configurationalMasterService.businessUnitEdit(id1, sta).subscribe(
        (res: any) => {

          this.toaster.success('Updated Successfully')
          this.reloadCurrentRoute();
        }, (err: any) => {
        });
    }

  }
  openDialog() {
    const dialogRef = this.dialog.open(KtMasterCreateDialog, {
      data: { grade: 'add_grade' },
      width: '40%',
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

}
