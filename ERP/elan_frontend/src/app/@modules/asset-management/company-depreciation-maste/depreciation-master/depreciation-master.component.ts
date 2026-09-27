import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { DepreciationService } from 'src/app/@shared/services/depreciation.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { DepreciationActionComponent } from '../depreciation-action/depreciation-action.component';

@Component({
  selector: 'app-depreciation-master',
  templateUrl: './depreciation-master.component.html',
  styleUrls: ['./depreciation-master.component.scss']
})
export class DepreciationMasterComponent {
  errorMessage: any;
  id: any;
  rowClass: any;
  fid:any;
  private gridApi!: GridApi<any>;
  rowData: any;
  entity_id:any;
  filter_fy:any;
  emp_id: any;
  assignAction: any;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55};
  constructor(
    private readonly _configurationalMasterService: ConfigurationalmasterService,
    private _commonService : CommonService,
    public dialog: MatDialog, private route: Router,
    private _rbackService: RbacMasterService,
    private depreciation_service:DepreciationService,
    private activetRoute:ActivatedRoute
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    let lg: any = localStorage.getItem('signInUser')
    let loginUser = JSON.parse(lg);
    this.emp_id= loginUser?.employee_id
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.filter_fy = localStorage.getItem('financial_id');
    this.getAllDepreciationList();

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
    })
  }

getAllDepreciationList(){
  if(this.entity_id){
    this.depreciation_service.getAllCreateDepreciationCalculations(this.entity_id).subscribe((res:any)=>{
       if(res.data){
        this.rowData=res.data;
       }
    },(err:any)=>{

    })
  }
}

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Asset Category',
      field: 'asset_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Calculation Type',
      field: 'calculationMethod',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Salvage Value',
      field: 'salvage_value',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      cellRenderer: (params:any) => {
        return params.value ? params.value + '%' : '';
      }
    },
    
    {
      headerName: 'Frequency',
      field: 'frequency',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Use Full Life',
      field: 'use_full_life',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      // minHeight: 150,
      cellRenderer: '',
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
      cellRenderer: DepreciationActionComponent,
      cellRendererParams: (params: any) => {
        return {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,
        };
      }
    }
  ];




  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(e:any){
  }

  agInit(params: ICellRendererParams): void {

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

 
}
