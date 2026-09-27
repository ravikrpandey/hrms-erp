import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { GateActionButtonComponent } from './gate-action-button/gate-action-button.component';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gate-inward-outward',
  templateUrl: './gate-inward-outward.component.html',
  styleUrls: ['./gate-inward-outward.component.scss'],
})
export class GateInwardOutwardComponent implements OnInit {
  currentTab: 'inward' | 'outward' | 'approved' = 'inward';
  paginationPageSize = 10;

  rowData: any[] = [];
  filteredRowData: any[] = [];

  frameworkComponents = {
    gateActionButton: GateActionButtonComponent,
  };

  columnDefs: ColDef[] = [];
  constructor(private apiUrl: warehouseListService, private activeRoute:ActivatedRoute) {}
 activeLabel:any;
  ngOnInit() {
    this.setColumnDefs();
    this.activeLabel = this.activeRoute.snapshot.data['label'];
    this.currentTab=this.activeLabel;
    this.getList(this.activeLabel);
  }

  setTab(tab: 'inward' | 'outward' | 'approved') {
    this.currentTab = tab;
    this.getList(tab);
    this.setColumnDefs();
  }

  getList(type: any) {
    this.apiUrl.getAllGateInwardOutwardList(type,this.activeLabel).subscribe(
      (response: any) => {
        this.filteredRowData = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  setColumnDefs() {
    const baseCols: ColDef[] = [
      {
        headerName: 'S. No.',
        valueGetter: 'node.rowIndex + 1',
        maxWidth: 75,
      },
      {
        headerName: 'Vehicle Planning Code',
        field: 'planning_code'
      },
      { headerName: 'Warehouse Name', field: 'warehouse_name', tooltipField: 'warehouse_name' },
      { headerName: 'Transporter Name', field: 'tm_name', tooltipField: 'tm_name' },
      {
        headerName: 'Route',
        field: 'vehicle_root_status',
        maxWidth: 90
      },
      {
        headerName: 'Pickup Date',
        field: 'pickup_date',
        valueFormatter: (params) => this.formatDateTime(params.value, 'Date'),
      },
      { headerName: 'Gate Bypass', field: 'gate_by_pass' },
    ];

    const inoutwardCols: ColDef[] = [
      {
        headerName: 'Inward Date Time',
        field: 'gate_inward_date',
        valueFormatter: (params) => {
          const row = params.data;

          if (row?.gate_by_pass === 'YES') {
            return 'GateByPass';
          }

          return this.formatDateTime(params.value, 'Full');
        },
      },
      { headerName: 'Vehicle Number', field: 'vehicle_number' },
      { headerName: 'Driver Name', field: 'driver_name' },
      { headerName: 'Driver Contact No.', field: 'driver_contact' },
    ];

    const approvedOnlyCols: ColDef[] = [
      {
        headerName: 'Outward Date Time',
        field: 'gate_outward_date',
        valueFormatter: (params) => {
          const row = params.data;

          if (row?.gate_by_pass === 'YES') {
            return 'GateByPass';
          }

          // Date null / empty
          if (!params.value) {
            return '--';
          }

          return this.formatDateTime(params.value, 'Full');
        },
      }
    ];

    const actionColumn: ColDef = {
      headerName: 'Action',
      field: 'id',
      cellRenderer: 'gateActionButton',
      pinned: 'right',
      maxWidth: 150,
    };

    if (this.currentTab === 'approved') {
      this.columnDefs = [
        ...baseCols,
        ...inoutwardCols,
        ...approvedOnlyCols,
        actionColumn,
      ];
    } else if (this.currentTab === 'outward') {
      this.columnDefs = [...baseCols, ...inoutwardCols, actionColumn];
    } else {
      this.columnDefs = [...baseCols, actionColumn];
    }
  }

  formatDateTime(dateString: string, type: string): string {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString('en-GB'); // dd/mm/yyyy
    const timePart = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return type == 'Date' ? `${datePart}` : `${datePart} ${timePart}`; // dd/mm/yyyy hh:mm AM/PM
  }

  onPageSizeChanged(event: any) {}

  onFilterTextBoxChanged(event: any) {}
}
