import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { AssetAllotmentCompStatus } from './asset-allotment-comp-status/asset-allotment-comp-status';
import { AssetAllotmentCompAction } from './asset-allotment-comp-action/asset-allotment-comp-action';
import { AssetAllotmentCompDialog } from './asset-allotment-comp-dialog/asset-allotment-comp-dialog';
import { AssetallotmentService } from '../assetallotment-service';


@Component({
  selector: 'app-asset-allotment-component',
  templateUrl: './asset-allotment-component.html',
  styleUrls: ['./asset-allotment-component.scss'],
})
export class AssetAllotmentComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  entity_Id: any;
  loginUser: any;
  assetMasterList: any[] = []; // ⭐ ADD THIS

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _assetAllotmentService: AssetallotmentService,
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.localStorage();
    this.getAllAssetMaster(); // ⭐ LOAD CATEGORIES FIRST
    this.getAllAssetAllotmentList();
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
  }

  // ⭐ ADD THIS METHOD
  getAllAssetMaster() {
    this._configurationalMasterService.getAllAssetMaster(this.entity_Id).subscribe((res: any) => {
      this.assetMasterList = res.data;
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
      headerName: 'Asset Master Name',
      field: 'asset_master_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Assigned To',
      field: 'assigned_user_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Allotment Date',
      field: 'asset_allotment_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Alloted By',
      field: 'alloted_by_user_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Remark',
      field: 'remark',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Current Status',
      field: 'current_status',
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
      cellRenderer: AssetAllotmentCompStatus,
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
      flex: 1,
      minWidth: 150,
      cellRenderer: AssetAllotmentCompAction
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  getAllAssetAllotmentList() {
    this._assetAllotmentService.getAllAssetAllotmentList(this.entity_Id).subscribe((res: any) => {
      this.rowData = res.data;
    });
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.asset_allotment_id;
    let val = event.newValue;
    let sta = event.data;

    if (val == event.data.asset_master_name || val == event.data.status || val == event.data.asset_allotment_id) {
      this._assetAllotmentService.assetAllotmentUpdate(id1, sta).subscribe(
        (res: any) => {
          this.toaster.success('Updated Successfully');
          this.reloadCurrentRoute();
        }, (err: any) => {
        });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(AssetAllotmentCompDialog, {
      data: { assetallotment: 'add_assetallotment' },
      width: '30%',
    });
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
