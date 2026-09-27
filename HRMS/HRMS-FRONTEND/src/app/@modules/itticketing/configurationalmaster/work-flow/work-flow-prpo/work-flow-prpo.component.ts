import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { WorkFlowPrpoActionComponent } from './work-flow-prpo-action/work-flow-prpo-action.component';

@Component({
  selector: 'app-work-flow-prpo',
  templateUrl: './work-flow-prpo.component.html',
  styleUrls: ['./work-flow-prpo.component.scss']
})
export class WorkFlowPrpoComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple', };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;

  constructor(
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.getAllworkflowData()
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Work flow for',
      field: 'workflow_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Category Name',
      field: 'asset_category_name',
      valueGetter: function (params: any) {
        if (params.data.workflow_type === "BOM PR") {
          if (params.data.workflow_category === 2) {
            return "PACKAGING";
          } else if (params.data.workflow_category === 1) {
            return "PRODUCTION";
          }
        } else {
          if (params.data.asset_category_name !== null) {
            return params.data.asset_category_name;
          } else if (params.data.service_category_name !== null) {
            return params.data.service_category_name;
          }
        }
        return '';
      },
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Department',
      field: 'department_name',
      cellRenderer: '',
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 90,
      cellRenderer: WorkFlowPrpoActionComponent,
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

  getAllworkflowData() {
    this._configurationalMasterService.getAllworkflowData().subscribe((response: any) => {
      if (response) {
        this.rowData = response.data;
        // this.toast.success(response.message)
      }
    }, (err: any) => {
      this.toast.error(err.error.message);
    })
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}
