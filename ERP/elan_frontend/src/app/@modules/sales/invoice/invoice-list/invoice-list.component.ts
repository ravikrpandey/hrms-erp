import { Component } from '@angular/core';
// import { ActionButtonComponent } from './action-button/action-button.component';
import { ColDef } from 'ag-grid-community';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';
import { InvoiceActionComponent } from '../invoice-action/invoice-action.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent {

    paginationPageSize = 10;
    rowData: any[] = [];
    filteredRowData: any[] = [];
  
    frameworkComponents = {
      gateActionButton: InvoiceActionComponent
    };
  
    columnDefs: ColDef[] = [];
    
    constructor(
      private apiUrl: warehouseListService,
    ) {}
  
    ngOnInit() {
      this.setColumnDefs();
      this.getList();
    }
  
    getList() {   
      this.apiUrl.getInvoiceList().subscribe((response: any) => {
        this.filteredRowData=response.data;
      }, err => {
        console.log(err);
      })
    }
  
    setColumnDefs() {
      const baseCols: ColDef[] = [
        { headerName: 'S. No.', valueGetter: 'node.rowIndex + 1', maxWidth: 75},
        { headerName: 'Vehicle Planning Code', field: 'planning_code'},
        { headerName: 'Transporter Name ', field: 'transported_by',valueFormatter: (params:any) => params?.data?.transporters[0]?.transporterDetails?.tm_name},
        { headerName: 'Route', field: 'vehicle_root_status', maxWidth: 90 },
        { headerName: 'Vehicle Type', field: 'vehicle_type_name',valueFormatter:(params:any)=>params?.data?.vehicleTypeMST?.vehicle_type_name},
        { headerName: 'Planning Date', field: 'createdAt', valueFormatter: params => this.formatDateTime(params?.data.createdAt,'Date'),},
        { headerName: 'Inward Date Time', field: 'gate_inward_date', valueFormatter: params => this.formatDateTime(params?.data?.vehiclePlaningMst[0].createdAt,'Full') },
      ];
  
      const actionColumn: ColDef = {
        headerName: 'Action',
        field: 'id',
        cellRenderer: 'gateActionButton',
        pinned: 'right',
        maxWidth: 160
      };
  
      this.columnDefs = [...baseCols, actionColumn];
    }
  
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
  
    onPageSizeChanged(event: any) {
  
    }
  
    onFilterTextBoxChanged(event: any) {
      
    }
  }