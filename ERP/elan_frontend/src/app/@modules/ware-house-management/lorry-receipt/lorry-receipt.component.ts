import { Component } from '@angular/core';
import { ActionButtonComponent } from './action-button/action-button.component';
import { ColDef } from 'ag-grid-community';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';

@Component({
  selector: 'app-lorry-receipt',
  templateUrl: './lorry-receipt.component.html',
  styleUrls: ['./lorry-receipt.component.scss']
})
export class LorryReceiptComponent {
  currentTab: 'Pending' | 'Approved' = 'Pending';
    paginationPageSize = 10;
  
    rowData: any[] = [];
    filteredRowData: any[] = [];
  
    frameworkComponents = {
      gateActionButton: ActionButtonComponent
    };

    gridOptions = {
      context: {
        componentParent: this
      }
    };
  
    columnDefs: ColDef[] = [];
    
    constructor(
      private apiUrl: warehouseListService,
    ) {}
  
    ngOnInit() {
      this.setColumnDefs();
      this.getList('Pending');
    }
  
    setTab(tab: 'Approved' | 'Pending') {
      this.currentTab = tab;
      this.getList(tab);
      this.setColumnDefs();
    }
  
    getList(type:any) {   
      this.apiUrl.getLRList(type).subscribe((response: any) => {
        this.filteredRowData=response.data;
      }, err => {
        console.log(err);
      })
    }
  
    setColumnDefs() {
      const baseCols: ColDef[] = [
        {
          headerName: 'S. No.',
          valueGetter: 'node.rowIndex + 1',
          maxWidth: 75,
        },
        { headerName: 'Vehicle Planning Code', field: 'planning_code' },
        ];

      const approvedOnlyCols: ColDef[] = [
        { headerName: 'LR Number', field: 'LR_number' }
      ];

      const lastonlyCols: ColDef[] = [
        { headerName: 'Warehouse Name', field: 'warehouse_name'},
        { headerName: 'Transporter Name', field: 'tm_name', tooltipField: 'tm_name' },
        { headerName: 'Route', field: 'vehicle_root_status', maxWidth: 90 },
        { headerName: 'Planning Date', field: 'createdAt', valueFormatter: params => this.formatDateTime(params.value,'Date'), maxWidth: 150},
        { headerName: 'Inward Date Time', field: 'gate_inward_date', valueFormatter: params => this.formatDateTime(params.value,'Full') }
      ];
  
      const actionColumn: ColDef = {
        headerName: 'Action',
        field: 'id',
        cellRenderer: 'gateActionButton',
        pinned: 'right',
        maxWidth: 150
      };
      
      if (this.currentTab === 'Pending') {
        this.columnDefs = [...baseCols, ...lastonlyCols, actionColumn];
      }else{
        this.columnDefs = [...baseCols, ...approvedOnlyCols, ...lastonlyCols, actionColumn];
      }
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

    refreshGrid() {
      this.getList(this.currentTab);
    }
  }
  