import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EInvoiceActionComponent } from '../e-invoice-action/e-invoice-action.component';

@Component({
  selector: 'app-e-invoice-list',
  templateUrl: './e-invoice-list.component.html',
  styleUrls: ['./e-invoice-list.component.scss']
})
export class EInvoiceListComponent {
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
      this.getEinvoiceList();
    }
    getRowHeight(params: any) {
      // Adjust this logic as per your requirements
      return 40; // Example: return a fixed height like 50px
    }
  
    getEinvoiceList() {   
      this.apiUrl.getEinvoiceList().subscribe((response: any) => {
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
        cellRenderer: EInvoiceActionComponent,
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
  
