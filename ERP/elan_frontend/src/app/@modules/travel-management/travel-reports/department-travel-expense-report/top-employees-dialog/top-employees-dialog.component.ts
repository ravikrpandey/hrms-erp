import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';

@Component({
  selector: 'app-top-employees-dialog',
  templateUrl: './top-employees-dialog.component.html',
  styleUrls: ['./top-employees-dialog.component.scss']
})
export class TopEmployeesDialogComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  entity_id: string | null;
  public rowData: any;
  gridOptions: GridOptions<any>;
  department_id:any;
  ;


  constructor(
    private reportService : TravelRequestService,
    private toaster: ToastrService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rowClass = 'rowClass'
    this.department_id = this.data.id
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getTopSpendingEmployees();
  }

  getTopSpendingEmployees() {
    this.reportService.getTopSpendingEmployees(this.entity_id,this.department_id).subscribe({
      next: (res: any) => {
        this.rowData = res.data;
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.rowData = [];
          this.toaster.error('No Top spending employees data found!.');
        } else {
          console.error('Error fetching report:', err);
          this.toaster.error('An error occurred while fetching the report.');
        }
      }
    });
  }
  public columnDefs = [
    {
      headerName: 'S No',
      field: 'node.rowIndex+1',
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 80,
      valueGetter: (params: any) => params.node.rowIndex + 1,
      tooltipValueGetter: (params: any) => `Serial Number: ${params.node.rowIndex + 1}`
    },
    {
      headerName: 'Employee Name',
      field: 'employee_name',
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'employee_name',
      cellStyle: () => {
        return { fontWeight: 'bold' };
      },
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
  ];
  
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
