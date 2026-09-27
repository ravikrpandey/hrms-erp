import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { BreakdownManagementService } from 'src/app/@shared/services/breakdown-management/breakdown-management.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { AssignedActionComponent } from './assigned-action/assigned-action.component';

@Component({
  selector: 'app-assigned-indent',
  templateUrl: './assigned-indent.component.html',
  styleUrls: ['./assigned-indent.component.scss']
})
export class AssignedIndentComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  editDesig: any;
  entity_id: string | null;
  financial_year_id: string | null;
  emp_id: string | null;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
   private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private breakdown_service:BreakdownManagementService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');;
    this.emp_id = localStorage.getItem('EmpMainId');
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
    });
    this.getAll_AssignedIndent();
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
      headerName: 'Indent Number',
      field: 'breakdown_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      editable: true,
    },
{

  headerName: 'WorkStation Name',
  field: 'name_of_workstation',
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,
  minWidth: 150,
  editable: true,
},
{

  headerName: 'Raised By',
  field: 'name',
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,
  minWidth: 150,
  editable: true,
},
{

  headerName: 'Priority',
  field: 'priority',
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,
  minWidth: 150,
  editable: true,
},
{

  headerName: 'Line',
  field: 'line',
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,
  minWidth: 150,
  editable: true,
},
{
  headerName: 'Status',
  field: 'breakSatus',
  valueGetter: (params:any) => {
    return params.data.status_name ?? params.data.breakSatus ;
  },
},
     {
             headerName: 'Action',
             field: 'id',
             flex: 1,
             minWidth: 150,
             cellRenderer: AssignedActionComponent,
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
  addRecordToGrid(data: any) {
    // if data missing or data has no it, do nothing
    if (!data || data.id == null) {
      return;
    }

    const api = this.gridApi;
    // do nothing if row is already in the grid, otherwise we would have duplicates
    const rowAlreadyInGrid = !!api.getRowNode(data.id);

    if (rowAlreadyInGrid) {

      return;
    }
    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
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


  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  getAll_AssignedIndent(){
   this.breakdown_service.getAll_AssignedIndent(this.emp_id).subscribe((res:any)=>{
     if(res){
      this.rowData=res.data;
     }
   },(err:any)=>{

   })
  }


}






