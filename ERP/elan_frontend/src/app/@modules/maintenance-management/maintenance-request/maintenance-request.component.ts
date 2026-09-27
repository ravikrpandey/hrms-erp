import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MaintenanceService } from 'src/app/@shared/services/Maintenance/maintenance.service';
import { RequestActionComponent } from './request-action/request-action.component';

@Component({
  selector: 'app-maintenance-request',
  templateUrl: './maintenance-request.component.html',
  styleUrls: ['./maintenance-request.component.scss']
})
export class MaintenanceRequestComponent {
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
  emp_id:any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
   private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private maintenance_service:MaintenanceService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.emp_id = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');;
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
    });
    this.getall_Plan_Maintenance();
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
      headerName: 'Maintenance Code',
      field: 'maintenance_code',
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

  headerName: 'Maintenance Type',
  field: 'maintenance_type',
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
  headerName: 'Start Date',
  field: 'start_date',
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,
  minWidth: 150,
  editable: true,
  valueFormatter: (params:any) => {
    if (!params.value) return '';
    const date = new Date(params.value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  },
},

{

  headerName: 'End Date',
  field: 'end_date',
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,
  minWidth: 150,
  editable: true,
  valueFormatter: (params:any) => {
    if (!params.value) return '';
    const date = new Date(params.value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  },
},
{
  headerName: 'Status',
  field: 'maintenance_Satus',
  valueGetter: (params:any) => {
    return params.data.status_name ?? params.data.maintenance_Satus ;
  },
},
 {
             headerName: 'Action',
             field: 'id',
             flex: 1,
             minWidth: 150,
             cellRenderer: RequestActionComponent,
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

  getall_Plan_Maintenance(){
    this.maintenance_service.getAllPending_maintenance(this.emp_id,'PENDING').subscribe((res:any)=>{
       if(res){
        this.rowData=res.data;
       }
    },(err:any)=>{

    })
  }

}







