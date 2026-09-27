import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';

@Component({
  selector: 'app-department-city-dialoge',
  templateUrl: './department-city-dialoge.component.html',
  styleUrls: ['./department-city-dialoge.component.scss']
})
export class DepartmentCityDialogeComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  entity_id: string | null;
  mainEmpId: string | null;
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
    this.getFrequentlyVisitedCities();
  }

  getFrequentlyVisitedCities() {
    this.reportService.getFrequentlyVisitedCities(this.department_id).subscribe({
      next: (res: any) => {
        this.rowData = res.data;
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.rowData = [];
          this.toaster.error('No travel data found!.');
        } else {
          console.error('Error fetching report:', err);
          this.toaster.error('An error occurred while fetching the report.');
        }
      }
    });
  }
  public columnDefs = [
    {
      headerName: 'City Name',
      field: 'city_name',
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'department',
      cellStyle: () => {
        return { fontWeight: 'bold' };
      },
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'City Visit Count',
      field: 'city_visit_count',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'total_travel_requests',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
  ];
  
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
