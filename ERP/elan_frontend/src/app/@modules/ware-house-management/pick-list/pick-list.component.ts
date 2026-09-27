import { Component } from '@angular/core';
import { ActionButtonComponent } from './action-button/action-button.component';
import { ColDef } from 'ag-grid-community';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';

@Component({
  selector: 'app-pick-list',
  templateUrl: './pick-list.component.html',
  styleUrls: ['./pick-list.component.scss']
})
export class PickListComponent {
  currentTab: 'Pending' | 'Approved' = 'Pending';
  paginationPageSize = 10;

  rowData: any[] = [];
  filteredRowData: any[] = [];

  frameworkComponents = {
    gateActionButton: ActionButtonComponent
  };

  columnDefs: ColDef[] = [];
  
  constructor(
    private apiUrl: warehouseListService,
  ) {}

  ngOnInit() {
    this.setColumnDefs();
    this.getList('Pending');
  }

  setTab(tab: 'Pending' | 'Approved') {
    this.currentTab = tab;
    this.getList(tab);
    this.setColumnDefs();
  }

  getList(type:any) {   
    this.apiUrl.getPickList(type).subscribe((response: any) => {
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
      { headerName: 'Warehouse Name', field: 'warehouse_name' },
      { headerName: 'Transporter Name', field: 'tm_name', tooltipField: 'tm_name' },
      {
        headerName: 'Route',
        field: 'vehicle_root_status',
        maxWidth: 90
      },
      { headerName: 'Planning Date', field: 'createdAt', valueFormatter: params => this.formatDateTime(params.value,'Date'), maxWidth: 150},
      { headerName: 'Inward Date Time', field: 'gate_inward_date', valueFormatter: params => this.formatDateTime(params.value,'Full') }
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
