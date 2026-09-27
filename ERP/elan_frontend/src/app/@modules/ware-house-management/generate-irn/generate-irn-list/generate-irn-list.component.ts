import { Component } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';
import { GenerateIrnActionComponent } from '../generate-irn-action/generate-irn-action.component';

@Component({
  selector: 'app-generate-irn-list',
  templateUrl: './generate-irn-list.component.html',
  styleUrls: ['./generate-irn-list.component.scss']
})
export class GenerateIrnListComponent {

  rowClass: any;
    rowData:[];
    isDeleteButtonVisible: boolean = false;
    selectedRows: any[] = [];
    private gridApi!: GridApi<any>;
    public gridOptions: any = { rowSelection: 'multiple', getRowHeight: this.getRowHeight.bind(this) };
    constructor(
      private apiUrl: warehouseListService,
    ) {}
  
    ngOnInit() {
      this.getList('Approved');
    }
    getRowHeight(params: any) {
      // Adjust this logic as per your requirements
      return 40; // Example: return a fixed height like 50px
    }
  
    getList(type:any) {   
      this.apiUrl.getLRList(type).subscribe((response: any) => {
        this.rowData=response.data;
      }, err => {
        console.log(err);
      })
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
        minWidth: 100,
      },
      {
        headerName: 'Vehicle Planning Code',
        field: 'planning_code',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      }, 
      {
        headerName: 'Vehicle Number',
        field: 'vehicle_number',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'LR Number',
        field: 'LR_number',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Warehouse Name',
        field: 'warehouse_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Transporter Name',
        field: 'driver_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Delivery Route',
        field: 'vehicle_root_status',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Planning Date',
        field: 'createdAt',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Inword Date Time',
        field: 'gate_inward_date',
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
        field: 'id',
        flex: 1,
        minWidth: 150,
        cellRenderer: GenerateIrnActionComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false, // Hide attachment icon
        },
      },
    ];
  
    formatDateTime(dateString: string, type:string): string {
      const date = new Date(dateString);
      const datePart = date.toLocaleDateString('en-GB'); // dd/mm/yyyy
      const timePart = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      return type=='Date' ? `${datePart}` : `${datePart} ${timePart}`; // dd/mm/yyyy hh:mm AM/PM
    }
    onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
      this.gridApi.addEventListener('selectionChanged', this.onSelectionChanged.bind(this));
  
    }
    onPageSizeChanged() {
      var value = (document.getElementById('page-size') as HTMLInputElement)
        .value;
      this.gridApi.paginationSetPageSize(Number(value));
    }
    onSelectionChanged(event: any) {
      this.selectedRows = event.api.getSelectedRows();
  
      this.isDeleteButtonVisible = this.selectedRows.length > 0;
    }
    onFilterTextBoxChanged(event: any) {
      
    }
  }
