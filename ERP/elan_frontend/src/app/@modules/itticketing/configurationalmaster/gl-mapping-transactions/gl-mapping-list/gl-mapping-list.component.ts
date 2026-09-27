import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { WorkFlowPrpoActionComponent } from 'src/app/@modules/work-flow/work-flow-prpo/work-flow-prpo-action/work-flow-prpo-action.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-gl-mapping-list',
  templateUrl: './gl-mapping-list.component.html',
  styleUrls: ['./gl-mapping-list.component.scss']
})
export class GlMappingListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any=[];
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
    private activeroute: ActivatedRoute,
    private _finance:FinaceService,
    private _commonService : CommonService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
   this.getAllGlMappingData()
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
      headerName: 'Transactions',
      field: 'transaction_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Debit Account',
      field: 'debit_account',
      
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Creit Account',
      field: 'credit_account',
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
 
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  getAllGlMappingData() {
    let entity_id = localStorage.getItem('selectedEntityId')
    this._commonService?.showLoader()
    this._finance.getAllGlMappingData(entity_id).subscribe((response: any) => {
      if (response) {
        this._commonService?.hideLoader()
        this.rowData = response.data || [];
    
      }
    }, (err: any) => {
      this._commonService?.hideLoader()
      this.toast.error(err.error.message);
    })
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}
