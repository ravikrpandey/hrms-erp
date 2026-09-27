import { Component } from '@angular/core';
import { DispatchListActionComponent } from '../dispatch-list/dispatch-list-action/dispatch-list-action.component';
import { Router } from '@angular/router';
import { InventoryManagementService } from '../inventory-management.service';
import { VehiclePlanActionComponent } from './vehicle-plan-action/vehicle-plan-action.component';
import { RfqDialogComponent } from './rfq-dialog/rfq-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';

@Component({
  selector: 'app-vehicle-planning',
  templateUrl: './vehicle-planning.component.html',
  styleUrls: ['./vehicle-planning.component.scss'],
})
export class VehiclePlanningComponent {
  rowClass: string = 'rowClass';
  rowData: any[] = [];

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .5,
    },
    {
      headerName: 'Vehicle Planning Code',
      field: 'planningCode',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1.2,
    },
    {
      headerName: 'Delivery Route',
      field: 'vehicle_root_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8,
    },
    {
      headerName: 'Vehicle Type',
      field: 'vehicleType',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Transported By',
      field: 'transportedBy',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Transport Type',
      field: 'transportType',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Planning Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Transporter Count',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueGetter: (params:any) => {
        const accepted = params.data.accepted_transporter || 0;
        const total = params.data.total_transporter || 0;
        return `${accepted}/${total}`;
      },
      cellRenderer: this.transporterCellRenderer.bind(this),
    },
    {
      headerName: 'Action',
      field: 'order_no_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: VehiclePlanActionComponent,
      cellRendererParams: {
        viewDetails: true,
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

  entity_id: any;
  financial_year_id: any;

  constructor(
    private router: Router,
    private inventoryService: InventoryManagementService,
    public dialog: MatDialog,private accessData: AccessControlService
  ) {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();
    this.getVehiclePlanList();
  }

  addRedirect() {
    this.router.navigate(['/master/warehouse-management/vehicle-planning/add']);
  }

  getVehiclePlanList() {
    this.inventoryService.getVehiclePlanList(this.entity_id).subscribe(
      (response: any) => {
        this.rowData = response.data;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  onPageSizeChanged() {

  }
  onFilterTextBoxChanged() {

  }
  transporterCellRenderer(params: any) {
    const cellValue = params.value;
    const clickableContent = document.createElement('div');
    clickableContent.style.cursor = 'pointer';
    clickableContent.style.textDecoration = 'underline';
    clickableContent.innerText = cellValue;
    clickableContent.addEventListener('click', () => {
      this.openTransporterDialog(params);
    });
    return clickableContent;
  }
 
  openTransporterDialog(e: any) {
   const dialogRef = this.dialog.open(RfqDialogComponent,{
          width: '1200px',
          maxHeight: '1000px',
          minHeight: '500px',
          disableClose: true,
          data: e.data
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if(result){
              this.getVehiclePlanList();
            }
            console.log('Dialog result:', result);
            
          }
        });
        
    
  }
}
