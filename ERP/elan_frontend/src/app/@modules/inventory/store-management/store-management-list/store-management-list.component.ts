import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { StoreManagementDialogueComponent } from '../store-management-dialogue/store-management-dialogue.component';
import { StoreManagementActionComponent } from '../store-management-action/store-management-action.component';
import { StoreManagementStatusComponent } from '../store-management-status/store-management-status.component';
import { StoreManagementService } from 'src/app/@shared/services/inventory/store-management.service';

@Component({
  selector: 'app-store-management',
  templateUrl: './store-management-list.component.html',
  styleUrls: ['./store-management-list.component.scss']
})
export class StoreManagementListComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  constructor(
    private store_Management_Service:StoreManagementService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService, private router: Router
  ) {
    this.rowClass = 'rowClass'

  }

  ngOnInit(): void {
    this.getInventory_mng();

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;


      this.countryss_id = this.id.countryss_id

    })
  }

  public columnDefs = [
    {
      headerName: 'S.no',
      valueGetter: "node.rowIndex+1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Store Name',
      field: 'store_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Branch',
      field: 'tbl_branch.branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },

    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: StoreManagementStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
      minWidth: 150,
    },

    {
      headerName: 'Action',
      // field: 'countryss_name',
      flex: 1,
      minWidth: 150,
      cellRenderer: StoreManagementActionComponent,
      cellRendererParams: (params:any) => ({
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        rowData: params.data // Pass the row data to the component
      }),

    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  agInit(params: ICellRendererParams): void {

  }

  openDialog() {
    const dialogRef = this.dialog.open(StoreManagementDialogueComponent, {
      // data: { id: this.queryParamss },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
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
  getInventory_mng() {
    this.store_Management_Service.getInventory_mng().subscribe((res: any) => {
      this.rowData = res.data;
    })
  }

}
